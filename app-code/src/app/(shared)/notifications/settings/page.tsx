"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationSettingsPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        pushDonations: true, pushVolunteers: true, pushMessages: true,
        pushRequests: true, pushUpdates: false,
        emailDonations: true, emailVolunteers: false, emailMessages: false,
        emailRequests: true, emailUpdates: true,
        soundEnabled: true, vibrateEnabled: true,
        quietHoursEnabled: false, quietStart: "22:00", quietEnd: "07:00",
    });

    const handleToggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

    const handleSave = async () => {
        setSaving(true);
        setTimeout(() => { setSaving(false); alert("Settings saved successfully!"); }, 1000);
    };

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <div onClick={onChange} style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer", transition: "background 0.2s",
            background: checked ? "var(--primary)" : "var(--border-default)",
            display: "flex", alignItems: "center", padding: 2,
        }}>
            <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                transition: "transform 0.2s", transform: checked ? "translateX(20px)" : "translateX(0)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
        </div>
    );

    const SettingRow = ({ label, desc, checked, onToggle }: { label: string; desc?: string; checked: boolean; onToggle: () => void }) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-sm) 0" }}>
            <div>
                <p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{label}</p>
                {desc && <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{desc}</p>}
            </div>
            <Toggle checked={checked} onChange={onToggle} />
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <button onClick={() => router.push("/notifications")} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--foreground-muted)" }}>arrow_back</span>
                </button>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Notification Settings</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Manage how you receive notifications</p>
                </div>
            </div>

            {/* Push Notifications */}
            <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>notifications</span>
                    <h2 style={{ fontWeight: 600, fontSize: "var(--font-base)" }}>Push Notifications</h2>
                </div>
                <SettingRow label="Donations" desc="New donations and refunds" checked={settings.pushDonations} onToggle={() => handleToggle("pushDonations")} />
                <SettingRow label="Volunteers" desc="Volunteer applications and updates" checked={settings.pushVolunteers} onToggle={() => handleToggle("pushVolunteers")} />
                <SettingRow label="Messages" desc="New direct messages" checked={settings.pushMessages} onToggle={() => handleToggle("pushMessages")} />
                <SettingRow label="Help Requests" desc="New and updated help requests" checked={settings.pushRequests} onToggle={() => handleToggle("pushRequests")} />
                <SettingRow label="Platform Updates" desc="New features and announcements" checked={settings.pushUpdates} onToggle={() => handleToggle("pushUpdates")} />
            </div>

            {/* Email Notifications */}
            <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>email</span>
                    <h2 style={{ fontWeight: 600, fontSize: "var(--font-base)" }}>Email Notifications</h2>
                </div>
                <SettingRow label="Donations" desc="Donation receipts and summaries" checked={settings.emailDonations} onToggle={() => handleToggle("emailDonations")} />
                <SettingRow label="Volunteers" desc="Volunteer activity digest" checked={settings.emailVolunteers} onToggle={() => handleToggle("emailVolunteers")} />
                <SettingRow label="Messages" desc="Unread message reminders" checked={settings.emailMessages} onToggle={() => handleToggle("emailMessages")} />
                <SettingRow label="Help Requests" desc="Request status updates" checked={settings.emailRequests} onToggle={() => handleToggle("emailRequests")} />
                <SettingRow label="Platform Updates" desc="Weekly digest and news" checked={settings.emailUpdates} onToggle={() => handleToggle("emailUpdates")} />
            </div>

            {/* General Settings */}
            <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>tune</span>
                    <h2 style={{ fontWeight: 600, fontSize: "var(--font-base)" }}>General</h2>
                </div>
                <SettingRow label="Sound" desc="Play sound for notifications" checked={settings.soundEnabled} onToggle={() => handleToggle("soundEnabled")} />
                <SettingRow label="Vibration" desc="Vibrate for notifications" checked={settings.vibrateEnabled} onToggle={() => handleToggle("vibrateEnabled")} />
                <SettingRow label="Quiet Hours" desc="Mute notifications during set hours" checked={settings.quietHoursEnabled} onToggle={() => handleToggle("quietHoursEnabled")} />
                {settings.quietHoursEnabled && (
                    <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-sm)", paddingLeft: "var(--space-md)" }}>
                        <div>
                            <label className="field-label">From</label>
                            <input type="time" value={settings.quietStart} onChange={(e) => setSettings(prev => ({ ...prev, quietStart: e.target.value }))} className="field-input" style={{ width: "auto" }} />
                        </div>
                        <div>
                            <label className="field-label">To</label>
                            <input type="time" value={settings.quietEnd} onChange={(e) => setSettings(prev => ({ ...prev, quietEnd: e.target.value }))} className="field-input" style={{ width: "auto" }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Save */}
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ alignSelf: "flex-end" }}>
                {saving ? "Saving..." : "Save Settings"}
            </button>
        </div>
    );
}
