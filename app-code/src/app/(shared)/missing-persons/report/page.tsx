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

    const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
        <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>{icon}</span>
                <h2 style={{ fontWeight: 600, fontSize: "var(--font-base)" }}>{title}</h2>
            </div>
            {children}
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <button onClick={() => router.push("/missing-persons")} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--foreground-muted)" }}>arrow_back</span>
                </button>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Report Missing Person</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Provide as much detail as possible</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                {/* Personal Details */}
                <Section title="Personal Details" icon="person">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label className="field-label">Full Name *</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className="field-input" required placeholder="Enter full name" />
                        </div>
                        <div>
                            <label className="field-label">Age *</label>
                            <input name="age" type="number" value={formData.age} onChange={handleChange} className="field-input" required placeholder="Age" />
                        </div>
                        <div>
                            <label className="field-label">Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="field-input" required>
                                <option value="">Select</option>
                                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="field-label">Height (cm)</label>
                            <input name="height" value={formData.height} onChange={handleChange} className="field-input" placeholder="e.g. 165" />
                        </div>
                        <div>
                            <label className="field-label">Weight (kg)</label>
                            <input name="weight" value={formData.weight} onChange={handleChange} className="field-input" placeholder="e.g. 60" />
                        </div>
                    </div>
                </Section>

                {/* Physical Description */}
                <Section title="Physical Description" icon="face">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                        <div>
                            <label className="field-label">Hair Color</label>
                            <input name="hairColor" value={formData.hairColor} onChange={handleChange} className="field-input" placeholder="e.g. Black" />
                        </div>
                        <div>
                            <label className="field-label">Eye Color</label>
                            <input name="eyeColor" value={formData.eyeColor} onChange={handleChange} className="field-input" placeholder="e.g. Brown" />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label className="field-label">Distinguishing Features</label>
                            <textarea name="distinguishingFeatures" value={formData.distinguishingFeatures} onChange={handleChange}
                                className="field-input" style={{ minHeight: 80, resize: "vertical" }} placeholder="Scars, tattoos, marks, etc." />
                        </div>
                    </div>
                </Section>

                {/* Last Seen */}
                <Section title="Last Seen Information" icon="location_on">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                        <div>
                            <label className="field-label">Date *</label>
                            <input name="lastSeenDate" type="date" value={formData.lastSeenDate} onChange={handleChange} className="field-input" required />
                        </div>
                        <div>
                            <label className="field-label">Time</label>
                            <input name="lastSeenTime" type="time" value={formData.lastSeenTime} onChange={handleChange} className="field-input" />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label className="field-label">Location / Address *</label>
                            <input name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleChange} className="field-input" required placeholder="Address or landmark" />
                        </div>
                        <div>
                            <label className="field-label">City *</label>
                            <input name="lastSeenCity" value={formData.lastSeenCity} onChange={handleChange} className="field-input" required placeholder="City" />
                        </div>
                        <div>
                            <label className="field-label">State *</label>
                            <input name="lastSeenState" value={formData.lastSeenState} onChange={handleChange} className="field-input" required placeholder="State" />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label className="field-label">Clothing Description</label>
                            <textarea name="clothing" value={formData.clothing} onChange={handleChange}
                                className="field-input" style={{ minHeight: 60, resize: "vertical" }} placeholder="What was the person wearing?" />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label className="field-label">Circumstances</label>
                            <textarea name="circumstances" value={formData.circumstances} onChange={handleChange}
                                className="field-input" style={{ minHeight: 80, resize: "vertical" }} placeholder="Describe the circumstances of disappearance" />
                        </div>
                    </div>
                </Section>

                {/* Contact Information */}
                <Section title="Contact Information" icon="call">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                        <div>
                            <label className="field-label">Contact Name *</label>
                            <input name="contactName" value={formData.contactName} onChange={handleChange} className="field-input" required placeholder="Your name" />
                        </div>
                        <div>
                            <label className="field-label">Relation *</label>
                            <input name="contactRelation" value={formData.contactRelation} onChange={handleChange} className="field-input" required placeholder="e.g. Parent, Sibling" />
                        </div>
                        <div>
                            <label className="field-label">Phone *</label>
                            <input name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleChange} className="field-input" required placeholder="Phone number" />
                        </div>
                        <div>
                            <label className="field-label">Email</label>
                            <input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} className="field-input" placeholder="Email address" />
                        </div>
                    </div>
                </Section>

                {/* Submit */}
                <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
                    <button type="button" className="btn-secondary" onClick={() => router.push("/missing-persons")}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit Report"}</button>
                </div>
            </form>
        </div>
    );
}
