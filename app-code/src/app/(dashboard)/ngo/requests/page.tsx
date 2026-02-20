'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
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

const urgencyStyle: Record<string, { bg: string; color: string }> = {
    CRITICAL: { bg: '#FEE2E2', color: '#DC2626' },
    HIGH: { bg: '#FFF3E0', color: '#E65100' },
    MEDIUM: { bg: '#FFF8E1', color: '#F57F17' },
    LOW: { bg: '#E8F5E9', color: '#2E7D32' },
};

const statusStyle: Record<string, { bg: string; color: string }> = {
    ACTIVE: { bg: '#E3F2FD', color: '#1565C0' },
    IN_PROGRESS: { bg: '#EDE7F6', color: '#4527A0' },
    COMPLETED: { bg: '#E8F5E9', color: '#2E7D32' },
    CLOSED: { bg: '#F5F5F5', color: '#616161' },
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
            if (!session) { setLoading(false); return; }

            const { data: membership } = await supabase
                .from('ngo_members')
                .select('ngo_id')
                .eq('user_id', session.user.id)
                .single();

            if (!membership) { setLoading(false); return; }

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
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title">Help Requests</h1>
                <Link href="/ngo/requests/create" className="btn btn-primary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    New Request
                </Link>
            </div>

            {/* Tabs */}
            <div className="tabs-row">
                {tabs.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`tab-pill ${activeTab === tab.value ? 'tab-pill-active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Request List */}
            {requests.length === 0 ? (
                <div className="empty-state-container">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>inbox</span>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No requests found</p>
                    <Link href="/ngo/requests/create" className="btn btn-primary" style={{ marginTop: 12 }}>Create Request</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {requests.map((request) => {
                        const uStyle = urgencyStyle[request.urgency] || { bg: '#F5F5F5', color: '#616161' };
                        const sStyle = statusStyle[request.status] || { bg: '#F5F5F5', color: '#616161' };
                        return (
                            <Link
                                key={request.id}
                                href={`/ngo/requests/${request.id}`}
                                className="card card-interactive"
                                style={{ padding: '16px 18px', textDecoration: 'none' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <h3 style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-heading)' }}>{request.title}</h3>
                                    <span style={{
                                        fontSize: 10, fontWeight: 700,
                                        padding: '3px 8px', borderRadius: 'var(--radius-full)',
                                        background: uStyle.bg, color: uStyle.color,
                                        flexShrink: 0, marginLeft: 8,
                                    }}>
                                        {request.urgency}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12 }}>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                                        background: sStyle.bg, color: sStyle.color,
                                        fontWeight: 500,
                                    }}>
                                        {request.status.replace("_", " ")}
                                    </span>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{request.category}</span>
                                    <span style={{ color: 'var(--color-text-disabled)' }}>•</span>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{request.volunteers_count || 0} volunteers</span>
                                    <span style={{ color: 'var(--color-text-disabled)' }}>•</span>
                                    <span style={{ color: 'var(--color-text-disabled)' }}>{formatDistanceToNow(request.created_at)}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
