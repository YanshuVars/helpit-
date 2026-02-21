"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface Notification {
    id: string; type: string; title: string; message: string;
    is_read: boolean; created_at: string; data: any;
}

const typeStyles: Record<string, { icon: string; color: string }> = {
    DONATION: { icon: "payments", color: "#16a34a" },
    VOLUNTEER: { icon: "diversity_3", color: "#1de2d1" },
    VERIFICATION: { icon: "verified", color: "#3b82f6" },
    REQUEST: { icon: "help", color: "#f59e0b" },
    REPORT: { icon: "flag", color: "#dc2626" },
    MESSAGE: { icon: "chat", color: "#8b5cf6" },
    SYSTEM: { icon: "info", color: "#94a3b8" },
};

export default function NotificationsPage() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchNotifications(); }, []);

    async function fetchNotifications() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from("notifications").select("*").eq("user_id", user.id)
                .order("created_at", { ascending: false }).limit(50);
            if (data) setNotifications(data);
        } catch (e) { console.error("Error fetching notifications:", e); }
        finally { setLoading(false); }
    }

    async function markAsRead(id: string) {
        try {
            await supabase.from("notifications").update({ is_read: true }).eq("id", id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (e) { console.error("Error marking as read:", e); }
    }

    async function markAllAsRead() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) { console.error("Error marking all as read:", e); }
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Notifications</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                            borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
                            fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>done_all</span>Mark all read
                        </button>
                    )}
                    <Link href="/notifications/settings" style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                        borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 13, fontWeight: 600, color: '#0f172a', textDecoration: 'none',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>settings</span>Settings
                    </Link>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : notifications.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
                    border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>notifications_none</span>
                    <p style={{ color: '#94a3b8', marginTop: 10 }}>No notifications</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {notifications.map(n => {
                        const style = typeStyles[n.type] || typeStyles.SYSTEM;
                        return (
                            <div key={n.id} onClick={() => !n.is_read && markAsRead(n.id)}
                                style={{
                                    display: 'flex', alignItems: 'start', gap: 14, padding: 18,
                                    borderRadius: 14, cursor: 'pointer', transition: 'all 200ms',
                                    background: n.is_read ? '#fff' : 'rgba(29,226,209,0.04)',
                                    border: `1px solid ${n.is_read ? '#e2e8f0' : '#1de2d1'}`,
                                    borderLeft: n.is_read ? '1px solid #e2e8f0' : '3px solid #1de2d1',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: `${style.color}15`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: style.color }}>{style.icon}</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <p style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 14, color: '#0f172a' }}>{n.title}</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDistanceToNow(n.created_at)}</p>
                                    </div>
                                    <p style={{ fontSize: 13, color: '#64748b' }}>{n.message}</p>
                                </div>
                                {!n.is_read && (
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1de2d1', flexShrink: 0, marginTop: 8 }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
