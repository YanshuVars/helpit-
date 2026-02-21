'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface Assignment {
    id: string; status: string; hours_spent: number;
    request: { id: string; title: string; description: string; ngo: { name: string }; scheduled_date: string; location: string };
}

type TabType = 'ACTIVE' | 'COMPLETED';

export default function VolunteerAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('ACTIVE');

    useEffect(() => {
        async function fetchAssignments() {
            setLoading(true);
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: assignmentsData } = await supabase.from('volunteer_assignments')
                .select('id, status, hours_spent, request_id').eq('volunteer_id', session.user.id)
                .in('status', activeTab === 'ACTIVE' ? ['ASSIGNED', 'IN_PROGRESS'] : ['COMPLETED'])
                .order('created_at', { ascending: false });

            const requestIds = (assignmentsData || []).map(a => a.request_id).filter(Boolean);
            let requestsData: Record<string, any> = {};
            if (requestIds.length > 0) {
                const { data: requests } = await supabase.from('requests').select('id, title, description, ngo:ngos(name), scheduled_date, location').in('id', requestIds);
                (requests || []).forEach(r => {
                    requestsData[r.id] = { title: r.title, description: r.description, ngo_name: (r.ngo as unknown as { name: string })?.name || 'Unknown NGO', scheduled_date: r.scheduled_date, location: r.location };
                });
            }

            const formatted: Assignment[] = (assignmentsData || []).map(a => ({
                id: a.id, status: a.status, hours_spent: a.hours_spent,
                request: {
                    id: a.request_id, title: requestsData[a.request_id]?.title || 'Unknown Request',
                    description: requestsData[a.request_id]?.description || '',
                    ngo: { name: requestsData[a.request_id]?.ngo_name || 'Unknown NGO' },
                    scheduled_date: requestsData[a.request_id]?.scheduled_date || '',
                    location: requestsData[a.request_id]?.location || '',
                },
            }));
            setAssignments(formatted);
            setLoading(false);
        }
        fetchAssignments();
    }, [activeTab]);

    const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
        ASSIGNED: { bg: '#dbeafe', text: '#1e40af', icon: 'assignment' },
        IN_PROGRESS: { bg: '#ede9fe', text: '#7c3aed', icon: 'pending_actions' },
        COMPLETED: { bg: '#dcfce7', text: '#166534', icon: 'check_circle' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>My Assignments</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Track your current and past volunteer assignments.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8 }}>
                {(['ACTIVE', 'COMPLETED'] as TabType[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '8px 18px', borderRadius: 999,
                        border: activeTab === tab ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                        background: activeTab === tab ? 'rgba(29,226,209,0.08)' : '#fff',
                        color: activeTab === tab ? '#0d9488' : '#64748b',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 200ms',
                    }}>{tab === 'ACTIVE' ? '🔥 Active' : '✅ Completed'}</button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : assignments.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: 64,
                    background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
                }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: 'rgba(29,226,209,0.08)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#1de2d1' }}>assignment</span>
                    </div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a' }}>No {activeTab.toLowerCase()} assignments</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                        {activeTab === 'ACTIVE' ? 'Browse opportunities to find new assignments' : 'Completed assignments will appear here'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {assignments.map(a => {
                        const ss = statusConfig[a.status] || statusConfig.ASSIGNED;
                        return (
                            <Link key={a.id} href={`/volunteer/assignments/${a.id}`} style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                padding: 20, borderRadius: 16,
                                background: '#fff', border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                textDecoration: 'none', transition: 'box-shadow 200ms, transform 200ms',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: ss.bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: ss.text }}>{ss.icon}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{a.request?.title}</h3>
                                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{a.request?.ngo?.name}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: 999,
                                        fontSize: 11, fontWeight: 700, background: ss.bg, color: ss.text,
                                    }}>{a.status.replace('_', ' ')}</span>
                                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                                        {a.request?.scheduled_date ? formatDistanceToNow(a.request.scheduled_date) : 'No date'}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#cbd5e1' }}>chevron_right</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
