'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow, formatCurrency } from "@/lib/utils";

interface AssignmentDetail {
    id: string;
    status: string;
    hours_spent: number;
    request: {
        id: string;
        title: string;
        description: string;
        ngo: {
            id: string;
            name: string;
        };
        scheduled_date: string;
        location: string;
        required_volunteers: number;
        assigned_volunteers: number;
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
            if (!session) {
                setLoading(false);
                return;
            }

            setCurrentUserId(session.user.id);

            // Get assignment
            const { data: assignmentData } = await supabase
                .from('volunteer_assignments')
                .select('id, status, hours_spent, request_id')
                .eq('id', assignmentId)
                .single();

            if (!assignmentData) {
                setLoading(false);
                return;
            }

            // Get request details
            const { data: requestData } = await supabase
                .from('requests')
                .select('id, title, description, ngo_id, scheduled_date, location, required_volunteers')
                .eq('id', assignmentData.request_id)
                .single();

            // Get NGO details
            let ngoName = 'Unknown NGO';
            if (requestData?.ngo_id) {
                const { data: ngoData } = await supabase
                    .from('ngos')
                    .select('id, name')
                    .eq('id', requestData.ngo_id)
                    .single();
                ngoName = ngoData?.name || 'Unknown NGO';
            }

            // Get assigned volunteers count
            const { count: assignedCount } = await supabase
                .from('volunteer_assignments')
                .select('*', { count: 'exact', head: true })
                .eq('request_id', assignmentData.request_id);

            setAssignment({
                id: assignmentData.id,
                status: assignmentData.status,
                hours_spent: assignmentData.hours_spent,
                request: {
                    id: requestData?.id,
                    title: requestData?.title || 'Unknown Request',
                    description: requestData?.description || '',
                    ngo: {
                        id: requestData?.ngo_id || '',
                        name: ngoName,
                    },
                    scheduled_date: requestData?.scheduled_date || '',
                    location: requestData?.location || '',
                    required_volunteers: requestData?.required_volunteers || 0,
                    assigned_volunteers: assignedCount || 0,
                },
            });

            setLoading(false);
        }

        fetchAssignment();
    }, [assignmentId]);

    const markComplete = async () => {
        const supabase = createClient();

        await supabase
            .from('volunteer_assignments')
            .update({ status: 'COMPLETED' })
            .eq('id', assignmentId);

        router.push('/volunteer/assignments');
    };

    const statusStyles: Record<string, string> = {
        ASSIGNED: "bg-blue-100 text-blue-700",
        IN_PROGRESS: "bg-purple-100 text-purple-700",
        COMPLETED: "bg-green-100 text-green-700",
    };

    const progress = assignment?.request?.required_volunteers
        ? Math.round((assignment.request.assigned_volunteers / assignment.request.required_volunteers) * 100)
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-8 text-center animate-fadeIn">
                <span className="material-symbols-outlined text-5xl text-[var(--foreground-light)] mb-3">error</span>
                <h2 className="text-xl font-bold mb-2">Assignment Not Found</h2>
                <Link href="/volunteer/assignments" className="btn btn-primary mt-4">
                    Back to Assignments
                </Link>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/volunteer/assignments" className="p-2 -ml-2 rounded-full hover:bg-[var(--background-subtle)] transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Assignment Details</h1>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl p-4 border border-[var(--border-light)] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-lg">{assignment.request.title}</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[assignment.status]}`}>
                        {assignment.status.replace("_", " ")}
                    </span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-3">{assignment.request.ngo.name}</p>

                {/* Progress */}
                {assignment.status !== 'COMPLETED' && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Volunteers</span>
                            <span className="font-semibold">{assignment.request.assigned_volunteers} / {assignment.request.required_volunteers}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-subtle)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Hours */}
                {assignment.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 mt-3">
                        <span className="material-symbols-outlined text-[var(--primary)]">schedule</span>
                        <span className="text-sm font-medium">{assignment.hours_spent || 0} hours contributed</span>
                    </div>
                )}
            </div>

            {/* Description */}
            {assignment.request.description && (
                <div className="bg-white rounded-xl p-4 border border-[var(--border-light)] shadow-sm">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">{assignment.request.description}</p>
                </div>
            )}

            {/* Details */}
            <div className="bg-white rounded-xl p-4 border border-[var(--border-light)] shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--primary)]">calendar_today</span>
                    <div>
                        <p className="font-semibold text-sm">Date & Time</p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                            {assignment.request.scheduled_date
                                ? new Date(assignment.request.scheduled_date).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : 'Not scheduled'}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--primary)]">location_on</span>
                    <div>
                        <p className="font-semibold text-sm">Location</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{assignment.request.location || 'Location not specified'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--primary)]">business</span>
                    <div>
                        <p className="font-semibold text-sm">Organization</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{assignment.request.ngo.name}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {assignment.status !== 'COMPLETED' && (
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href={`/messages/${assignment.request.ngo.id}`}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] bg-white font-semibold text-sm hover:bg-[var(--background-subtle)] transition-colors"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        Contact NGO
                    </Link>
                    <button
                        onClick={markComplete}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">check</span>
                        Mark Complete
                    </button>
                </div>
            )}

            {assignment.status === 'COMPLETED' && (
                <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-3xl text-green-600">check_circle</span>
                    </div>
                    <h3 className="font-bold text-lg">Completed! 🎉</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">Thank you for your contribution</p>
                </div>
            )}
        </div>
    );
}
