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
        const interval = setInterval(checkVerification, 5000);
        return () => clearInterval(interval);
    }, [router, supabase]);

    async function handleResendEmail() {
        if (!email) { setError("No email address provided"); return; }
        setResending(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resend({ type: "signup", email });
            if (error) throw error;
            setResent(true);
        } catch (err: any) {
            setError(err.message || "Failed to resend verification email");
        } finally {
            setResending(false);
        }
    }

    function handleOpenEmail() {
        window.location.href = `mailto:${email || ""}`;
    }

    return (
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
            {/* Large Mail Icon */}
            <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
                <div style={{
                    width: 96, height: 96, borderRadius: "50%",
                    background: "rgba(29,226,209,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <span className="material-symbols-outlined" style={{
                        fontSize: 56, color: "#1de2d1",
                        fontVariationSettings: "'FILL' 1",
                    }}>mail</span>
                </div>
            </div>

            {/* Heading */}
            <h1 style={{
                fontFamily: "'Merriweather', serif", fontSize: 32,
                fontWeight: 700, color: "#1a2e2c", marginBottom: 16,
                letterSpacing: "-0.02em",
            }}>
                Verify Your Email
            </h1>

            {/* Subtitle */}
            <p style={{
                color: "#4a6260", fontSize: 18, lineHeight: 1.6,
                marginBottom: 40,
            }}>
                We&apos;ve sent a verification link to<br />
                <span style={{ fontWeight: 700, color: "#1a2e2c" }}>
                    {email || "your email address"}
                </span>
            </p>

            {/* Error */}
            {error && (
                <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                    background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
                    fontSize: 13, color: "#dc2626", textAlign: "left", marginBottom: 16,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                    {error}
                </div>
            )}

            {/* Resent success */}
            {resent && (
                <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                    background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8,
                    fontSize: 13, color: "#15803d", textAlign: "left", marginBottom: 16,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                    Verification email resent successfully!
                </div>
            )}

            {/* Checking indicator */}
            {checking && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, fontSize: 13, color: "#89a3a1", marginBottom: 16,
                }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16, color: "#1de2d1" }}>
                        progress_activity
                    </span>
                    Checking verification status...
                </div>
            )}

            {/* Primary CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <button onClick={handleOpenEmail} style={{
                    width: "100%", height: 56, borderRadius: 8,
                    background: "#1de2d1", color: "#1a2e2c",
                    fontWeight: 700, fontSize: 18, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                    boxShadow: "0 8px 24px rgba(29,226,209,0.2)",
                }}>
                    <span className="material-symbols-outlined">open_in_new</span>
                    Open Email App
                </button>

                {/* Troubleshooting */}
                <div style={{ paddingTop: 8 }}>
                    <p style={{ color: "#4a6260", fontSize: 14, marginBottom: 24 }}>
                        Didn&apos;t receive it? <span style={{ fontWeight: 500 }}>Check your spam folder</span>
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "20px 0",
            }}>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Other Options
                </span>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            {/* Navigation Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                <button
                    onClick={handleResendEmail}
                    disabled={resending || resent}
                    style={{
                        background: "none", border: "none", cursor: resending || resent ? "not-allowed" : "pointer",
                        color: "#1de2d1", fontWeight: 700, fontSize: 15,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        opacity: resending || resent ? 0.5 : 1,
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>forward_to_inbox</span>
                    {resending ? "Sending..." : resent ? "Email Resent ✓" : "Resend Verification Email"}
                </button>

                <button
                    onClick={() => router.push("/login")}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#4a6260", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: "#1de2d1" }}>
                    progress_activity
                </span>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
