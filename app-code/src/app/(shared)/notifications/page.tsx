'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from '@/lib/utils';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    data?: Record<string, unknown>;
}

const iconMap: Record<string, { icon: string; bg: string; color: string }> = {
    donation: { icon: "payments", bg: "bg-green-100", color: "text-green-600" },
    volunteer: { icon: "person_add", bg: "bg-blue-100", color: "text-blue-600" },
    request: { icon: "priority_high", bg: "bg-orange-100", color: "text-orange-600" },
    message: { icon: "chat", bg: "bg-purple-100", color: "text-purple-600" },
    event: { icon: "event", bg: "bg-blue-100", color: "text-blue-600" },
    system: { icon: "info", bg: "bg-gray-100", color: "text-gray-600" },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            const supabase = createClient();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            const notifs = (data || []).map(n => ({
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                is_read: n.is_read,
                created_at: n.created_at,
                data: n.data,
            }));

            setNotifications(notifs);
            setLoading(false);
        }

        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', session.user.id)
            .eq('is_read', false);

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const markAsRead = async (id: string) => {
        const supabase = createClient();
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Notifications</h1>
                <button
                    onClick={markAllAsRead}
                    className="text-[var(--primary)] text-sm font-semibold"
                >
                    Mark all read
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">notifications_off</span>
                    <p className="text-gray-500">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => {
                        const { icon, bg, color } = iconMap[notif.type] || iconMap.system;
                        return (
                            <Link
                                key={notif.id}
                                href={`/notifications/${notif.id}`}
                                onClick={() => markAsRead(notif.id)}
                                className={`block bg-white rounded-xl p-4 border ${notif.is_read ? "border-gray-200" : "border-[var(--primary)] bg-blue-50/50"}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-sm">{notif.title}</p>
                                            <span className="text-[10px] text-gray-400">{formatDistanceToNow(notif.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                                    </div>
                                    {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2"></div>}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
