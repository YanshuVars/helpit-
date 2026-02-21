'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from '@/lib/utils';

interface Request {
    id: string;
    title: string;
    description: string;
    category: string;
    urgency: string;
    status: string;
    location: string;
    volunteers_count: number;
    created_at: string;
}

const urgencyStyles: Record<string, { bg: string; color: string }> = {
    CRITICAL: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
    HIGH: { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    MEDIUM: { bg: 'rgba(245,158,11,0.1)', color: '#ca8a04' },
    LOW: { bg: 'rgba(148,163,184,0.1)', color: '#64748b' },
};

const categoryIcons: Record<string, string> = {
    FOOD: 'restaurant',
    MEDICAL: 'medical_services',
    EDUCATION: 'school',
    DISASTER_RELIEF: 'flood',
    ENVIRONMENT: 'eco',
    ANIMAL_WELFARE: 'pets',
    OTHER: 'category',
};

type TabType = 'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED';

export default function NGORequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchRequests() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: membership } = await supabase
                .from('ngo_members').select('ngo_id')
                .eq('user_id', session.user.id).single();

            if (!membership) { setLoading(false); return; }

            let query = supabase
                .from('requests')
                .select('id, title, description, category, urgency, status, location, volunteers_count, created_at')
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

    const tabs: { label: string; value: TabType; count: number }[] = [
        { label: 'All', value: 'ALL', count: requests.length },
        { label: 'Active', value: 'ACTIVE', count: requests.filter(r => r.status === 'ACTIVE').length },
        { label: 'Pending', value: 'PENDING', count: requests.filter(r => r.status === 'PENDING').length },
        { label: 'Completed', value: 'COMPLETED', count: requests.filter(r => r.status === 'COMPLETED').length },
    ];

    const filtered = requests.filter(r =>
        !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Requests List Management
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link href="/ngo/requests/create" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '9px 18px', borderRadius: 8,
                        background: '#1de2d1', color: '#0f172a',
                        fontWeight: 700, fontSize: 13, textDecoration: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_circle</span>
                        Create New Request
                    </Link>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div style={{ marginBottom: 20 }}>
                {/* Tab bar */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid #e2e8f0',
                    overflowX: 'auto', marginBottom: 16,
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            style={{
                                padding: '12px 24px', fontSize: 13, fontWeight: activeTab === tab.value ? 700 : 500,
                                color: activeTab === tab.value ? '#0f172a' : '#64748b',
                                borderBottom: activeTab === tab.value ? '2px solid #1de2d1' : '2px solid transparent',
                                background: 'none', border: 'none', borderBottomStyle: 'solid',
                                cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Search + Filters row */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative', minWidth: 240 }}>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                            color: '#94a3b8', fontSize: 20,
                        }}>search</span>
                        <input
                            type="text"
                            placeholder="Search requests by title or description..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', paddingLeft: 40, paddingRight: 16, height: 42,
                                borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
                                fontSize: 13, outline: 'none',
                            }}
                        />
                    </div>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '0 16px', height: 42, borderRadius: 12,
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#475569',
                    }}>
                        Category: All
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>expand_more</span>
                    </button>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '0 16px', height: 42, borderRadius: 12,
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#475569',
                    }}>
                        Urgency: All
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>expand_more</span>
                    </button>
                </div>
            </div>

            {/* Request Cards */}
            {filtered.length === 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: 64, gap: 12, textAlign: 'center',
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#cbd5e1' }}>inbox</span>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>No requests found</p>
                    <Link href="/ngo/requests/create" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 20px', borderRadius: 8,
                        background: '#1de2d1', color: '#0f172a', fontWeight: 700, fontSize: 13,
                        textDecoration: 'none', marginTop: 4,
                    }}>Create Request</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filtered.map((request) => {
                        const uStyle = urgencyStyles[request.urgency] || urgencyStyles.LOW;
                        const catIcon = categoryIcons[request.category] || 'category';
                        return (
                            <Link
                                key={request.id}
                                href={`/ngo/requests/${request.id}`}
                                style={{
                                    display: 'block', padding: 20, textDecoration: 'none', color: 'inherit',
                                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 200ms ease',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                            >
                                {/* Title + Urgency */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{request.title}</h3>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700,
                                            padding: '2px 8px', borderRadius: 4,
                                            background: uStyle.bg, color: uStyle.color,
                                            textTransform: 'uppercase', letterSpacing: '0.05em',
                                        }}>
                                            {request.urgency === 'CRITICAL' ? 'Urgent' : request.urgency}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>
                                        {formatDistanceToNow(request.created_at)}
                                    </span>
                                </div>

                                {/* Description */}
                                {request.description && (
                                    <p style={{
                                        fontSize: 13, color: '#64748b', lineHeight: 1.5,
                                        marginBottom: 14, overflow: 'hidden',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any,
                                    }}>
                                        {request.description}
                                    </p>
                                )}

                                {/* Footer metadata */}
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                                    justifyContent: 'space-between', gap: 8,
                                    borderTop: '1px solid #f8fafc', paddingTop: 14,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            background: 'rgba(29,226,209,0.1)', color: '#0f766e',
                                            padding: '4px 10px', borderRadius: 20,
                                            fontSize: 11, fontWeight: 600,
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{catIcon}</span>
                                            {request.category}
                                        </div>
                                        {request.location && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                                                {request.location}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        fontSize: 12, fontWeight: 500, color: '#64748b',
                                        background: '#f1f5f9', padding: '4px 12px', borderRadius: 20,
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>groups</span>
                                        {request.volunteers_count || 0} Volunteers
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
