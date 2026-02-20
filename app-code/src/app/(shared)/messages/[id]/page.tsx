"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Message {
    id: string; sender_id: string; receiver_id: string;
    content: string; is_read: boolean; created_at: string;
}
interface OtherUser {
    id: string; full_name: string | null; avatar_url: string | null;
}

export default function ChatRoomPage() {
    const supabase = createClient();
    const { id: conversationId } = useParams();
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [otherUser, setOtherUser] = useState<OtherUser | null>(null);

    useEffect(() => { init(); }, [conversationId]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    async function init() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setCurrentUserId(user.id);

            const { data: conv } = await supabase
                .from("conversations")
                .select("user1_id, user2_id, user1:users!conversations_user1_id_fkey(id, full_name, avatar_url), user2:users!conversations_user2_id_fkey(id, full_name, avatar_url)")
                .eq("id", conversationId).single();

            if (conv) {
                const other = (conv as any).user1_id === user.id ? (conv as any).user2 : (conv as any).user1;
                setOtherUser(other);
            }

            const { data: msgs } = await supabase
                .from("messages").select("*").eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });
            if (msgs) setMessages(msgs);

            await supabase.from("messages").update({ is_read: true })
                .eq("conversation_id", conversationId).eq("receiver_id", user.id).eq("is_read", false);

            const channel = supabase.channel(`messages:${conversationId}`)
                .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
                    (payload) => { setMessages(prev => [...prev, payload.new as Message]); })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        } catch (e) { console.error("Error loading chat:", e); }
        finally { setLoading(false); }
    }

    async function sendMessage() {
        if (!newMessage.trim() || !currentUserId || !otherUser) return;
        setSending(true);
        try {
            const { error } = await supabase.from("messages").insert({
                conversation_id: conversationId,
                sender_id: currentUserId,
                receiver_id: otherUser.id,
                content: newMessage.trim(),
            });
            if (error) throw error;
            await supabase.from("conversations").update({ last_message: newMessage.trim(), last_message_at: new Date().toISOString() }).eq("id", conversationId);
            setNewMessage("");
        } catch (e) { console.error("Error sending message:", e); }
        finally { setSending(false); }
    }

    const fmtTime = (ts: string) => new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const fmtDate = (ts: string) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    let lastDate = "";

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
            {/* Chat header */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", padding: "var(--space-md) 0", borderBottom: "1px solid var(--border-light)" }}>
                <button onClick={() => router.push("/messages")} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--foreground-muted)" }}>arrow_back</span>
                </button>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, overflow: "hidden" }}>
                    {otherUser?.avatar_url ? <img src={otherUser.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (otherUser?.full_name?.charAt(0) || "?").toUpperCase()}
                </div>
                <div>
                    <p style={{ fontWeight: 600, fontSize: "var(--font-sm)" }}>{otherUser?.full_name || "Loading..."}</p>
                    <p style={{ fontSize: "var(--font-xs)", color: "var(--color-success)" }}>Online</p>
                </div>
            </div>

            {/* Messages area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-md) 0", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div className="spinner" /></div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--foreground-muted)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--foreground-light)" }}>waving_hand</span>
                        <p style={{ marginTop: 8 }}>Say hello!</p>
                    </div>
                ) : messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    const dateStr = fmtDate(msg.created_at);
                    let showDate = false;
                    if (dateStr !== lastDate) { showDate = true; lastDate = dateStr; }

                    return (
                        <div key={msg.id}>
                            {showDate && (
                                <div style={{ textAlign: "center", padding: "var(--space-sm) 0" }}>
                                    <span style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", background: "var(--background-subtle)", padding: "4px 12px", borderRadius: 12 }}>{dateStr}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                                <div style={{
                                    maxWidth: "70%", padding: "var(--space-sm) var(--space-md)",
                                    borderRadius: "var(--radius-lg)",
                                    background: isMine ? "var(--primary)" : "var(--background-card)",
                                    color: isMine ? "#fff" : "var(--foreground)",
                                    border: isMine ? "none" : "1px solid var(--border-light)",
                                }}>
                                    <p style={{ fontSize: "var(--font-sm)", wordBreak: "break-word" }}>{msg.content}</p>
                                    <p style={{ fontSize: 10, marginTop: 4, textAlign: "right", opacity: 0.7 }}>{fmtTime(msg.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Send bar */}
            <div style={{ display: "flex", gap: "var(--space-sm)", padding: "var(--space-md) 0", borderTop: "1px solid var(--border-light)" }}>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..." className="field-input" style={{ flex: 1 }} />
                <button className="btn-primary" disabled={sending || !newMessage.trim()} onClick={sendMessage}
                    style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>Send
                </button>
            </div>
        </div>
    );
}
