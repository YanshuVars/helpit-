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
        <div className="flex flex-col min-h-[800px] px-6 py-8">
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/login" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">Reset Password</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col items-center justify-center mt-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[var(--primary)] text-4xl">lock_reset</span>
                </div>
                <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
                <p className="text-[var(--foreground-muted)] text-sm pt-2 text-center max-w-xs">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {sent ? (
                <div className="mt-10 p-5 bg-green-50 border border-green-200 rounded-xl text-center">
                    <span className="material-symbols-outlined text-green-500 text-4xl">mark_email_read</span>
                    <p className="font-bold text-green-700 mt-2">Email Sent!</p>
                    <p className="text-green-600 text-sm mt-1">
                        Check your inbox for a password reset link. It may take a few minutes.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium pl-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            )}

            <div className="mt-auto pt-8 pb-4 text-center">
                <Link href="/login" className="text-[var(--primary)] text-sm font-semibold">
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
