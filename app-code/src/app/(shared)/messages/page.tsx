"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface Conversation {
    id: string;
    otherUser: { id: string; full_name: string | null; avatar_url: string | null; };
    lastMessage: string | null;
    lastMessageTime: string | null;
    unreadCount: number;
}

export default function MessagesPage() {
    const supabase = createClient();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => { fetchConversations(); }, []);

    async function fetchConversations() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: conversationData } = await supabase
                .from("conversations")
                .select("id, user1_id, user2_id, last_message, last_message_at, user1:users!conversations_user1_id_fkey(id, full_name, avatar_url), user2:users!conversations_user2_id_fkey(id, full_name, avatar_url)")
                .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
                .order("last_message_at", { ascending: false });

            if (conversationData) {
                const convos: Conversation[] = conversationData.map((c: any) => {
                    const otherUser = c.user1_id === user.id ? c.user2 : c.user1;
                    return {
                        id: c.id,
                        otherUser: { id: otherUser?.id || "", full_name: otherUser?.full_name || "Unknown", avatar_url: otherUser?.avatar_url || null },
                        lastMessage: c.last_message || null,
                        lastMessageTime: c.last_message_at || null,
                        unreadCount: 0,
                    };
                });

                for (const conv of convos) {
                    const { count } = await supabase.from("messages").select("*", { count: "exact", head: true })
                        .eq("conversation_id", conv.id).eq("receiver_id", user.id).eq("is_read", false);
                    conv.unreadCount = count || 0;
                }
                setConversations(convos);
            }
        } catch (e) { console.error("Error fetching conversations:", e); }
        finally { setLoading(false); }
    }

    const filteredConversations = conversations.filter(c =>
        (c.otherUser.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Messages</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                    {totalUnread > 0 ? `${totalUnread} unread messages` : "All caught up!"}
                </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 22 }}>search</span>
                <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 46px', borderRadius: 14, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            {/* Conversations */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : filteredConversations.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
                    border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>chat_bubble_outline</span>
                    <p style={{ color: '#94a3b8', marginTop: 10 }}>No conversations yet</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filteredConversations.map(conv => (
                        <Link key={conv.id} href={`/messages/${conv.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 14, padding: 16,
                                borderRadius: 14, cursor: 'pointer', transition: 'all 200ms',
                                background: conv.unreadCount > 0 ? 'rgba(29,226,209,0.04)' : '#fff',
                                border: `1px solid ${conv.unreadCount > 0 ? '#1de2d1' : '#e2e8f0'}`,
                            }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: '#1de2d1', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0, overflow: 'hidden',
                                }}>
                                    {conv.otherUser.avatar_url
                                        ? <img src={conv.otherUser.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : (conv.otherUser.full_name?.charAt(0) || "?").toUpperCase()
                                    }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize: 14, color: '#0f172a' }}>{conv.otherUser.full_name || "Unknown"}</p>
                                        {conv.lastMessageTime && <p style={{ fontSize: 11, color: '#94a3b8' }}>{formatDistanceToNow(conv.lastMessageTime)}</p>}
                                    </div>
                                    <p style={{ fontSize: 13, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {conv.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div style={{
                                        minWidth: 24, height: 24, borderRadius: 999, padding: '0 6px',
                                        background: '#1de2d1', color: '#0f172a',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 800,
                                    }}>
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
