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
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Messages</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>
                        {totalUnread > 0 ? `${totalUnread} unread messages` : "All caught up!"}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--foreground-light)" }}>search</span>
                <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="field-input" style={{ paddingLeft: 40 }} />
            </div>

            {/* Conversation list */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div className="spinner" /></div>
            ) : filteredConversations.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--foreground-light)" }}>chat_bubble_outline</span>
                    <p style={{ color: "var(--foreground-muted)", marginTop: "var(--space-sm)" }}>No conversations yet</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    {filteredConversations.map((conv) => (
                        <Link key={conv.id} href={`/messages/${conv.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="card" style={{
                                display: "flex", alignItems: "center", gap: "var(--space-md)",
                                cursor: "pointer", transition: "background 0.15s",
                                background: conv.unreadCount > 0 ? "var(--primary-50)" : undefined,
                            }}>
                                {/* Avatar */}
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "var(--font-lg)", flexShrink: 0, overflow: "hidden" }}>
                                    {conv.otherUser.avatar_url
                                        ? <img src={conv.otherUser.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : (conv.otherUser.full_name?.charAt(0) || "?").toUpperCase()
                                    }
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <p style={{ fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize: "var(--font-sm)" }}>{conv.otherUser.full_name || "Unknown"}</p>
                                        {conv.lastMessageTime && <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{formatDistanceToNow(conv.lastMessageTime)}</p>}
                                    </div>
                                    <p style={{ fontSize: "var(--font-sm)", color: "var(--foreground-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                                        {conv.lastMessage || "No messages yet"}
                                    </p>
                                </div>

                                {/* Unread badge */}
                                {conv.unreadCount > 0 && (
                                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
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
