'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/api/users';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn(email, password);

            if (!result.user) {
                throw new Error('Invalid email or password');
            }

            // Fetch role from users table and redirect to correct dashboard
            const supabase = createClient();
            const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', result.user.id)
                .single();

            const role = profile?.role || 'DONOR';
            const dashboardMap: Record<string, string> = {
                PLATFORM_ADMIN: '/admin',
                NGO_ADMIN: '/ngo',
                NGO_COORDINATOR: '/ngo',
                NGO_MEMBER: '/ngo',
                VOLUNTEER: '/volunteer',
                DONOR: '/donor',
                INDIVIDUAL: '/donor',
            };
            router.push(dashboardMap[role] || '/donor');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Invalid credentials';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 30, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                    Welcome Back
                </h2>
                <p style={{ fontSize: 15, color: "#64748b" }}>
                    Sign in to your Helpit account
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

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Google OAuth */}
                <button style={{
                    display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 12,
                    height: 44, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff",
                    fontSize: 14, fontWeight: 600, color: "#334155", cursor: "pointer",
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                    <span style={{ margin: "0 16px", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5 }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                </div>

                {/* Email & Password form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Email */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Email Address</label>
                        <div style={{ position: "relative" }}>
                            <span className="material-symbols-outlined" style={{
                                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                                fontSize: 20, color: "#94a3b8", pointerEvents: "none",
                            }}>mail</span>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@organization.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%", height: 44, borderRadius: 8,
                                    border: "1px solid #e2e8f0", paddingLeft: 40, paddingRight: 16,
                                    fontSize: 14, color: "#0f172a", background: "#fff",
                                    outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Password</label>
                            <Link href="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: "#0f756d", textDecoration: "none" }}>
                                Forgot password?
                            </Link>
                        </div>
                        <div style={{ position: "relative" }}>
                            <span className="material-symbols-outlined" style={{
                                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                                fontSize: 20, color: "#94a3b8", pointerEvents: "none",
                            }}>lock</span>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%", height: 44, borderRadius: 8,
                                    border: "1px solid #e2e8f0", paddingLeft: 40, paddingRight: 16,
                                    fontSize: 14, color: "#0f172a", background: "#fff",
                                    outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%", height: 44, borderRadius: 8,
                            background: loading ? "#5eada7" : "#0f756d",
                            color: "#fff", fontWeight: 700, fontSize: 15,
                            border: "none", cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "0 1px 3px rgba(15,117,109,0.2)",
                            transition: "background 0.2s",
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Sign up link */}
                <p style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" style={{ fontWeight: 700, color: "#0f756d", textDecoration: "none", marginLeft: 4 }}>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
