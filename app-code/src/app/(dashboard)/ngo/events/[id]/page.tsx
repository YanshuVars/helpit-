"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { eventsApi } from "@/lib/api";
import { format } from "@/lib/utils";

const statusColor: Record<string, { bg: string; color: string }> = {
    UPCOMING: { bg: '#E3F2FD', color: '#1565C0' },
    ONGOING: { bg: '#E8F5E9', color: '#2E7D32' },
    COMPLETED: { bg: '#F5F5F5', color: '#616161' },
    CANCELLED: { bg: '#FEE2E2', color: '#DC2626' },
};

const eventTypeColor: Record<string, { bg: string; color: string }> = {
    FUNDRAISER: { bg: '#EDE7F6', color: '#4527A0' },
    VOLUNTEER_DRIVE: { bg: '#E8F5E9', color: '#2E7D32' },
    AWARENESS: { bg: '#FFF8E1', color: '#F57F17' },
    COMMUNITY: { bg: '#E3F2FD', color: '#1565C0' },
    TRAINING: { bg: '#FFF3E0', color: '#E65100' },
    VOLUNTEER: { bg: '#E8F5E9', color: '#2E7D32' },
};

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
        } finally { setLoading(false); }
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
        if (!currentUserId) { router.push("/login"); return; }
        setRegistering(true);
        try {
            const registration = await eventsApi.register(eventId);
            setUserRegistration(registration);
            fetchEvent();
        } catch (error) {
            console.error("Error registering:", error);
            alert("Failed to register for event");
        } finally { setRegistering(false); }
    }

    async function handleCancelRegistration() {
        setRegistering(true);
        try {
            await eventsApi.cancelRegistration(eventId);
            setUserRegistration(null);
            fetchEvent();
        } catch (error) {
            console.error("Error cancelling registration:", error);
            alert("Failed to cancel registration");
        } finally { setRegistering(false); }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    if (!event) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Link href="/ngo/events" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to events
                </Link>
                <div className="empty-state-container">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>event_busy</span>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Event not found</p>
                </div>
            </div>
        );
    }

    const sStyle = statusColor[event.status] || { bg: '#F5F5F5', color: '#616161' };
    const tStyle = eventTypeColor[event.event_type] || { bg: '#F5F5F5', color: '#616161' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <Link href="/ngo/events" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to events
                </Link>
            </div>

            {/* Cover Image */}
            {event.cover_image_url && (
                <div style={{ width: '100%', height: 180, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={event.cover_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            {/* Main Info Card */}
            <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                    <div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: tStyle.bg, color: tStyle.color }}>
                            {event.event_type.replace("_", " ")}
                        </span>
                        <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{event.title}</h1>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: sStyle.bg, color: sStyle.color, flexShrink: 0 }}>
                        {event.status}
                    </span>
                </div>

                {/* NGO Info */}
                {event.ngo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: 14, overflow: 'hidden',
                        }}>
                            {event.ngo.logo_url
                                ? <img src={event.ngo.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : event.ngo.name?.charAt(0)
                            }
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 13 }}>{event.ngo.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Organizer</p>
                        </div>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div style={{ marginBottom: 18 }}>
                        <h2 style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>About this event</h2>
                        <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{event.description}</p>
                    </div>
                )}

                {/* Detail Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: '#1565C0', fontSize: 18 }}>calendar_today</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 500 }}>
                                {format(new Date(event.start_date), "MMMM d, yyyy")}
                                {event.start_date !== event.end_date && <> — {format(new Date(event.end_date), "MMMM d, yyyy")}</>}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Date</p>
                        </div>
                    </div>

                    {/* Time */}
                    {(event.start_time || event.end_time) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#EDE7F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#4527A0', fontSize: 18 }}>schedule</span>
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 500 }}>
                                    {event.start_time && format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                                    {event.end_time && <> — {format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}</>}
                                </p>
                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Time</p>
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: '#2E7D32', fontSize: 18 }}>
                                {event.location_type === "VIRTUAL" ? "videocam" : "location_on"}
                            </span>
                        </div>
                        <div>
                            {event.location_type === "VIRTUAL" ? (
                                <>
                                    <p style={{ fontSize: 13, fontWeight: 500 }}>Virtual Event</p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Online</p>
                                </>
                            ) : (
                                <>
                                    <p style={{ fontSize: 13, fontWeight: 500 }}>{event.venue_name || event.address || "Location TBA"}</p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{[event.city, event.state].filter(Boolean).join(", ")}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Capacity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: '#E65100', fontSize: 18 }}>groups</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 500 }}>{event.current_attendees} / {event.max_attendees || "∞"} registered</p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Attendees</p>
                        </div>
                    </div>

                    {/* Registration Deadline */}
                    {event.registration_deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#DC2626', fontSize: 18 }}>alarm</span>
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 500 }}>Register by {format(new Date(event.registration_deadline), "MMMM d, yyyy")}</p>
                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Registration Deadline</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Virtual Link */}
                {event.location_type === "VIRTUAL" && event.virtual_link && (
                    <a
                        href={event.virtual_link} target="_blank" rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', gap: 8, marginTop: 18, height: 44, textDecoration: 'none' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>videocam</span>
                        Join Virtual Event
                    </a>
                )}

                {/* Registration Button */}
                {event.status !== "CANCELLED" && event.status !== "COMPLETED" && (
                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 18, marginTop: 18 }}>
                        {userRegistration ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>You are registered!</span>
                                </div>
                                {userRegistration.status === "REGISTERED" && (
                                    <button
                                        onClick={handleCancelRegistration}
                                        disabled={registering}
                                        style={{
                                            width: '100%', padding: '10px 0', borderRadius: 'var(--radius-md)',
                                            border: '2px solid #FEE2E2', background: 'none',
                                            color: '#DC2626', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                                            opacity: registering ? 0.5 : 1,
                                        }}
                                    >
                                        {registering ? "Cancelling..." : "Cancel Registration"}
                                    </button>
                                )}
                                {userRegistration.status === "ATTENDED" && (
                                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>You attended this event</p>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleRegister}
                                disabled={registering}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, fontWeight: 700, opacity: registering ? 0.5 : 1 }}
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
