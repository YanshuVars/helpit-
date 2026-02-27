'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Opportunity {
    id: string;
    title: string;
    ngo_name: string;
    urgency: string;
    category: string;
    location: string;
    volunteers_needed: number;
    volunteers_assigned: number;
    deadline: string | null;
}

const urgencyConfig: Record<string, { bg: string; text: string; label: string }> = {
    CRITICAL: { bg: '#fee2e2', text: '#dc2626', label: 'Critical' },
    HIGH: { bg: '#fee2e2', text: '#dc2626', label: 'Urgent' },
    MEDIUM: { bg: '#fef3c7', text: '#d97706', label: 'Moderate' },
    LOW: { bg: '#dcfce7', text: '#16a34a', label: 'Flexible' },
};

const catColors: Record<string, { bg: string; text: string }> = {
    FOOD: { bg: '#fef3c7', text: '#92400e' },
    EDUCATION: { bg: '#dbeafe', text: '#1e40af' },
    MEDICAL: { bg: '#fce7f3', text: '#9d174d' },
    ENVIRONMENT: { bg: '#dcfce7', text: '#166534' },
    SHELTER: { bg: '#ede9fe', text: '#5b21b6' },
    CLOTHING: { bg: '#cffafe', text: '#0e7490' },
    EMERGENCY: { bg: '#fee2e2', text: '#991b1b' },
    ELDERLY_CARE: { bg: '#fef3c7', text: '#92400e' },
    CHILD_CARE: { bg: '#fce7f3', text: '#9d174d' },
    DISABILITY_SUPPORT: { bg: '#dbeafe', text: '#1e40af' },
    COMMUNITY: { bg: '#fef3c7', text: '#92400e' },
    OTHER: { bg: '#f1f5f9', text: '#475569' },
};

const catIcons: Record<string, string> = {
    FOOD: 'restaurant', EDUCATION: 'school', MEDICAL: 'local_hospital',
    ENVIRONMENT: 'eco', SHELTER: 'home', CLOTHING: 'checkroom',
    EMERGENCY: 'emergency', ELDERLY_CARE: 'elderly', CHILD_CARE: 'child_care',
    DISABILITY_SUPPORT: 'accessible', COMMUNITY: 'groups', OTHER: 'category',
};

export default function VolunteerOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchOpportunities();
    }, []);

    async function fetchOpportunities() {
        try {
            const res = await fetch('/api/volunteer/requests?status=OPEN&limit=50');
            const json = await res.json();
            const data = json.data || [];

            setOpportunities(data.map((r: any) => ({
                id: r.id,
                title: r.title,
                ngo_name: (r.ngo as any)?.name || 'Unknown NGO',
                urgency: r.urgency || 'MEDIUM',
                category: r.category || 'OTHER',
                location: r.location || r.city || '',
                volunteers_needed: r.volunteers_needed || 1,
                volunteers_assigned: r.volunteers_assigned || 0,
                deadline: r.deadline,
            })));
        } catch (e) {
            console.error('Failed to fetch opportunities:', e);
        } finally {
            setLoading(false);
        }
    }

    async function handleApply(requestId: string) {
        setApplying(requestId);
        try {
            const res = await fetch('/api/volunteer/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: requestId }),
            });
            const json = await res.json();

            if (res.status === 409) {
                toast.info('You have already applied for this opportunity');
            } else if (!res.ok) {
                console.error('Apply error:', json.error);
                toast.error('Failed to apply. Please try again.');
            } else {
                toast.success('Application submitted! The NGO will review your request.');
            }
        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setApplying(null);
        }
    }

    const filtered = opportunities.filter(opp => {
        if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase()) && !opp.ngo_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (activeFilter === 'Urgent') return opp.urgency === 'HIGH' || opp.urgency === 'CRITICAL';
        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Volunteer Opportunities
                </h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                    Find opportunities near you and make a real difference in your community.
                </p>
            </div>

            {/* Search + Map Toggle */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 20,
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#94a3b8', fontSize: 22,
                        }}>search</span>
                        <input
                            type="text" placeholder="Search opportunities by name or NGO..."
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px 12px 46px',
                                borderRadius: 12, border: '1px solid #e2e8f0',
                                background: '#f8fafc', fontSize: 14, color: '#0f172a',
                                outline: 'none',
                            }}
                            onFocus={e => e.target.style.borderColor = '#1de2d1'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                    <Link href="/volunteer/opportunities/map" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '12px 20px', borderRadius: 12,
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 13, fontWeight: 700, color: '#0f172a', textDecoration: 'none',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>map</span>
                        Map View
                    </Link>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {['All', 'Urgent'].map((f, i) => (
                        <button key={f} onClick={() => setActiveFilter(f)} style={{
                            padding: '7px 14px', borderRadius: 999,
                            border: activeFilter === f ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                            background: activeFilter === f ? 'rgba(29,226,209,0.08)' : '#fff',
                            color: activeFilter === f ? '#0d9488' : '#64748b',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Loading / Empty / Grid */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: 64,
                    background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>search_off</span>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', marginTop: 12 }}>No opportunities found</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Check back later for new volunteer opportunities.</p>
                </div>
            ) : (
                <div className="r-grid-cards" style={{ gap: 20 }}>
                    {filtered.map(opp => {
                        const uc = urgencyConfig[opp.urgency] || urgencyConfig.MEDIUM;
                        const cc = catColors[opp.category] || catColors.OTHER;
                        const icon = catIcons[opp.category] || 'category';
                        return (
                            <div key={opp.id} style={{
                                background: '#fff', borderRadius: 16,
                                border: '1px solid #e2e8f0', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'box-shadow 300ms, transform 300ms',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ padding: 22 }}>
                                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 14 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 12,
                                                background: cc.bg, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 22, color: cc.text }}>{icon}</span>
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{opp.title}</h3>
                                                <p style={{ fontSize: 12, color: '#64748b' }}>{opp.ngo_name}</p>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: 999,
                                            fontSize: 11, fontWeight: 700,
                                            background: uc.bg, color: uc.text,
                                        }}>{uc.label}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                        {[
                                            { icon: 'location_on', val: opp.location || 'Not specified' },
                                            { icon: 'event', val: opp.deadline ? new Date(opp.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Open' },
                                            { icon: 'group', val: `${opp.volunteers_needed - opp.volunteers_assigned} needed` },
                                        ].map(m => (
                                            <span key={m.icon} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{m.icon}</span>
                                                {m.val}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleApply(opp.id)}
                                        disabled={applying === opp.id}
                                        style={{
                                            width: '100%', padding: '10px 16px', borderRadius: 10,
                                            background: '#1de2d1', color: '#0f172a',
                                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                            border: 'none', transition: 'background 200ms',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            opacity: applying === opp.id ? 0.6 : 1,
                                        }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                            {applying === opp.id ? 'sync' : 'how_to_reg'}
                                        </span>
                                        {applying === opp.id ? 'Applying...' : 'Apply Now'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
