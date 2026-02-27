"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface MapOpportunity {
    id: string;
    title: string;
    ngo_name: string;
    urgency: string;
    volunteers_needed: number;
    volunteers_assigned: number;
    location: string;
    address: string;
    city: string;
}

export default function OpportunitiesMapPage() {
    const [opportunities, setOpportunities] = useState<MapOpportunity[]>([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        async function fetch_data() {
            try {
                const res = await fetch('/api/volunteer/requests?status=OPEN&limit=30');
                const json = await res.json();
                setOpportunities((json.data || []).map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    ngo_name: (r.ngo as any)?.name || 'Unknown NGO',
                    urgency: r.urgency || 'MEDIUM',
                    volunteers_needed: r.volunteers_needed || 1,
                    volunteers_assigned: r.volunteers_assigned || 0,
                    location: r.location || '',
                    address: r.address || '',
                    city: r.city || '',
                })));
            } catch (e) {
                console.error('Failed to fetch:', e);
            } finally {
                setLoading(false);
            }
        }
        fetch_data();
    }, []);

    const urgencyColor: Record<string, string> = { HIGH: '#E53935', CRITICAL: '#E53935', MEDIUM: '#F9A825', LOW: '#2E7D32' };

    async function handleApply(requestId: string) {
        setApplying(true);
        try {
            const res = await fetch('/api/volunteer/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: requestId }),
            });
            const json = await res.json();

            if (res.status === 409) { toast.info('Already applied'); }
            else if (!res.ok) { toast.error('Failed to apply'); console.error(json.error); }
            else { toast.success('Application submitted!'); }
        } finally { setApplying(false); }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
            <div style={{ marginBottom: 12 }}>
                <Link href="/volunteer/opportunities" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Map View</h1>
            </div>

            {/* Map Container */}
            <div style={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-xl, 16px)', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #E3F2FD, #E8F5E9)',
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}>
                    {/* Distribution of markers in a grid-like pattern */}
                    {opportunities.map((opp, i) => {
                        const col = i % 4;
                        const row = Math.floor(i / 4);
                        return (
                            <button key={opp.id} onClick={() => setSelectedOpportunity(opp.id)}
                                style={{
                                    position: 'absolute', transform: 'translate(-50%, -50%)', border: 'none', cursor: 'pointer', background: 'none', padding: 0,
                                    left: `${15 + col * 20 + (row % 2 ? 10 : 0)}%`,
                                    top: `${15 + row * 25}%`,
                                    transition: 'transform 0.2s',
                                    ...(selectedOpportunity === opp.id ? { transform: 'translate(-50%, -50%) scale(1.2)' } : {}),
                                }}>
                                <div style={{
                                    position: 'relative', width: 40, height: 40, borderRadius: '50%',
                                    background: urgencyColor[opp.urgency] || '#F9A825',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>location_on</span>
                                    <span style={{
                                        position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#fff',
                                        fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>{opp.volunteers_needed - opp.volunteers_assigned}</span>
                                </div>
                            </button>
                        );
                    })}

                    {/* Current Location */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#1565C0', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
                    </div>

                    {opportunities.length === 0 && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ fontSize: 15, color: '#64748b', fontWeight: 600 }}>No open opportunities to display on map</p>
                        </div>
                    )}
                </div>

                {/* Map Controls */}
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['add', 'remove', 'my_location'].map(icon => (
                        <button key={icon} style={{
                            width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Urgency</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[{ label: 'High', color: '#E53935' }, { label: 'Medium', color: '#F9A825' }, { label: 'Low', color: '#2E7D32' }].map(l => (
                            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} /> {l.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected Opportunity Card */}
            {selectedOpportunity && (() => {
                const opp = opportunities.find(o => o.id === selectedOpportunity);
                if (!opp) return null;
                return (
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 16,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', marginTop: 12,
                        border: '1px solid #e2e8f0',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 700, fontSize: 15 }}>{opp.title}</h3>
                                <p style={{ fontSize: 11, color: '#64748b' }}>{opp.ngo_name}</p>
                            </div>
                            <button onClick={() => setSelectedOpportunity(null)} style={{ padding: 4, borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>close</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> {opp.location || opp.city || 'Not specified'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group</span> {opp.volunteers_needed - opp.volunteers_assigned} needed
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <Link href="/volunteer/opportunities" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px',
                                borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff',
                                color: '#0f172a', fontSize: 12, fontWeight: 600, textDecoration: 'none',
                            }}>List View</Link>
                            <button onClick={() => handleApply(opp.id)} disabled={applying} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px',
                                borderRadius: 10, background: '#1de2d1', color: '#0f172a', border: 'none',
                                fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: applying ? 0.6 : 1,
                            }}>{applying ? 'Applying...' : 'Apply Now'}</button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
