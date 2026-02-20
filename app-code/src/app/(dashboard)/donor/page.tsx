'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow, formatCurrency } from '@/lib/utils';

interface DonorDashboardData {
    user: { id: string; full_name: string } | null;
    stats: { totalDonated: number; impactCount: number };
    followedNgos: Array<{ id: string; name: string; logo_url: string | null }>;
    recentDonations: Array<{ id: string; amount: number; ngo_name: string; status: string; created_at: string }>;
}

export default function DonorDashboardPage() {
    const [data, setData] = useState<DonorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: userData } = await supabase.from('users').select('id, full_name').eq('id', session.user.id).single();
            if (!userData) { setLoading(false); return; }

            const { data: donorProfile } = await supabase.from('donor_profiles').select('total_donated, impact_count').eq('user_id', session.user.id).single();

            const { data: followedNgos } = await supabase.from('ngo_followers').select('ngo:ngos(id, name, logo_url)').eq('user_id', session.user.id).limit(5);
            const ngos = (followedNgos || []).map(f => ({
                id: (f.ngo as unknown as { id: string })?.id,
                name: (f.ngo as unknown as { name: string })?.name || 'Unknown',
                logo_url: (f.ngo as unknown as { logo_url: string })?.logo_url,
            }));

            const { data: donations } = await supabase.from('donations').select('id, amount, status, created_at, ngo:ngos(name)').eq('donor_id', session.user.id).order('created_at', { ascending: false }).limit(5);
            const recentDonations = (donations || []).map(d => ({
                id: d.id, amount: d.amount,
                ngo_name: (d.ngo as unknown as { name: string })?.name || 'Unknown NGO',
                status: d.status, created_at: d.created_at,
            }));

            setData({
                user: { id: userData.id, full_name: userData.full_name || 'Donor' },
                stats: { totalDonated: donorProfile?.total_donated || 0, impactCount: donorProfile?.impact_count || 0 },
                followedNgos: ngos, recentDonations,
            });
            setLoading(false);
        }
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    if (!data?.user) {
        return (
            <div className="empty-state-container">
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-text-disabled)' }}>favorite</span>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Welcome, Donor!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Complete your profile to start donating.</p>
                <Link href="/register/individual" className="btn btn-primary" style={{ marginTop: 16 }}>Complete Profile</Link>
            </div>
        );
    }

    const firstName = data.user.full_name.split(' ')[0] || 'Donor';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Greeting */}
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>Hi, {firstName}! 👋</h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>Your contributions are making a difference.</p>
            </div>

            {/* Impact Stats */}
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', marginBottom: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>volunteer_activism</span>
                        <span className="stat-card-label">Donated</span>
                    </div>
                    <div className="stat-card-value">{formatCurrency(data.stats.totalDonated)}</div>
                    <Link href="/donor/history" style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: 2, marginTop: 4, textDecoration: 'none' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
                        View history
                    </Link>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#E65100', marginBottom: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>groups</span>
                        <span className="stat-card-label">Impacted</span>
                    </div>
                    <div className="stat-card-value">{data.stats.impactCount}</div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>favorite</span> Lives helped
                    </p>
                </div>
            </div>

            {/* Followed NGOs */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Followed NGOs</h3>
                    <Link href="/donor/discover" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>See all</Link>
                </div>
                <div style={{ display: 'flex', gap: 14, overflowX: 'auto' }}>
                    {data.followedNgos.length === 0 ? (
                        <Link href="/donor/discover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-disabled)' }}>
                                <span className="material-symbols-outlined">add</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)' }}>Discover</span>
                        </Link>
                    ) : (
                        <>
                            {data.followedNgos.map(ngo => (
                                <Link key={ngo.id} href={`/donor/discover/${ngo.id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, textDecoration: 'none' }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--color-primary)',
                                        padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            width: '100%', height: '100%', borderRadius: '50%', backgroundSize: 'cover', backgroundPosition: 'center',
                                            backgroundImage: ngo.logo_url ? `url("${ngo.logo_url}")` : 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16,
                                        }}>
                                            {!ngo.logo_url && ngo.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 500, textAlign: 'center', width: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-body)' }}>{ngo.name}</span>
                                </Link>
                            ))}
                            <Link href="/donor/discover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, textDecoration: 'none' }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-disabled)' }}>
                                    <span className="material-symbols-outlined">add</span>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)' }}>Discover</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recent Activity</h3>
                {data.recentDonations.length === 0 ? (
                    <div className="empty-state-container">
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>inbox</span>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No recent donations</p>
                        <Link href="/donor/discover" className="btn btn-primary" style={{ marginTop: 12 }}>Discover NGOs</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'var(--color-border-subtle)' }} />
                        {data.recentDonations.map(donation => (
                            <div key={donation.id} style={{ position: 'relative', paddingLeft: 20 }}>
                                <div style={{ position: 'absolute', left: -14, top: 6, width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)', border: '3px solid var(--color-bg-card)', zIndex: 1 }} />
                                <div className="card" style={{ padding: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 700, fontSize: 13 }}>{donation.status === 'COMPLETED' ? 'Donation Confirmed' : 'Donation Pending'}</span>
                                        <span style={{ fontSize: 10, color: 'var(--color-text-disabled)' }}>{formatDistanceToNow(donation.created_at)}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--color-text-body)' }}>
                                        Donated <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formatCurrency(donation.amount)}</span> to <span style={{ fontWeight: 600 }}>{donation.ngo_name}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
