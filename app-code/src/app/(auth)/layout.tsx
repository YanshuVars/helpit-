export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main style={{ display: "flex", minHeight: "100vh", width: "100%", fontFamily: "'Public Sans', sans-serif" }}>
            {/* ── Left Brand Panel (45%) ── */}
            <section style={{
                position: "relative", display: "flex", flexDirection: "column",
                justifyContent: "space-between", width: "45%", padding: "64px",
                backgroundColor: "#0f756d", overflow: "hidden", color: "#fff",
                /* Geometric plus-sign pattern */
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

            {/* ── Right Form Panel (55%) ── */}
            <section style={{
                display: "flex", width: "55%", alignItems: "center", justifyContent: "center",
                backgroundColor: "#fff", padding: "32px 64px",
            }}>
                <div style={{ width: "100%", maxWidth: 448 }}>
                    {children}
                </div>
            </section>
        </main>
    );
}
