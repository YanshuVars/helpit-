// Notifications API Helper Functions
import { createClient } from '@/lib/supabase/client';
import type {
    Notification,
    NotificationPreferences,
    NotificationType,
} from '@/types/database';

// ============================================
// NOTIFICATION CRUD
// ============================================

export async function getNotifications(options?: {
    unreadOnly?: boolean;
    type?: NotificationType;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', authUser.id);

    if (options?.unreadOnly) {
        query = query.eq('is_read', false);
    }

    if (options?.type) {
        query = query.eq('notification_type', options.type);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        notifications: data as Notification[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function getUnreadCount() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return 0;

    const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)
        .eq('is_read', false);

    return count || 0;
}

export async function markAsRead(notificationId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('notifications')
        .update({
            is_read: true,
            read_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

    if (error) throw error;
}

export async function markAllAsRead() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('notifications')
        .update({
            is_read: true,
            read_at: new Date().toISOString(),
        })
        .eq('user_id', authUser.id)
        .eq('is_read', false);

    if (error) throw error;
}

export async function deleteNotification(notificationId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

    if (error) throw error;
}

export async function clearAllNotifications() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', authUser.id);

    if (error) throw error;
}

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

export async function getNotificationPreferences() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Return defaults if no preferences exist
    if (!data) {
        return {
            push_enabled: true,
            push_new_requests: true,
            push_assignments: true,
            push_messages: true,
            push_donations: true,
            email_enabled: true,
            email_new_requests: true,
            email_assignments: true,
            email_messages: false,
            email_donations: true,
            email_newsletter: false,
            quiet_hours_enabled: false,
            quiet_hours_start: null,
            quiet_hours_end: null,
        } as NotificationPreferences;
    }

    return data as NotificationPreferences;
}

export async function updateNotificationPreferences(
    preferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    // Check if preferences exist
    const { data: existing } = await supabase
        .from('notification_preferences')
        .select('id')
        .eq('user_id', authUser.id)
        .single();

    if (existing) {
        const { data, error } = await supabase
            .from('notification_preferences')
            .update(preferences)
            .eq('user_id', authUser.id)
            .select()
            .single();

        if (error) throw error;
        return data as NotificationPreferences;
    } else {
        const { data, error } = await supabase
            .from('notification_preferences')
            .insert({
                user_id: authUser.id,
                ...preferences,
            })
            .select()
            .single();

        if (error) throw error;
        return data as NotificationPreferences;
    }
}

// ============================================
// CREATE NOTIFICATIONS (Internal use)
// ============================================

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    options?: {
        message?: string;
        data?: Record<string, unknown>;
        actionUrl?: string;
    }
) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            notification_type: type,
            title,
            message: options?.message,
            data: options?.data || {},
            action_url: options?.actionUrl,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Notification;
}

// Helper functions for common notifications
export async function notifyNewRequest(userId: string, requestId: string, requestTitle: string) {
    return createNotification(userId, 'NEW_REQUEST', 'New Help Request', {
        message: `New request: ${requestTitle}`,
        data: { requestId },
        actionUrl: `/ngo/requests/${requestId}`,
    });
}

export async function notifyAssignment(userId: string, requestId: string, requestTitle: string) {
    return createNotification(userId, 'ASSIGNMENT', 'New Assignment', {
        message: `You have been assigned to: ${requestTitle}`,
        data: { requestId },
        actionUrl: `/volunteer/assignments/${requestId}`,
    });
}

export async function notifyDonation(userId: string, ngoName: string, amount: number) {
    return createNotification(userId, 'DONATION', 'New Donation Received', {
        message: `${ngoName} received ₹${amount.toLocaleString()} donation`,
        data: { ngoName, amount },
    });
}

export async function notifyMessage(userId: string, chatId: string, senderName: string) {
    return createNotification(userId, 'MESSAGE', 'New Message', {
        message: `New message from ${senderName}`,
        data: { chatId },
        actionUrl: `/messages/${chatId}`,
    });
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
) {
    const supabase = createClient();

    const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            (payload: { new: Notification }) => {
                onNotification(payload.new);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
