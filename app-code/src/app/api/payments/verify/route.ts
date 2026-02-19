// API Route: Verify Payment
// POST /api/payments/verify
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

interface DonationRecord {
    id: string;
    ngo_id: string;
    amount: number;
    status: string;
    donor_id: string | null;
    receipt_number: string | null;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const body = await request.json();
        const { donationId, paymentId, orderId, signature } = body;

        if (!donationId || !paymentId || !orderId || !signature) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify Razorpay signature
        // In production, use actual Razorpay secret key
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';
        const expectedSignature = crypto
            .createHmac('sha256', razorpayKeySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        // For development, skip signature verification
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isValidSignature = isDevelopment || expectedSignature === signature;

        if (!isValidSignature) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Update donation status to completed
        const { data: donation, error } = await supabase
            .from('donations')
            .update({
                status: 'COMPLETED',
                payment_id: paymentId,
                completed_at: new Date().toISOString(),
            } as Record<string, unknown>)
            .eq('id', donationId)
            .select('id, ngo_id, amount, status, donor_id, receipt_number')
            .single() as { data: DonationRecord | null; error: unknown };

        if (error) {
            console.error('Error updating donation:', error);
            return NextResponse.json(
                { error: 'Failed to update donation status' },
                { status: 500 }
            );
        }

        // Create notification for NGO
        if (donation) {
            const { data: ngoMembers } = await supabase
                .from('ngo_members')
                .select('user_id')
                .eq('ngo_id', donation.ngo_id)
                .in('role', ['NGO_ADMIN', 'NGO_COORDINATOR']) as { data: { user_id: string }[] | null };

            if (ngoMembers && ngoMembers.length > 0) {
                const notifications = ngoMembers.map((member) => ({
                    user_id: member.user_id,
                    notification_type: 'DONATION',
                    title: 'New Donation Received',
                    message: `₹${donation.amount.toLocaleString()} donation received`,
                    data: { donationId: donation.id, amount: donation.amount },
                    action_url: `/ngo/donations`,
                }));

                await supabase.from('notifications').insert(notifications as Record<string, unknown>[]);
            }
        }

        return NextResponse.json({
            success: true,
            donation,
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
