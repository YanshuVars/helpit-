'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, checkEmailExists } from "@/lib/api/users";

const SKILLS = ["Teaching", "Medical Support", "Logistics", "Fundraising", "Tech Support", "Counseling", "Driving", "Cooking"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
const AVAILABILITY = ["Full-time", "Part-time", "Weekends Only", "Flexible"];

/* ── shared inline-style helpers ── */
const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 8,
    border: "1px solid #e2e8f0", paddingLeft: 40, paddingRight: 16,
    fontSize: 14, color: "#0f172a", background: "#fff",
    outline: "none", boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, paddingLeft: 40, appearance: "none" as const };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#334155" };
const iconStyle: React.CSSProperties = {
    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
    fontSize: 20, color: "#94a3b8", pointerEvents: "none",
};
const sectionTitleStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700,
    color: "#0f172a", paddingBottom: 12, borderBottom: "1px solid #e2e8f0", marginBottom: 16,
};

export default function VolunteerRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', city: '',
        password: '', confirmPassword: '', availability: '',
    });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            // Check if email already exists in another account
            const existingRole = await checkEmailExists(formData.email);
            if (existingRole) {
                setError(`This email is already registered as a ${existingRole} account. Please use a different email or login with the existing account.`);
                setLoading(false);
                return;
            }

            const result = await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                phone: formData.phone || null,
                role: 'VOLUNTEER',
                skills: selectedSkills,
                availability: false,
            });

            // Ensure user row exists via server API (bypasses RLS)
            if (result.user) {
                try {
                    await fetch('/api/auth/ensure-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: result.user.id,
                            email: formData.email,
                            full_name: formData.fullName,
                            phone: formData.phone || null,
                            role: 'VOLUNTEER',
                            skills: selectedSkills,
                        }),
                    });
                } catch (e) {
                    console.error('ensure-user error:', e);
                }
            }

            router.push('/verify-email');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                    Volunteer Registration
                </h2>
                <p style={{ fontSize: 15, color: "#64748b" }}>
                    Complete the form below to join our network.
                </p>
            </div>

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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* ── Personal Details ── */}
                <div>
                    <div style={sectionTitleStyle}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0f756d" }}>person</span>
                        Personal Details
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {/* Full Name */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>Full Name</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>person</span>
                                <input name="fullName" type="text" placeholder="Jane Doe" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </div>
                        {/* Email */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>mail</span>
                                <input name="email" type="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </div>
                        {/* Phone */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>Phone Number</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>call</span>
                                <input name="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                        {/* City */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>City</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>location_on</span>
                                <select name="city" value={formData.city} onChange={handleChange} style={selectStyle}>
                                    <option value="">Select your city</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Skills & Availability ── */}
                <div>
                    <div style={sectionTitleStyle}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0f756d" }}>build</span>
                        Skills &amp; Availability
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label style={{ ...labelStyle, marginBottom: 10, display: "block" }}>Select Your Skills</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                                {SKILLS.map(skill => (
                                    <label key={skill} style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "10px 14px", borderRadius: 8,
                                        border: `1px solid ${selectedSkills.includes(skill) ? "#0f756d" : "#e2e8f0"}`,
                                        background: selectedSkills.includes(skill) ? "rgba(15,117,109,0.05)" : "#fff",
                                        cursor: "pointer", fontSize: 13, color: "#334155",
                                        transition: "all 0.2s",
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSkills.includes(skill)}
                                            onChange={() => toggleSkill(skill)}
                                            style={{ accentColor: "#0f756d", width: 16, height: 16 }}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Availability */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>Availability</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>calendar_today</span>
                                <select name="availability" value={formData.availability} onChange={handleChange} style={selectStyle}>
                                    <option value="">Select availability</option>
                                    {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Security ── */}
                <div>
                    <div style={sectionTitleStyle}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0f756d" }}>lock</span>
                        Security
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>Password</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>lock</span>
                                <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={8} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={labelStyle}>Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>shield</span>
                                <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
                    <input type="checkbox" required style={{ accentColor: "#0f756d", width: 16, height: 16 }} />
                    I agree to the <a href="#" style={{ color: "#0f756d", fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: "#0f756d", fontWeight: 600 }}>Privacy Policy</a>.
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                    width: "100%", height: 48, borderRadius: 8,
                    background: loading ? "#5eada7" : "#0f756d",
                    color: "#fff", fontWeight: 700, fontSize: 15,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 1px 3px rgba(15,117,109,0.2)",
                }}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            {/* Footer */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ fontWeight: 700, color: "#0f756d", textDecoration: "none" }}>
                    Log in
                </Link>
            </p>
        </div>
    );
}
