import Link from "next/link";

const settingsItems = [
    { href: "/ngo/settings/profile", icon: "business", iconBg: "#E3F2FD", iconColor: "var(--color-primary)", title: "Organization Profile", desc: "Edit name, description, logo" },
    { href: "/ngo/settings/members", icon: "group", iconBg: "#E8F5E9", iconColor: "#2E7D32", title: "Team Members", desc: "Manage admins and coordinators" },
    { href: "/ngo/settings/audit", icon: "history", iconBg: "#EDE7F6", iconColor: "#4527A0", title: "Audit Log", desc: "View activity history" },
    { href: "/notifications/settings", icon: "notifications", iconBg: "#FFF3E0", iconColor: "#E65100", title: "Notification Preferences", desc: "Email, push, in-app" },
];

export default function NGOSettingsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1 className="page-title">Settings</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {settingsItems.map(item => (
                    <Link key={item.href} href={item.href} className="card card-interactive" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textDecoration: 'none' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <span className="material-symbols-outlined" style={{ color: item.iconColor, fontSize: 20 }}>{item.icon}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</p>
                            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.desc}</p>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-text-disabled)', fontSize: 20 }}>chevron_right</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
