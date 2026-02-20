"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

const statusColor: Record<string, { bg: string; color: string }> = {
    UPCOMING: { bg: '#E3F2FD', color: '#1565C0' },
    ONGOING: { bg: '#E8F5E9', color: '#2E7D32' },
    COMPLETED: { bg: '#F5F5F5', color: '#616161' },
    CANCELLED: { bg: '#FEE2E2', color: '#DC2626' },
};

export default function NGOEventsPage() {
    const supabase = createClient();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "", description: "", event_type: "VOLUNTEER",
        start_date: "", end_date: "", start_time: "", end_time: "",
        venue_name: "", city: "", max_attendees: "",
    });

    useEffect(() => { fetchEvents(); }, []);

    async function fetchEvents() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const { data: ngoData } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", user.id).eq("role", "ADMIN").single();

            if (ngoData?.ngo_id) {
                const { data: eventsData } = await supabase
                    .from("events").select("*")
                    .eq("ngo_id", ngoData.ngo_id)
                    .order("start_date", { ascending: true });
                if (eventsData) setEvents(eventsData as Event[]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally { setLoading(false); }
    }

    async function handleCreateEvent(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: ngoData } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", user.id).eq("role", "ADMIN").single();

            if (!ngoData?.ngo_id) { alert("You must be an NGO admin to create events"); return; }

            const { error } = await supabase.from("events").insert({
                ngo_id: ngoData.ngo_id, created_by: user.id,
                title: formData.title, description: formData.description,
                event_type: formData.event_type,
                start_date: formData.start_date, end_date: formData.end_date,
                start_time: formData.start_time || null, end_time: formData.end_time || null,
                venue_name: formData.venue_name || null, city: formData.city || null,
                max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
                location_type: "PHYSICAL", status: "UPCOMING",
            });
            if (error) throw error;
            setShowCreateModal(false);
            setFormData({ title: "", description: "", event_type: "VOLUNTEER", start_date: "", end_date: "", start_time: "", end_time: "", venue_name: "", city: "", max_attendees: "" });
            fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event");
        } finally { setSubmitting(false); }
    }

    const formatEventDate = (dateStr: string) => {
        try { return format(new Date(dateStr), "MMM dd, yyyy"); } catch { return dateStr; }
    };

    const formatEventTime = (time: string | null) => {
        if (!time) return "";
        try {
            const [hours, minutes] = time.split(":");
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
            return `${hour % 12 || 12}:${minutes} ${ampm}`;
        } catch { return time; }
    };

    const getTimeRange = (event: Event) => {
        if (event.start_time && event.end_time) return `${formatEventTime(event.start_time)} - ${formatEventTime(event.end_time)}`;
        if (event.start_time) return formatEventTime(event.start_time);
        return "All Day";
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title">Events</h1>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Create
                </button>
            </div>

            {/* View Toggle */}
            <div className="tabs-row">
                <button onClick={() => setViewMode("list")} className={`tab-pill ${viewMode === "list" ? "tab-pill-active" : ""}`}>List View</button>
                <button onClick={() => setViewMode("calendar")} className={`tab-pill ${viewMode === "calendar" ? "tab-pill-active" : ""}`}>Calendar</button>
            </div>

            {viewMode === "list" ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {events.length === 0 ? (
                        <div className="empty-state-container">
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>event</span>
                            <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No events yet</p>
                            <button onClick={() => setShowCreateModal(true)} className="auth-link" style={{ marginTop: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Create your first event</button>
                        </div>
                    ) : (
                        events.map(event => {
                            const sStyle = statusColor[event.status] || { bg: '#F5F5F5', color: '#616161' };
                            return (
                                <Link key={event.id} href={`/ngo/events/${event.id}`} className="card card-interactive" style={{ overflow: 'hidden', textDecoration: 'none', padding: 0 }}>
                                    {/* Cover */}
                                    <div style={{
                                        height: 100, background: 'linear-gradient(135deg, var(--color-primary-soft), #BBDEFB)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {event.cover_image_url ? (
                                            <img src={event.cover_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-primary)' }}>event</span>
                                        )}
                                    </div>
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                            <div>
                                                <h3 style={{ fontWeight: 600, fontSize: 14 }}>{event.title}</h3>
                                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                                    {[event.venue_name, event.city].filter(Boolean).join(", ") || "Location TBD"}
                                                </p>
                                            </div>
                                            <span style={{
                                                fontSize: 10, fontWeight: 700,
                                                padding: '3px 8px', borderRadius: 'var(--radius-full)',
                                                background: sStyle.bg, color: sStyle.color,
                                            }}>{event.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
                                                {formatEventDate(event.start_date)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
                                                {getTimeRange(event)}
                                            </span>
                                        </div>
                                        {event.max_attendees && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ flex: 1, height: 6, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)', width: `${Math.min((event.current_attendees / event.max_attendees) * 100, 100)}%` }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{event.current_attendees}/{event.max_attendees}</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            ) : (
                /* Calendar View */
                <div className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', minHeight: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
                        </button>
                        <h3 style={{ fontWeight: 700, fontSize: 15 }}>{format(new Date(), "MMMM yyyy")}</h3>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', minHeight: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center', marginBottom: 6 }}>
                        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <div key={i} style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', padding: 6 }}>{d}</div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                        {Array.from({ length: 35 }, (_, i) => {
                            const day = i - 2;
                            const isCurrentMonth = day >= 1 && day <= 31;
                            const today = new Date().getDate();
                            const hasEvent = events.some(e => new Date(e.start_date).getDate() === day);
                            return (
                                <button key={i} style={{
                                    aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 'var(--radius-sm)', fontSize: 13, border: 'none', cursor: 'pointer',
                                    background: day === today ? 'var(--color-primary)' : hasEvent && day !== today ? 'var(--color-primary-soft)' : 'transparent',
                                    color: day === today ? '#fff' : !isCurrentMonth ? 'var(--color-text-disabled)' : 'var(--color-text-body)',
                                }}>
                                    {isCurrentMonth ? day : ""}
                                    {hasEvent && <span style={{ width: 4, height: 4, background: day === today ? '#fff' : 'var(--color-primary)', borderRadius: '50%', marginTop: 2 }} />}
                                </button>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)' }}>
                        <h4 style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Events this month</h4>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{events.length} event(s)</p>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <>
                    <div onClick={() => setShowCreateModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'fixed', left: '50%', top: '50%', zIndex: 50,
                        width: '100%', maxWidth: 480, transform: 'translate(-50%, -50%)',
                        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--color-bg-card)', zIndex: 1 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Create Event</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateEvent}>
                            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div className="form-group">
                                    <label className="field-label">Event Title *</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Enter event title" required className="field-input" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Event description..." rows={3} className="field-input field-textarea" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Event Type</label>
                                    <select value={formData.event_type} onChange={e => setFormData({ ...formData, event_type: e.target.value })} className="field-input">
                                        <option value="VOLUNTEER">Volunteer Activity</option>
                                        <option value="FUNDRAISER">Fundraiser</option>
                                        <option value="AWARENESS">Awareness Campaign</option>
                                        <option value="COMMUNITY">Community Event</option>
                                        <option value="TRAINING">Training Session</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div className="form-group">
                                        <label className="field-label">Start Date *</label>
                                        <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required className="field-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">End Date *</label>
                                        <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} required className="field-input" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div className="form-group">
                                        <label className="field-label">Start Time</label>
                                        <input type="time" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} className="field-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">End Time</label>
                                        <input type="time" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} className="field-input" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Venue</label>
                                    <input type="text" value={formData.venue_name} onChange={e => setFormData({ ...formData, venue_name: e.target.value })} placeholder="Event venue" className="field-input" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">City</label>
                                    <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City" className="field-input" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Max Attendees</label>
                                    <input type="number" value={formData.max_attendees} onChange={e => setFormData({ ...formData, max_attendees: e.target.value })} placeholder="Maximum number of attendees" className="field-input" />
                                </div>
                            </div>
                            <div style={{ padding: '14px 18px', borderTop: '1px solid var(--color-border-subtle)', position: 'sticky', bottom: 0, background: 'var(--color-bg-card)' }}>
                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 42, fontSize: 14, fontWeight: 700, opacity: submitting ? 0.5 : 1 }}>
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
