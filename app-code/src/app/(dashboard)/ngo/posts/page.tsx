"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface Post {
    id: string;
    title: string;
    content: string;
    post_type: string;
    published_at: string | null;
    created_at: string;
    author_name: string;
    author_id: string;
}

const typeColors: Record<string, { bg: string; text: string }> = {
    UPDATE: { bg: "rgba(59,130,246,0.08)", text: "#2563eb" },
    ANNOUNCEMENT: { bg: "rgba(239,68,68,0.08)", text: "#dc2626" },
    STORY: { bg: "rgba(139,92,246,0.08)", text: "#7c3aed" },
    IMPACT: { bg: "rgba(16,185,129,0.08)", text: "#059669" },
};

const postTypes = ['UPDATE', 'ANNOUNCEMENT', 'STORY', 'IMPACT'] as const;

export default function PostsPage() {
    const { ngoId, userId, canWrite, loading: ctxLoading } = useNgoContext();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Form fields
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState<string>("UPDATE");

    useEffect(() => {
        async function load() {
            if (ctxLoading || !ngoId) { setLoading(false); return; }
            const supabase = createClient();
            const { data, error } = await supabase
                .from("posts")
                .select("id, title, content, post_type, published_at, created_at, author_id, author:users!author_id(full_name)")
                .eq("ngo_id", ngoId)
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) {
                console.error("Error fetching posts:", error);
                toast.error("Failed to load posts.");
            }

            setPosts((data || []).map((p: any) => {
                const author = Array.isArray(p.author) ? p.author[0] : p.author;
                return {
                    id: p.id,
                    title: p.title || "",
                    content: p.content || "",
                    post_type: p.post_type,
                    published_at: p.published_at,
                    created_at: p.created_at,
                    author_name: author?.full_name || "Unknown",
                    author_id: p.author_id,
                };
            }));
            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    function resetForm() {
        setFormTitle("");
        setFormContent("");
        setFormType("UPDATE");
        setEditingId(null);
        setShowForm(false);
    }

    function startEdit(post: Post) {
        setEditingId(post.id);
        setFormTitle(post.title);
        setFormContent(post.content);
        setFormType(post.post_type);
        setShowForm(true);
    }

    async function handleSave() {
        if (!ngoId || !userId || !canWrite) {
            toast.error("You don't have permission to manage posts.");
            return;
        }
        if (!formContent.trim()) {
            toast.error("Post content is required.");
            return;
        }
        setSaving(true);
        const supabase = createClient();

        if (editingId) {
            // UPDATE existing post
            const { error } = await supabase
                .from("posts")
                .update({
                    title: formTitle.trim() || null,
                    content: formContent.trim(),
                    post_type: formType,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", editingId);

            if (error) {
                toast.error(`Failed to update: ${error.message}`);
            } else {
                toast.success("Post updated!");
                setPosts(prev => prev.map(p => p.id === editingId ? {
                    ...p,
                    title: formTitle.trim(),
                    content: formContent.trim(),
                    post_type: formType,
                } : p));
                resetForm();
            }
        } else {
            // INSERT new post
            const { data: newPost, error } = await supabase
                .from("posts")
                .insert({
                    ngo_id: ngoId,
                    author_id: userId,
                    title: formTitle.trim() || null,
                    content: formContent.trim(),
                    post_type: formType,
                    published_at: new Date().toISOString(),
                })
                .select("id, created_at")
                .single();

            if (error) {
                toast.error(`Failed to create post: ${error.message}`);
            } else {
                toast.success("Post published!");
                setPosts(prev => [{
                    id: newPost.id,
                    title: formTitle.trim(),
                    content: formContent.trim(),
                    post_type: formType,
                    published_at: new Date().toISOString(),
                    created_at: newPost.created_at,
                    author_name: "You",
                    author_id: userId,
                }, ...prev]);
                resetForm();
            }
        }
        setSaving(false);
    }

    async function handleDelete(postId: string) {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        const supabase = createClient();
        const { error } = await supabase.from("posts").delete().eq("id", postId);
        if (error) {
            toast.error(`Failed to delete: ${error.message}`);
        } else {
            toast.success("Post deleted.");
            setPosts(prev => prev.filter(p => p.id !== postId));
        }
    }

    const filtered = filter === 'ALL' ? posts : posts.filter(p => p.post_type === filter);

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    const inputStyle = {
        width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
        border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Posts</h1>
                    <p style={{ color: "#64748b", fontSize: 15, marginTop: 4 }}>Share updates, announcements, and impact stories.</p>
                </div>
                {canWrite && (
                    <button onClick={() => { resetForm(); setShowForm(true); }} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "10px 20px", borderRadius: 8,
                        background: "#1de2d1", color: "#0f172a",
                        fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        New Post
                    </button>
                )}
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    marginBottom: 24,
                }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
                        {editingId ? "Edit Post" : "Create New Post"}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Title</label>
                                <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Post title (optional)" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Type</label>
                                <select value={formType} onChange={e => setFormType(e.target.value)} style={{ ...inputStyle, minWidth: 140 }}>
                                    {postTypes.map(t => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Content *</label>
                            <textarea value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="Write your post content..." rows={5} style={{
                                width: '100%', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical',
                            }} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={resetForm} style={{
                                padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                                background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{
                                padding: '8px 18px', borderRadius: 8, border: 'none',
                                background: '#1de2d1', color: '#0f172a', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            }}>
                                {saving ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{ borderBottom: "2px solid #f1f5f9", marginBottom: 24, display: "flex", gap: 32 }}>
                {['ALL', ...postTypes].map(t => (
                    <button key={t} onClick={() => setFilter(t)} style={{
                        paddingBottom: 10, fontSize: 13, fontWeight: filter === t ? 700 : 500,
                        color: filter === t ? "#0f172a" : "#94a3b8",
                        borderBottom: filter === t ? "2px solid #1de2d1" : "2px solid transparent",
                        background: "none", border: "none", cursor: "pointer", marginBottom: -2,
                    }}>{t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}</button>
                ))}
            </div>

            {/* Posts List */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 64,
                    background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#cbd5e1" }}>article</span>
                    <p style={{ marginTop: 12, color: "#94a3b8" }}>No posts yet</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filtered.map(p => {
                        const tc = typeColors[p.post_type] || typeColors.UPDATE;
                        const isOwner = p.author_id === userId;
                        return (
                            <div key={p.id} style={{
                                background: "#fff", borderRadius: 12, padding: 20,
                                border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                                            background: tc.bg, color: tc.text, textTransform: "uppercase", letterSpacing: "0.05em",
                                        }}>{p.post_type.replace('_', ' ')}</span>
                                        {p.title && (
                                            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 8, color: '#0f172a' }}>{p.title}</h3>
                                        )}
                                    </div>
                                    {canWrite && isOwner && (
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button onClick={() => startEdit(p)} style={{
                                                padding: 4, background: 'none', border: 'none', cursor: 'pointer',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} style={{
                                                padding: 4, background: 'none', border: 'none', cursor: 'pointer',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#dc2626' }}>delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>
                                    {p.content.length > 200 ? p.content.slice(0, 200) + "…" : p.content}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#94a3b8' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
                                        {p.author_name}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(p.published_at || p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
