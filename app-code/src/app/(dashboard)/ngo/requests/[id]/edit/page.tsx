"use client";

import Link from "next/link";
import { useState, use } from "react";

// Mock request data - in production, this would come from the database
const mockRequest = {
    id: "1",
    title: "Emergency Food Relief",
    description: "We need volunteers to help distribute food packages to families affected by the recent floods in the eastern district. Packages are ready at our warehouse and need to be delivered to approximately 50 families.",
    category: "FOOD",
    urgency: "CRITICAL",
    status: "OPEN",
    location: "Eastern District Community Center, 123 Main Street",
    visibility: "PUBLIC",
    media: [
        { id: "1", type: "image", url: "/placeholder.jpg" }
    ]
};

export default function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [title, setTitle] = useState(mockRequest.title);
    const [description, setDescription] = useState(mockRequest.description);
    const [category, setCategory] = useState(mockRequest.category);
    const [urgency, setUrgency] = useState(mockRequest.urgency);
    const [location, setLocation] = useState(mockRequest.location);
    const [visibility, setVisibility] = useState(mockRequest.visibility);
    const [media, setMedia] = useState(mockRequest.media);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            // In production, redirect to the detail page
            window.history.back();
        }, 1000);
    };

    const handleMediaUpload = () => {
        // In production, this would open a file picker
        const newMedia = {
            id: String(Date.now()),
            type: "image",
            url: "/placeholder.jpg"
        };
        setMedia([...media, newMedia]);
    };

    const removeMedia = (mediaId: string) => {
        setMedia(media.filter(m => m.id !== mediaId));
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href={`/ngo/requests/${id}`} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Edit Request</h1>
            </div>

            {/* Form */}
            <div className="space-y-4">
                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white"
                    >
                        <option value="FOOD">Food</option>
                        <option value="MEDICAL">Medical</option>
                        <option value="DISASTER">Disaster Relief</option>
                        <option value="ANIMAL">Animal Welfare</option>
                        <option value="MISSING_PERSON">Missing Person</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                {/* Urgency Level */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Urgency Level *</label>
                    <div className="grid grid-cols-4 gap-2">
                        {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setUrgency(level)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${urgency === level
                                    ? level === "CRITICAL"
                                        ? "bg-red-500 text-white border-red-500"
                                        : level === "HIGH"
                                            ? "bg-orange-500 text-white border-orange-500"
                                            : level === "MEDIUM"
                                                ? "bg-yellow-500 text-white border-yellow-500"
                                                : "bg-green-500 text-white border-green-500"
                                    : "bg-white border-gray-200 text-gray-600"
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 px-4"
                    />
                    <div className="h-32 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Map preview will appear here</span>
                    </div>
                </div>

                {/* Media Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Photos/Videos</label>

                    {/* Existing Media Grid */}
                    {media.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {media.map((item) => (
                                <div key={item.id} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden group">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                        <span className="material-symbols-outlined text-gray-400">image</span>
                                    </div>
                                    <button
                                        onClick={() => removeMedia(item.id)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        type="button"
                        onClick={handleMediaUpload}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                        <p className="text-sm text-gray-500 mt-2">Tap to upload media</p>
                    </button>
                </div>

                {/* Visibility */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Visibility</label>
                    <div className="flex gap-3">
                        <label className={`flex items-center gap-2 flex-1 p-3 rounded-xl border cursor-pointer transition-all ${visibility === "PUBLIC" ? "border-[var(--primary)] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                            <input
                                type="radio"
                                name="visibility"
                                value="PUBLIC"
                                checked={visibility === "PUBLIC"}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="accent-[var(--primary)]"
                            />
                            <span className="text-sm">Public</span>
                        </label>
                        <label className={`flex items-center gap-2 flex-1 p-3 rounded-xl border cursor-pointer transition-all ${visibility === "INTERNAL" ? "border-[var(--primary)] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                            <input
                                type="radio"
                                name="visibility"
                                value="INTERNAL"
                                checked={visibility === "INTERNAL"}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="accent-[var(--primary)]"
                            />
                            <span className="text-sm">Internal Only</span>
                        </label>
                    </div>
                </div>

                {/* Status - Only admins can change status */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Status</label>
                    <select className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white">
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-24 bg-[var(--background-light)] pt-4 space-y-3">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">sync</span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">save</span>
                            Save Changes
                        </>
                    )}
                </button>
                <Link
                    href={`/ngo/requests/${mockRequest.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
