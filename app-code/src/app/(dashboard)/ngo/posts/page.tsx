"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface Post {
    id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    author: { full_name: string; avatar_url: string | null } | null;
    likes_count: number;
    comments_count: number;
    user_has_liked: boolean;
}

interface Comment {
    id: string;
    content: string;
    created_at: string;
    author: { full_name: string; avatar_url: string | null } | null;
}

export default function NGOPostsPage() {
    const supabase = createClient();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [commentModal, setCommentModal] = useState<{ postId: string; comments: Comment[] } | null>(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => { fetchPosts(); }, []);

    async function fetchPosts() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const { data: ngoData } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", user.id).single();

            if (ngoData?.ngo_id) {
                const { data: postsData } = await supabase
                    .from("posts").select("*, profiles!posts_user_id_fkey(full_name, avatar_url)")
                    .eq("ngo_id", ngoData.ngo_id)
                    .order("created_at", { ascending: false });

                if (postsData) {
                    setPosts(postsData.map((p: any) => ({
                        ...p,
                        author: p.profiles,
                        likes_count: p.likes_count || 0,
                        comments_count: p.comments_count || 0,
                        user_has_liked: false,
                    })));
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally { setLoading(false); }
    }

    async function handleCreatePost() {
        if (!newPostContent.trim()) return;
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: ngoData } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", user.id).single();

            if (!ngoData?.ngo_id) return;

            await supabase.from("posts").insert({
                user_id: user.id,
                ngo_id: ngoData.ngo_id,
                content: newPostContent,
                post_type: "ANNOUNCEMENT",
            });

            setNewPostContent("");
            setShowCreateModal(false);
            fetchPosts();
        } catch (error) {
            console.error("Error creating post:", error);
        } finally { setSubmitting(false); }
    }

    async function handleLike(postId: string) {
        setPosts(posts.map(p => p.id === postId ? { ...p, user_has_liked: !p.user_has_liked, likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count + 1 } : p));
    }

    async function openComments(postId: string) {
        try {
            const { data: comments } = await supabase
                .from("comments").select("*, profiles!comments_user_id_fkey(full_name, avatar_url)")
                .eq("post_id", postId).order("created_at", { ascending: true });

            setCommentModal({ postId, comments: (comments || []).map((c: any) => ({ ...c, author: c.profiles })) });
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }

    async function handleAddComment() {
        if (!newComment.trim() || !commentModal) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from("comments").insert({
                post_id: commentModal.postId,
                user_id: user.id,
                content: newComment,
            });

            setNewComment("");
            openComments(commentModal.postId);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title">Posts</h1>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    New Post
                </button>
            </div>

            {/* Post List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {posts.length === 0 ? (
                    <div className="empty-state-container">
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>article</span>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No posts yet</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="card" style={{ padding: 18 }}>
                            {/* Author Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 700, fontSize: 14, overflow: 'hidden',
                                }}>
                                    {post.author?.avatar_url
                                        ? <img src={post.author.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : (post.author?.full_name?.charAt(0) || "?")}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: 13 }}>{post.author?.full_name || "Unknown"}</p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                        {formatDistanceToNow(new Date(post.created_at))}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-body)', whiteSpace: 'pre-wrap' }}>{post.content}</p>

                            {post.image_url && (
                                <div style={{ marginTop: 12, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <img src={post.image_url} alt="" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-border-subtle)' }}>
                                <button
                                    onClick={() => handleLike(post.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                                        color: post.user_has_liked ? '#DC2626' : 'var(--color-text-muted)', fontSize: 13, fontWeight: 500,
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{post.user_has_liked ? 'favorite' : 'favorite_border'}</span>
                                    {post.likes_count}
                                </button>
                                <button
                                    onClick={() => openComments(post.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500 }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat_bubble_outline</span>
                                    {post.comments_count}
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500, marginLeft: 'auto' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <>
                    <div onClick={() => setShowCreateModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'fixed', left: '50%', top: '50%', zIndex: 50,
                        width: '100%', maxWidth: 440, transform: 'translate(-50%, -50%)',
                        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
                    }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Create Announcement</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        <div style={{ padding: 18 }}>
                            <textarea
                                value={newPostContent}
                                onChange={e => setNewPostContent(e.target.value)}
                                placeholder="Share something with your community..."
                                rows={5}
                                className="field-input field-textarea"
                                style={{ width: '100%' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                                <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>add_photo_alternate</span>
                                </button>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim() || submitting}
                                    className="btn btn-primary"
                                    style={{ fontSize: 13, padding: '8px 20px', opacity: !newPostContent.trim() || submitting ? 0.5 : 1 }}
                                >
                                    {submitting ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Comment Modal */}
            {commentModal && (
                <>
                    <div onClick={() => setCommentModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'fixed', left: '50%', top: '50%', zIndex: 50,
                        width: '100%', maxWidth: 440, transform: 'translate(-50%, -50%)',
                        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)', overflow: 'hidden', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                    }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Comments</h2>
                            <button onClick={() => setCommentModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {commentModal.comments.length === 0 ? (
                                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: 13 }}>No comments yet</p>
                            ) : (
                                commentModal.comments.map(c => (
                                    <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                                        <div style={{
                                            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                                            background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: 12,
                                        }}>{c.author?.full_name?.charAt(0) || "?"}</div>
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 600 }}>{c.author?.full_name || "Unknown"} <span style={{ fontWeight: 400, color: 'var(--color-text-disabled)' }}>{formatDistanceToNow(new Date(c.created_at))}</span></p>
                                            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginTop: 2 }}>{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', gap: 8, flexShrink: 0 }}>
                            <input
                                type="text"
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="field-input"
                                style={{ flex: 1 }}
                                onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
                            />
                            <button onClick={handleAddComment} className="btn btn-primary" style={{ padding: '6px 14px', minHeight: 0 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
