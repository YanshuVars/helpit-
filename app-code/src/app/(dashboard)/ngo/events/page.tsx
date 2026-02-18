"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
// Link is used in the list view for event cards

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    maxAttendees: number;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    image?: string;
}

export default function NGOEventsPage() {
    const events: Event[] = [
        {
            id: "e1",
            title: "Food Distribution Drive",
            description: "Monthly food distribution for families in need. Volunteers needed for packing and distribution.",
            date: "Jan 25, 2026",
            time: "9:00 AM - 2:00 PM",
            location: "Community Center, East District",
            attendees: 24,
            maxAttendees: 50,
            status: "upcoming",
        },
        {
            id: "e2",
            title: "Volunteer Training Session",
            description: "Training session on disaster response and first aid basics.",
            date: "Jan 28, 2026",
            time: "10:00 AM - 4:00 PM",
            location: "Hope Foundation HQ",
            attendees: 15,
            maxAttendees: 30,
            status: "upcoming",
        },
        {
            id: "e3",
            title: "Medical Camp",
            description: "Free health checkup camp in collaboration with HealthFirst NGO.",
            date: "Feb 5, 2026",
            time: "8:00 AM - 5:00 PM",
            location: "Village Square, North District",
            attendees: 45,
            maxAttendees: 100,
            status: "upcoming",
        },
    ];

    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const statusColors = {
        upcoming: "bg-blue-100 text-blue-700",
        ongoing: "bg-green-100 text-green-700",
        completed: "bg-gray-100 text-gray-700",
        cancelled: "bg-red-100 text-red-700",
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Events"
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

            {/* View Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${viewMode === "list" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
                >
                    List View
                </button>
                <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${viewMode === "calendar" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
                >
                    Calendar
                </button>
            </div>

            {viewMode === "list" ? (
                /* List View */
                <div className="space-y-4">
                    {events.map((event) => (
                        <Link
                            key={event.id}
                            href={`/ngo/events/${event.id}`}
                            className="block bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            {/* Event Image Placeholder */}
                            <div className="h-32 bg-gradient-to-br from-[var(--primary)]/20 to-blue-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-[var(--primary)]">event</span>
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold">{event.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[event.status]}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                                        {event.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">schedule</span>
                                        {event.time}
                                    </span>
                                </div>

                                {/* Attendees Progress */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--primary)] rounded-full"
                                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {event.attendees}/{event.maxAttendees}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* Calendar View */
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <h3 className="font-bold">January 2026</h3>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                            <div key={i} className="text-xs font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }, (_, i) => {
                            const day = i - 2; // Offset for month start
                            const isCurrentMonth = day >= 1 && day <= 31;
                            const hasEvent = [25, 28].includes(day);
                            return (
                                <button
                                    key={i}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${day === 18 ? "bg-[var(--primary)] text-white" : ""
                                        } ${hasEvent && day !== 18 ? "bg-blue-50" : ""} ${!isCurrentMonth ? "text-gray-300" : ""
                                        }`}
                                >
                                    {isCurrentMonth ? day : ""}
                                    {hasEvent && (
                                        <span className="w-1 h-1 bg-[var(--primary)] rounded-full mt-0.5" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Events on Selected Date */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-semibold text-sm mb-2">Events on Jan 18</h4>
                        <p className="text-sm text-gray-500">No events scheduled</p>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-lg font-bold">Create Event</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Event Title *</label>
                                <input
                                    type="text"
                                    placeholder="Enter event title"
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    placeholder="Event description..."
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Date *</label>
                                    <input
                                        type="date"
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Time *</label>
                                    <input
                                        type="time"
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    placeholder="Event location"
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Max Attendees</label>
                                <input
                                    type="number"
                                    placeholder="Maximum number of attendees"
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Event Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                                    <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                                    <p className="text-sm text-gray-500 mt-2">Tap to upload image</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                            <button className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl">
                                Create Event
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
