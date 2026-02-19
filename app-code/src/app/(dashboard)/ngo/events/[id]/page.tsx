"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { eventsApi } from "@/lib/api";
import { format } from "@/lib/utils";

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const supabase = createClient();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userRegistration, setUserRegistration] = useState<any>(null);
    const [registering, setRegistering] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchEvent();
        checkUserRegistration();
    }, [eventId]);

    async function fetchEvent() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);

            const eventData = await eventsApi.getById(eventId);
            setEvent(eventData);
        } catch (error) {
            console.error("Error fetching event:", error);
        } finally {
            setLoading(false);
        }
    }

    async function checkUserRegistration() {
        try {
            const registration = await eventsApi.getUserRegistration(eventId);
            setUserRegistration(registration);
        } catch (error) {
            console.error("Error checking registration:", error);
        }
    }

    async function handleRegister() {
        if (!currentUserId) {
            router.push("/login");
            return;
        }

        setRegistering(true);
        try {
            const registration = await eventsApi.register(eventId);
            setUserRegistration(registration);
            // Refresh event data
            fetchEvent();
        } catch (error) {
            console.error("Error registering:", error);
            alert("Failed to register for event");
        } finally {
            setRegistering(false);
        }
    }

    async function handleCancelRegistration() {
        setRegistering(true);
        try {
            await eventsApi.cancelRegistration(eventId);
            setUserRegistration(null);
            // Refresh event data
            fetchEvent();
        } catch (error) {
            console.error("Error cancelling registration:", error);
            alert("Failed to cancel registration");
        } finally {
            setRegistering(false);
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

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case "FUNDRAISER": return "bg-purple-100 text-purple-700";
            case "VOLUNTEER_DRIVE": return "bg-green-100 text-green-700";
            case "AWARENESS": return "bg-yellow-100 text-yellow-700";
            case "COMMUNITY": return "bg-blue-100 text-blue-700";
            case "TRAINING": return "bg-orange-100 text-orange-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Event Details" showBack fallbackRoute="/ngo/events" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="space-y-6">
                <PageHeader title="Event Details" showBack fallbackRoute="/ngo/events" />
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">event_busy</span>
                    <p className="text-gray-500 mt-2">Event not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Event Details"
                showBack
                fallbackRoute="/ngo/events"
            />

            {/* Event Cover Image */}
            {event.cover_image_url && (
                <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden">
                    <img
                        src={event.cover_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Event Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getEventTypeColor(event.event_type)}`}>
                            {event.event_type.replace("_", " ")}
                        </span>
                        <h1 className="text-2xl font-bold mt-2">{event.title}</h1>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                    </span>
                </div>

                {/* NGO */}
                {event.ngo && (
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white font-bold overflow-hidden">
                            {event.ngo.logo_url ? (
                                <img src={event.ngo.logo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                event.ngo.name?.charAt(0)
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{event.ngo.name}</p>
                            <p className="text-xs text-gray-500">Organizer</p>
                        </div>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div className="mb-6">
                        <h2 className="font-semibold mb-2">About this event</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600">calendar_today</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {format(new Date(event.start_date), "MMMM d, yyyy")}
                                {event.start_date !== event.end_date && (
                                    <> - {format(new Date(event.end_date), "MMMM d, yyyy")}</>
                                )}
                            </p>
                            <p className="text-xs text-gray-500">Date</p>
                        </div>
                    </div>

                    {(event.start_time || event.end_time) && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600">schedule</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {event.start_time && format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                                    {event.end_time && <> - {format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}</>}
                                </p>
                                <p className="text-xs text-gray-500">Time</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">
                            {event.location_type === "VIRTUAL" ? "videocam" : "location_on"}
                        </span>
                    </div>
                    <div>
                        {event.location_type === "VIRTUAL" ? (
                            <>
                                <p className="text-sm font-medium">Virtual Event</p>
                                <p className="text-xs text-gray-500">Online</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium">{event.venue_name || event.address || "Location TBA"}</p>
                                <p className="text-xs text-gray-500">
                                    {[event.city, event.state].filter(Boolean).join(", ")}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-600">groups</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {event.current_attendees} / {event.max_attendees || "∞"} registered
                        </p>
                        <p className="text-xs text-gray-500">Attendees</p>
                    </div>
                </div>

                {/* Registration Deadline */}
                {event.registration_deadline && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600">alarm</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Register by {format(new Date(event.registration_deadline), "MMMM d, yyyy")}
                            </p>
                            <p className="text-xs text-gray-500">Registration Deadline</p>
                        </div>
                    </div>
                )}

                {/* Virtual Link */}
                {event.location_type === "VIRTUAL" && event.virtual_link && (
                    <div className="mb-6">
                        <a
                            href={event.virtual_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                        >
                            <span className="material-symbols-outlined">videocam</span>
                            Join Virtual Event
                        </a>
                    </div>
                )}

                {/* Registration Button */}
                {event.status !== "CANCELLED" && event.status !== "COMPLETED" && (
                    <div className="border-t border-gray-100 pt-6">
                        {userRegistration ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-green-600">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <span className="font-medium">You are registered!</span>
                                </div>
                                {userRegistration.status === "REGISTERED" && (
                                    <button
                                        onClick={handleCancelRegistration}
                                        disabled={registering}
                                        className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {registering ? "Cancelling..." : "Cancel Registration"}
                                    </button>
                                )}
                                {userRegistration.status === "ATTENDED" && (
                                    <p className="text-center text-gray-500 text-sm">
                                        You attended this event
                                    </p>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleRegister}
                                disabled={registering}
                                className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                                {registering ? "Registering..." : "Register for Event"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
