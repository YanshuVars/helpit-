"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateRequestPage() {
    const [urgency, setUrgency] = useState("MEDIUM");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/ngo/requests" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Create Help Request</h1>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Title *</label>
                    <input
                        type="text"
                        placeholder="Brief title for the request"
                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea
                        placeholder="Detailed description of the help needed..."
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white">
                        <option value="">Select category</option>
                        <option value="FOOD">Food</option>
                        <option value="MEDICAL">Medical</option>
                        <option value="DISASTER">Disaster Relief</option>
                        <option value="ANIMAL">Animal Welfare</option>
                        <option value="MISSING_PERSON">Missing Person</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

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

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                        type="text"
                        placeholder="Address or location description"
                        className="w-full h-12 rounded-xl border border-gray-200 px-4"
                    />
                    <div className="h-32 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Map preview will appear here</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Add Photos/Videos</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                        <p className="text-sm text-gray-500 mt-2">Tap to upload media</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Visibility</label>
                    <div className="flex gap-3">
                        <label className="flex items-center gap-2 flex-1 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="visibility" value="PUBLIC" defaultChecked className="accent-[var(--primary)]" />
                            <span className="text-sm">Public</span>
                        </label>
                        <label className="flex items-center gap-2 flex-1 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="visibility" value="INTERNAL" className="accent-[var(--primary)]" />
                            <span className="text-sm">Internal Only</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-24 bg-[var(--background-light)] pt-4">
                <button className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform">
                    Create Request
                </button>
            </div>
        </div>
    );
}
