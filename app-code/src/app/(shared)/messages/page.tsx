'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from '@/lib/utils';

interface Conversation {
    id: string;
    other_user_id: string;
    other_user_name: string;
    other_user_avatar: string | null;
    last_message: string;
    last_message_at: string;
    unread_count: number;
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchConversations() {
            const supabase = createClient();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            // Get all conversations for the current user
            const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id})`)
                .order('created_at', { ascending: false });

            if (!messages || messages.length === 0) {
                setLoading(false);
                return;
            }

            // Group by conversation partner
            const conversationMap = new Map<string, Conversation>();

            for (const msg of messages) {
                const otherUserId = msg.sender_id === session.user.id ? msg.receiver_id : msg.sender_id;

                if (!conversationMap.has(otherUserId)) {
                    // Get other user's info
                    const { data: otherUser } = await supabase
                        .from('users')
                        .select('full_name, avatar_url')
                        .eq('id', otherUserId)
                        .single();

                    conversationMap.set(otherUserId, {
                        id: otherUserId,
                        other_user_id: otherUserId,
                        other_user_name: otherUser?.full_name || 'Unknown User',
                        other_user_avatar: otherUser?.avatar_url,
                        last_message: msg.content,
                        last_message_at: msg.created_at,
                        unread_count: msg.receiver_id === session.user.id && !msg.is_read ? 1 : 0,
                    });
                } else {
                    const convo = conversationMap.get(otherUserId)!;
                    if (msg.receiver_id === session.user.id && !msg.is_read) {
                        convo.unread_count++;
                    }
                }
            }

            // Get unread counts properly
            const { data: unreadMessages } = await supabase
                .from('messages')
                .select('sender_id')
                .eq('receiver_id', session.user.id)
                .eq('is_read', false);

            const unreadByUser = new Map<string, number>();
            (unreadMessages || []).forEach(msg => {
                const count = unreadByUser.get(msg.sender_id) || 0;
                unreadByUser.set(msg.sender_id, count + 1);
            });

            // Update unread counts
            conversationMap.forEach((convo, userId) => {
                convo.unread_count = unreadByUser.get(userId) || 0;
            });

            // Sort by last message time
            const sortedConversations = Array.from(conversationMap.values())
                .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

            setConversations(sortedConversations);
            setLoading(false);
        }

        fetchConversations();
    }, []);

    const filteredConversations = searchQuery
        ? conversations.filter(c =>
            c.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.last_message.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : conversations;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">Messages</h1>

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4"
                />
            </div>

            {filteredConversations.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">chat</span>
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-2">Start a conversation by messaging an NGO or volunteer</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredConversations.map((convo) => (
                        <Link
                            key={convo.id}
                            href={`/messages/${convo.id}`}
                            className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200"
                        >
                            <div
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundImage: convo.other_user_avatar ? `url("${convo.other_user_avatar}")` : undefined, backgroundSize: 'cover' }}
                            >
                                {!convo.other_user_avatar && convo.other_user_name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold truncate">{convo.other_user_name}</p>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{formatDistanceToNow(convo.last_message_at)}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{convo.last_message}</p>
                            </div>
                            {convo.unread_count > 0 && (
                                <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                                    {convo.unread_count}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
