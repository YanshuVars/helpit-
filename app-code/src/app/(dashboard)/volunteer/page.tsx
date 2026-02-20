'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from '@/lib/utils';

interface VolunteerDashboardData {
    user: { full_name: string } | null;
    stats: { hours: number; tasks: number; ngos: number };
    isAvailable: boolean;
    activeAssignments: Array<{ id: string; status: string; request_title: string; ngo_name: string; scheduled_date: string }>;
    nearbyRequests: Array<{ id: string; title: string; ngo_name: string; urgency: string; location: string }>;
}

export default function VolunteerDashboardPage() {
    const [data, setData] = useState<VolunteerDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState(false);

    useEffect(() => {
        async function fetchDashboardData() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: userData } = await supabase.from('users').select('full_name, is_available').eq('id', session.user.id).single();

            // Stats
            const { data: completedAssignments } = await supabase.from('volunteer_assignments')
                .select('hours_spent, request:requests(ngo_id)').eq('volunteer_id', session.user.id).eq('status', 'COMPLETED');

            const totalHours = (completedAssignments || []).reduce((a, c) => a + (c.hours_spent || 0), 0);
            const totalTasks = (completedAssignments || []).length;
            const uniqueNgos = new Set((completedAssignments || []).map((a: any) => a.request?.ngo_id).filter(Boolean));

            // Active assignments
            const { data: activeData } = await supabase.from('volunteer_assignments')
                .select('id, status, request_id').eq('volunteer_id', session.user.id).in('status', ['ASSIGNED', 'IN_PROGRESS']).order('created_at', { ascending: false }).limit(5);

            const requestIds = (activeData || []).map(a => a.request_id).filter(Boolean);
            let requestMap: Record<string, any> = {};
            if (requestIds.length > 0) {
                const { data: requests } = await supabase.from('requests').select('id, title, ngo:ngos(name), scheduled_date').in('id', requestIds);
                (requests || []).forEach(r => { requestMap[r.id] = r; });
            }

            const activeAssignments = (activeData || []).map(a => ({
                id: a.id, status: a.status,
                request_title: requestMap[a.request_id]?.title || 'Unknown',
                ngo_name: (requestMap[a.request_id]?.ngo as any)?.name || 'Unknown NGO',
                scheduled_date: requestMap[a.request_id]?.scheduled_date || '',
            }));

            // Nearby urgent requests
            const { data: urgentRequests } = await supabase.from('requests')
                .select('id, title, ngo:ngos(name), urgency, location').eq('status', 'OPEN')
                .order('created_at', { ascending: false }).limit(3);

            const nearbyRequests = (urgentRequests || []).map(r => ({
                id: r.id, title: r.title,
                ngo_name: (r.ngo as unknown as { name: string })?.name || 'Unknown NGO',
                urgency: r.urgency || 'NORMAL', location: r.location || '',
            }));

            setAvailability(userData?.is_available || false);
            setData({
                user: { full_name: userData?.full_name || 'Volunteer' },
                stats: { hours: totalHours, tasks: totalTasks, ngos: uniqueNgos.size },
                isAvailable: userData?.is_available || false,
                activeAssignments, nearbyRequests,
            });
            setLoading(false);
        }
        fetchDashboardData();
    }, []);

    const toggleAvailability = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const newVal = !availability;
        setAvailability(newVal);
        await supabase.from('users').update({ is_available: newVal }).eq('id', session.user.id);
    };

    if (loading) {
        return <div className="dashboard-loading"><span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span></div>;
    }

    if (!data?.user) return null;
    const firstName = data.user.full_name.split(' ')[0] || 'Volunteer';

    const statusStyles: Record<string, { bg: string; text: string }> = {
        ASSIGNED: { bg: '#E3F2FD', text: '#1565C0' },
        IN_PROGRESS: { bg: '#F3E5F5', text: '#7B1FA2' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Greeting + Availability */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700 }}>Hi, {firstName}! 🙌</h2>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>Ready to make an impact?</p>
                </div>
                <button onClick={toggleAvailability} style={{
                    width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                    background: availability ? 'var(--color-success)' : 'var(--color-border)',
                    position: 'relative', transition: 'background 0.2s',
                }}>
                    <span style={{
                        position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        boxShadow: 'var(--shadow-sm)', transition: 'left 0.2s',
                        left: availability ? 25 : 3,
                    }} />
                </button>
            </div>

            {/* Stats */}
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                    { icon: 'schedule', label: 'Hours', value: data.stats.hours, color: 'var(--color-primary)' },
                    { icon: 'task_alt', label: 'Tasks', value: data.stats.tasks, color: '#E65100' },
                    { icon: 'apartment', label: 'NGOs', value: data.stats.ngos, color: '#2E7D32' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color, marginBottom: 4 }}>{s.icon}</span>
                        <div className="stat-card-value">{s.value}</div>
                        <div className="stat-card-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Active Assignments */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Active Assignments</h3>
                    <Link href="/volunteer/assignments" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>See all</Link>
                </div>
                {data.activeAssignments.length === 0 ? (
                    <div className="empty-state-container">
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>assignment</span>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No active assignments</p>
                        <Link href="/volunteer/opportunities" className="btn btn-primary" style={{ marginTop: 10, textDecoration: 'none' }}>Find Opportunities</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {data.activeAssignments.map(a => {
                            const ss = statusStyles[a.status] || statusStyles.ASSIGNED;
                            return (
                                <Link key={a.id} href={`/volunteer/assignments/${a.id}`} className="card-interactive" style={{ padding: 14, textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, fontSize: 14 }}>{a.request_title}</h4>
                                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a.ngo_name}</p>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: ss.bg, color: ss.text, whiteSpace: 'nowrap' }}>{a.status.replace('_', ' ')}</span>
                                    </div>
                                    {a.scheduled_date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-disabled)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                                            {formatDistanceToNow(a.scheduled_date)}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Nearby Urgent Requests */}
            <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Nearby Requests</h3>
                {data.nearbyRequests.length === 0 ? (
                    <div className="empty-state-container">
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>explore</span>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No nearby requests right now</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {data.nearbyRequests.map(r => (
                            <div key={r.id} className="card" style={{ padding: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</h4>
                                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{r.ngo_name}</p>
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
                                        background: r.urgency === 'HIGH' ? '#FFEBEE' : '#FFF8E1',
                                        color: r.urgency === 'HIGH' ? '#E53935' : '#F9A825',
                                    }}>{r.urgency}</span>
                                </div>
                                {r.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-disabled)', marginBottom: 10 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                                        {r.location}
                                    </div>
                                )}
                                <Link href={`/volunteer/opportunities`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '8px 0', textDecoration: 'none' }}>
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
