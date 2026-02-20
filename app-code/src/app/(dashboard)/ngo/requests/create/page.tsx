"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateRequestPage() {
    const [urgency, setUrgency] = useState("MEDIUM");

    const urgencyLevels = [
        { value: "LOW", color: '#2E7D32', bg: '#E8F5E9' },
        { value: "MEDIUM", color: '#F57F17', bg: '#FFF8E1' },
        { value: "HIGH", color: '#E65100', bg: '#FFF3E0' },
        { value: "CRITICAL", color: '#DC2626', bg: '#FEE2E2' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <Link href="/ngo/requests" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to requests
                </Link>
                <h1 className="page-title">Create Help Request</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                    <label className="field-label">Title *</label>
                    <input type="text" placeholder="Brief title for the request" className="field-input" />
                </div>

                <div className="form-group">
                    <label className="field-label">Description *</label>
                    <textarea placeholder="Detailed description of the help needed..." rows={4} className="field-input field-textarea" />
                </div>

                <div className="form-group">
                    <label className="field-label">Category *</label>
                    <select className="field-input">
                        <option value="">Select category</option>
                        <option value="FOOD">Food</option>
                        <option value="MEDICAL">Medical</option>
                        <option value="DISASTER">Disaster Relief</option>
                        <option value="ANIMAL">Animal Welfare</option>
                        <option value="MISSING_PERSON">Missing Person</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="field-label">Urgency Level *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {urgencyLevels.map(level => (
                            <button
                                key={level.value}
                                type="button"
                                onClick={() => setUrgency(level.value)}
                                style={{
                                    padding: '8px 4px', borderRadius: 'var(--radius-sm)',
                                    fontSize: 11, fontWeight: 700,
                                    border: urgency === level.value ? 'none' : '1px solid var(--color-border)',
                                    background: urgency === level.value ? level.bg : 'var(--color-bg-card)',
                                    color: urgency === level.value ? level.color : 'var(--color-text-muted)',
                                    cursor: 'pointer', transition: 'all 150ms ease',
                                }}
                            >
                                {level.value}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Location</label>
                    <input type="text" placeholder="Address or location description" className="field-input" />
                    <div style={{ height: 100, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                        <span style={{ color: 'var(--color-text-disabled)', fontSize: 13 }}>Map preview will appear here</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Add Photos/Videos</label>
                    <div style={{
                        border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                        padding: 24, textAlign: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-text-disabled)' }}>add_photo_alternate</span>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Tap to upload media</p>
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Visibility</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <label style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)', cursor: 'pointer',
                        }}>
                            <input type="radio" name="visibility" value="PUBLIC" defaultChecked style={{ accentColor: 'var(--color-primary)' }} />
                            <span style={{ fontSize: 13 }}>Public</span>
                        </label>
                        <label style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)', cursor: 'pointer',
                        }}>
                            <input type="radio" name="visibility" value="INTERNAL" style={{ accentColor: 'var(--color-primary)' }} />
                            <span style={{ fontSize: 13 }}>Internal Only</span>
                        </label>
                    </div>
                </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46, fontSize: 15, fontWeight: 700 }}>
                Create Request
            </button>
        </div>
    );
}
