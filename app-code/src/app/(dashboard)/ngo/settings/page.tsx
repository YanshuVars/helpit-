"use client";

import Link from "next/link";

const sections = [
    {
        title: "Organization Profile",
        desc: "Manage your NGO's public-facing information and branding",
        icon: "business",
        iconBg: "rgba(29,226,209,0.1)",
        iconColor: "#1de2d1",
        href: "/ngo/settings/profile",
    },
    {
        title: "Team Members",
        desc: "Add, remove, and manage roles for your team",
        icon: "group",
        iconBg: "rgba(59,130,246,0.1)",
        iconColor: "#2563eb",
        href: "/ngo/settings/members",
    },
    {
        title: "Audit Log",
        desc: "Review all administrative actions and changes",
        icon: "history",
        iconBg: "rgba(139,92,246,0.1)",
        iconColor: "#7c3aed",
        href: "/ngo/settings/audit",
    },
    {
        title: "Notifications",
        desc: "Configure email and in-app notification preferences",
        icon: "notifications",
        iconBg: "rgba(245,158,11,0.1)",
        iconColor: "#d97706",
        href: "#",
    },
    {
        title: "Integrations",
        desc: "Connect third-party services and payment gateways",
        icon: "extension",
        iconBg: "rgba(236,72,153,0.1)",
        iconColor: "#db2777",
        href: "#",
    },
    {
        title: "Security",
        desc: "Two-factor authentication and session management",
        icon: "shield",
        iconBg: "rgba(16,185,129,0.1)",
        iconColor: "#059669",
        href: "#",
    },
];

export default function SettingsHubPage() {
    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Settings</h2>
                <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>Manage your organization, team and system preferences.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {sections.map(s => (
                    <Link key={s.title} href={s.href} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{
                            background: "#fff", borderRadius: 14, padding: 22,
                            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            transition: "box-shadow 200ms, border-color 200ms",
                            cursor: "pointer",
                        }}>
                            <div style={{
                                width: 46, height: 46, borderRadius: 10, background: s.iconBg,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: 16,
                            }}>
                                <span className="material-symbols-outlined" style={{
                                    color: s.iconColor, fontVariationSettings: "'FILL' 1",
                                }}>{s.icon}</span>
                            </div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
