"use client";

import { useState } from "react";
import Link from "next/link";

export default function OpportunitiesMapPage() {
    const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);

    const opportunities = [
        { id: "1", title: "Food Distribution Drive", ngo: "Hope Foundation", distance: "0.8 km", urgency: "HIGH", volunteers: 3, lat: 19.0760, lng: 72.8777, address: "123 Main Street, Mumbai" },
        { id: "2", title: "Teaching Session", ngo: "EduChild", distance: "2.1 km", urgency: "MEDIUM", volunteers: 1, lat: 19.0780, lng: 72.8790, address: "456 Education Lane, Mumbai" },
        { id: "3", title: "Medical Camp Assistance", ngo: "HealthFirst", distance: "3.5 km", urgency: "HIGH", volunteers: 5, lat: 19.0720, lng: 72.8850, address: "789 Health Ave, Mumbai" },
        { id: "4", title: "Elderly Care Visit", ngo: "Golden Years", distance: "1.2 km", urgency: "LOW", volunteers: 2, lat: 19.0790, lng: 72.8740, address: "321 Care Home Road, Mumbai" },
        { id: "5", title: "Beach Cleanup", ngo: "Green Earth", distance: "5.0 km", urgency: "MEDIUM", volunteers: 10, lat: 19.0650, lng: 72.8900, address: "Marine Drive Beach, Mumbai" },
    ];

    const urgencyColor: Record<string, string> = { HIGH: '#E53935', MEDIUM: '#F9A825', LOW: '#2E7D32' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
            <div style={{ marginBottom: 12 }}>
                <Link href="/volunteer/opportunities" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Map View</h1>
            </div>

            {/* Map Container */}
            <div style={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #E3F2FD, #E8F5E9)',
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}>
                    {/* Map Markers */}
                    {opportunities.map(opp => (
                        <button key={opp.id} onClick={() => setSelectedOpportunity(opp.id)}
                            style={{
                                position: 'absolute', transform: 'translate(-50%, -50%)', border: 'none', cursor: 'pointer', background: 'none', padding: 0,
                                left: `${((opp.lng - 72.87) / 0.03) * 20 + 50}%`,
                                top: `${((19.08 - opp.lat) / 0.02) * 20 + 40}%`,
                                transition: 'transform 0.2s',
                                ...(selectedOpportunity === opp.id ? { transform: 'translate(-50%, -50%) scale(1.2)' } : {}),
                            }}>
                            <div style={{
                                position: 'relative', width: 40, height: 40, borderRadius: '50%',
                                background: urgencyColor[opp.urgency] || '#F9A825',
                                boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>location_on</span>
                                <span style={{
                                    position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#fff',
                                    fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>{opp.volunteers}</span>
                            </div>
                        </button>
                    ))}

                    {/* Current Location */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#1565C0', border: '3px solid #fff', boxShadow: 'var(--shadow-md)' }} />
                    </div>
                </div>

                {/* Map Controls */}
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['add', 'remove', 'my_location'].map(icon => (
                        <button key={icon} style={{
                            width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: 'var(--shadow-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', padding: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>Urgency</p>
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
                    <div className="card" style={{ position: 'absolute', bottom: 16, left: 16, right: 16, padding: 16, boxShadow: 'var(--shadow-xl)', zIndex: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 700, fontSize: 15 }}>{opp.title}</h3>
                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{opp.ngo}</p>
                            </div>
                            <button onClick={() => setSelectedOpportunity(null)} style={{ padding: 4, borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--color-text-disabled)' }}>close</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--color-text-disabled)', marginBottom: 12 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> {opp.distance}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group</span> {opp.volunteers} needed
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <Link href="/volunteer/opportunities" className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: 12, textDecoration: 'none' }}>List View</Link>
                            <button className="btn btn-primary" style={{ justifyContent: 'center', fontSize: 12 }}>Apply Now</button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
