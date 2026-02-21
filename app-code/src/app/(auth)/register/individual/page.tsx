'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api/users";

/* ── shared styles ── */
const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 8,
    border: "1px solid #e2e8f0", paddingLeft: 40, paddingRight: 16,
    fontSize: 14, color: "#0f172a", background: "#fff",
    outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#334155" };
const iconStyle: React.CSSProperties = {
    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
    fontSize: 20, color: "#94a3b8", pointerEvents: "none",
};

export default function IndividualRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '',
        password: '', confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
            await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                phone: formData.phone || null,
                role: 'DONOR',
            });

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
                    Create Your Account
                </h2>
                <p style={{ fontSize: 15, color: "#64748b" }}>
                    Join us to start making a difference today. It takes less than a minute.
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Full Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Full Name</label>
                    <div style={{ position: "relative" }}>
                        <span className="material-symbols-outlined" style={iconStyle}>person</span>
                        <input name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
                    </div>
                </div>

                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: "relative" }}>
                        <span className="material-symbols-outlined" style={iconStyle}>mail</span>
                        <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required style={inputStyle} />
                    </div>
                </div>

                {/* Phone */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={labelStyle}>Phone Number</label>
                    <div style={{ position: "relative" }}>
                        <span className="material-symbols-outlined" style={iconStyle}>call</span>
                        <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                {/* Password row */}
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
                    Sign In
                </Link>
            </p>
        </div>
    );
}
