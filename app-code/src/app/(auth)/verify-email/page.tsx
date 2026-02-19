"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
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
        // Try to open default email client
        const mailtoUrl = `mailto:${email || ""}`;
        window.location.href = mailtoUrl;
    }

    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8 items-center justify-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[var(--primary)] text-5xl">mark_email_unread</span>
            </div>
            <h1 className="text-2xl font-bold text-center">Check Your Email</h1>
            <p className="text-[var(--foreground-muted)] text-sm pt-2 text-center max-w-xs">
                {email
                    ? `We've sent a verification link to ${email}. Please click the link to verify your account.`
                    : "We've sent a verification link to your email address. Please click the link to verify your account."
                }
            </p>

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {resent && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Verification email resent successfully! Check your inbox.
                </div>
            )}

            {checking && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]"></div>
                    Checking verification status...
                </div>
            )}

            <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
                <button
                    onClick={handleOpenEmail}
                    className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl"
                >
                    Open Email App
                </button>
                <button
                    onClick={handleResendEmail}
                    disabled={resending || resent}
                    className="w-full border border-[var(--border)] text-[var(--foreground)] font-semibold py-3 rounded-xl disabled:opacity-50"
                >
                    {resending ? "Sending..." : resent ? "Email Resent" : "Resend Verification Email"}
                </button>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => router.push("/login")}
                    className="text-sm text-[var(--primary)] font-semibold"
                >
                    Back to Login
                </button>
            </div>

            <p className="text-xs text-[var(--foreground-muted)] mt-8 text-center">
                Didn't receive the email? Check your spam folder or click resend to get a new verification link.
            </p>
        </div>
    );
}
