'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow, formatCurrency } from '@/lib/utils';

interface NGODashboardData {
    ngo: {
        id: string;
        name: string;
        total_requests: number;
        total_volunteers: number;
        total_donations: number;
        total_events: number;
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
    const [data, setData] = useState<NGODashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            const supabase = createClient();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            const { data: membership } = await supabase
                .from('ngo_members')
                .select('ngo_id')
                .eq('user_id', session.user.id)
                .single();

            if (!membership) {
                setLoading(false);
                return;
            }

            const ngoId = membership.ngo_id;

            const { data: ngoData } = await supabase
                .from('ngos')
                .select('*')
                .eq('id', ngoId)
                .single();

            const ngo = ngoData;

            const { count: activeRequests } = await supabase
                .from('requests')
                .select('*', { count: 'exact', head: true })
                .eq('ngo_id', ngoId)
                .eq('status', 'ACTIVE');

            const { count: pendingDonations } = await supabase
                .from('donations')
                .select('*', { count: 'exact', head: true })
                .eq('ngo_id', ngoId)
                .eq('status', 'PENDING');

            const { count: upcomingEvents } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('ngo_id', ngoId)
                .gte('start_date', new Date().toISOString());

            const { data: recentRequests } = await supabase
                .from('requests')
                .select('id, title, status, created_at')
                .eq('ngo_id', ngoId)
                .order('created_at', { ascending: false })
                .limit(3);

            const { data: recentDonations } = await supabase
                .from('donations')
                .select('id, amount, donor_name, created_at')
                .eq('ngo_id', ngoId)
                .order('created_at', { ascending: false })
                .limit(3);

            const activity: NGODashboardData['recentActivity'] = [];

            recentRequests?.forEach(r => {
                activity.push({
                    id: `req-${r.id}`,
                    type: 'request',
                    title: `New request: ${r.title}`,
                    description: `Status: ${r.status}`,
                    created_at: r.created_at,
                });
            });

            recentDonations?.forEach(d => {
                activity.push({
                    id: `don-${d.id}`,
                    type: 'donation',
                    title: `Donation received: ₹${d.amount}`,
                    description: d.donor_name || 'Anonymous donor',
                    created_at: d.created_at,
                });
            });

            activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            const finalActivity = activity.slice(0, 5);

            setData({
                ngo: ngo ? {
                    id: ngo.id,
                    name: ngo.name,
                    total_requests: ngo.total_requests || 0,
                    total_volunteers: ngo.total_volunteers || 0,
                    total_donations: ngo.total_donations || 0,
                    total_events: ngo.total_events || 0,
                } : null,
                stats: {
                    activeRequests: activeRequests || 0,
                    pendingDonations: pendingDonations || 0,
                    upcomingEvents: upcomingEvents || 0,
                },
                recentActivity: finalActivity,
            });
            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'request': return 'pending_actions';
            case 'donation': return 'paid';
            case 'volunteer': return 'person_add';
            case 'event': return 'event';
            default: return 'info';
        }
    };

    const getActivityBg = (type: string) => {
        switch (type) {
            case 'request': return { bg: '#FFF3E0', color: '#E65100' };
            case 'donation': return { bg: '#E8F5E9', color: '#2E7D32' };
            case 'volunteer': return { bg: '#E3F2FD', color: '#1565C0' };
            case 'event': return { bg: '#EDE7F6', color: '#4527A0' };
            default: return { bg: '#F5F5F5', color: '#616161' };
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    if (!data?.ngo) {
        return (
            <div className="empty-state-container">
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-primary)' }}>business</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>No NGO Found</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 16 }}>You need to register an NGO to access this dashboard.</p>
                <Link href="/register/ngo" className="btn btn-primary">Register NGO</Link>
            </div>
        );
    }

    const statCards = [
        { icon: 'pending_actions', iconBg: '#EDE7F6', iconColor: 'var(--color-primary)', value: data.ngo.total_requests, label: 'Total Requests', badge: `${data.stats.activeRequests} active` },
        { icon: 'groups', iconBg: '#E3F2FD', iconColor: '#1565C0', value: data.ngo.total_volunteers, label: 'Volunteers' },
        { icon: 'payments', iconBg: '#E8F5E9', iconColor: '#2E7D32', value: formatCurrency(data.ngo.total_donations), label: 'Total Raised' },
        { icon: 'event', iconBg: '#EDE7F6', iconColor: '#4527A0', value: data.ngo.total_events, label: 'Events', badge: `${data.stats.upcomingEvents} upcoming` },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Welcome */}
            <div>
                <h1 className="page-title">{data.ngo.name}</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 2 }}>Welcome back! Here&apos;s your impact overview.</p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/ngo/requests/create" className="btn btn-primary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
                    New Request
                </Link>
                <Link href="/ngo/events" className="btn btn-secondary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>event</span>
                    Create Event
                </Link>
                <Link href="/ngo/posts" className="btn btn-secondary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>campaign</span>
                    Announcement
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stat-grid">
                {statCards.map(stat => (
                    <div key={stat.label} className="card" style={{ padding: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: stat.iconBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span className="material-symbols-outlined" style={{ color: stat.iconColor, fontSize: 20 }}>{stat.icon}</span>
                            </div>
                            {stat.badge && (
                                <span className="badge badge-info" style={{ fontSize: 11 }}>{stat.badge}</span>
                            )}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)' }}>{stat.value}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h2>
                    <button className="auth-link" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}>View all</button>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {data.recentActivity.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>inbox</span>
                            <p style={{ color: 'var(--color-text-muted)', marginTop: 8, fontSize: 13 }}>No recent activity</p>
                        </div>
                    ) : (
                        data.recentActivity.map((activity, i) => {
                            const colors = getActivityBg(activity.type);
                            return (
                                <div key={activity.id} className="list-row" style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
                                    borderBottom: i < data.recentActivity.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: colors.bg, color: colors.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{getActivityIcon(activity.type)}</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.title}</p>
                                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{activity.description}</p>
                                    </div>
                                    <span style={{ fontSize: 11, color: 'var(--color-text-disabled)', flexShrink: 0 }}>
                                        {activity.created_at ? formatDistanceToNow(activity.created_at) : 'Just now'}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
