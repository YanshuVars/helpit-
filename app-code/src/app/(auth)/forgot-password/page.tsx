'use client';

import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "@/lib/api/users";

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
        <>
            <Link href="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24, fontSize: 13 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                Back to login
            </Link>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--color-primary-soft)', margin: '0 auto 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 28 }}>lock_reset</span>
                </div>
                <h1>Forgot password?</h1>
                <p className="auth-subtitle">
                    Enter your email and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {sent ? (
                <div style={{
                    padding: 20, borderRadius: 'var(--radius-md)',
                    background: '#E8F5E9', border: '1px solid #A5D6A7',
                    textAlign: 'center',
                }}>
                    <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-success)', fontSize: 36 }}>mark_email_read</span>
                    <p style={{ fontWeight: 600, color: '#2E7D32', marginTop: 8 }}>Email Sent!</p>
                    <p style={{ fontSize: 13, color: '#43A047', marginTop: 4 }}>
                        Check your inbox for a password reset link. It may take a few minutes.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {error && (
                        <div className="alert alert-error">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="field-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="field-input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            )}
        </>
    );
}
