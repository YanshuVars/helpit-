"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Event {
    id: string;
    title: string;
    location: string;
    start_date: string;
    category: string;
    status: string;
    attendees: number;
    max_participants: number;
}

const statusBadge: Record<string, { bg: string; text: string; border: string }> = {
    UPCOMING: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
    ONGOING: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
    PAST: { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" },
    PLANNING: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
};

export default function EventsListPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [tab, setTab] = useState("Upcoming");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: membership } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", session.user.id).single();
            if (!membership) { setLoading(false); return; }

            const { data } = await supabase
                .from("events")
                .select("id, title, location, start_date, category, status, max_participants")
                .eq("ngo_id", membership.ngo_id)
                .order("start_date", { ascending: false })
                .limit(20);

            setEvents((data || []).map((e: any) => ({
                ...e,
                attendees: Math.floor(Math.random() * (e.max_participants || 200)),
            })));
            setLoading(false);
        }
        load();
    }, []);

    const tabs = ["Upcoming", "Ongoing", "Past"];
    const bannerColors = ["#e2f3f0", "#dbeafe", "#fef3c7", "#fce7f3"];

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Events</h1>
                    <p style={{ color: "#64748b", fontSize: 15, marginTop: 4 }}>Manage your upcoming activities and fundraisers.</p>
                </div>
                <button style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#1de2d1", color: "#0f172a",
                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Create Event
                </button>
            </header>

            {/* Tabs */}
            <div style={{ borderBottom: "2px solid #f1f5f9", marginBottom: 28, display: "flex", gap: 40 }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        paddingBottom: 12, fontSize: 13, fontWeight: tab === t ? 700 : 500,
                        color: tab === t ? "#0f172a" : "#94a3b8",
                        borderBottom: tab === t ? "3px solid #1de2d1" : "3px solid transparent",
                        background: "none", border: "none", cursor: "pointer",
                        marginBottom: -2,
                    }}>{t}</button>
                ))}
            </div>

            {/* Event Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {events.map((ev, i) => {
                    const badge = statusBadge[ev.status] || statusBadge.UPCOMING;
                    return (
                        <Link key={ev.id} href={`/ngo/events/${ev.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <div style={{
                                background: "#fff", borderRadius: 12,
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                overflow: "hidden", display: "flex", flexDirection: "column",
                                transition: "box-shadow 200ms",
                            }}>
                                {/* Banner */}
                                <div style={{
                                    height: 140, background: bannerColors[i % bannerColors.length],
                                    position: "relative",
                                    backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                                }}>
                                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: "3px 10px",
                                            borderRadius: 20, background: badge.bg, color: badge.text,
                                            border: `1px solid ${badge.border}`,
                                        }}>{ev.status}</span>
                                    </div>
                                    <div style={{ position: "absolute", bottom: 12, left: 16, color: "#fff" }}>
                                        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9 }}>
                                            {ev.category || "Community"}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{ev.title}</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
                                            {new Date(ev.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                                            {ev.location || "TBD"}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={{
                                        marginTop: "auto", paddingTop: 14, borderTop: "1px solid #f1f5f9",
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                    }}>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                                            {ev.attendees}/{ev.max_participants || 200} Reg.
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1de2d1" }}>Manage</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* Create New Event card */}
                <div style={{
                    borderRadius: 12, border: "2px dashed #e2e8f0",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    minHeight: 350, cursor: "pointer",
                    transition: "border-color 200ms",
                }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: "rgba(29,226,209,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 14,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#1de2d1" }}>add</span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Create New Event</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", maxWidth: 200 }}>
                        Start planning your next campaign or meeting.
                    </p>
                </div>
            </div>
        </div>
    );
}
