"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportMissingPersonPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "", age: "", gender: "", height: "", weight: "",
        hairColor: "", eyeColor: "", distinguishingFeatures: "",
        lastSeenDate: "", lastSeenTime: "", lastSeenLocation: "", lastSeenCity: "", lastSeenState: "",
        clothing: "", circumstances: "",
        contactName: "", contactPhone: "", contactEmail: "", contactRelation: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/missing-persons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            if (!res.ok) throw new Error("Failed to submit report");
            alert("Report submitted successfully!");
            router.push("/missing-persons");
        } catch (err) { console.error("Error submitting report:", err); alert("Failed to submit report. Please try again."); }
        finally { setLoading(false); }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px', borderRadius: 12,
        border: '1px solid #e2e8f0', background: '#f8fafc',
        fontSize: 14, color: '#0f172a', outline: 'none',
    };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: 12, fontWeight: 700,
        color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em',
    };

    const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
        <div style={{
            background: '#fff', borderRadius: 16, padding: 24,
            border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(29,226,209,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#1de2d1' }}>{icon}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => router.push("/missing-persons")} style={{
                    width: 40, height: 40, borderRadius: 10, border: '1px solid #e2e8f0',
                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: 20 }}>arrow_back</span>
                </button>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Report Missing Person</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Provide as much detail as possible</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Personal Details */}
                <Section title="Personal Details" icon="person">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Full Name *</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} required placeholder="Enter full name"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Age *</label>
                            <input name="age" type="number" value={formData.age} onChange={handleChange} style={inputStyle} required placeholder="Age"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} required>
                                <option value="">Select</option>
                                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Height (cm)</label>
                            <input name="height" value={formData.height} onChange={handleChange} style={inputStyle} placeholder="e.g. 165"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Weight (kg)</label>
                            <input name="weight" value={formData.weight} onChange={handleChange} style={inputStyle} placeholder="e.g. 60"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                </Section>

                {/* Physical Description */}
                <Section title="Physical Description" icon="face">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Hair Color</label>
                            <input name="hairColor" value={formData.hairColor} onChange={handleChange} style={inputStyle} placeholder="e.g. Black"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Eye Color</label>
                            <input name="eyeColor" value={formData.eyeColor} onChange={handleChange} style={inputStyle} placeholder="e.g. Brown"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Distinguishing Features</label>
                            <textarea name="distinguishingFeatures" value={formData.distinguishingFeatures} onChange={handleChange}
                                style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Scars, tattoos, marks, etc."
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                </Section>

                {/* Last Seen */}
                <Section title="Last Seen Information" icon="location_on">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Date *</label>
                            <input name="lastSeenDate" type="date" value={formData.lastSeenDate} onChange={handleChange} style={inputStyle} required
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Time</label>
                            <input name="lastSeenTime" type="time" value={formData.lastSeenTime} onChange={handleChange} style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Location / Address *</label>
                            <input name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleChange} style={inputStyle} required placeholder="Address or landmark"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>City *</label>
                            <input name="lastSeenCity" value={formData.lastSeenCity} onChange={handleChange} style={inputStyle} required placeholder="City"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>State *</label>
                            <input name="lastSeenState" value={formData.lastSeenState} onChange={handleChange} style={inputStyle} required placeholder="State"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Clothing Description</label>
                            <textarea name="clothing" value={formData.clothing} onChange={handleChange}
                                style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} placeholder="What was the person wearing?"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Circumstances</label>
                            <textarea name="circumstances" value={formData.circumstances} onChange={handleChange}
                                style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Describe the circumstances of disappearance"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                </Section>

                {/* Contact Info */}
                <Section title="Contact Information" icon="call">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Contact Name *</label>
                            <input name="contactName" value={formData.contactName} onChange={handleChange} style={inputStyle} required placeholder="Your name"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Relation *</label>
                            <input name="contactRelation" value={formData.contactRelation} onChange={handleChange} style={inputStyle} required placeholder="e.g. Parent, Sibling"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone *</label>
                            <input name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleChange} style={inputStyle} required placeholder="Phone number"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} style={inputStyle} placeholder="Email address"
                                onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                    </div>
                </Section>

                {/* Submit */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => router.push("/missing-persons")} style={{
                        padding: '12px 24px', borderRadius: 12, border: '1px solid #e2e8f0',
                        background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}>Cancel</button>
                    <button type="submit" disabled={loading} style={{
                        padding: '12px 28px', borderRadius: 12, border: 'none',
                        background: '#1de2d1', color: '#0f172a', fontWeight: 700, fontSize: 14,
                        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                    }}>{loading ? "Submitting..." : "Submit Report"}</button>
                </div>
            </form>
        </div>
    );
}
