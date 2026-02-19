// Messages & Chat API Helper Functions
import { createClient } from '@/lib/supabase/client';
import type {
    Chat,
    ChatParticipant,
    Message,
    ChatType,
} from '@/types/database';

// ============================================
// CHAT FUNCTIONS
// ============================================

export async function getChatById(chatId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('chats')
        .select(`
      *,
      participants:chat_participants(
        *,
        user:users(id, full_name, avatar_url),
        ngo:ngos(id, name, logo_url)
      )
    `)
        .eq('id', chatId)
        .single();

    if (error) throw error;
    return data as Chat & {
        participants: (ChatParticipant & {
            user: { id: string; full_name: string; avatar_url: string | null };
            ngo?: { id: string; name: string; logo_url: string | null };
        })[];
    };
}

export async function getUserChats() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('chat_participants')
        .select(`
      chat:chats(
        *,
        participants:chat_participants(
          user:users(id, full_name, avatar_url)
        )
      ),
      last_read_at
    `)
        .eq('user_id', authUser.id)
        .order('chat(last_message_at)', { ascending: false });

    if (error) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item: { chat: Chat; last_read_at: string }) => ({
        ...item.chat,
        last_read_at: item.last_read_at,
    }));
}

export async function createChat(
    type: ChatType,
    participantIds: string[],
    name?: string,
    ngoId?: string
) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    // Create chat
    const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({
            chat_type: type,
            name,
            created_by: authUser.id,
        })
        .select()
        .single();

    if (chatError) throw chatError;

    // Add participants
    const participants = participantIds.map(userId => ({
        chat_id: chat.id,
        user_id: userId,
        ngo_id: ngoId,
    }));

    // Add creator as participant
    participants.push({
        chat_id: chat.id,
        user_id: authUser.id,
        ngo_id: ngoId,
    });

    const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(participants);

    if (participantsError) throw participantsError;

    return chat as Chat;
}

export async function getOrCreateDirectChat(otherUserId: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    // Check if chat already exists
    const { data: existingChats } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', authUser.id);

    if (existingChats && existingChats.length > 0) {
        const chatIds = existingChats.map((c: { chat_id: string }) => c.chat_id);

        const { data: existingChat } = await supabase
            .from('chat_participants')
            .select('chat_id, chat:chats(*)')
            .in('chat_id', chatIds)
            .eq('user_id', otherUserId)
            .eq('chat.chat_type', 'VOLUNTEER_TO_NGO')
            .single();

        if (existingChat) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (existingChat.chat as unknown) as Chat;
        }
    }

    // Create new chat
    return createChat('VOLUNTEER_TO_NGO', [otherUserId]);
}

// ============================================
// MESSAGE FUNCTIONS
// ============================================

export async function getChatMessages(
    chatId: string,
    options?: {
        before?: string;
        limit?: number;
    }
) {
    const supabase = createClient();
    const limit = options?.limit || 50;

    let query = supabase
        .from('messages')
        .select(`
      *,
      sender:users(id, full_name, avatar_url)
    `)
        .eq('chat_id', chatId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (options?.before) {
        query = query.lt('created_at', options.before);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Reverse to get chronological order
    return (data as (Message & { sender: { id: string; full_name: string; avatar_url: string | null } })[]).reverse();
}

export async function sendMessage(
    chatId: string,
    content: string,
    options?: {
        type?: 'TEXT' | 'IMAGE' | 'FILE' | 'LOCATION';
        mediaUrl?: string;
        replyTo?: string;
        metadata?: Record<string, unknown>;
    }
) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('messages')
        .insert({
            chat_id: chatId,
            sender_id: authUser.id,
            content,
            message_type: options?.type || 'TEXT',
            media_url: options?.mediaUrl || null,
            reply_to: options?.replyTo || null,
            metadata: options?.metadata || {},
        })
        .select(`
      *,
      sender:users(id, full_name, avatar_url)
    `)
        .single();

    if (error) throw error;

    // Update chat's last_message_at
    await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);

    return data as Message & { sender: { id: string; full_name: string; avatar_url: string | null } };
}

export async function editMessage(messageId: string, content: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('messages')
        .update({
            content,
            is_edited: true,
            edited_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .select()
        .single();

    if (error) throw error;
    return data as Message;
}

export async function deleteMessage(messageId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('messages')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
        })
        .eq('id', messageId);

    if (error) throw error;
}

// ============================================
// READ STATUS
// ============================================

export async function markChatAsRead(chatId: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', authUser.id);

    if (error) throw error;
}

export async function getChatUnreadCount(chatId: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    // Get last read time
    const { data: participant } = await supabase
        .from('chat_participants')
        .select('last_read_at')
        .eq('chat_id', chatId)
        .eq('user_id', authUser.id)
        .single();

    if (!participant) return 0;

    // Count messages after last read
    let query = supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('chat_id', chatId)
        .eq('is_deleted', false);

    if (participant.last_read_at) {
        query = query.gt('created_at', participant.last_read_at);
    }

    const { count } = await query;

    return count || 0;
}

export async function getTotalUnreadCount() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data: chats } = await supabase
        .from('chat_participants')
        .select(`
      chat_id,
      last_read_at,
      chat:chats(last_message_at)
    `)
        .eq('user_id', authUser.id);

    if (!chats) return 0;

    let totalUnread = 0;

    for (const chat of chats) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chatData = (chat.chat as unknown) as { last_message_at: string | null };
        if (!chatData?.last_message_at) continue;

        if (!chat.last_read_at || new Date(chatData.last_message_at) > new Date(chat.last_read_at)) {
            totalUnread++;
        }
    }

    return totalUnread;
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToChat(
    chatId: string,
    onMessage: (message: Message) => void
) {
    const supabase = createClient();

    const channel = supabase
        .channel(`chat:${chatId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `chat_id=eq.${chatId}`,
            },
            (payload: { new: Message }) => {
                onMessage(payload.new as Message);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

export function subscribeToUserChats(
    userId: string,
    onChatUpdate: (chat: Chat) => void
) {
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase.channel(`user-chats:${userId}`) as any)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'chats',
            },
            (payload: { new: Chat }) => {
                onChatUpdate(payload.new as Chat);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// ============================================
// TYPING INDICATORS
// ============================================

export async function sendTypingIndicator(chatId: string, isTyping: boolean) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return;

    const channel = supabase.channel(`chat:${chatId}`);
    channel.track({
        user_id: authUser.id,
        is_typing: isTyping,
        timestamp: Date.now(),
    });
}

export function subscribeToTypingIndicators(
    chatId: string,
    onTypingUpdate: (userId: string, isTyping: boolean) => void
) {
    const supabase = createClient();

    const channel = supabase
        .channel(`chat:${chatId}`)
        .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            Object.entries(state).forEach(([userId, presences]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const presenceList = presences as unknown as Array<{ is_typing: boolean }>;
                if (presenceList.length > 0) {
                    onTypingUpdate(userId, presenceList[0].is_typing);
                }
            });
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
