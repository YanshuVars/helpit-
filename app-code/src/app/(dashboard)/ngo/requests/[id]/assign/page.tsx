"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface RequestInfo {
    title: string;
    volunteers_needed: number;
    volunteers_assigned: number;
}

interface VolunteerRow {
    id: string;
    full_name: string;
    email: string;
    skills: string[];
    avatar_url: string;
    availability: boolean;
    last_active_at: string | null;
    assignmentId: string | null;  // null = not assigned
    assignmentStatus: string | null;
}

export default function AssignVolunteersPage() {
    const params = useParams();
    const requestId = params.id as string;
    const { ngoId, userId, canWrite, loading: ctxLoading } = useNgoContext();
    const [request, setRequest] = useState<RequestInfo | null>(null);
    const [volunteers, setVolunteers] = useState<VolunteerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            // Fetch request info
            const { data: reqData, error: reqError } = await supabase
                .from("help_requests")
                .select("title, volunteers_needed, volunteers_assigned")
                .eq("id", requestId)
                .eq("ngo_id", ngoId)
                .single();

            if (reqError || !reqData) {
                console.error("Error loading request:", reqError);
                setLoading(false);
                return;
            }
            setRequest(reqData);

            // Fetch existing assignments for this request
            const { data: assignments } = await supabase
                .from("volunteer_assignments")
                .select("id, volunteer_id, status")
                .eq("request_id", requestId);

            const assignmentMap = new Map<string, { id: string; status: string }>();
            (assignments || []).forEach((a: any) => {
                assignmentMap.set(a.volunteer_id, { id: a.id, status: a.status });
            });

            // Fetch all volunteers (users with VOLUNTEER role)
            const { data: vols, error: volError } = await supabase
                .from("users")
                .select("id, full_name, email, skills, avatar_url, availability, last_active_at")
                .eq("role", "VOLUNTEER")
                .order("full_name")
                .limit(50);

            if (volError) {
                console.error("Error loading volunteers:", volError);
            }

            setVolunteers(
                (vols || []).map((v: any) => ({
                    id: v.id,
                    full_name: v.full_name || "Unknown",
                    email: v.email || "",
                    skills: v.skills || [],
                    avatar_url: v.avatar_url || "",
                    availability: v.availability || false,
                    last_active_at: v.last_active_at,
                    assignmentId: assignmentMap.get(v.id)?.id || null,
                    assignmentStatus: assignmentMap.get(v.id)?.status || null,
                }))
            );
            setLoading(false);
        }
        load();
    }, [requestId, ngoId, ctxLoading]);

    async function handleAssign(volunteerId: string) {
        if (!canWrite || !userId) return;
        setActionLoading(volunteerId);
        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("volunteer_assignments")
                .insert({
                    request_id: requestId,
                    volunteer_id: volunteerId,
                    assigned_by: userId,
                    status: "PENDING",
                })
                .select("id")
                .single();

            if (error) {
                if (error.code === '23505') {
                    toast.error("This volunteer is already assigned to this request.");
                } else {
                    toast.error(`Failed to assign: ${error.message}`);
                }
                return;
            }

            // Update local state
            setVolunteers(prev => prev.map(v =>
                v.id === volunteerId ? { ...v, assignmentId: data.id, assignmentStatus: "PENDING" } : v
            ));

            // Increment volunteers_assigned on the request
            await supabase
                .from("help_requests")
                .update({ volunteers_assigned: (request?.volunteers_assigned || 0) + 1 })
                .eq("id", requestId);

            setRequest(prev => prev ? { ...prev, volunteers_assigned: prev.volunteers_assigned + 1 } : prev);
            toast.success("Volunteer assigned successfully!");
        } catch (err) {
            console.error("Error assigning:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleUnassign(volunteerId: string, assignmentId: string) {
        if (!canWrite) return;
        setActionLoading(volunteerId);
        try {
            const supabase = createClient();

            const { error } = await supabase
                .from("volunteer_assignments")
                .delete()
                .eq("id", assignmentId);

            if (error) {
                toast.error(`Failed to remove: ${error.message}`);
                return;
            }

            setVolunteers(prev => prev.map(v =>
                v.id === volunteerId ? { ...v, assignmentId: null, assignmentStatus: null } : v
            ));

            await supabase
                .from("help_requests")
                .update({ volunteers_assigned: Math.max(0, (request?.volunteers_assigned || 1) - 1) })
                .eq("id", requestId);

            setRequest(prev => prev ? { ...prev, volunteers_assigned: Math.max(0, prev.volunteers_assigned - 1) } : prev);
            toast.success("Volunteer removed from assignment.");
        } catch (err) {
            console.error("Error unassigning:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setActionLoading(null);
        }
    }

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
            </div>
        );
    }

    const assigned = volunteers.filter(v => v.assignmentId);
    const available = volunteers.filter(v => !v.assignmentId);

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
    };

    const isRecentlyActive = (d: string | null) => {
        if (!d) return false;
        return Date.now() - new Date(d).getTime() < 30 * 60 * 1000; // 30 min
    };

    return (
        <div>
            {/* Back */}
            <Link href={`/ngo/requests/${requestId}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#1de2d1", fontSize: 13, fontWeight: 600,
                textDecoration: "none", marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                Back to request
            </Link>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>Assign Volunteers</h2>
                <p style={{ color: "#64748b", fontSize: 14 }}>
                    {request.title} — {request.volunteers_assigned}/{request.volunteers_needed} assigned
                </p>
            </div>

            {/* Assigned section */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>how_to_reg</span>
                    Currently Assigned ({assigned.length})
                </h3>
                {assigned.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                        <p style={{ color: "#94a3b8", fontSize: 13 }}>No volunteers assigned yet</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {assigned.map(v => (
                            <div key={v.id} style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                                background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                            }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: "50%",
                                    background: "rgba(29,226,209,0.1)", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 700, color: "#1de2d1",
                                }}>{getInitials(v.full_name)}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600 }}>{v.full_name}</p>
                                    <p style={{ fontSize: 12, color: "#64748b" }}>{v.email}</p>
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                                    background: "rgba(16,185,129,0.08)", color: "#059669",
                                    textTransform: "uppercase",
                                }}>{v.assignmentStatus}</span>
                                {canWrite && (
                                    <button
                                        onClick={() => handleUnassign(v.id, v.assignmentId!)}
                                        disabled={actionLoading === v.id}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 4,
                                            padding: "6px 14px", borderRadius: 8,
                                            border: "1px solid #fecaca", background: "#fff",
                                            color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                        }}
                                    >
                                        {actionLoading === v.id ? (
                                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person_remove</span>
                                        )}
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available section */}
            <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#64748b" }}>group</span>
                    Available Volunteers ({available.length})
                </h3>
                {available.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                        <p style={{ color: "#94a3b8", fontSize: 13 }}>No more volunteers available</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {available.map(v => {
                            const active = isRecentlyActive(v.last_active_at);
                            return (
                                <div key={v.id} style={{
                                    display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                                    background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                                }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: "50%",
                                        background: "rgba(100,116,139,0.1)", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontSize: 14, fontWeight: 700, color: "#64748b",
                                        position: "relative",
                                    }}>
                                        {getInitials(v.full_name)}
                                        <span style={{
                                            position: "absolute", bottom: 0, right: 0,
                                            width: 10, height: 10, borderRadius: "50%",
                                            border: "2px solid #fff",
                                            background: active ? "#10b981" : "#94a3b8",
                                        }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600 }}>{v.full_name}</p>
                                        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                                            {(v.skills || []).slice(0, 3).map((s, i) => (
                                                <span key={i} style={{
                                                    fontSize: 10, fontWeight: 600, color: "#1de2d1",
                                                    padding: "1px 8px", borderRadius: 20, border: "1px solid #1de2d1",
                                                }}>{s}</span>
                                            ))}
                                            {v.availability && (
                                                <span style={{ fontSize: 10, fontWeight: 600, color: "#059669", padding: "1px 8px", borderRadius: 20, background: "rgba(16,185,129,0.1)" }}>Available</span>
                                            )}
                                        </div>
                                    </div>
                                    {canWrite && (
                                        <button
                                            onClick={() => handleAssign(v.id)}
                                            disabled={actionLoading === v.id}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 4,
                                                padding: "6px 14px", borderRadius: 8,
                                                background: "#1de2d1", color: "#0f172a",
                                                fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                                            }}
                                        >
                                            {actionLoading === v.id ? (
                                                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person_add</span>
                                            )}
                                            Assign
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
