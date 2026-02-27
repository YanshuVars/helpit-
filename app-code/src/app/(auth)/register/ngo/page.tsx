'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUp } from "@/lib/api/users";

const ORG_TYPES = [
    { value: "EDUCATION", label: "Education" },
    { value: "MEDICAL", label: "Healthcare" },
    { value: "ENVIRONMENT", label: "Environment" },
    { value: "FOOD", label: "Food & Nutrition" },
    { value: "SHELTER", label: "Shelter" },
    { value: "EMERGENCY", label: "Disaster Relief" },
    { value: "CHILD_CARE", label: "Child Care" },
    { value: "ELDERLY_CARE", label: "Elderly Care" },
    { value: "OTHER", label: "Other" },
];

const STATES = ["Andhra Pradesh", "Bihar", "Delhi", "Goa", "Gujarat", "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

/* ── shared styles ── */
const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 8,
    border: "1px solid #e2e8f0", paddingLeft: 16, paddingRight: 16,
    fontSize: 14, color: "#0f172a", background: "#fff",
    outline: "none", boxSizing: "border-box",
};
const inputIconStyle: React.CSSProperties = { ...inputStyle, paddingLeft: 40 };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none" as const };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#334155" };
const reqStar: React.CSSProperties = { color: "#dc2626", marginLeft: 2 };
const iconStyle: React.CSSProperties = {
    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
    fontSize: 20, color: "#94a3b8", pointerEvents: "none",
};
const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
    color: "#0f756d", paddingBottom: 12, borderBottom: "1px solid #e2e8f0", marginBottom: 16,
};

export default function NGORegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        orgName: '', registrationNumber: '', orgType: '',
        description: '', websiteUrl: '',
        contactEmail: '', contactPhone: '',
        address: '', city: '', state: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (loading) return; // Prevent double-submit
        setLoading(true);

        try {
            // 1. Create admin user account
            const { user } = await signUp(formData.contactEmail, formData.password, {
                full_name: `${formData.orgName} Admin`,
                role: 'NGO_ADMIN',
            });

            if (!user) throw new Error('Failed to create admin account');

            // 2. Sign in immediately to get an active session
            //    (signUp alone may not provide a session if email confirmation is enabled)
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.contactEmail,
                password: formData.password,
            });

            // If sign-in fails (e.g. email confirmation required), create NGO without session
            // by storing NGO data and redirecting to verify-email
            if (signInError) {
                // Store pending NGO data in localStorage so it can be created after email verification
                localStorage.setItem('pending_ngo', JSON.stringify({
                    name: formData.orgName,
                    slug: generateSlug(formData.orgName),
                    email: formData.contactEmail,
                    phone: formData.contactPhone || null,
                    address: formData.address || null,
                    city: formData.city || null,
                    state: formData.state || null,
                    registration_number: formData.registrationNumber,
                    categories: formData.orgType ? [formData.orgType] : [],
                    description: formData.description || null,
                }));
                router.push('/verify-email');
                return;
            }

            // 3. Now we have a session — create NGO record
            const slug = generateSlug(formData.orgName);
            const { data: ngo, error: ngoError } = await supabase
                .from('ngos')
                .insert({
                    name: formData.orgName,
                    slug,
                    email: formData.contactEmail,
                    phone: formData.contactPhone || null,
                    address: formData.address || null,
                    city: formData.city || null,
                    state: formData.state || null,
                    registration_number: formData.registrationNumber,
                    categories: formData.orgType ? [formData.orgType] : [],
                    tags: [],
                    status: 'PENDING',
                    has_80g: false,
                    has_12a: false,
                    plan: 'FREE',
                    social_links: {},
                    country: 'India',
                    description: formData.description || null,
                } as Record<string, unknown>)
                .select()
                .single();

            if (ngoError || !ngo) {
                console.error('NGO creation error:', ngoError);
                throw new Error(ngoError?.message || 'Failed to create NGO');
            }

            // 4. Add user as NGO admin member
            await supabase.from('ngo_members').insert({
                ngo_id: ngo.id,
                user_id: user.id,
                role: 'NGO_ADMIN',
            });

            router.push('/ngo');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            if (errorMessage.includes('Too Many Requests') || errorMessage.includes('429')) {
                setError('Too many signup attempts. Please wait a few minutes and try again.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxHeight: "calc(100vh - 100px)", overflowY: "auto", paddingRight: 4 }}>
            {/* Error */}
            {error && (
                <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
                    background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
                    fontSize: 13, color: "#dc2626",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* ── Organization Name ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Organization Name<span style={reqStar}>*</span></label>
                    <input name="orgName" type="text" placeholder="e.g. Save the Earth Foundation" value={formData.orgName} onChange={handleChange} required style={inputStyle} />
                </div>

                {/* Registration # + Org Type */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={labelStyle}>Registration Number<span style={reqStar}>*</span></label>
                        <input name="registrationNumber" type="text" placeholder="e.g. 501(c)(3) ID" value={formData.registrationNumber} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={labelStyle}>Organization Type</label>
                        <select name="orgType" value={formData.orgType} onChange={handleChange} style={selectStyle}>
                            <option value="">Select type...</option>
                            {ORG_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Short Description</label>
                    <textarea name="description" placeholder="Briefly describe your mission..." value={formData.description} onChange={handleChange} maxLength={300}
                        style={{ ...inputStyle, height: 80, paddingTop: 12, resize: "vertical" }} />
                    <span style={{ fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{formData.description.length}/300 characters</span>
                </div>

                {/* Website */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Website URL</label>
                    <div style={{ position: "relative" }}>
                        <span className="material-symbols-outlined" style={iconStyle}>link</span>
                        <input name="websiteUrl" type="url" placeholder="https://www.example.org" value={formData.websiteUrl} onChange={handleChange} style={inputIconStyle} />
                    </div>
                </div>

                {/* ── Contact & Location ── */}
                <div style={sectionLabel}>CONTACT &amp; LOCATION</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={labelStyle}>Email Address<span style={reqStar}>*</span></label>
                        <input name="contactEmail" type="email" placeholder="contact@org.com" value={formData.contactEmail} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={labelStyle}>Phone Number</label>
                        <input name="contactPhone" type="tel" placeholder="+1 (555) 000-0000" value={formData.contactPhone} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Street Address</label>
                    <input name="address" type="text" placeholder="123 Charity Lane, Suite 100" value={formData.address} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={labelStyle}>City</label>
                        <select name="city" value={formData.city} onChange={handleChange} style={selectStyle}>
                            <option value="">Select...</option>
                            {["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={labelStyle}>State/Region</label>
                        <select name="state" value={formData.state} onChange={handleChange} style={selectStyle}>
                            <option value="">Select...</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* ── Security ── */}
                <div style={sectionLabel}>SECURITY</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Create Password<span style={reqStar}>*</span></label>
                    <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={8} style={inputStyle} />
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Must be at least 8 characters with one number.</span>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                    width: "100%", height: 48, borderRadius: 8,
                    background: loading ? "#5eada7" : "#0f756d",
                    color: "#fff", fontWeight: 700, fontSize: 15,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 1px 3px rgba(15,117,109,0.2)",
                }}>
                    {loading ? 'Registering...' : 'Register Organization'}
                </button>
            </form>
        </div>
    );
}
