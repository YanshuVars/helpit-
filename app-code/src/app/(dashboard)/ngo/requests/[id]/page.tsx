"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface RequestDetail {
    id: string;
    title: string;
    description: string;
    category: string;
    urgency: string;
    status: string;
    location: string;
    address: string;
    city: string;
    state: string;
    volunteers_needed: number;
    volunteers_assigned: number;
    estimated_hours: number;
    deadline: string;
    visibility: string;
    created_at: string;
    created_by: string;
}

interface AssignedVolunteer {
    id: string;
    status: string;
    volunteer: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
}

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { ngoId, canWrite, isAdmin, loading: ctxLoading } = useNgoContext();
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [volunteers, setVolunteers] = useState<AssignedVolunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchRequest() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            try {
                const res = await fetch(`/api/ngo/requests/${id}?ngo_id=${ngoId}`);
                const json = await res.json();
                if (!res.ok || !json.data) {
                    console.error("Error fetching request:", json.error);
                    setLoading(false);
                    return;
                }
                setRequest(json.data);
            } catch (err) {
                console.error("Error fetching request:", err);
                setLoading(false);
                return;
            }

            // Fetch assigned volunteers
            const { data: assignments, error: assignError } = await supabase
                .from("volunteer_assignments")
                .select(`
                    id,
                    status,
                    volunteer:users!volunteer_id(id, full_name, avatar_url)
                `)
                .eq("request_id", id);

            if (assignError) {
                console.error("Error fetching assignments:", assignError);
            }

            setVolunteers(
                (assignments || []).map((a: any) => ({
                    id: a.id,
                    status: a.status,
                    volunteer: {
                        id: a.volunteer?.id || "",
                        full_name: a.volunteer?.full_name || "Unknown",
                        avatar_url: a.volunteer?.avatar_url || "",
                    },
                }))
            );
            setLoading(false);
        }
        fetchRequest();
    }, [id, ngoId, ctxLoading]);

    async function handleStatusChange(newStatus: string) {
        if (!canWrite || !request) return;
        setUpdating(true);

        const updateData: Record<string, unknown> = { status: newStatus, ngo_id: ngoId };
        if (newStatus === 'COMPLETED') updateData.completed_at = new Date().toISOString();
        if (newStatus === 'IN_PROGRESS') updateData.started_at = new Date().toISOString();

        try {
            const res = await fetch(`/api/ngo/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            if (!res.ok) {
                const json = await res.json();
                toast.error(`Failed to update status: ${json.error}`);
            } else {
                setRequest({ ...request, status: newStatus });
                toast.success(`Request marked as ${newStatus.replace('_', ' ')}`);
            }
        } catch (err) {
            toast.error('Network error updating status');
        }
        setUpdating(false);
    }

    async function handleDelete() {
        if (!isAdmin || !confirm("Are you sure you want to delete this request? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/ngo/requests/${id}?ngo_id=${ngoId}`, { method: 'DELETE' });
            if (!res.ok) {
                const json = await res.json();
                toast.error(`Failed to delete: ${json.error}`);
            } else {
                toast.success("Request deleted successfully");
                router.push("/ngo/requests");
            }
        } catch (err) {
            toast.error('Network error deleting request');
        }
    }

    const urgencyColor: Record<string, string> = {
        CRITICAL: "#dc2626", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#64748b",
    };

    const statusColor: Record<string, { bg: string; text: string }> = {
        OPEN: { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
        IN_PROGRESS: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
        COMPLETED: { bg: "rgba(16,185,129,0.1)", text: "#059669" },
        CANCELLED: { bg: "rgba(100,116,139,0.1)", text: "#64748b" },
        CLOSED: { bg: "rgba(100,116,139,0.1)", text: "#64748b" },
    };

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    if (!request) {
        return (
            <div style={{ textAlign: "center", padding: 64 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#cbd5e1" }}>search_off</span>
                <p style={{ marginTop: 12, color: "#64748b" }}>Request not found</p>
                <Link href="/ngo/requests" style={{ color: "#1de2d1", fontWeight: 600, textDecoration: "none", fontSize: 13, marginTop: 8, display: "inline-block" }}>← Back to requests</Link>
            </div>
        );
    }

    const sColor = statusColor[request.status] || statusColor.OPEN;

    return (
        <div>
            {/* Breadcrumbs */}
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                <Link href="/ngo" style={{ color: "#94a3b8", textDecoration: "none" }}>Dashboard</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <Link href="/ngo/requests" style={{ color: "#94a3b8", textDecoration: "none" }}>Help Requests</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <span style={{ color: "#0f172a", fontWeight: 500 }}>{request.title}</span>
            </nav>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em", color: "#0f172a" }}>{request.title}</h1>
                        <span style={{
                            padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 800,
                            background: `${urgencyColor[request.urgency] || "#64748b"}1a`,
                            color: urgencyColor[request.urgency] || "#64748b",
                            textTransform: "uppercase", letterSpacing: "0.06em",
                        }}>{request.urgency}</span>
                        <span style={{
                            padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                            background: sColor.bg, color: sColor.text, textTransform: "uppercase",
                        }}>{request.status.replace('_', ' ')}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#64748b" }}>
                        Created {new Date(request.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                </div>
                {canWrite && (
                    <div style={{ display: "flex", gap: 10 }}>
                        <Link href={`/ngo/requests/${id}/edit`} style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "9px 18px", borderRadius: 8,
                            border: "1px solid #e2e8f0", background: "#fff",
                            color: "#475569", fontSize: 13, fontWeight: 700, textDecoration: "none",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                            Edit
                        </Link>
                        {request.status === 'OPEN' && (
                            <button onClick={() => handleStatusChange('IN_PROGRESS')} disabled={updating} style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "9px 18px", borderRadius: 8,
                                background: "#2563eb", color: "#fff",
                                fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
                                Start
                            </button>
                        )}
                        {(request.status === 'OPEN' || request.status === 'IN_PROGRESS') && (
                            <button onClick={() => handleStatusChange('COMPLETED')} disabled={updating} style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "9px 18px", borderRadius: 8,
                                background: "#1de2d1", color: "#0f172a",
                                fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                                Mark Resolved
                            </button>
                        )}
                        {isAdmin && (
                            <button onClick={handleDelete} style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "9px 18px", borderRadius: 8,
                                border: "1px solid #fecaca", background: "#fff",
                                color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                {/* Left: Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Description</h4>
                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{request.description || "No description provided."}</p>
                    </div>

                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Location</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>location_on</span>
                            <span style={{ fontSize: 14, color: "#475569" }}>
                                {[request.location, request.address, request.city, request.state].filter(Boolean).join(', ') || "Location not specified"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Volunteers + Meta */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Assigned Volunteers */}
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Assigned Volunteers ({volunteers.length})
                            </h4>
                            {canWrite && (
                                <Link href={`/ngo/requests/${id}/assign`} style={{ fontSize: 12, fontWeight: 700, color: "#1de2d1", textDecoration: "none" }}>Manage</Link>
                            )}
                        </div>
                        {volunteers.length === 0 ? (
                            <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>group_off</span>
                                <p style={{ fontSize: 12, marginTop: 6 }}>No volunteers assigned yet</p>
                            </div>
                        ) : (
                            <div>
                                {volunteers.map(v => (
                                    <div key={v.id} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f8fafc" }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(29,226,209,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>person</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600 }}>{v.volunteer.full_name}</p>
                                            <p style={{ fontSize: 11, color: "#94a3b8" }}>{v.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info card */}
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Request Details</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>category</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Category</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{request.category}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>groups</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Volunteers</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{request.volunteers_assigned || 0} / {request.volunteers_needed || 0} assigned</p>
                                </div>
                            </div>
                            {request.estimated_hours && (
                                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>schedule</span>
                                    <div>
                                        <p style={{ fontSize: 11, color: "#94a3b8" }}>Estimated Hours</p>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>{request.estimated_hours}h</p>
                                    </div>
                                </div>
                            )}
                            {request.deadline && (
                                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>event</span>
                                    <div>
                                        <p style={{ fontSize: 11, color: "#94a3b8" }}>Deadline</p>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>{new Date(request.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>visibility</span>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Visibility</p>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{request.visibility}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
