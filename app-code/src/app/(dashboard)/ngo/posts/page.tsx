"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Post {
    id: string;
    title: string;
    content: string;
    type: string;
    created_at: string;
    author_name: string;
    status: string;
}

const typeIcons: Record<string, { icon: string; bg: string; color: string }> = {
    update: { icon: "campaign", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    news: { icon: "newspaper", bg: "rgba(16,185,129,0.1)", color: "#059669" },
    alert: { icon: "warning", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
    story: { icon: "auto_stories", bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
};

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: membership } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", session.user.id).single();
            if (!membership) { setLoading(false); return; }

            const { data } = await supabase
                .from("posts")
                .select("id, title, content, type, created_at, author_name, status")
                .eq("ngo_id", membership.ngo_id)
                .order("created_at", { ascending: false })
                .limit(20);

            setPosts(data || []);
            setLoading(false);
        }
        load();
    }, []);

    const filters = ["All", "Updates", "News", "Alerts", "Stories"];

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Posts & Updates</h2>
                    <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Share news, updates, and stories with your community.</p>
                </div>
                <button style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#1de2d1", color: "#0f172a",
                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit_note</span>
                    New Post
                </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {filters.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{
                            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                            background: filter === f ? "#1de2d1" : "#f1f5f9",
                            color: filter === f ? "#0f172a" : "#64748b",
                            border: "none", cursor: "pointer",
                        }}
                    >{f}</button>
                ))}
            </div>

            {/* Post Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {posts.length === 0 ? (
                    <div style={{
                        padding: 48, textAlign: "center", background: "#fff",
                        borderRadius: 12, border: "1px solid #e2e8f0",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#cbd5e1" }}>article</span>
                        <p style={{ marginTop: 12, color: "#94a3b8" }}>No posts yet. Create your first post!</p>
                    </div>
                ) : (
                    posts.map(p => {
                        const ti = typeIcons[p.type] || typeIcons.update;
                        return (
                            <div key={p.id} style={{
                                background: "#fff", borderRadius: 12,
                                border: "1px solid #e2e8f0", padding: 20,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                display: "flex", gap: 16,
                            }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: 10,
                                    background: ti.bg, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: ti.color, fontVariationSettings: "'FILL' 1" }}>{ti.icon}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                        <h4 style={{ fontSize: 15, fontWeight: 700 }}>{p.title}</h4>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{
                                                fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                                                padding: "2px 8px", borderRadius: 4,
                                                background: p.status === "published" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
                                                color: p.status === "published" ? "#059669" : "#d97706",
                                            }}>{p.status}</span>
                                            <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#94a3b8" }}>more_horiz</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                                        {p.content}
                                    </p>
                                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#94a3b8" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
                                            {p.author_name || "Admin"}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                                            {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
