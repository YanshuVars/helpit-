'use client';

import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "@/lib/api/users";

/* ── shared styles ── */
const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 8,
    border: "1px solid #e2e8f0", paddingLeft: 40, paddingRight: 16,
    fontSize: 14, color: "#0f172a", background: "#fff",
    outline: "none", boxSizing: "border-box",
};
const iconStyle: React.CSSProperties = {
    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
    fontSize: 20, color: "#94a3b8", pointerEvents: "none",
};

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSent(true);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Back link */}
            <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 500, color: "#475569", textDecoration: "none",
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                Back to Sign In
            </Link>

            {/* ── Request form card ── */}
            {!sent && (
                <div style={{
                    background: "#f1f5f9", borderRadius: 16, padding: 32,
                    display: "flex", flexDirection: "column", gap: 16,
                }}>
                    {/* Icon */}
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 26, color: "#0f756d" }}>lock_reset</span>
                    </div>

                    <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
                        Forgot Password?
                    </h2>
                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                        No worries, we&apos;ll send you reset instructions. Enter the email associated with your account.
                    </p>

                    {/* Error */}
                    {error && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
                            fontSize: 13, color: "#dc2626",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <span className="material-symbols-outlined" style={iconStyle}>mail</span>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            width: "100%", height: 44, borderRadius: 8,
                            background: loading ? "#5eada7" : "#0f756d",
                            color: "#fff", fontWeight: 700, fontSize: 14,
                            border: "none", cursor: loading ? "not-allowed" : "pointer",
                        }}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>}
                        </button>
                    </form>
                </div>
            )}

            {/* ── Success state ── */}
            {sent && (
                <>
                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                        <span style={{ margin: "0 16px", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5 }}>SUCCESS STATE VIEW</span>
                        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                    </div>

                    <div style={{
                        background: "#f1f5f9", borderRadius: 16, padding: 40,
                        textAlign: "center", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 16,
                    }}>
                        {/* Mail icon */}
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: "rgba(15,117,109,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#0f756d" }}>mark_email_read</span>
                        </div>

                        <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
                            Check your email
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                            We have sent password recovery instructions to<br />
                            <strong style={{ color: "#0f172a" }}>{email}</strong>.
                        </p>

                        <button
                            onClick={() => window.open('mailto:', '_blank')}
                            style={{
                                width: "100%", maxWidth: 320, height: 44, borderRadius: 8,
                                background: "#0f756d", color: "#fff", fontWeight: 700, fontSize: 14,
                                border: "none", cursor: "pointer",
                            }}
                        >
                            Open Email App
                        </button>

                        <div style={{ fontSize: 13, color: "#64748b" }}>
                            Did not receive the email?<br />
                            Check your spam filter, or{" "}
                            <button
                                onClick={() => { setSent(false); setEmail(''); }}
                                style={{ background: "none", border: "none", color: "#0f756d", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                            >
                                Resend Email
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Bottom link */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                Remember your password?{" "}
                <Link href="/login" style={{ fontWeight: 700, color: "#0f756d", textDecoration: "none" }}>
                    Log in
                </Link>
            </p>
        </div>
    );
}
