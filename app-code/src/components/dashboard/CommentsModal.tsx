"use client";

import { useState } from "react";
import { formatDistanceToNow } from "@/lib/utils";
import { Post, Comment } from "@/types/dashboard";

interface CommentsModalProps {
    post: Post;
    comments: Comment[];
    loading: boolean;
    currentUserId: string | null;
    onClose: () => void;
    onAddComment: (content: string) => Promise<void>;
}

export function CommentsModal({ post, comments, loading, currentUserId, onClose, onAddComment }: CommentsModalProps) {
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        await onAddComment(newComment);
        setNewComment("");
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Comments</h2>
                        <p className="text-sm text-gray-500">{post.comments_count} comments</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-gray-400">chat_bubble_outline</span>
                            <p className="text-gray-500 mt-2">No comments yet</p>
                            <p className="text-sm text-gray-400">Be the first to comment!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {comment.user?.avatar_url ? (
                                        <img src={comment.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        comment.user?.full_name?.charAt(0) || "?"
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="font-semibold text-sm">{comment.user?.full_name || "User"}</p>
                                        <p className="text-sm text-gray-600">{comment.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDistanceToNow(comment.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Comment */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 h-10 rounded-xl border border-gray-200 px-4"
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !newComment.trim()}
                            className="px-4 h-10 bg-[var(--primary)] text-white rounded-xl font-medium disabled:opacity-50"
                        >
                            {submitting ? "..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
