'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from '@/lib/utils';

interface Notification {
    id: string; notification_type: string; title: string; message: string;
    is_read: boolean; created_at: string; data: any; action_url: string | null;
}

type FilterTab = 'ALL' | 'UNREAD' | 'ASSIGNMENTS' | 'MESSAGES';

const typeStyles: Record<string, { icon: string; color: string; bg: string }> = {
    ASSIGNMENT: { icon: 'assignment_turned_in', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    NEW_REQUEST: { icon: 'volunteer_activism', color: '#1de2d1', bg: 'rgba(29,226,209,0.1)' },
    STATUS_UPDATE: { icon: 'update', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    MESSAGE: { icon: 'chat', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    DONATION: { icon: 'payments', color: '#16a34a', bg: 'rgba(22,163,106,0.1)' },
    FOLLOW: { icon: 'person_add', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    VERIFICATION: { icon: 'verified', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    SYSTEM: { icon: 'info', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

export default function VolunteerNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

    useEffect(() => { fetchNotifications(); }, []);

    async function fetchNotifications() {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('notifications').select('*').eq('user_id', user.id)
                .order('created_at', { ascending: false }).limit(50);
            if (data) setNotifications(data as Notification[]);
        } catch (e) { console.error('Error fetching notifications:', e); }
        finally { setLoading(false); }
    }

    async function markAsRead(id: string) {
        try {
            const supabase = createClient();
            await supabase.from('notifications').update({ is_read: true }).eq('id', id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (e) { console.error('Error marking as read:', e); }
    }

    async function markAllAsRead() {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) { console.error('Error marking all as read:', e); }
    }

    async function deleteNotification(id: string) {
        try {
            const supabase = createClient();
            await supabase.from('notifications').delete().eq('id', id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (e) { console.error('Error deleting notification:', e); }
    }

    const filtered = notifications.filter(n => {
        if (activeTab === 'UNREAD') return !n.is_read;
        if (activeTab === 'ASSIGNMENTS') return ['ASSIGNMENT', 'NEW_REQUEST', 'STATUS_UPDATE'].includes(n.notification_type);
        if (activeTab === 'MESSAGES') return n.notification_type === 'MESSAGE';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const tabs: { key: FilterTab; label: string; icon: string }[] = [
        { key: 'ALL', label: 'All', icon: 'notifications' },
        { key: 'UNREAD', label: `Unread (${unreadCount})`, icon: 'mark_email_unread' },
        { key: 'ASSIGNMENTS', label: 'Assignments', icon: 'assignment' },
        { key: 'MESSAGES', label: 'Messages', icon: 'chat' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                borderRadius: 20, padding: '32px 36px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #1de2d1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            Notifications
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up! 🎉"}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                                borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                                fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>done_all</span>
                                Mark all read
                            </button>
                        )}
                        <Link href="/volunteer/notifications/settings" style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                            borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                            fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>settings</span>
                            Settings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            }}>
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 999,
                        border: activeTab === tab.key ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                        background: activeTab === tab.key ? 'rgba(29,226,209,0.08)' : '#fff',
                        color: activeTab === tab.key ? '#0d9488' : '#64748b',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 200ms', whiteSpace: 'nowrap',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 20, padding: 56, textAlign: 'center',
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'rgba(29,226,209,0.08)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#1de2d1' }}>
                            {activeTab === 'UNREAD' ? 'mark_email_read' : 'notifications_none'}
                        </span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>
                        {activeTab === 'UNREAD' ? 'All caught up!' : 'No notifications yet'}
                    </h3>
                    <p style={{ color: '#94a3b8', marginTop: 6, fontSize: 14, maxWidth: 320, margin: '6px auto 0' }}>
                        {activeTab === 'UNREAD'
                            ? "You've read all your notifications. Great job staying on top of things!"
                            : 'When you receive assignment updates, messages, or other alerts, they will show up here.'}
                    </p>
                    {activeTab !== 'ALL' && (
                        <button onClick={() => setActiveTab('ALL')} style={{
                            marginTop: 16, padding: '10px 20px', borderRadius: 12,
                            background: '#1de2d1', color: '#0f172a', fontSize: 13,
                            fontWeight: 700, border: 'none', cursor: 'pointer',
                        }}>View all notifications</button>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filtered.map(n => {
                        const s = typeStyles[n.notification_type] || typeStyles.SYSTEM;
                        return (
                            <div key={n.id}
                                style={{
                                    display: 'flex', alignItems: 'start', gap: 14, padding: '16px 18px',
                                    borderRadius: 16, transition: 'all 200ms', cursor: 'pointer',
                                    background: n.is_read ? '#fff' : 'rgba(29,226,209,0.03)',
                                    border: `1px solid ${n.is_read ? '#f1f5f9' : 'rgba(29,226,209,0.3)'}`,
                                    boxShadow: n.is_read ? 'none' : '0 0 0 1px rgba(29,226,209,0.05)',
                                }}
                                onClick={() => !n.is_read && markAsRead(n.id)}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = n.is_read ? 'none' : '0 0 0 1px rgba(29,226,209,0.05)'}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: s.bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                                        <p style={{
                                            fontWeight: n.is_read ? 500 : 700, fontSize: 14, color: '#0f172a',
                                            lineHeight: 1.4,
                                        }}>{n.title}</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            {formatDistanceToNow(n.created_at)}
                                        </p>
                                    </div>
                                    {n.message && (
                                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>{n.message}</p>
                                    )}
                                    {n.action_url && (
                                        <Link href={n.action_url} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            fontSize: 12, fontWeight: 600, color: '#1de2d1', textDecoration: 'none',
                                            marginTop: 8,
                                        }}>
                                            View details
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Unread dot + delete */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                    {!n.is_read && (
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1de2d1', marginTop: 6 }} />
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                                        color: '#cbd5e1', transition: 'color 200ms',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
