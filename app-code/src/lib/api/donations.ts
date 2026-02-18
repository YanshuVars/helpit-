// Donation API Helper Functions
import { createClient } from '@/lib/supabase/client';
import type {
    Donation,
    DonationInsert,
    DonationStatus,
    PaymentMethod,
} from '@/types/database';

// ============================================
// DONATION CRUD FUNCTIONS
// ============================================

export async function getDonationById(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('donations')
        .select(`
      *,
      ngo:ngos(id, name, logo_url, has_80g)
    `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Donation & { ngo: { id: string; name: string; logo_url: string | null; has_80g: boolean } };
}

export async function createDonation(donation: DonationInsert) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('donations')
        .insert(donation)
        .select()
        .single();

    if (error) throw error;
    return data as Donation;
}

export async function updateDonation(id: string, updates: Partial<DonationInsert>) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('donations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Donation;
}

// ============================================
// DONATION LISTING
// ============================================

export async function getDonations(options?: {
    ngoId?: string;
    donorId?: string;
    status?: DonationStatus;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('donations')
        .select(`
      *,
      ngo:ngos(id, name, logo_url)
    `, { count: 'exact' });

    if (options?.ngoId) {
        query = query.eq('ngo_id', options.ngoId);
    }

    if (options?.donorId) {
        query = query.eq('donor_id', options.donorId);
    }

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        donations: data as (Donation & { ngo: { id: string; name: string; logo_url: string | null } })[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function getNgoDonations(ngoId: string, options?: {
    status?: DonationStatus;
    page?: number;
    limit?: number;
}) {
    return getDonations({ ...options, ngoId });
}

export async function getDonorDonations(options?: {
    status?: DonationStatus;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    return getDonations({ ...options, donorId: authUser.id });
}

export async function getCurrentUserDonations(options?: {
    status?: DonationStatus;
    page?: number;
    limit?: number;
}) {
    return getDonorDonations(options);
}

// ============================================
// DONATION STATS
// ============================================

export async function getNgoDonationStats(ngoId: string) {
    const supabase = createClient();

    const { data: donations } = await supabase
        .from('donations')
        .select('amount, status, created_at')
        .eq('ngo_id', ngoId);

    const completed = donations?.filter((d: { status: string }) => d.status === 'COMPLETED') || [];
    const totalAmount = completed.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
    const totalDonations = completed.length;

    // Monthly breakdown
    const monthlyStats: Record<string, { amount: number; count: number }> = {};
    completed.forEach((d: { amount: number; created_at: string }) => {
        const month = new Date(d.created_at).toISOString().slice(0, 7);
        if (!monthlyStats[month]) {
            monthlyStats[month] = { amount: 0, count: 0 };
        }
        monthlyStats[month].amount += d.amount;
        monthlyStats[month].count += 1;
    });

    return {
        totalAmount,
        totalDonations,
        monthlyStats,
    };
}

// ============================================
// PAYMENT INTEGRATION (Razorpay)
// ============================================

export async function createPaymentOrder(
    ngoId: string,
    amount: number,
    donorInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        pan?: string;
    }
) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    // Create pending donation record
    const { data: donation, error } = await supabase
        .from('donations')
        .insert({
            ngo_id: ngoId,
            donor_id: authUser?.id || null,
            amount,
            currency: 'INR',
            status: 'PENDING',
            donor_name: donorInfo?.name || null,
            donor_email: donorInfo?.email || null,
            donor_phone: donorInfo?.phone || null,
            donor_pan: donorInfo?.pan || null,
            is_anonymous: !authUser,
            is_recurring: false,
            recurring_frequency: null,
            recurring_parent_id: null,
            message: null,
            payment_method: null,
            payment_id: null,
            order_id: null,
        })
        .select()
        .single();

    if (error) throw error;

    // Call API to create Razorpay order
    const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            donationId: donation.id,
            amount,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create payment order');
    }

    const order = await response.json();

    // Update donation with order ID
    await updateDonation(donation.id, { order_id: order.id });

    return {
        donation,
        order,
    };
}

export async function verifyPayment(
    donationId: string,
    paymentId: string,
    orderId: string,
    signature: string
) {
    const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            donationId,
            paymentId,
            orderId,
            signature,
        }),
    });

    if (!response.ok) {
        throw new Error('Payment verification failed');
    }

    const result = await response.json();

    // Update donation status
    const donation = await updateDonation(donationId, {
        status: 'COMPLETED',
        payment_id: paymentId,
    });

    return donation;
}

export async function markDonationCompleted(donationId: string, paymentId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('donations')
        .update({
            status: 'COMPLETED',
            payment_id: paymentId,
            completed_at: new Date().toISOString(),
        })
        .eq('id', donationId)
        .select()
        .single();

    if (error) throw error;
    return data as Donation;
}

// ============================================
// RECEIPTS
// ============================================

export async function getDonationReceipt(donationId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('donations')
        .select(`
      *,
      ngo:ngos(id, name, address, city, state, pincode, pan_number, has_80g)
    `)
        .eq('id', donationId)
        .single();

    if (error) throw error;

    return data as Donation & {
        ngo: {
            id: string;
            name: string;
            address: string | null;
            city: string | null;
            state: string | null;
            pincode: string | null;
            pan_number: string | null;
            has_80g: boolean;
        };
    };
}

export async function downloadReceipt(donationId: string) {
    const response = await fetch(`/api/receipts/${donationId}`);

    if (!response.ok) {
        throw new Error('Failed to generate receipt');
    }

    return response.blob();
}

// ============================================
// RECURRING DONATIONS
// ============================================

export async function setupRecurringDonation(
    ngoId: string,
    amount: number,
    frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('donations')
        .insert({
            ngo_id: ngoId,
            donor_id: authUser.id,
            amount,
            currency: 'INR',
            status: 'PENDING',
            is_recurring: true,
            recurring_frequency: frequency,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Donation;
}

export async function cancelRecurringDonation(donationId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('donations')
        .update({
            is_recurring: false,
            recurring_frequency: null,
        })
        .eq('id', donationId)
        .select()
        .single();

    if (error) throw error;
    return data as Donation;
}

export async function getRecurringDonations() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('donations')
        .select(`
      *,
      ngo:ngos(id, name, logo_url)
    `)
        .eq('donor_id', authUser.id)
        .eq('is_recurring', true)
        .eq('status', 'COMPLETED');

    if (error) throw error;
    return data as (Donation & { ngo: { id: string; name: string; logo_url: string | null } })[];
}
