"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface EventDetail {
    id: string;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    category: string;
    status: string;
    max_participants: number;
}

export default function EventDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data } = await supabase.from("events").select("*").eq("id", id).single();
            setEvent(data);
            setLoading(false);
        }
        if (id) load();
    }, [id]);

    if (loading) {
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
        PAST: { bg: "#f1f5f9", text: "#64748b" },
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
                        {event.category || "Event"}
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
                            <span style={{ fontSize: 14, color: "#475569" }}>{event.location || "TBD"}</span>
                        </div>
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
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>groups</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Max Participants</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{event.max_participants || "Unlimited"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={{
                            flex: 1, padding: "10px 0", borderRadius: 8,
                            border: "1px solid #e2e8f0", background: "#fff",
                            fontWeight: 700, fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                            Edit
                        </button>
                        <button style={{
                            flex: 1, padding: "10px 0", borderRadius: 8,
                            background: "#1de2d1", color: "#0f172a",
                            fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
