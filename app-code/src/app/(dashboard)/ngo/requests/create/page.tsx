"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateRequestPage() {
    const [urgency, setUrgency] = useState("HIGH");
    const [visibility, setVisibility] = useState("public");

    const urgencyLevels = [
        { value: "LOW", label: "LOW" },
        { value: "MEDIUM", label: "MEDIUM" },
        { value: "HIGH", label: "HIGH" },
        { value: "CRITICAL", label: "CRITICAL" },
    ];

    return (
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {/* Back link */}
            <Link href="/ngo/requests" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#1de2d1', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                Back to requests
            </Link>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 6 }}>
                    Create Help Request
                </h2>
                <p style={{ color: '#64748b', fontSize: 14 }}>
                    Fill in the formal requirements to broadcast this assistance need to our volunteer network.
                </p>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80 }}>
                {/* Section 1: Basic Information */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                        background: 'rgba(248,250,252,0.5)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>1. Basic Information</h3>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Request Title</label>
                                <input type="text" placeholder="e.g. Emergency Food Supply - Sector 7" style={{
                                    width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
                                    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                                }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Detailed Description</label>
                                <textarea placeholder="Provide full details of the assistance required..." rows={4} style={{
                                    width: '100%', padding: 14, borderRadius: 8,
                                    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical',
                                }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Category</label>
                                <select style={{
                                    width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
                                    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', appearance: 'none',
                                    background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center`,
                                }}>
                                    <option>Disaster Relief</option>
                                    <option>Medical Assistance</option>
                                    <option>Education Support</option>
                                    <option>Food &amp; Nutrition</option>
                                    <option>Infrastructure</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Urgency Level</label>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {urgencyLevels.map(u => (
                                        <button key={u.value} type="button" onClick={() => setUrgency(u.value)}
                                            style={{
                                                padding: '8px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                                border: urgency === u.value
                                                    ? u.value === 'HIGH' ? '1px solid #f97316' : u.value === 'CRITICAL' ? '1px solid #dc2626' : '1px solid #1de2d1'
                                                    : '1px solid #e2e8f0',
                                                background: urgency === u.value
                                                    ? u.value === 'HIGH' ? 'rgba(249,115,22,0.1)' : u.value === 'CRITICAL' ? 'rgba(220,38,38,0.1)' : 'rgba(29,226,209,0.1)'
                                                    : '#fff',
                                                color: urgency === u.value
                                                    ? u.value === 'HIGH' ? '#ea580c' : u.value === 'CRITICAL' ? '#dc2626' : '#0f766e'
                                                    : '#64748b',
                                                cursor: 'pointer',
                                            }}
                                        >{u.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Location & Media */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                        background: 'rgba(248,250,252,0.5)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>2. Location &amp; Media</h3>
                    </div>
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Physical Address</label>
                                <div style={{ position: 'relative' }}>
                                    <span className="material-symbols-outlined" style={{
                                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                        color: '#94a3b8',
                                    }}>location_on</span>
                                    <input type="text" placeholder="Street address, City, Country" style={{
                                        width: '100%', height: 42, paddingLeft: 40, paddingRight: 14, borderRadius: 8,
                                        border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                                    }} />
                                </div>
                            </div>
                            <div style={{
                                aspectRatio: '16/9', background: '#f1f5f9', borderRadius: 8,
                                border: '1px solid #e2e8f0',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: '#94a3b8',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>map</span>
                                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interactive Map Placeholder</p>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Attachments &amp; Documentation</label>
                            <div style={{
                                minHeight: 200, border: '2px dashed #e2e8f0', borderRadius: 8,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: 32, textAlign: 'center', cursor: 'pointer',
                                background: 'rgba(248,250,252,0.3)',
                            }}>
                                <div style={{
                                    background: 'rgba(29,226,209,0.1)', padding: 14, borderRadius: '50%', marginBottom: 14,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#1de2d1' }}>cloud_upload</span>
                                </div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Drag &amp; Drop files here</p>
                                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Upload site photos or official assessment documents (Max 10MB)</p>
                                <button type="button" style={{
                                    marginTop: 14, color: '#1de2d1', fontSize: 13, fontWeight: 700,
                                    textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer',
                                }}>Browse Files</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Visibility */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                        background: 'rgba(248,250,252,0.5)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>3. Visibility Settings</h3>
                    </div>
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <label onClick={() => setVisibility('public')} style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, cursor: 'pointer',
                            border: visibility === 'public' ? '2px solid #1de2d1' : '2px solid #e2e8f0',
                            background: visibility === 'public' ? 'rgba(29,226,209,0.04)' : '#fff',
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: 28, color: visibility === 'public' ? '#1de2d1' : '#94a3b8',
                                fontVariationSettings: visibility === 'public' ? "'FILL' 1" : "'FILL' 0",
                            }}>public</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>Public Request</p>
                                <p style={{ fontSize: 11, color: '#64748b' }}>Broadcast to all verified volunteers in the platform network.</p>
                            </div>
                            <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                border: `2px solid ${visibility === 'public' ? '#1de2d1' : '#cbd5e1'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {visibility === 'public' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1de2d1' }} />}
                            </div>
                        </label>
                        <label onClick={() => setVisibility('internal')} style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, cursor: 'pointer',
                            border: visibility === 'internal' ? '2px solid #1de2d1' : '2px solid #e2e8f0',
                            background: visibility === 'internal' ? 'rgba(29,226,209,0.04)' : '#fff',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#94a3b8' }}>lock</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>Internal NGO Staff</p>
                                <p style={{ fontSize: 11, color: '#64748b' }}>Restricted visibility. Only accessible by authorized team members.</p>
                            </div>
                            <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                border: `2px solid ${visibility === 'internal' ? '#1de2d1' : '#cbd5e1'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {visibility === 'internal' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1de2d1' }} />}
                            </div>
                        </label>
                    </div>
                </section>

                {/* Submit Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <button type="submit" style={{
                        flex: 1, height: 52, borderRadius: 8,
                        background: '#1de2d1', color: '#0f172a', fontWeight: 700, fontSize: 14,
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 8px 24px rgba(29,226,209,0.2)',
                    }}>
                        <span className="material-symbols-outlined">add_task</span>
                        CREATE HELP REQUEST
                    </button>
                    <button type="button" style={{
                        padding: '0 28px', height: 52, borderRadius: 8,
                        background: '#e2e8f0', color: '#475569', fontWeight: 700, fontSize: 14,
                        border: 'none', cursor: 'pointer',
                    }}>Save Draft</button>
                </div>
            </form>
        </div>
    );
}
