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

    const statusStyles: Record<string, { bg: string; text: string }> = {
        ASSIGNED: { bg: '#E3F2FD', text: '#1565C0' },
        IN_PROGRESS: { bg: '#F3E5F5', text: '#7B1FA2' },
        COMPLETED: { bg: 'var(--color-success-bg, #E8F5E9)', text: 'var(--color-success)' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Link href="/volunteer" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">My Assignments</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6 }}>
                {(['ACTIVE', 'COMPLETED'] as TabType[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? "tab-pill tab-pill-active" : "tab-pill"}
                    >{tab === 'ACTIVE' ? 'Active' : 'Completed'}</button>
                ))}
            </div>

            {loading ? (
                <div className="dashboard-loading"><div className="spinner" /></div>
            ) : assignments.length === 0 ? (
                <div className="empty-state-container">
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-primary)' }}>assignment</span>
                    </div>
                    <h3 style={{ fontWeight: 700, marginBottom: 4 }}>No {activeTab.toLowerCase()} assignments</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                        {activeTab === 'ACTIVE' ? 'Browse opportunities to find new assignments' : 'Completed assignments will appear here'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {assignments.map(a => {
                        const ss = statusStyles[a.status] || statusStyles.ASSIGNED;
                        return (
                            <Link key={a.id} href={`/volunteer/assignments/${a.id}`} className="card-interactive" style={{ padding: 14, textDecoration: 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: 14 }}>{a.request?.title || 'Unknown Request'}</h3>
                                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a.request?.ngo?.name || 'Unknown NGO'}</p>
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: ss.bg, color: ss.text, whiteSpace: 'nowrap' }}>{a.status.replace("_", " ")}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-disabled)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                                    {a.request?.scheduled_date ? formatDistanceToNow(a.request.scheduled_date) : 'No date set'}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
