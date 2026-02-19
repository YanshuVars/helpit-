"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

interface Event {
    id: string;
    ngo_id: string;
    title: string;
    description: string;
    event_type: string;
    cover_image_url: string | null;
    start_date: string;
    end_date: string;
    start_time: string | null;
    end_time: string | null;
    location_type: string;
    venue_name: string | null;
    city: string | null;
    max_attendees: number | null;
    current_attendees: number;
    status: string;
    visibility: string;
    created_at: string;
}

export default function NGOEventsPage() {
    const supabase = createClient();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        event_type: "VOLUNTEER",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        venue_name: "",
        city: "",
        max_attendees: "",
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            // Get NGO ID for the user
            const { data: ngoData } = await supabase
                .from("ngo_members")
                .select("ngo_id")
                .eq("user_id", user.id)
                .eq("role", "ADMIN")
                .single();

            if (ngoData?.ngo_id) {
                const { data: eventsData, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("ngo_id", ngoData.ngo_id)
                    .order("start_date", { ascending: true });

                if (eventsData) {
                    setEvents(eventsData as Event[]);
                }
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateEvent(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get NGO ID
            const { data: ngoData } = await supabase
                .from("ngo_members")
                .select("ngo_id")
                .eq("user_id", user.id)
                .eq("role", "ADMIN")
                .single();

            if (!ngoData?.ngo_id) {
                alert("You must be an NGO admin to create events");
                return;
            }

            const { error } = await supabase.from("events").insert({
                ngo_id: ngoData.ngo_id,
                created_by: user.id,
                title: formData.title,
                description: formData.description,
                event_type: formData.event_type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                start_time: formData.start_time || null,
                end_time: formData.end_time || null,
                venue_name: formData.venue_name || null,
                city: formData.city || null,
                max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                location_type: "PHYSICAL",
                status: "UPCOMING",
            });

            if (error) throw error;

            setShowCreateModal(false);
            setFormData({
                title: "",
                description: "",
                event_type: "VOLUNTEER",
                start_date: "",
                end_date: "",
                start_time: "",
                end_time: "",
                venue_name: "",
                city: "",
                max_attendees: "",
            });
            fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event");
        } finally {
            setSubmitting(false);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "UPCOMING": return "bg-blue-100 text-blue-700";
            case "ONGOING": return "bg-green-100 text-green-700";
            case "COMPLETED": return "bg-gray-100 text-gray-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const formatEventDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "MMM dd, yyyy");
        } catch {
            return dateStr;
        }
    };

    const formatEventTime = (time: string | null) => {
        if (!time) return "";
        try {
            const [hours, minutes] = time.split(":");
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch {
            return time;
        }
    };

    const getTimeRange = (event: Event) => {
        if (event.start_time && event.end_time) {
            return `${formatEventTime(event.start_time)} - ${formatEventTime(event.end_time)}`;
        } else if (event.start_time) {
            return formatEventTime(event.start_time);
        }
        return "All Day";
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Events" showBack fallbackRoute="/ngo" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

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
                    {events.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-400">event</span>
                            <p className="text-gray-500 mt-2">No events yet</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="mt-4 text-[var(--primary)] font-semibold"
                            >
                                Create your first event
                            </button>
                        </div>
                    ) : (
                        events.map((event) => (
                            <Link
                                key={event.id}
                                href={`/ngo/events/${event.id}`}
                                className="block bg-white rounded-xl border border-gray-200 overflow-hidden"
                            >
                                {/* Event Image Placeholder */}
                                <div className="h-32 bg-gradient-to-br from-[var(--primary)]/20 to-blue-100 flex items-center justify-center">
                                    {event.cover_image_url ? (
                                        <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-4xl text-[var(--primary)]">event</span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold">{event.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {[event.venue_name, event.city].filter(Boolean).join(", ") || "Location TBD"}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                                            {formatEventDate(event.start_date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg">schedule</span>
                                            {getTimeRange(event)}
                                        </span>
                                    </div>

                                    {/* Attendees Progress */}
                                    {event.max_attendees && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[var(--primary)] rounded-full"
                                                    style={{ width: `${Math.min((event.current_attendees / event.max_attendees) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {event.current_attendees}/{event.max_attendees}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            ) : (
                /* Calendar View */
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <h3 className="font-bold">{format(new Date(), "MMMM yyyy")}</h3>
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
                            const today = new Date().getDate();
                            const hasEvent = events.some(e => {
                                const eventDate = new Date(e.start_date);
                                return eventDate.getDate() === day;
                            });
                            return (
                                <button
                                    key={i}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${day === today ? "bg-[var(--primary)] text-white" : ""
                                        } ${hasEvent && day !== today ? "bg-blue-50" : ""} ${!isCurrentMonth ? "text-gray-300" : ""
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
                        <h4 className="font-semibold text-sm mb-2">Events this month</h4>
                        <p className="text-sm text-gray-500">{events.length} event(s)</p>
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
                        <form onSubmit={handleCreateEvent}>
                            <div className="p-4 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Event Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter event title"
                                        required
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Event description..."
                                        rows={3}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Event Type</label>
                                    <select
                                        value={formData.event_type}
                                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white"
                                    >
                                        <option value="VOLUNTEER">Volunteer Activity</option>
                                        <option value="FUNDRAISER">Fundraiser</option>
                                        <option value="AWARENESS">Awareness Campaign</option>
                                        <option value="COMMUNITY">Community Event</option>
                                        <option value="TRAINING">Training Session</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Start Date *</label>
                                        <input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            required
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">End Date *</label>
                                        <input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            required
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Start Time</label>
                                        <input
                                            type="time"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">End Time</label>
                                        <input
                                            type="time"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Venue</label>
                                    <input
                                        type="text"
                                        value={formData.venue_name}
                                        onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                                        placeholder="Event venue"
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="City"
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Max Attendees</label>
                                    <input
                                        type="number"
                                        value={formData.max_attendees}
                                        onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                                        placeholder="Maximum number of attendees"
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl disabled:opacity-50"
                                >
                                    {submitting ? "Creating..." : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
