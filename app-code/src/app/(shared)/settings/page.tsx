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
            router.push("/");
        } catch (e) { console.error("Error signing out:", e); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Settings</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Manage your account preferences</p>
            </div>

            {/* Menu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {settingsItems.map(item => (
                    <Link key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: 18,
                            borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0',
                            cursor: 'pointer', transition: 'all 200ms',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#1de2d1'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: 'rgba(29,226,209,0.08)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span className="material-symbols-outlined" style={{ color: '#1de2d1', fontSize: 22 }}>{item.icon}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{item.label}</p>
                                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.desc}</p>
                            </div>
                            <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: 20 }}>chevron_right</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: 16, borderRadius: 14, border: '1px solid #fecaca',
                    background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', transition: 'background 200ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                Log Out
            </button>
        </div>
    );
}
