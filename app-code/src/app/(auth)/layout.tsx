export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="auth-page-layout" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            {/* ── Left Brand Panel (hidden on mobile via CSS) ── */}
            <section className="auth-brand-panel" style={{
                backgroundColor: "#0f756d",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}>
                {/* Brand identity */}
                <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 72, fontWeight: 300, color: "#fff" }}>
                        diversity_1
                    </span>
                    <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 52, fontWeight: 700, letterSpacing: "-1px", color: "#fff" }}>
                        Helpit
                    </h1>
                    <p style={{ fontFamily: "'Merriweather', serif", fontStyle: "italic", fontSize: 22, color: "rgba(255,255,255,0.9)" }}>
                        Connecting India for Good
                    </p>
                </div>

                {/* Trust stats */}
                <div style={{ position: "relative", zIndex: 10, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: 80 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, fontSize: 14, fontWeight: 500, letterSpacing: 0.5, color: "rgba(255,255,255,0.8)" }}>
                        <span>500+ NGOs</span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                        <span>10k+ Volunteers</span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                        <span>₹5Cr+ Raised</span>
                    </div>
                </div>
            </section>

            {/* ── Right Form Panel (full width on mobile via CSS) ── */}
            <section className="auth-form-side">
                <div style={{ width: "100%", maxWidth: 448 }}>
                    {children}
                </div>
            </section>
        </main>
    );
}
