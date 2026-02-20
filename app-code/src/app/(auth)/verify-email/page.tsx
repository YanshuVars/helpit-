"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        // Check if user is already verified
        const checkVerification = async () => {
            setChecking(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email_confirmed_at) {
                    router.push("/verify-email/success");
                }
            } catch (err) {
                console.error("Error checking verification:", err);
            } finally {
                setChecking(false);
            }
        };

        checkVerification();

        // Set up interval to check verification status
        const interval = setInterval(checkVerification, 5000);

        return () => clearInterval(interval);
    }, [router, supabase]);

    async function handleResendEmail() {
        if (!email) {
            setError("No email address provided");
            return;
        }

        setResending(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email: email,
            });

            if (error) throw error;
            setResent(true);
        } catch (err: any) {
            setError(err.message || "Failed to resend verification email");
        } finally {
            setResending(false);
        }
    }

    function handleOpenEmail() {
        const mailtoUrl = `mailto:${email || ""}`;
        window.location.href = mailtoUrl;
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--color-primary-soft)', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 32 }}>mark_email_unread</span>
            </div>

            <h1>Check your email</h1>
            <p className="auth-subtitle" style={{ maxWidth: 320, margin: '0 auto' }}>
                {email
                    ? `We've sent a verification link to ${email}. Please click the link to verify your account.`
                    : "We've sent a verification link to your email address. Please click the link to verify your account."
                }
            </p>

            {error && (
                <div className="alert alert-error" style={{ marginTop: 16, textAlign: 'left' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                    {error}
                </div>
            )}

            {resent && (
                <div style={{
                    marginTop: 16, padding: 12, borderRadius: 'var(--radius-md)',
                    background: '#E8F5E9', border: '1px solid #A5D6A7',
                    fontSize: 13, color: '#2E7D32',
                }}>
                    Verification email resent successfully! Check your inbox.
                </div>
            )}

            {checking && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
                    Checking verification status...
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                <button onClick={handleOpenEmail} className="auth-submit-btn">
                    Open Email App
                </button>
                <button
                    onClick={handleResendEmail}
                    disabled={resending || resent}
                    className="btn btn-secondary"
                    style={{ width: '100%', height: 44 }}
                >
                    {resending ? "Sending..." : resent ? "Email Resent ✓" : "Resend Verification Email"}
                </button>
            </div>

            <div style={{ marginTop: 20 }}>
                <button
                    onClick={() => router.push("/login")}
                    className="auth-link"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
                >
                    Back to Login
                </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginTop: 20 }}>
                Didn&apos;t receive the email? Check your spam folder or click resend.
            </p>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div className="spinner" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

