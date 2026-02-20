'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
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
            if (!session) { setLoading(false); return; }

            const { data: membership } = await supabase
                .from('ngo_members')
                .select('ngo_id')
                .eq('user_id', session.user.id)
                .single();

            if (!membership) { setLoading(false); return; }

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

            const totalReceived = donations.reduce((sum, d) => sum + d.amount, 0);
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const thisMonth = donations
                .filter(d => new Date(d.created_at) >= startOfMonth)
                .reduce((sum, d) => sum + d.amount, 0);
            const uniqueDonors = new Set(donations.map(d => d.donor_name)).size;
            const avgDonation = donations.length > 0 ? Math.round(totalReceived / donations.length) : 0;

            setStats({ totalReceived, thisMonth, totalDonors: uniqueDonors, avgDonation });
            setDonations(donations);
            setLoading(false);
        }

        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Received', value: formatCurrency(stats.totalReceived), icon: 'account_balance', iconBg: '#E8F5E9', iconColor: '#2E7D32' },
        { label: 'This Month', value: formatCurrency(stats.thisMonth), icon: 'trending_up', iconBg: '#E3F2FD', iconColor: '#1565C0' },
        { label: 'Donors', value: stats.totalDonors, icon: 'people', iconBg: '#EDE7F6', iconColor: 'var(--color-primary)' },
        { label: 'Avg Donation', value: formatCurrency(stats.avgDonation), icon: 'analytics', iconBg: '#FFF3E0', iconColor: '#E65100' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h1 className="page-title">Donations</h1>

            {/* Stats */}
            <div className="stat-grid">
                {statCards.map(stat => (
                    <div key={stat.label} className="card" style={{ padding: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span className="material-symbols-outlined" style={{ color: stat.iconColor, fontSize: 18 }}>{stat.icon}</span>
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{stat.label}</span>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent Donations */}
            <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recent Donations</h2>
                {donations.length === 0 ? (
                    <div className="empty-state-container">
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>payments</span>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No donations yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {donations.map(donation => (
                            <div key={donation.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: '#2E7D32', fontSize: 20 }}>payments</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{donation.donor_name}</p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{donation.payment_method} • {formatDistanceToNow(donation.created_at)}</p>
                                </div>
                                <span style={{ fontWeight: 700, color: '#2E7D32', flexShrink: 0, fontSize: 14 }}>+{formatCurrency(donation.amount)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
