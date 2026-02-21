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

const catColors: Record<string, { bg: string; text: string }> = {
    Education: { bg: "rgba(245,158,11,0.1)", text: "#92400e" },
    "Disaster Relief": { bg: "rgba(239,68,68,0.1)", text: "#991b1b" },
    Hunger: { bg: "rgba(59,130,246,0.1)", text: "#1e3a8a" },
    Environment: { bg: "rgba(16,185,129,0.1)", text: "#064e3b" },
    Health: { bg: "rgba(139,92,246,0.1)", text: "#5b21b6" },
};

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!data?.user) {
        return (
            <div style={{ textAlign: 'center', padding: 64 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>favorite</span>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Welcome, Donor!</h2>
                <p style={{ color: '#64748b', marginTop: 4 }}>Complete your profile to start donating.</p>
                <Link href="/register/individual" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', borderRadius: 8, background: '#1de2d1', color: '#0f172a', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Complete Profile</Link>
            </div>
        );
    }

    const firstName = data.user.full_name.split(' ')[0] || 'Donor';

    const stats = [
        { label: 'Total Donated', value: formatCurrency(data.stats.totalDonated), icon: 'payments', iconBg: 'rgba(29,226,209,0.1)', iconColor: '#1de2d1', bubble: 'rgba(29,226,209,0.1)' },
        { label: 'NGOs Supported', value: data.followedNgos.length, icon: 'diversity_1', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#2563eb', bubble: 'rgba(59,130,246,0.1)' },
        { label: 'Tax Saved', value: formatCurrency(Math.floor(data.stats.totalDonated * 0.25)), icon: 'savings', iconBg: 'rgba(16,185,129,0.1)', iconColor: '#059669', bubble: 'rgba(16,185,129,0.1)' },
        { label: 'Donations Count', value: data.recentDonations.length, icon: 'receipt_long', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#d97706', bubble: 'rgba(245,158,11,0.1)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
                <div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Welcome back, {firstName} <span style={{ display: 'inline-block' }}>👋</span>
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 16, marginTop: 6, maxWidth: 500 }}>
                        Here is the summary of your kindness journey and the impact you've made this year.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/donor/discover" style={{
                        display: 'inline-flex', alignItems: 'center',
                        height: 48, padding: '0 24px', borderRadius: 12,
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 14, fontWeight: 600, color: '#0f172a', textDecoration: 'none',
                    }}>Browse NGOs</Link>
                    <Link href="/donor/donate" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        height: 48, padding: '0 24px', borderRadius: 12,
                        background: '#1de2d1', color: '#0f172a',
                        fontSize: 14, fontWeight: 700, textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(29,226,209,0.2)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>favorite</span>
                        Donate Now
                    </Link>
                </div>
            </header>

            {/* Stat Cards */}
            <div className="r-grid-4" style={{ gap: 18 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        position: 'relative', overflow: 'hidden',
                        background: '#fff', borderRadius: 16, padding: 22,
                        border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 200ms',
                    }}>
                        {/* Decorative bubble */}
                        <div style={{
                            position: 'absolute', right: -24, top: -24,
                            width: 80, height: 80, borderRadius: '50%',
                            background: s.bubble,
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 12,
                                background: s.iconBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 26, color: s.iconColor }}>{s.icon}</span>
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{s.label}</p>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Donations */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>Recent Donations</h3>
                    <Link href="/donor/history" style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 13, fontWeight: 600, color: '#1de2d1', textDecoration: 'none',
                    }}>
                        View All History
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                    </Link>
                </div>

                <div style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(248,250,252,0.5)', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Organization</th>
                                    <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Category</th>
                                    <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Amount</th>
                                    <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Date</th>
                                    <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentDonations.map((d) => {
                                    const cc = catColors[d.status] || { bg: 'rgba(100,116,139,0.1)', text: '#475569' };
                                    return (
                                        <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{
                                                        width: 38, height: 38, borderRadius: '50%',
                                                        background: '#f1f5f9',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748b' }}>volunteer_activism</span>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 13, fontWeight: 600 }}>{d.ngo_name}</p>
                                                        <p style={{ fontSize: 11, color: '#94a3b8' }}>ID: #{d.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                                                    background: cc.bg, color: cc.text,
                                                }}>{d.status}</span>
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600 }}>
                                                {formatCurrency(d.amount)}
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>
                                                {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                                <Link href={`/donor/receipts/${d.id}`} style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    padding: '5px 10px', borderRadius: 6,
                                                    fontSize: 12, fontWeight: 600, color: '#64748b', textDecoration: 'none',
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {data.recentDonations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>favorite</span>
                                            <p style={{ marginTop: 8 }}>No donations yet. Start making an impact!</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
