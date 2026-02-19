'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

interface User {
    id: string;
    full_name: string;
    avatar_url: string | null;
}

export default function ChatRoomPage() {
    const params = useParams();
    const conversationId = params.id as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const supabase = createClient();

    // Get current user and messages
    useEffect(() => {
        async function fetchData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            setCurrentUserId(session.user.id);

            // Get other user's info
            const { data: otherUserData } = await supabase
                .from('users')
                .select('id, full_name, avatar_url')
                .eq('id', conversationId)
                .single();

            if (otherUserData) {
                setOtherUser(otherUserData);
            }

            // Get messages between users
            const { data: messagesData } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${session.user.id})`)
                .order('created_at', { ascending: true });

            setMessages(messagesData || []);

            // Mark messages as read
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('sender_id', conversationId)
                .eq('receiver_id', session.user.id);

            setLoading(false);
        }

        fetchData();
    }, [conversationId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Subscribe to new messages
    useEffect(() => {
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${currentUserId}`,
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentUserId) return;

        setSending(true);

        const { error } = await supabase
            .from('messages')
            .insert({
                sender_id: currentUserId,
                receiver_id: conversationId,
                content: newMessage.trim(),
                is_read: false,
            });

        if (!error) {
            // Refresh messages
            const { data: messagesData } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${currentUserId})`)
                .order('created_at', { ascending: true });

            setMessages(messagesData || []);
            setNewMessage("");
        }

        setSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getStatusIcon = (isRead: boolean) => {
        return isRead ? "done_all" : "done";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[var(--background-light)]">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 flex items-center bg-white border-b border-[var(--border-light)] p-4 pb-2 justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="text-[var(--foreground)] flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-[var(--background-subtle)] rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white font-bold shrink-0"
                            style={{ backgroundImage: otherUser?.avatar_url ? `url("${otherUser.avatar_url}")` : undefined, backgroundSize: 'cover' }}
                        >
                            {!otherUser?.avatar_url && otherUser?.full_name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-base font-bold">{otherUser?.full_name || 'Chat'}</h2>
                            <p className="text-green-500 text-xs font-medium">Online</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-transparent text-[var(--foreground)] hover:bg-[var(--background-subtle)]">
                        <span className="material-symbols-outlined">call</span>
                    </button>
                    <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-transparent text-[var(--foreground)] hover:bg-[var(--background-subtle)]">
                        <span className="material-symbols-outlined">videocam</span>
                    </button>
                </div>
            </div>

            {/* Message Thread */}
            <div className="chat-scroll flex flex-col p-4 space-y-2 flex-1">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <span className="material-symbols-outlined text-5xl text-[var(--foreground-light)] mb-3">chat_bubble_outline</span>
                        <p className="text-[var(--foreground-muted)]">No messages yet</p>
                        <p className="text-sm text-[var(--foreground-light)]">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return isMe ? (
                            // Sent Message
                            <div key={msg.id} className="flex items-end gap-2 self-end max-w-[85%] justify-end">
                                <div className="flex flex-col gap-1 items-end">
                                    <div className="rounded-2xl rounded-br-sm px-4 py-3 bg-[var(--primary)] text-white shadow-md">
                                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mr-1">
                                        <p className="text-[var(--foreground-muted)] text-[10px]">{time}</p>
                                        <span className={`material-symbols-outlined text-[14px] ${msg.is_read ? "text-blue-400" : "text-gray-400"}`}>
                                            {getStatusIcon(msg.is_read)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Received Message
                            <div key={msg.id} className="flex items-end gap-2 max-w-[85%]">
                                <div
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1"
                                    style={{ backgroundImage: otherUser?.avatar_url ? `url("${otherUser.avatar_url}")` : undefined, backgroundSize: 'cover' }}
                                >
                                    {!otherUser?.avatar_url && otherUser?.full_name?.charAt(0)}
                                </div>
                                <div className="flex flex-col gap-1 items-start">
                                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-white shadow-sm border border-[var(--border-light)]">
                                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                    </div>
                                    <p className="text-[var(--foreground-muted)] text-[10px] ml-1">{time}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-[var(--border-light)] p-3 pb-8">
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center w-10 h-10 text-[var(--primary)] hover:bg-[var(--primary-50)] rounded-full transition-colors">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 text-[var(--primary)] hover:bg-[var(--primary-50)] rounded-full transition-colors">
                        <span className="material-symbols-outlined">image</span>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            className="w-full bg-[var(--background-subtle)] border-none rounded-full px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-[var(--primary)]/50 text-[var(--foreground)] placeholder:text-[var(--foreground-light)]"
                            placeholder="Type a message..."
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all ${newMessage.trim() && !sending
                            ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95"
                            : "bg-[var(--background-subtle)] text-[var(--foreground-light)] cursor-not-allowed"
                            }`}
                    >
                        {sending ? (
                            <div className="spinner" style={{ width: 16, height: 16 }}></div>
                        ) : (
                            <span className="material-symbols-outlined">send</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
