'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDistanceToNow } from "@/lib/utils";

interface Assignment {
    id: string;
    status: string;
    hours_spent: number;
    request: {
        id: string;
        title: string;
        description: string;
        ngo: {
            name: string;
        };
        scheduled_date: string;
        location: string;
    };
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
            if (!session) {
                setLoading(false);
                return;
            }

            // Get assignments
            const { data: assignmentsData } = await supabase
                .from('volunteer_assignments')
                .select('id, status, hours_spent, request_id')
                .eq('volunteer_id', session.user.id)
                .in('status', activeTab === 'ACTIVE' ? ['ASSIGNED', 'IN_PROGRESS'] : ['COMPLETED'])
                .order('created_at', { ascending: false });

            // Get request details
            const requestIds = (assignmentsData || []).map(a => a.request_id).filter(Boolean);
            let requestsData: Record<string, { title: string; description: string; ngo_name: string; scheduled_date: string; location: string }> = {};

            if (requestIds.length > 0) {
                const { data: requests } = await supabase
                    .from('requests')
                    .select('id, title, description, ngo:ngos(name), scheduled_date, location')
                    .in('id', requestIds);

                (requests || []).forEach(r => {
                    requestsData[r.id] = {
                        title: r.title,
                        description: r.description,
                        ngo_name: (r.ngo as unknown as { name: string })?.name || 'Unknown NGO',
                        scheduled_date: r.scheduled_date,
                        location: r.location,
                    };
                });
            }

            const formattedAssignments: Assignment[] = (assignmentsData || []).map(a => ({
                id: a.id,
                status: a.status,
                hours_spent: a.hours_spent,
                request: {
                    id: a.request_id,
                    title: requestsData[a.request_id]?.title || 'Unknown Request',
                    description: requestsData[a.request_id]?.description || '',
                    ngo: {
                        name: requestsData[a.request_id]?.ngo_name || 'Unknown NGO',
                    },
                    scheduled_date: requestsData[a.request_id]?.scheduled_date || '',
                    location: requestsData[a.request_id]?.location || '',
                },
            }));

            setAssignments(formattedAssignments);
            setLoading(false);
        }

        fetchAssignments();
    }, [activeTab]);

    const statusStyles: Record<string, string> = {
        ASSIGNED: "bg-blue-100 text-blue-700",
        IN_PROGRESS: "bg-purple-100 text-purple-700",
        COMPLETED: "bg-green-100 text-green-700",
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="My Assignments" showBack fallbackRoute="/volunteer" />

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('ACTIVE')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${activeTab === 'ACTIVE' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-subtle)]'}`}
                >
                    Active
                </button>
                <button
                    onClick={() => setActiveTab('COMPLETED')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${activeTab === 'COMPLETED' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-subtle)]'}`}
                >
                    Completed
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner"></div>
                </div>
            ) : assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-[var(--primary)]">assignment</span>
                    </div>
                    <h3 className="font-bold mb-1">No {activeTab.toLowerCase()} assignments</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                        {activeTab === 'ACTIVE'
                            ? 'Browse opportunities to find new assignments'
                            : 'Completed assignments will appear here'}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {assignments.map((assignment) => (
                        <Link
                            key={assignment.id}
                            href={`/volunteer/assignments/${assignment.id}`}
                            className="block bg-white rounded-xl p-4 border border-[var(--border-light)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold">{assignment.request?.title || 'Unknown Request'}</h3>
                                    <p className="text-xs text-[var(--foreground-muted)]">{assignment.request?.ngo?.name || 'Unknown NGO'}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${statusStyles[assignment.status] || 'bg-gray-100'}`}>
                                    {assignment.status.replace("_", " ")}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                {assignment.request?.scheduled_date
                                    ? formatDistanceToNow(assignment.request.scheduled_date)
                                    : 'No date set'}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
