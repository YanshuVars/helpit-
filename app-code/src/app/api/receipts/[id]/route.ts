// API Route: Generate Donation Receipt
// GET /api/receipts/[id]
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface DonationWithDetails {
    id: string;
    receipt_number: string | null;
    amount: number;
    currency: string;
    payment_method: string | null;
    payment_id: string | null;
    completed_at: string | null;
    created_at: string;
    is_anonymous: boolean;
    message: string | null;
    donor_name: string | null;
    donor_email: string | null;
    donor_pan: string | null;
    status: string;
    donor_id: string | null;
    ngo_id: string;
    ngo: {
        name: string;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        pan_number: string | null;
        has_80g: boolean;
        registration_number: string;
        email: string;
        phone: string | null;
    };
    donor: {
        full_name: string;
        email: string;
        phone: string | null;
    } | null;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { id: donationId } = await params;

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch donation with NGO details
        const { data: donation, error } = await supabase
            .from('donations')
            .select(`
                *,
                ngo:ngos(
                    id,
                    name,
                    address,
                    city,
                    state,
                    pincode,
                    pan_number,
                    has_80g,
                    registration_number,
                    email,
                    phone
                ),
                donor:users(
                    id,
                    full_name,
                    email,
                    phone
                )
            `)
            .eq('id', donationId)
            .single() as { data: DonationWithDetails | null; error: unknown };

        if (error || !donation) {
            return NextResponse.json(
                { error: 'Donation not found' },
                { status: 404 }
            );
        }

        // Verify access - donor or NGO member
        const isOwner = donation.donor_id === user.id;
        const { data: ngoMember } = await supabase
            .from('ngo_members')
            .select('id')
            .eq('user_id', user.id)
            .eq('ngo_id', donation.ngo_id)
            .single();

        if (!isOwner && !ngoMember) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        if (donation.status !== 'COMPLETED') {
            return NextResponse.json(
                { error: 'Receipt only available for completed donations' },
                { status: 400 }
            );
        }

        // Generate receipt HTML
        const receiptHtml = generateReceiptHtml(donation);

        return new NextResponse(receiptHtml, {
            headers: {
                'Content-Type': 'text/html',
                'Content-Disposition': `attachment; filename="receipt-${donation.receipt_number || donationId}.html"`,
            },
        });
    } catch (error) {
        console.error('Error generating receipt:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function generateReceiptHtml(donation: DonationWithDetails) {
    const donorName = escapeHtml(
        donation.is_anonymous
            ? 'Anonymous'
            : donation.donor?.full_name || donation.donor_name || 'Anonymous'
    );
    const donorEmail = escapeHtml(donation.donor?.email || donation.donor_email || '');
    const donorPan = escapeHtml(donation.donor_pan || 'N/A');
    const donationDate = new Date(donation.completed_at || donation.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    const amount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: donation.currency || 'INR',
    }).format(donation.amount);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt - ${donation.receipt_number || donation.id}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #22c55e; }
        .receipt-title { font-size: 20px; color: #666; margin-top: 5px; }
        .receipt-number { font-size: 14px; color: #999; }
        .section { margin: 20px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #22c55e; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { color: #666; font-size: 14px; }
        .value { font-weight: 500; font-size: 14px; }
        .amount-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .amount-label { font-size: 14px; color: #666; }
        .amount-value { font-size: 32px; font-weight: bold; color: #22c55e; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #999; }
        .tax-note { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 20px 0; font-size: 13px; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🌱 Helpit</div>
        <div class="receipt-title">Donation Receipt</div>
        <div class="receipt-number">Receipt No: ${donation.receipt_number || donation.id}</div>
    </div>

    <div class="amount-box">
        <div class="amount-label">Donation Amount</div>
        <div class="amount-value">${amount}</div>
        <div class="amount-label">Donated on ${donationDate}</div>
    </div>

    <div class="section">
        <div class="section-title">Donor Information</div>
        <div class="row">
            <span class="label">Name</span>
            <span class="value">${donorName}</span>
        </div>
        ${donorEmail ? `<div class="row">
            <span class="label">Email</span>
            <span class="value">${donorEmail}</span>
        </div>` : ''}
        ${!donation.is_anonymous ? `<div class="row">
            <span class="label">PAN Number</span>
            <span class="value">${donorPan}</span>
        </div>` : ''}
    </div>

    <div class="section">
        <div class="section-title">NGO Information</div>
        <div class="row">
            <span class="label">Organization Name</span>
            <span class="value">${donation.ngo.name}</span>
        </div>
        <div class="row">
            <span class="label">Registration Number</span>
            <span class="value">${donation.ngo.registration_number}</span>
        </div>
        ${donation.ngo.pan_number ? `<div class="row">
            <span class="label">PAN Number</span>
            <span class="value">${donation.ngo.pan_number}</span>
        </div>` : ''}
        ${donation.ngo.address ? `<div class="row">
            <span class="label">Address</span>
            <span class="value">${[donation.ngo.address, donation.ngo.city, donation.ngo.state, donation.ngo.pincode].filter(Boolean).join(', ')}</span>
        </div>` : ''}
    </div>

    <div class="section">
        <div class="section-title">Payment Details</div>
        <div class="row">
            <span class="label">Payment Method</span>
            <span class="value">${donation.payment_method || 'Online'}</span>
        </div>
        ${donation.payment_id ? `<div class="row">
            <span class="label">Transaction ID</span>
            <span class="value">${donation.payment_id}</span>
        </div>` : ''}
        <div class="row">
            <span class="label">Date</span>
            <span class="value">${donationDate}</span>
        </div>
    </div>

    ${donation.ngo.has_80g ? `
    <div class="tax-note">
        <strong>80G Tax Exemption:</strong> This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961. Please retain this receipt for your tax records.
    </div>
    ` : ''}

    ${donation.message ? `
    <div class="section">
        <div class="section-title">Message from Donor</div>
        <p style="font-style: italic; color: #666;">"${donation.message}"</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>For any queries, contact: ${donation.ngo.email} ${donation.ngo.phone ? `| ${donation.ngo.phone}` : ''}</p>
        <p>Generated by Helpit Platform | ${new Date().toLocaleDateString('en-IN')}</p>
    </div>
</body>
</html>`;
}
