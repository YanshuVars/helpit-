"use client";

import { useState } from "react";

interface CreatePostModalProps {
    onClose: () => void;
    onSubmit: (data: { title: string; content: string; post_type: string }) => Promise<void>;
}

export function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        post_type: "UPDATE",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Create Post</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Post Type</label>
                            <select
                                value={formData.post_type}
                                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white"
                            >
                                <option value="UPDATE">Update</option>
                                <option value="ANNOUNCEMENT">Announcement</option>
                                <option value="STORY">Story</option>
                                <option value="IMPACT">Impact Story</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Post title..."
                                className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="What's on your mind?"
                                rows={4}
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                <span className="material-symbols-outlined text-lg">image</span>
                                Photo
                            </button>
                            <button type="button" className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                <span className="material-symbols-outlined text-lg">videocam</span>
                                Video
                            </button>
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl disabled:opacity-50"
                        >
                            {submitting ? "Publishing..." : "Publish Post"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
