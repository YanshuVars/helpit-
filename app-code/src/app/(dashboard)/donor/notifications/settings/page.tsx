'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DonorNotificationSettingsPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        pushDonations: true, pushReceipts: true, pushMessages: true,
        pushNgoUpdates: true, pushUpdates: false,
        emailDonations: true, emailReceipts: true, emailMessages: false,
        emailNgoUpdates: false, emailUpdates: true,
        soundEnabled: true, vibrateEnabled: true,
        quietHoursEnabled: false, quietStart: '22:00', quietEnd: '07:00',
    });

    const handleToggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

    const handleSave = async () => {
        setSaving(true);
        setTimeout(() => { setSaving(false); alert('Settings saved successfully!'); }, 1000);
    };

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <div onClick={onChange} style={{
            width: 48, height: 26, borderRadius: 13, cursor: 'pointer', transition: 'background 200ms',
            background: checked ? '#10b981' : '#e2e8f0',
            display: 'flex', alignItems: 'center', padding: 3,
        }}>
            <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'transform 200ms', transform: checked ? 'translateX(22px)' : 'translateX(0)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }} />
        </div>
    );

    const SettingRow = ({ label, desc, checked, onToggle }: { label: string; desc?: string; checked: boolean; onToggle: () => void }) => (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0', borderBottom: '1px solid #f1f5f9',
        }}>
            <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{label}</p>
                {desc && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</p>}
            </div>
            <Toggle checked={checked} onChange={onToggle} />
        </div>
    );

    const SectionCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
        <div style={{
            background: '#fff', borderRadius: 16, padding: 24,
            border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(16,185,129,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#10b981' }}>{icon}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => router.push('/donor/notifications')} style={{
                    width: 40, height: 40, borderRadius: 10, border: '1px solid #e2e8f0',
                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: 20 }}>arrow_back</span>
                </button>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Notification Settings</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Manage how you receive notifications</p>
                </div>
            </div>

            <SectionCard icon="notifications" title="Push Notifications">
                <SettingRow label="Donations" desc="Donation confirmations and updates" checked={settings.pushDonations} onToggle={() => handleToggle('pushDonations')} />
                <SettingRow label="Receipts" desc="Donation receipts and tax documents" checked={settings.pushReceipts} onToggle={() => handleToggle('pushReceipts')} />
                <SettingRow label="Messages" desc="New direct messages" checked={settings.pushMessages} onToggle={() => handleToggle('pushMessages')} />
                <SettingRow label="NGO Updates" desc="Updates from NGOs you've donated to" checked={settings.pushNgoUpdates} onToggle={() => handleToggle('pushNgoUpdates')} />
                <SettingRow label="Platform Updates" desc="New features and announcements" checked={settings.pushUpdates} onToggle={() => handleToggle('pushUpdates')} />
            </SectionCard>

            <SectionCard icon="email" title="Email Notifications">
                <SettingRow label="Donations" desc="Donation acknowledgments" checked={settings.emailDonations} onToggle={() => handleToggle('emailDonations')} />
                <SettingRow label="Receipts" desc="Receipts and tax summaries" checked={settings.emailReceipts} onToggle={() => handleToggle('emailReceipts')} />
                <SettingRow label="Messages" desc="Unread message reminders" checked={settings.emailMessages} onToggle={() => handleToggle('emailMessages')} />
                <SettingRow label="NGO Updates" desc="Impact reports from NGOs" checked={settings.emailNgoUpdates} onToggle={() => handleToggle('emailNgoUpdates')} />
                <SettingRow label="Platform Updates" desc="Weekly digest and news" checked={settings.emailUpdates} onToggle={() => handleToggle('emailUpdates')} />
            </SectionCard>

            <SectionCard icon="tune" title="General">
                <SettingRow label="Sound" desc="Play sound for notifications" checked={settings.soundEnabled} onToggle={() => handleToggle('soundEnabled')} />
                <SettingRow label="Vibration" desc="Vibrate for notifications" checked={settings.vibrateEnabled} onToggle={() => handleToggle('vibrateEnabled')} />
                <SettingRow label="Quiet Hours" desc="Mute notifications during set hours" checked={settings.quietHoursEnabled} onToggle={() => handleToggle('quietHoursEnabled')} />
                {settings.quietHoursEnabled && (
                    <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingLeft: 4 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>From</label>
                            <input type="time" value={settings.quietStart} onChange={e => setSettings(prev => ({ ...prev, quietStart: e.target.value }))}
                                style={{ display: 'block', marginTop: 4, padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>To</label>
                            <input type="time" value={settings.quietEnd} onChange={e => setSettings(prev => ({ ...prev, quietEnd: e.target.value }))}
                                style={{ display: 'block', marginTop: 4, padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
                        </div>
                    </div>
                )}
            </SectionCard>

            <button onClick={handleSave} disabled={saving} style={{
                alignSelf: 'flex-end', padding: '12px 28px', borderRadius: 12,
                background: '#10b981', color: '#fff', fontWeight: 700,
                fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
            }}>
                {saving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    );
}
