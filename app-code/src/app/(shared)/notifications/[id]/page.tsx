"use client";

import { useParams, useRouter } from "next/navigation";

export default function NotificationDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => router.push("/notifications")} style={{
                    width: 40, height: 40, borderRadius: 10, border: '1px solid #e2e8f0',
                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: 20 }}>arrow_back</span>
                </button>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Notification</h2>
            </div>

            {/* Content placeholder */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{
                    width: 64, height: 64, borderRadius: 16, margin: '0 auto',
                    background: 'rgba(29,226,209,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#1de2d1' }}>notifications</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 16 }}>Notification Detail</h3>
                <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>Notification ID: {id}</p>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>This is a placeholder for the notification detail view.</p>
                <button onClick={() => router.push("/notifications")} style={{
                    marginTop: 24, padding: '10px 24px', borderRadius: 12,
                    border: 'none', background: '#1de2d1', color: '#0f172a',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}>Back to Notifications</button>
            </div>
        </div>
    );
}
