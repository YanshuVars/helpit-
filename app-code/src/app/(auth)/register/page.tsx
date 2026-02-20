import Link from "next/link";

const roles = [
    {
        href: "/register/individual",
        icon: "person",
        iconBg: "#EEE8F9",
        iconColor: "var(--color-primary)",
        title: "Individual / Donor",
        desc: "Discover NGOs and make donations",
    },
    {
        href: "/register/volunteer",
        icon: "volunteer_activism",
        iconBg: "#E8F5E9",
        iconColor: "#059669",
        title: "Volunteer",
        desc: "Find opportunities and help NGOs",
    },
    {
        href: "/register/ngo",
        icon: "business",
        iconBg: "#FFF3E0",
        iconColor: "#D97706",
        title: "NGO / Organization",
        desc: "Manage your organization and volunteers",
    },
];

export default function RegisterPage() {
    return (
        <>
            <h1>Create your account</h1>
            <p className="auth-subtitle">Choose how you&apos;d like to contribute</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                {roles.map((role) => (
                    <Link
                        key={role.href}
                        href={role.href}
                        className="card card-interactive"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '16px 18px',
                            textDecoration: 'none',
                        }}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: 10,
                            background: role.iconBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <span className="material-symbols-outlined" style={{ color: role.iconColor, fontSize: 22 }}>
                                {role.icon}
                            </span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text-heading)' }}>{role.title}</div>
                            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>{role.desc}</div>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)', fontSize: 18 }}>
                            chevron_right
                        </span>
                    </Link>
                ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 24 }}>
                Already have an account?{" "}
                <Link href="/login" className="auth-link" style={{ fontWeight: 600 }}>
                    Sign in
                </Link>
            </p>
        </>
    );
}
