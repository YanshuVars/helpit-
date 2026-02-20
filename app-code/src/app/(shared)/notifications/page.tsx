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
    DONATION: { icon: "payments", color: "var(--color-success)" },
    VOLUNTEER: { icon: "diversity_3", color: "var(--primary)" },
    VERIFICATION: { icon: "verified", color: "var(--color-info)" },
    REQUEST: { icon: "help", color: "var(--color-warning)" },
    REPORT: { icon: "flag", color: "var(--color-danger)" },
    MESSAGE: { icon: "chat", color: "var(--primary)" },
    SYSTEM: { icon: "info", color: "var(--foreground-muted)" },
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
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Notifications</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                    {unreadCount > 0 && (
                        <button className="btn-secondary" onClick={markAllAsRead} style={{ fontSize: "var(--font-sm)", display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>done_all</span>
                            Mark all read
                        </button>
                    )}
                    <Link href="/notifications/settings" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", fontSize: "var(--font-sm)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>settings</span>Settings
                    </Link>
                </div>
            </div>

            {/* Notification list */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div className="spinner" /></div>
            ) : notifications.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--foreground-light)" }}>notifications_none</span>
                    <p style={{ color: "var(--foreground-muted)", marginTop: "var(--space-sm)" }}>No notifications</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    {notifications.map((n) => {
                        const style = typeStyles[n.type] || typeStyles.SYSTEM;
                        return (
                            <div key={n.id} className="card" onClick={() => !n.is_read && markAsRead(n.id)}
                                style={{
                                    display: "flex", alignItems: "flex-start", gap: "var(--space-md)",
                                    cursor: "pointer", transition: "background 0.15s",
                                    background: n.is_read ? undefined : "var(--primary-50)",
                                    borderLeft: n.is_read ? undefined : `3px solid var(--primary)`,
                                }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${style.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: style.color }}>{style.icon}</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                        <p style={{ fontWeight: n.is_read ? 400 : 600, fontSize: "var(--font-sm)" }}>{n.title}</p>
                                        <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", whiteSpace: "nowrap" }}>{formatDistanceToNow(n.created_at)}</p>
                                    </div>
                                    <p style={{ fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>{n.message}</p>
                                </div>
                                {!n.is_read && (
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", flexShrink: 0, marginTop: 6 }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
