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

            const { data: completedAssignments } = await supabase.from('volunteer_assignments')
                .select('hours_spent, request:requests(ngo_id)').eq('volunteer_id', session.user.id).eq('status', 'COMPLETED');

            const totalHours = (completedAssignments || []).reduce((a, c) => a + (c.hours_spent || 0), 0);
            const totalTasks = (completedAssignments || []).length;
            const uniqueNgos = new Set((completedAssignments || []).map((a: any) => a.request?.ngo_id).filter(Boolean));

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
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!data?.user) return null;
    const firstName = data.user.full_name.split(' ')[0] || 'Volunteer';

    const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
        ASSIGNED: { bg: '#dbeafe', text: '#1e40af', icon: 'assignment' },
        IN_PROGRESS: { bg: '#ede9fe', text: '#7c3aed', icon: 'pending_actions' },
    };

    const urgencyConfig: Record<string, { bg: string; text: string }> = {
        HIGH: { bg: '#fee2e2', text: '#dc2626' },
        NORMAL: { bg: '#fef3c7', text: '#d97706' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Greeting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Hi, {firstName}! 🙌
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Ready to make an impact today?</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: availability ? '#0d9488' : '#94a3b8' }}>
                        {availability ? 'Available' : 'Unavailable'}
                    </span>
                    <button onClick={toggleAvailability} style={{
                        width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                        background: availability ? '#1de2d1' : '#cbd5e1',
                        position: 'relative', transition: 'background 200ms',
                    }}>
                        <span style={{
                            position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
                            background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'left 200ms', left: availability ? 25 : 3,
                        }} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="r-grid-3">
                {[
                    { icon: 'schedule', label: 'Hours', value: data.stats.hours, color: '#1de2d1' },
                    { icon: 'task_alt', label: 'Tasks Done', value: data.stats.tasks, color: '#f59e0b' },
                    { icon: 'apartment', label: 'NGOs Helped', value: data.stats.ngos, color: '#8b5cf6' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', padding: 22, borderRadius: 16,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Active Assignments */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Active Assignments</h3>
                    <Link href="/volunteer/assignments" style={{ fontSize: 13, fontWeight: 600, color: '#1de2d1', textDecoration: 'none' }}>See all →</Link>
                </div>
                {data.activeAssignments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 32 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#cbd5e1' }}>assignment</span>
                        <p style={{ color: '#94a3b8', marginTop: 8, fontWeight: 600 }}>No active assignments</p>
                        <Link href="/volunteer/opportunities" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            marginTop: 12, padding: '10px 20px', borderRadius: 10,
                            background: '#1de2d1', color: '#0f172a',
                            fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        }}>Find Opportunities</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {data.activeAssignments.map(a => {
                            const ss = statusConfig[a.status] || statusConfig.ASSIGNED;
                            return (
                                <Link key={a.id} href={`/volunteer/assignments/${a.id}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: 16, borderRadius: 12,
                                    border: '1px solid #f1f5f9', background: '#fafbfc',
                                    textDecoration: 'none', transition: 'background 200ms',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fafbfc'}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: ss.bg, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: ss.text }}>{ss.icon}</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{a.request_title}</h4>
                                        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{a.ngo_name}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 999,
                                            fontSize: 11, fontWeight: 700, background: ss.bg, color: ss.text,
                                        }}>{a.status.replace('_', ' ')}</span>
                                        {a.scheduled_date && (
                                            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{formatDistanceToNow(a.scheduled_date)}</p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Nearby Requests */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Nearby Requests</h3>
                {data.nearbyRequests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 32 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#cbd5e1' }}>explore</span>
                        <p style={{ color: '#94a3b8', marginTop: 8 }}>No nearby requests right now</p>
                    </div>
                ) : (
                    <div className="r-grid-cards" style={{ gap: 14 }}>
                        {data.nearbyRequests.map(r => {
                            const uc = urgencyConfig[r.urgency] || urgencyConfig.NORMAL;
                            return (
                                <div key={r.id} style={{
                                    padding: 18, borderRadius: 14,
                                    border: '1px solid #f1f5f9', background: '#fafbfc',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                        <div>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.title}</h4>
                                            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{r.ngo_name}</p>
                                        </div>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 999,
                                            fontSize: 11, fontWeight: 700, background: uc.bg, color: uc.text,
                                        }}>{r.urgency}</span>
                                    </div>
                                    {r.location && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                                            {r.location}
                                        </div>
                                    )}
                                    <Link href="/volunteer/opportunities" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                        padding: '9px 16px', borderRadius: 10,
                                        background: '#1de2d1', color: '#0f172a',
                                        fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                    }}>View Details</Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
