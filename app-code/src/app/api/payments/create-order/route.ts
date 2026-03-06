// API Route: Create Payment Order
// POST /api/payments/create-order
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { donationId, amount } = body;

        if (!donationId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: donationId, amount' },
                { status: 400 }
            );
        }

        // Verify the donation exists and belongs to the user (or is anonymous)
        const { data: donation, error: donationError } = await supabase
            .from('donations')
            .select('id, ngo_id, amount, status, donor_id')
            .eq('id', donationId)
            .single() as { data: { id: string; ngo_id: string; amount: number; status: string; donor_id: string | null } | null; error: unknown };

        if (donationError || !donation) {
            return NextResponse.json(
                { error: 'Donation not found' },
                { status: 404 }
            );
        }

        if (donation.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Donation is not in pending state' },
                { status: 400 }
            );
        }

        // Verify ownership (if authenticated)
        if (user && donation.donor_id && donation.donor_id !== user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // For now, create a mock order (replace with actual Razorpay integration)
        // In production, you would call Razorpay API here:
        // const Razorpay = require('razorpay');
        // const razorpay = new Razorpay({
        //     key_id: process.env.RAZORPAY_KEY_ID,
        //     key_secret: process.env.RAZORPAY_KEY_SECRET,
        // });
        // const order = await razorpay.orders.create({
        //     amount: amount * 100, // Convert to paise
        //     currency: 'INR',
        //     receipt: donationId,
        // });

        // Mock order for development
        const mockOrder = {
            id: `order_${Date.now()}`,
            amount: amount * 100, // In paise
            currency: 'INR',
            receipt: donationId,
            status: 'created',
        };

        // Update donation with order ID
        await supabase
            .from('donations')
            .update({ order_id: mockOrder.id } as Record<string, unknown>)
            .eq('id', donationId);

        return NextResponse.json(mockOrder);
    } catch (error) {
        console.error('Error creating payment order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
