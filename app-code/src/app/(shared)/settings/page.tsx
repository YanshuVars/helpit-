"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/api/users";

const settingsItems = [
    { icon: "person", label: "Edit Profile", desc: "Update your personal information", href: "#" },
    { icon: "notifications", label: "Notifications", desc: "Manage notification preferences", href: "/notifications/settings" },
    { icon: "lock", label: "Privacy & Security", desc: "Manage privacy and security settings", href: "#" },
    { icon: "help", label: "Help & Support", desc: "Get help and contact support", href: "#" },
    { icon: "info", label: "About", desc: "About Helpit platform", href: "#" },
];

export default function SettingsPage() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/auth/login");
        } catch (e) { console.error("Error signing out:", e); }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Settings</h1>
                <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Manage your account preferences</p>
            </div>

            {/* Settings menu */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {settingsItems.map((item) => (
                    <Link key={item.label} href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="card" style={{
                            display: "flex", alignItems: "center", gap: "var(--space-md)",
                            cursor: "pointer", transition: "background 0.15s",
                        }}>
                            <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>{item.icon}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 500, fontSize: "var(--font-sm)" }}>{item.label}</p>
                                <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{item.desc}</p>
                            </div>
                            <span className="material-symbols-outlined" style={{ color: "var(--foreground-light)" }}>chevron_right</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
                style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)",
                    padding: "var(--space-md)", borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--color-danger)", background: "transparent",
                    color: "var(--color-danger)", fontWeight: 500, cursor: "pointer",
                    transition: "background 0.15s",
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                Log Out
            </button>
        </div>
    );
}
