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
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAssignment() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }
            setCurrentUserId(session.user.id);

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

    const statusStyles: Record<string, { bg: string; text: string }> = {
        ASSIGNED: { bg: '#E3F2FD', text: '#1565C0' },
        IN_PROGRESS: { bg: '#F3E5F5', text: '#7B1FA2' },
        COMPLETED: { bg: '#E8F5E9', text: '#2E7D32' },
    };

    const progress = assignment?.request?.required_volunteers
        ? Math.round((assignment.request.assigned_volunteers / assignment.request.required_volunteers) * 100) : 0;

    if (loading) {
        return <div className="dashboard-loading"><div className="spinner" /></div>;
    }

    if (!assignment) {
        return (
            <div className="empty-state-container" style={{ minHeight: '60vh' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-text-disabled)' }}>error</span>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>Assignment Not Found</h2>
                <Link href="/volunteer/assignments" className="btn btn-primary" style={{ marginTop: 16, textDecoration: 'none' }}>Back to Assignments</Link>
            </div>
        );
    }

    const ss = statusStyles[assignment.status] || statusStyles.ASSIGNED;

    const details = [
        { icon: 'calendar_today', label: 'Date & Time', value: assignment.request.scheduled_date ? new Date(assignment.request.scheduled_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not scheduled' },
        { icon: 'location_on', label: 'Location', value: assignment.request.location || 'Location not specified' },
        { icon: 'business', label: 'Organization', value: assignment.request.ngo.name },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Link href="/volunteer/assignments" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Assignment Details</h1>
            </div>

            {/* Status Card */}
            <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 17 }}>{assignment.request.title}</h2>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: ss.bg, color: ss.text }}>{assignment.status.replace("_", " ")}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 10 }}>{assignment.request.ngo.name}</p>

                {assignment.status !== 'COMPLETED' && (
                    <div style={{ marginTop: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                            <span>Volunteers</span>
                            <span style={{ fontWeight: 600 }}>{assignment.request.assigned_volunteers} / {assignment.request.required_volunteers}</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--color-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 3, width: `${Math.min(progress, 100)}%`, transition: 'width 0.4s' }} />
                        </div>
                    </div>
                )}

                {assignment.status === 'COMPLETED' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>schedule</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{assignment.hours_spent || 0} hours contributed</span>
                    </div>
                )}
            </div>

            {/* Description */}
            {assignment.request.description && (
                <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Description</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{assignment.request.description}</p>
                </div>
            )}

            {/* Details */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {details.map(d => (
                    <div key={d.label} style={{ display: 'flex', gap: 10, alignItems: 'start' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>{d.icon}</span>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 13 }}>{d.label}</p>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{d.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            {assignment.status !== 'COMPLETED' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Link href={`/messages/${assignment.request.ngo.id}`} className="btn btn-secondary" style={{ justifyContent: 'center', gap: 6, textDecoration: 'none' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span> Contact NGO
                    </Link>
                    <button onClick={markComplete} className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '10px 16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span> Mark Complete
                    </button>
                </div>
            )}

            {assignment.status === 'COMPLETED' && (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#2E7D32' }}>check_circle</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 18 }}>Completed! 🎉</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Thank you for your contribution</p>
                </div>
            )}
        </div>
    );
}
