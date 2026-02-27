'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow, formatCurrency } from '@/lib/utils';
import { useNgoContext } from '@/lib/hooks/use-ngo-context';

interface NGODashboardData {
    ngo: {
        id: string;
        name: string;
        total_requests_resolved: number;
        total_volunteers: number;
        total_donations: number;
    } | null;
    stats: {
        activeRequests: number;
        pendingDonations: number;
        upcomingEvents: number;
    };
    recentActivity: Array<{
        id: string;
        type: 'request' | 'donation' | 'volunteer' | 'event';
        title: string;
        description: string;
        created_at: string;
    }>;
}

export default function NGODashboardPage() {
    const { ngoId, loading: ctxLoading } = useNgoContext();
    const [data, setData] = useState<NGODashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            if (ctxLoading || !ngoId) {
                if (!ctxLoading) setLoading(false);
                return;
            }

            const supabase = createClient();

            const { data: ngoData } = await supabase
                .from('ngos').select('*').eq('id', ngoId).single();
            // Use API route to bypass RLS recursion on help_requests
            let activeRequests = 0;
            let recentRequests: any[] = [];
            try {
                const reqRes = await fetch(`/api/ngo/requests?ngo_id=${ngoId}`);
                if (reqRes.ok) {
                    const reqJson = await reqRes.json();
                    const allReqs = reqJson.data || [];
                    activeRequests = allReqs.filter((r: any) => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length;
                    recentRequests = allReqs.slice(0, 3);
                }
            } catch (e) {
                console.error('Error fetching requests for dashboard:', e);
            }

            const { count: pendingDonations } = await supabase
                .from('donations').select('*', { count: 'exact', head: true })
                .eq('ngo_id', ngoId).eq('status', 'PENDING');

            const { count: upcomingEvents } = await supabase
                .from('events').select('*', { count: 'exact', head: true })
                .eq('ngo_id', ngoId).gte('start_date', new Date().toISOString());

            const { data: recentDonations } = await supabase
                .from('donations').select('id, amount, donor_name, created_at')
                .eq('ngo_id', ngoId).order('created_at', { ascending: false }).limit(3);

            const activity: NGODashboardData['recentActivity'] = [];
            recentRequests?.forEach(r => {
                activity.push({ id: `req-${r.id}`, type: 'request', title: `New request: ${r.title}`, description: `Status: ${r.status}`, created_at: r.created_at });
            });
            recentDonations?.forEach(d => {
                activity.push({ id: `don-${d.id}`, type: 'donation', title: `Donation received: ₹${d.amount}`, description: d.donor_name || 'Anonymous donor', created_at: d.created_at });
            });
            activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setData({
                ngo: ngoData ? {
                    id: ngoData.id, name: ngoData.name,
                    total_requests_resolved: ngoData.total_requests_resolved || 0,
                    total_volunteers: ngoData.total_volunteers || 0,
                    total_donations: ngoData.total_donations || 0,
                } : null,
                stats: { activeRequests: activeRequests, pendingDonations: pendingDonations || 0, upcomingEvents: upcomingEvents || 0 },
                recentActivity: activity.slice(0, 5),
            });
            setLoading(false);
        }
        fetchDashboardData();
    }, [ngoId, ctxLoading]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'request': return 'assignment_turned_in';
            case 'donation': return 'add_card';
            case 'volunteer': return 'person_add';
            case 'event': return 'campaign';
            default: return 'info';
        }
    };

    const getActivityStyle = (type: string) => {
        switch (type) {
            case 'request': return { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' };
            case 'donation': return { bg: 'rgba(16,185,129,0.1)', color: '#059669' };
            case 'volunteer': return { bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' };
            case 'event': return { bg: 'rgba(245,158,11,0.1)', color: '#d97706' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    if (loading || ctxLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    const ngo = data?.ngo;
    const stats = [
        { label: 'Requests Resolved', value: ngo?.total_requests_resolved || 0, icon: 'description', iconBg: 'rgba(59,130,246,0.08)', iconColor: '#2563eb' },
        { label: 'Active Volunteers', value: ngo?.total_volunteers || 0, icon: 'person_check', iconBg: 'rgba(16,185,129,0.08)', iconColor: '#059669' },
        { label: 'Donations', value: formatCurrency(ngo?.total_donations || 0), icon: 'payments', iconBg: 'rgba(245,158,11,0.08)', iconColor: '#d97706' },
        { label: 'Upcoming Events', value: data?.stats.upcomingEvents || 0, icon: 'event', iconBg: 'rgba(139,92,246,0.08)', iconColor: '#7c3aed' },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
                Dashboard Overview
            </h2>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{
                        background: '#fff', padding: 20, borderRadius: 12,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 8,
                                background: stat.iconBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 22, color: stat.iconColor }}>{stat.icon}</span>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 4 }}>{stat.label}</p>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Dashboard Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Recent Activity Feed */}
                <div style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <h4 style={{ fontWeight: 700, color: '#1e293b' }}>Recent Activity</h4>
                        <Link href="/ngo/requests" style={{ fontSize: 12, fontWeight: 700, color: '#1de2d1', textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div>
                        {(data?.recentActivity || []).length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>inbox</span>
                                <p style={{ fontSize: 14 }}>No recent activity</p>
                            </div>
                        ) : (
                            data?.recentActivity.map((item) => {
                                const style = getActivityStyle(item.type);
                                return (
                                    <div key={item.id} style={{
                                        padding: '14px 20px',
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        borderBottom: '1px solid #f8fafc',
                                        cursor: 'pointer',
                                    }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: style.bg, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: style.color }}>{getActivityIcon(item.type)}</span>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                                            <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>{formatDistanceToNow(item.created_at)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{
                        background: '#fff', padding: 20, borderRadius: 12,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="material-symbols-outlined" style={{ color: '#1de2d1' }}>bolt</span>
                            Quick Actions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link href="/ngo/requests/create" style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px', borderRadius: 8,
                                background: '#1de2d1', color: '#1E3A5F',
                                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_box</span>
                                Create New Request
                            </Link>
                            <Link href="/ngo/volunteers" style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px', borderRadius: 8,
                                background: '#f1f5f9', color: '#475569',
                                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748b' }}>person_add</span>
                                Invite Volunteer
                            </Link>
                            <Link href="/ngo/donations" style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px', borderRadius: 8,
                                background: '#f1f5f9', color: '#475569',
                                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748b' }}>summarize</span>
                                View Reports
                            </Link>
                        </div>
                    </div>

                    {/* Active Requests Summary */}
                    <div style={{
                        background: '#1E3A5F', borderRadius: 12, padding: 20,
                        color: '#fff', position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <h5 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Active Requests</h5>
                            <p style={{ fontSize: 36, fontWeight: 900, color: '#1de2d1', marginBottom: 4 }}>
                                {data?.stats.activeRequests || 0}
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 14 }}>
                                requests currently open or in progress
                            </p>
                            <Link href="/ngo/requests" style={{
                                fontSize: 12, fontWeight: 700, color: '#1de2d1',
                                display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none',
                            }}>
                                View All
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                            </Link>
                        </div>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute', bottom: -16, right: -16,
                            fontSize: 80, color: 'rgba(255,255,255,0.03)',
                            transform: 'rotate(12deg)',
                        }}>auto_awesome</span>
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(135deg, rgba(29,226,209,0.1), transparent)',
                            opacity: 0.5,
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
