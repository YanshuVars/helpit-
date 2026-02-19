'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDistanceToNow } from '@/lib/utils';

interface Request {
    id: string;
    title: string;
    category: string;
    urgency: string;
    status: string;
    volunteers_count: number;
    created_at: string;
}

const urgencyColors: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-700",
};

type TabType = 'ALL' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED';

export default function NGORequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('ALL');

    useEffect(() => {
        async function fetchRequests() {
            const supabase = createClient();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            // Get user's NGO
            const { data: membership } = await supabase
                .from('ngo_members')
                .select('ngo_id')
                .eq('user_id', session.user.id)
                .single();

            if (!membership) {
                setLoading(false);
                return;
            }

            let query = supabase
                .from('requests')
                .select('id, title, category, urgency, status, volunteers_count, created_at')
                .eq('ngo_id', membership.ngo_id)
                .order('created_at', { ascending: false });

            if (activeTab !== 'ALL') {
                query = query.eq('status', activeTab);
            }

            const { data } = await query;

            setRequests(data || []);
            setLoading(false);
        }

        fetchRequests();
    }, [activeTab]);

    const tabs: { label: string; value: TabType }[] = [
        { label: 'All', value: 'ALL' },
        { label: 'Open', value: 'ACTIVE' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Resolved', value: 'COMPLETED' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Help Requests"
                showBack
                fallbackRoute="/ngo"
                rightAction={
                    <Link
                        href="/ngo/requests/create"
                        className="flex items-center gap-1.5 bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-semibold min-h-[44px]"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        New
                    </Link>
                }
            />

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {tabs.map((tab, i) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap min-h-[44px] ${activeTab === tab.value ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Request List */}
            {requests.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                    <p className="text-gray-500">No requests found</p>
                    <Link href="/ngo/requests/create" className="mt-4 inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold">
                        Create Request
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map((request) => (
                        <Link
                            key={request.id}
                            href={`/ngo/requests/${request.id}`}
                            className="block bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-base">{request.title}</h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${urgencyColors[request.urgency] || 'bg-gray-100 text-gray-700'}`}>
                                    {request.urgency}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[request.status] || 'bg-gray-100 text-gray-700'}`}>
                                    {request.status.replace("_", " ")}
                                </span>
                                <span className="text-xs text-gray-500">{request.category}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{request.volunteers_count || 0} volunteers</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">{formatDistanceToNow(request.created_at)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
