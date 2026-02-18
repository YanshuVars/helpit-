"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";

interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    createdAt: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    image?: string;
    tags: string[];
}

export default function NGOPostsPage() {
    const [posts, setPosts] = useState<Post[]>([
        {
            id: "p1",
            title: "Successful Food Distribution Drive",
            content: "We successfully distributed food packages to over 200 families in the eastern district. Thank you to all our volunteers and donors who made this possible!",
            author: "Sarah Admin",
            authorAvatar: "S",
            createdAt: "2 hours ago",
            likes: 45,
            comments: 12,
            isLiked: false,
            tags: ["Food Relief", "Success Story"],
        },
        {
            id: "p2",
            title: "Volunteer Training Session",
            content: "Join us this Saturday for a volunteer training session on disaster response. All skill levels welcome!",
            author: "Hope Foundation",
            authorAvatar: "H",
            createdAt: "1 day ago",
            likes: 28,
            comments: 8,
            isLiked: true,
            tags: ["Training", "Volunteers"],
        },
        {
            id: "p3",
            title: "New Partnership Announcement",
            content: "We're excited to announce our partnership with HealthFirst NGO to provide better medical support to communities in need.",
            author: "Sarah Admin",
            authorAvatar: "S",
            createdAt: "3 days ago",
            likes: 67,
            comments: 23,
            isLiked: false,
            tags: ["Partnership", "Healthcare"],
        },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");

    const toggleLike = (postId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const handleCreatePost = () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        const newPost: Post = {
            id: `p${Date.now()}`,
            title: newPostTitle,
            content: newPostContent,
            author: "Sarah Admin",
            authorAvatar: "S",
            createdAt: "Just now",
            likes: 0,
            comments: 0,
            isLiked: false,
            tags: [],
        };

        setPosts([newPost, ...posts]);
        setNewPostTitle("");
        setNewPostContent("");
        setShowCreateModal(false);
    };

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
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--primary)] text-white min-h-[44px]">All Posts</button>
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 min-h-[44px]">Drafts</button>
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 min-h-[44px]">Scheduled</button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Post Header */}
                        <div className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white font-bold">
                                {post.authorAvatar}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{post.author}</p>
                                <p className="text-xs text-gray-500">{post.createdAt}</p>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <span className="material-symbols-outlined text-gray-400">more_horiz</span>
                            </button>
                        </div>

                        {/* Post Content */}
                        <div className="px-4 pb-3">
                            <h3 className="font-bold mb-2">{post.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{post.content}</p>
                        </div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <div className="px-4 pb-3 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Post Actions */}
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {post.isLiked ? "favorite" : "favorite_border"}
                                    </span>
                                    <span className="text-sm">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1 text-gray-500">
                                    <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                                    <span className="text-sm">{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-1 text-gray-500">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                </button>
                            </div>
                            <button className="flex items-center gap-1 text-gray-500">
                                <span className="material-symbols-outlined text-lg">bookmark_border</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Create Post</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    placeholder="Post title..."
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Content</label>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                    <span className="material-symbols-outlined text-lg">image</span>
                                    Photo
                                </button>
                                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                    <span className="material-symbols-outlined text-lg">videocam</span>
                                    Video
                                </button>
                                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                    <span className="material-symbols-outlined text-lg">tag</span>
                                    Tag
                                </button>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={handleCreatePost}
                                className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl"
                            >
                                Publish Post
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
