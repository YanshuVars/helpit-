'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency, formatDistanceToNow } from '@/lib/utils';

interface Donation {
    id: string;
    amount: number;
    donor_name: string;
    payment_method: string;
    status: string;
    created_at: string;
}

export default function NGODonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [stats, setStats] = useState({
        totalReceived: 0,
        thisMonth: 0,
        totalDonors: 0,
        avgDonation: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDonations() {
            const supabase = createClient();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            // Get user's NGO
            const { data: membership } = await supabase
                .from('ngo_members')
                .select('ngo_id')
                .eq('user_id', session.user.id)
                .single();

            if (!membership) {
                setLoading(false);
                return;
            }

            // Get donations
            const { data: donationsData } = await supabase
                .from('donations')
                .select('id, amount, donor_name, payment_method, status, created_at')
                .eq('ngo_id', membership.ngo_id)
                .eq('status', 'COMPLETED')
                .order('created_at', { ascending: false })
                .limit(20);

            const donations = (donationsData || []).map(d => ({
                id: d.id,
                amount: d.amount,
                donor_name: d.donor_name || 'Anonymous',
                payment_method: d.payment_method || 'Unknown',
                status: d.status,
                created_at: d.created_at,
            }));

            // Calculate stats
            const totalReceived = donations.reduce((sum, d) => sum + d.amount, 0);

            // This month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const thisMonth = donations
                .filter(d => new Date(d.created_at) >= startOfMonth)
                .reduce((sum, d) => sum + d.amount, 0);

            // Unique donors
            const uniqueDonors = new Set(donations.map(d => d.donor_name)).size;

            // Avg donation
            const avgDonation = donations.length > 0 ? Math.round(totalReceived / donations.length) : 0;

            setStats({
                totalReceived,
                thisMonth,
                totalDonors: uniqueDonors,
                avgDonation,
            });

            setDonations(donations);
            setLoading(false);
        }

        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Donations" showBack fallbackRoute="/ngo" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Total Received</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(stats.totalReceived)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">This Month</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(stats.thisMonth)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Donors</p>
                    <p className="text-2xl font-bold mt-2">{stats.totalDonors}</p>
                </div>
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Avg Donation</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(stats.avgDonation)}</p>
                </div>
            </div>

            {/* Recent Donations */}
            <div>
                <h2 className="font-bold mb-4">Recent Donations</h2>
                {donations.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">payments</span>
                        <p className="text-gray-500">No donations yet</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {donations.map((donation) => (
                            <div key={donation.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-green-600">payments</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{donation.donor_name}</p>
                                    <p className="text-xs text-gray-500">{donation.payment_method} • {formatDistanceToNow(donation.created_at)}</p>
                                </div>
                                <p className="font-bold text-green-600 shrink-0">+{formatCurrency(donation.amount)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
