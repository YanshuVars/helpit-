'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AssignmentDetail {
    id: string; status: string; hours_spent: number;
    request: {
        id: string; title: string; description: string;
        ngo: { id: string; name: string };
        scheduled_date: string; location: string;
        required_volunteers: number; assigned_volunteers: number;
    };
}

export default function AssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params.id as string;
    const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAssignment() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: assignmentData } = await supabase.from('volunteer_assignments').select('id, status, hours_spent, request_id').eq('id', assignmentId).single();
            if (!assignmentData) { setLoading(false); return; }

            const { data: requestData } = await supabase.from('requests').select('id, title, description, ngo_id, scheduled_date, location, required_volunteers').eq('id', assignmentData.request_id).single();

            let ngoName = 'Unknown NGO';
            if (requestData?.ngo_id) {
                const { data: ngoData } = await supabase.from('ngos').select('id, name').eq('id', requestData.ngo_id).single();
                ngoName = ngoData?.name || 'Unknown NGO';
            }

            const { count: assignedCount } = await supabase.from('volunteer_assignments').select('*', { count: 'exact', head: true }).eq('request_id', assignmentData.request_id);

            setAssignment({
                id: assignmentData.id, status: assignmentData.status, hours_spent: assignmentData.hours_spent,
                request: {
                    id: requestData?.id, title: requestData?.title || 'Unknown Request',
                    description: requestData?.description || '',
                    ngo: { id: requestData?.ngo_id || '', name: ngoName },
                    scheduled_date: requestData?.scheduled_date || '', location: requestData?.location || '',
                    required_volunteers: requestData?.required_volunteers || 0, assigned_volunteers: assignedCount || 0,
                },
            });
            setLoading(false);
        }
        fetchAssignment();
    }, [assignmentId]);

    const markComplete = async () => {
        const supabase = createClient();
        await supabase.from('volunteer_assignments').update({ status: 'COMPLETED' }).eq('id', assignmentId);
        router.push('/volunteer/assignments');
    };

    const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
        ASSIGNED: { bg: '#dbeafe', text: '#1e40af', icon: 'assignment' },
        IN_PROGRESS: { bg: '#ede9fe', text: '#7c3aed', icon: 'pending_actions' },
        COMPLETED: { bg: '#dcfce7', text: '#166534', icon: 'check_circle' },
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div style={{ textAlign: 'center', padding: 64 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>error</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 12 }}>Assignment Not Found</h3>
                <Link href="/volunteer/assignments" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    marginTop: 16, padding: '10px 20px', borderRadius: 10,
                    background: '#1de2d1', color: '#0f172a',
                    fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>Back to Assignments</Link>
            </div>
        );
    }

    const ss = statusConfig[assignment.status] || statusConfig.ASSIGNED;
    const progress = assignment.request.required_volunteers
        ? Math.round((assignment.request.assigned_volunteers / assignment.request.required_volunteers) * 100) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <Link href="/volunteer/assignments" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    color: '#64748b', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 8,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                    Assignments
                </Link>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Assignment Details
                </h2>
            </div>

            <div className="r-main-side" style={{ alignItems: 'start' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Title Card */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                            <div>
                                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{assignment.request.title}</h3>
                                <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{assignment.request.ngo.name}</p>
                            </div>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '5px 12px', borderRadius: 999,
                                fontSize: 12, fontWeight: 700, background: ss.bg, color: ss.text,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{ss.icon}</span>
                                {assignment.status.replace('_', ' ')}
                            </span>
                        </div>

                        {assignment.status !== 'COMPLETED' && (
                            <div style={{ marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: '#64748b' }}>
                                    <span>Team Progress</span>
                                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{assignment.request.assigned_volunteers} / {assignment.request.required_volunteers}</span>
                                </div>
                                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', background: 'linear-gradient(90deg, #1de2d1, #0ea5e9)',
                                        borderRadius: 4, width: `${Math.min(progress, 100)}%`,
                                        transition: 'width 400ms',
                                    }} />
                                </div>
                            </div>
                        )}

                        {assignment.status === 'COMPLETED' && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: 14,
                                background: '#dcfce7', borderRadius: 12, marginTop: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#16a34a' }}>schedule</span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>{assignment.hours_spent || 0} hours contributed</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {assignment.request.description && (
                        <div style={{
                            background: '#fff', borderRadius: 16, padding: 24,
                            border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Description</h4>
                            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{assignment.request.description}</p>
                        </div>
                    )}

                    {/* Details */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Event Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {[
                                { icon: 'calendar_today', label: 'Schedule', value: assignment.request.scheduled_date ? new Date(assignment.request.scheduled_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not scheduled' },
                                { icon: 'location_on', label: 'Location', value: assignment.request.location || 'Location not specified' },
                                { icon: 'domain', label: 'Organization', value: assignment.request.ngo.name },
                            ].map(d => (
                                <div key={d.label} style={{ display: 'flex', gap: 14, alignItems: 'start' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: 'rgba(29,226,209,0.08)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#1de2d1' }}>{d.icon}</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{d.label}</p>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{d.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    position: 'sticky', top: 80,
                }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Quick Actions</h4>

                    {assignment.status !== 'COMPLETED' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link href={`/messages/${assignment.request.ngo.id}`} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                height: 44, borderRadius: 12,
                                border: '1px solid #e2e8f0', background: '#fff',
                                color: '#0f172a', fontSize: 13, fontWeight: 600,
                                textDecoration: 'none',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                                Contact NGO
                            </Link>
                            <button onClick={markComplete} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                height: 44, borderRadius: 12, border: 'none',
                                background: '#1de2d1', color: '#0f172a',
                                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(29,226,209,0.2)',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                                Mark Complete
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 20 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#fff' }}>check_circle</span>
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Completed! 🎉</h3>
                            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Thank you for your contribution</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
