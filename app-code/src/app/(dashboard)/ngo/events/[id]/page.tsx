"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface EventDetail {
    id: string;
    title: string;
    description: string;
    event_type: string;
    location: string;
    venue_name: string;
    address: string;
    city: string;
    state: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
    max_attendees: number;
    current_attendees: number;
    visibility: string;
    location_type: string;
    virtual_link: string;
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { ngoId, canWrite, isAdmin, loading: ctxLoading } = useNgoContext();
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            const supabase = createClient();
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("id", id)
                .single();

            if (error) console.error("Error fetching event:", error);
            setEvent(data);
            setLoading(false);
        }
        if (id) load();
    }, [id, ctxLoading]);

    async function handleDelete() {
        if (!isAdmin || !confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
        setDeleting(true);
        const supabase = createClient();
        const { error } = await supabase.from("events").delete().eq("id", id);
        if (error) {
            toast.error(`Failed to delete event: ${error.message}`);
            setDeleting(false);
        } else {
            toast.success("Event deleted successfully.");
            router.push("/ngo/events");
        }
    }

    async function handleStatusChange(newStatus: string) {
        if (!canWrite || !event) return;
        const supabase = createClient();
        const { error } = await supabase
            .from("events")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) {
            toast.error(`Failed to update status: ${error.message}`);
        } else {
            setEvent({ ...event, status: newStatus });
            toast.success(`Event marked as ${newStatus}`);
        }
    }

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    if (!event) {
        return (
            <div style={{ textAlign: "center", padding: 64 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#cbd5e1" }}>event_busy</span>
                <p style={{ marginTop: 12, color: "#64748b" }}>Event not found</p>
                <Link href="/ngo/events" style={{ color: "#1de2d1", fontWeight: 600, fontSize: 13, textDecoration: "none", marginTop: 8, display: "inline-block" }}>← Back to events</Link>
            </div>
        );
    }

    const badgeColor: Record<string, { bg: string; text: string }> = {
        UPCOMING: { bg: "#dcfce7", text: "#166534" },
        ONGOING: { bg: "#dbeafe", text: "#1e40af" },
        COMPLETED: { bg: "#f1f5f9", text: "#64748b" },
        CANCELLED: { bg: "#fef3c7", text: "#92400e" },
    };
    const bc = badgeColor[event.status] || badgeColor.UPCOMING;

    return (
        <div>
            {/* Breadcrumbs */}
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                <Link href="/ngo" style={{ color: "#94a3b8", textDecoration: "none" }}>Dashboard</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <Link href="/ngo/events" style={{ color: "#94a3b8", textDecoration: "none" }}>Events</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <span style={{ color: "#0f172a", fontWeight: 500 }}>{event.title}</span>
            </nav>

            {/* Hero Banner */}
            <div style={{
                height: 200, borderRadius: 16, marginBottom: 24,
                background: "linear-gradient(135deg, #1de2d1 0%, #0f766e 100%)",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "flex-end", padding: 24,
            }}>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <span style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                        background: bc.bg, color: bc.text,
                    }}>{event.status}</span>
                </div>
                <div style={{ color: "#fff" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, opacity: 0.8 }}>
                        {event.event_type?.replace('_', ' ') || "Event"}
                    </p>
                    <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>{event.title}</h1>
                </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Description */}
                    <div style={{
                        background: "#fff", borderRadius: 12, padding: 20,
                        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>About This Event</h3>
                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                            {event.description || "A community event organized for positive impact. More details to follow."}
                        </p>
                    </div>

                    {/* Location */}
                    <div style={{
                        background: "#fff", borderRadius: 12, padding: 20,
                        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Venue</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>location_on</span>
                            <span style={{ fontSize: 14, color: "#475569" }}>
                                {[event.venue_name, event.address, event.city, event.state].filter(Boolean).join(', ') || event.location || "TBD"}
                            </span>
                        </div>
                        {event.location_type === 'VIRTUAL' && event.virtual_link && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#2563eb" }}>videocam</span>
                                <a href={event.virtual_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
                                    Join Virtual Meeting
                                </a>
                            </div>
                        )}
                        <div style={{
                            marginTop: 14, height: 160, borderRadius: 8,
                            background: "#f1f5f9", border: "1px solid #e2e8f0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#cbd5e1" }}>map</span>
                        </div>
                    </div>
                </div>

                {/* Right: info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{
                        background: "#fff", borderRadius: 12, padding: 20,
                        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Event Info</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>calendar_today</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Start Date</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>
                                        {new Date(event.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        {event.start_time && ` at ${event.start_time}`}
                                    </p>
                                </div>
                            </div>
                            {event.end_date && (
                                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>event_available</span>
                                    <div>
                                        <p style={{ fontSize: 11, color: "#94a3b8" }}>End Date</p>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>
                                            {new Date(event.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            {event.end_time && ` at ${event.end_time}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>groups</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Attendees</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{event.current_attendees || 0} / {event.max_attendees || "Unlimited"}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>visibility</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Visibility</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{event.visibility || "PUBLIC"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {canWrite && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", gap: 10 }}>
                                <Link href={`/ngo/events/${id}/edit`} style={{
                                    flex: 1, padding: "10px 0", borderRadius: 8,
                                    border: "1px solid #e2e8f0", background: "#fff",
                                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                    textDecoration: "none", color: "#475569",
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                                    Edit
                                </Link>
                                {event.status === 'UPCOMING' && (
                                    <button onClick={() => handleStatusChange('ONGOING')} style={{
                                        flex: 1, padding: "10px 0", borderRadius: 8,
                                        background: "#1de2d1", color: "#0f172a",
                                        fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
                                        Start
                                    </button>
                                )}
                            </div>
                            {(event.status === 'UPCOMING' || event.status === 'ONGOING') && (
                                <button onClick={() => handleStatusChange('COMPLETED')} style={{
                                    width: "100%", padding: "10px 0", borderRadius: 8,
                                    background: "#059669", color: "#fff",
                                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                                    Mark Completed
                                </button>
                            )}
                            {isAdmin && (
                                <button onClick={handleDelete} disabled={deleting} style={{
                                    width: "100%", padding: "10px 0", borderRadius: 8,
                                    border: "1px solid #fecaca", background: "#fff",
                                    color: "#dc2626", fontWeight: 700, fontSize: 13, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                                    {deleting ? "Deleting..." : "Delete Event"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
