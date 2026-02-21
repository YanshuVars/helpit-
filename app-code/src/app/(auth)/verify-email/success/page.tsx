import Link from "next/link";

export default function VerifyEmailSuccessPage() {
    return (
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
            {/* Success Icon */}
            <div style={{ marginBottom: 32, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    width: 96, height: 96, borderRadius: "50%",
                    background: "rgba(29,226,209,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <span className="material-symbols-outlined" style={{
                        fontSize: 56, color: "#1de2d1",
                        fontVariationSettings: "'FILL' 1",
                    }}>check_circle</span>
                </div>
            </div>

            {/* Heading */}
            <h2 style={{
                fontFamily: "'Merriweather', serif", fontSize: 28,
                fontWeight: 700, color: "#1a2e2c", marginBottom: 16,
            }}>
                Email Verified!
            </h2>

            {/* Description */}
            <p style={{
                color: "#4a6260", fontSize: 18, lineHeight: 1.6, marginBottom: 40,
            }}>
                Your account is ready. Welcome to Helpit! You can now start exploring projects and making a difference.
            </p>

            {/* Primary CTA */}
            <Link href="/login" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", height: 56, borderRadius: 8,
                background: "#1de2d1", color: "#1a2e2c",
                fontWeight: 700, fontSize: 16, textDecoration: "none",
                boxShadow: "0 8px 24px rgba(29,226,209,0.2)",
                marginBottom: 24,
            }}>
                Go to Dashboard
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </Link>

            {/* Secondary */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>
                    Redirecting in 5 seconds...
                </p>

                <div style={{
                    paddingTop: 32, borderTop: "1px solid #f1f5f9",
                }}>
                    <p style={{ fontSize: 14, color: "#94a3b8" }}>
                        Need help?{" "}
                        <a href="mailto:support@helpit.ngo" style={{
                            color: "#1de2d1", fontWeight: 500, textDecoration: "none",
                        }}>Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
