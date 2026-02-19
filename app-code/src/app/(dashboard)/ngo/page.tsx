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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!data?.ngo) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                <div className="w-20 h-20 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-[var(--primary)]">business</span>
                </div>
                <h2 className="text-xl font-bold mb-2">No NGO Found</h2>
                <p className="text-[var(--foreground-muted)] mb-4">You need to register an NGO to access this dashboard.</p>
                <Link href="/register/ngo" className="btn btn-primary">
                    Register NGO
                </Link>
            </div>
        );
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'request': return 'pending_actions';
            case 'donation': return 'paid';
            case 'volunteer': return 'person_add';
            case 'event': return 'event';
            default: return 'info';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'request': return 'bg-orange-100 text-orange-600';
            case 'donation': return 'bg-green-100 text-green-600';
            case 'volunteer': return 'bg-blue-100 text-blue-600';
            case 'event': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="flex flex-col">
            {/* Welcome Section */}
            <div className="mb-6 animate-slideUp">
                <h1 className="text-2xl font-bold">{data.ngo.name}</h1>
                <p className="text-[var(--foreground-muted)] text-sm mt-1">Welcome back! Here's your impact overview.</p>
            </div>

            {/* Quick Actions */}
            <section className="section-spacing">
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    <Link
                        href="/ngo/requests/create"
                        className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[var(--primary)] text-white px-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        <span className="text-sm font-semibold">New Request</span>
                    </Link>
                    <Link
                        href="/ngo/events"
                        className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-[var(--border)] text-[var(--foreground)] px-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">event</span>
                        <span className="text-sm font-semibold">Create Event</span>
                    </Link>
                    <Link
                        href="/ngo/posts"
                        className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-[var(--border)] text-[var(--foreground)] px-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">campaign</span>
                        <span className="text-sm font-semibold">Announcement</span>
                    </Link>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="section-spacing">
                <div className="grid grid-cols-2 gap-3">
                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--primary)]">pending_actions</span>
                            </span>
                            <span className="badge badge-primary">{data.stats.activeRequests} active</span>
                        </div>
                        <p className="text-2xl font-bold">{data.ngo.total_requests}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Total Requests</p>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">groups</span>
                            </span>
                        </div>
                        <p className="text-2xl font-bold">{data.ngo.total_volunteers}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Volunteers</p>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600">payments</span>
                            </span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(data.ngo.total_donations)}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Total Raised</p>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600">event</span>
                            </span>
                            <span className="badge badge-info">{data.stats.upcomingEvents} upcoming</span>
                        </div>
                        <p className="text-2xl font-bold">{data.ngo.total_events}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Events</p>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section>
                <div className="flex items-center justify-between section-header">
                    <h3 className="text-lg font-bold">Recent Activity</h3>
                    <button className="text-sm font-medium text-[var(--primary)]">View all</button>
                </div>

                <div className="card overflow-hidden">
                    {data.recentActivity.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-[var(--foreground-light)] mb-2">inbox</span>
                            <p className="text-[var(--foreground-muted)]">No recent activity</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-light)]">
                            {data.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-4 hover:bg-[var(--background-subtle)] transition-colors">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}>
                                        <span className="material-symbols-outlined text-lg">{getActivityIcon(activity.type)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{activity.title}</p>
                                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{activity.description}</p>
                                    </div>
                                    <span className="text-xs text-[var(--foreground-light)] shrink-0">
                                        {activity.created_at ? formatDistanceToNow(activity.created_at) : 'Just now'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
