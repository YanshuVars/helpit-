"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { PostCard } from "@/components/dashboard/PostCard";
import { CreatePostModal } from "@/components/dashboard/CreatePostModal";
import { CommentsModal } from "@/components/dashboard/CommentsModal";
import { Post, Comment } from "@/types/dashboard";

export default function NGOPostsPage() {
    const supabase = createClient();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "drafts" | "scheduled">("all");

    // Comments modal state
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Current user info
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [ngoName, setNgoName] = useState<string>("");

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    async function fetchPosts() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            setCurrentUserId(user.id);

            // Get NGO ID for the user
            const { data: ngoData } = await supabase
                .from("ngo_members")
                .select("ngo_id")
                .eq("user_id", user.id)
                .single();

            if (ngoData?.ngo_id) {
                // Get NGO name separately
                const { data: ngoInfo } = await supabase
                    .from("ngos")
                    .select("name")
                    .eq("id", ngoData.ngo_id)
                    .single();

                setNgoName(ngoInfo?.name || "NGO");

                // Build query
                let query = supabase
                    .from("posts")
                    .select(`
                        *,
                        author:users(full_name, avatar_url)
                    `)
                    .eq("ngo_id", ngoData.ngo_id);

                // Filter by tab
                if (activeTab === "drafts") {
                    query = query.is("published_at", null);
                } else if (activeTab === "scheduled") {
                    query = query.not("published_at", "is", null);
                } else {
                    query = query.not("published_at", "is", null);
                }

                const { data: postsData, error } = await query.order("created_at", { ascending: false });

                if (postsData) {
                    // Check if user liked each post
                    const postsWithLikes = await Promise.all(
                        postsData.map(async (post: any) => {
                            const { data: likeData } = await supabase
                                .from("post_likes")
                                .select("id")
                                .eq("post_id", post.id)
                                .eq("user_id", user.id)
                                .single();

                            return {
                                ...post,
                                is_liked: !!likeData,
                            };
                        })
                    );
                    setPosts(postsWithLikes as Post[]);
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleLike(postId: string) {
        if (!currentUserId) return;

        const post = posts.find(p => p.id === postId);
        if (!post) return;

        try {
            if (post.is_liked) {
                // Unlike
                await supabase
                    .from("post_likes")
                    .delete()
                    .eq("post_id", postId)
                    .eq("user_id", currentUserId);

                setPosts(posts.map(p =>
                    p.id === postId
                        ? { ...p, is_liked: false, likes_count: p.likes_count - 1 }
                        : p
                ));
            } else {
                // Like
                await supabase
                    .from("post_likes")
                    .insert({ post_id: postId, user_id: currentUserId });

                setPosts(posts.map(p =>
                    p.id === postId
                        ? { ...p, is_liked: true, likes_count: p.likes_count + 1 }
                        : p
                ));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    }

    async function openCommentsModal(post: Post) {
        setSelectedPost(post);
        setLoadingComments(true);

        try {
            const { data, error } = await supabase
                .from("post_comments")
                .select(`
                    *,
                    user:users(full_name, avatar_url)
                `)
                .eq("post_id", post.id)
                .order("created_at", { ascending: true });

            if (data) {
                setComments(data as any[]);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoadingComments(false);
        }
    }

    async function handleAddComment(content: string) {
        if (!selectedPost || !currentUserId) return;

        try {
            const { data, error } = await supabase
                .from("post_comments")
                .insert({
                    post_id: selectedPost.id,
                    user_id: currentUserId,
                    content: content.trim(),
                })
                .select(`
                    *,
                    user:users(full_name, avatar_url)
                `)
                .single();

            if (error) throw error;

            if (data) {
                setComments([...comments, data as any]);
                // Update comments count in the post
                setPosts(posts.map(p =>
                    p.id === selectedPost.id
                        ? { ...p, comments_count: p.comments_count + 1 }
                        : p
                ));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment");
        }
    }

    async function handleCreatePost(data: { title: string; content: string; post_type: string }) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get NGO ID
            const { data: ngoData } = await supabase
                .from("ngo_members")
                .select("ngo_id")
                .eq("user_id", user.id)
                .single();

            if (!ngoData?.ngo_id) {
                alert("You must be an NGO member to create posts");
                return;
            }

            const { error } = await supabase.from("posts").insert({
                ngo_id: ngoData.ngo_id,
                author_id: user.id,
                title: data.title,
                content: data.content,
                post_type: data.post_type,
                published_at: new Date().toISOString(),
            });

            if (error) throw error;

            setShowCreateModal(false);
            fetchPosts();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post");
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Posts" showBack fallbackRoute="/ngo" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posts"
                showBack
                fallbackRoute="/ngo"
                rightAction={
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Create
                    </button>
                }
            />

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${activeTab === "all" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
                >
                    All Posts
                </button>
                <button
                    onClick={() => setActiveTab("drafts")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${activeTab === "drafts" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
                >
                    Drafts
                </button>
                <button
                    onClick={() => setActiveTab("scheduled")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${activeTab === "scheduled" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
                >
                    Scheduled
                </button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400">article</span>
                        <p className="text-gray-500 mt-2">No posts yet</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 text-[var(--primary)] font-semibold"
                        >
                            Create your first post
                        </button>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={currentUserId}
                            ngoName={ngoName}
                            onLike={toggleLike}
                            onComment={openCommentsModal}
                        />
                    ))
                )}
            </div>

            {/* Comments Modal */}
            {selectedPost && (
                <CommentsModal
                    post={selectedPost}
                    comments={comments}
                    loading={loadingComments}
                    currentUserId={currentUserId}
                    onClose={() => setSelectedPost(null)}
                    onAddComment={handleAddComment}
                />
            )}

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreatePost}
                />
            )}
        </div>
    );
}
