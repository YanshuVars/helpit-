"use client";

import { formatDistanceToNow } from "@/lib/utils";
import { Post } from "@/types/dashboard";

interface PostCardProps {
    post: Post;
    currentUserId: string | null;
    ngoName: string;
    onLike: (postId: string) => void;
    onComment: (post: Post) => void;
}

export function PostCard({ post, currentUserId, ngoName, onLike, onComment }: PostCardProps) {
    const getPostTypeColor = (type: string) => {
        switch (type) {
            case "ANNOUNCEMENT": return "bg-red-100 text-red-700";
            case "STORY": return "bg-purple-100 text-purple-700";
            case "IMPACT": return "bg-green-100 text-green-700";
            default: return "bg-blue-100 text-blue-700";
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white font-bold">
                    {post.author?.avatar_url ? (
                        <img src={post.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        post.author?.full_name?.charAt(0) || ngoName.charAt(0)
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{post.author?.full_name || ngoName}</p>
                    <p className="text-xs text-gray-500">
                        {post.published_at ? formatDistanceToNow(post.published_at) : "Draft"}
                    </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getPostTypeColor(post.post_type)}`}>
                    {post.post_type}
                </span>
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined text-gray-400">more_horiz</span>
                </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                {post.title && <h3 className="font-bold mb-2">{post.title}</h3>}
                <p className="text-sm text-gray-600 leading-relaxed">{post.content}</p>
            </div>

            {/* Media */}
            {post.media_urls && post.media_urls.length > 0 && (
                <div className="px-4 pb-3">
                    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                        {post.media_urls.slice(0, 4).map((url, idx) => (
                            <div key={idx} className="aspect-square bg-gray-100">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Post Actions */}
            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-1 ${post.is_liked ? "text-red-500" : "text-gray-500"}`}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {post.is_liked ? "favorite" : "favorite_border"}
                        </span>
                        <span className="text-sm">{post.likes_count}</span>
                    </button>
                    <button
                        onClick={() => onComment(post)}
                        className="flex items-center gap-1 text-gray-500"
                    >
                        <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                        <span className="text-sm">{post.comments_count}</span>
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
    );
}
