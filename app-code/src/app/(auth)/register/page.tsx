import Link from "next/link";

const roles = [
    {
        href: "/register/volunteer",
        icon: "sentiment_satisfied",
        iconBg: "rgba(15,117,109,0.1)",
        title: "I'm a Volunteer",
        desc: "Join projects and help out directly.",
    },
    {
        href: "/register/ngo",
        icon: "corporate_fare",
        iconBg: "rgba(15,117,109,0.1)",
        title: "I'm an NGO",
        desc: "Find volunteers and support for causes.",
    },
    {
        href: "/register/individual",
        icon: "favorite",
        iconBg: "rgba(15,117,109,0.1)",
        title: "I'm a Donor",
        desc: "Support initiatives with funding.",
    },
];

export default function RegisterPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header */}
            <div>
                <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                    Join Helpit
                </h1>
                <p style={{ fontSize: 16, color: "#64748b" }}>
                    Choose how you&apos;d like to contribute
                </p>
            </div>

            {/* Role cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {roles.map((role) => (
                    <Link
                        key={role.href}
                        href={role.href}
                        style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: 20, borderRadius: 12,
                            border: "1px solid #e2e8f0", background: "#fff",
                            textDecoration: "none", color: "inherit",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: role.iconBg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 26, color: "#0f756d" }}>
                                {role.icon}
                            </span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 2 }}>{role.title}</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>{role.desc}</div>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: "#94a3b8", fontSize: 20 }}>
                            arrow_forward
                        </span>
                    </Link>
                ))}
            </div>

            {/* Footer */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ fontWeight: 600, color: "#0f756d", textDecoration: "none" }}>
                    Sign In
                </Link>
            </p>
        </div>
    );
}
