"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface VolunteerRow {
    id: string;
    name: string;
    email: string;
    skills: string[];
    online: boolean;
    assigned: boolean;
}

export default function AssignVolunteersPage() {
    const params = useParams();
    const id = params.id as string;
    const [requestTitle, setRequestTitle] = useState("");
    const [volunteers, setVolunteers] = useState<VolunteerRow[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: req } = await supabase.from("requests").select("title").eq("id", id).single();
            if (req) setRequestTitle(req.title);

            // Load all volunteers with assignment status
            const { data: allProfiles } = await supabase.from("profiles").select("id, full_name, email, skills").limit(20);
            const { data: assigned } = await supabase.from("request_volunteers").select("volunteer_id").eq("request_id", id);
            const assignedIds = new Set((assigned || []).map((a: any) => a.volunteer_id));

            setVolunteers(
                (allProfiles || []).map((p: any) => ({
                    id: p.id,
                    name: p.full_name || "Unknown",
                    email: p.email || "",
                    skills: p.skills || [],
                    online: Math.random() > 0.3,
                    assigned: assignedIds.has(p.id),
                }))
            );
            setLoading(false);
        }
        if (id) load();
    }, [id]);

    const assignedVols = volunteers.filter(v => v.assigned);
    const availableVols = volunteers.filter(v =>
        !v.assigned && (!searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: 6 }}>
                        {requestTitle || "Assign Volunteers"}
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 15 }}>Assign and manage specialized volunteers for this high-priority response.</p>
                </div>
                <Link href={`/ngo/requests/${id}`} style={{
                    padding: "9px 20px", borderRadius: 8,
                    border: "2px solid #e2e8f0", background: "#fff",
                    color: "#475569", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
                }}>View Request Details</Link>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 32, position: "relative" }}>
                <span className="material-symbols-outlined" style={{
                    position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                    color: "#1de2d1", fontSize: 24,
                }}>person_search</span>
                <input
                    type="text"
                    placeholder="Search volunteers by name, skill, or availability..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%", height: 56, paddingLeft: 52, paddingRight: 20,
                        borderRadius: 12, border: "2px solid #f1f5f9", background: "#fff",
                        fontSize: 15, outline: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                />
            </div>

            {/* Currently Assigned */}
            <section style={{ marginBottom: 40 }}>
                <h3 style={{
                    fontSize: 12, fontWeight: 900, textTransform: "uppercase",
                    letterSpacing: "0.2em", color: "#94a3b8", marginBottom: 16,
                }}>Currently Assigned ({assignedVols.length})</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {assignedVols.length === 0 ? (
                        <div style={{
                            padding: 20, background: "#f8fafc", borderRadius: 12,
                            border: "1px dashed #e2e8f0", width: "100%", textAlign: "center",
                            color: "#94a3b8", fontSize: 13,
                        }}>No volunteers assigned yet</div>
                    ) : (
                        assignedVols.map(v => (
                            <div key={v.id} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: "#fff", padding: 12, borderRadius: 12,
                                border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                minWidth: 280, flex: "1",
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 8,
                                    background: "rgba(29,226,209,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#1de2d1" }}>person</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700 }}>{v.name}</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                                        {(v.skills || []).slice(0, 2).map((s, i) => (
                                            <span key={i} style={{
                                                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                                padding: "2px 6px", borderRadius: 4,
                                                background: "rgba(29,226,209,0.1)", color: "#0f766e",
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <button style={{
                                    padding: 6, background: "none", border: "none", cursor: "pointer",
                                    color: "#94a3b8",
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person_remove</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Available Volunteers */}
            <section>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{
                        fontSize: 12, fontWeight: 900, textTransform: "uppercase",
                        letterSpacing: "0.2em", color: "#94a3b8",
                    }}>Available Volunteers ({availableVols.length})</h3>
                    <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ padding: 6, border: "1px solid #e2e8f0", borderRadius: 4, background: "#fff", cursor: "pointer" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#64748b" }}>filter_list</span>
                        </button>
                        <button style={{ padding: 6, border: "1px solid #e2e8f0", borderRadius: 4, background: "#fff", cursor: "pointer" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#64748b" }}>sort</span>
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {availableVols.map(v => (
                        <div key={v.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            background: "#fff", padding: 14, borderRadius: 12,
                            border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            transition: "border-color 200ms",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                                <div style={{ position: "relative" }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: "50%", background: "#f1f5f9",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#64748b" }}>person</span>
                                    </div>
                                    <div style={{
                                        position: "absolute", bottom: 0, right: 0,
                                        width: 10, height: 10, borderRadius: "50%",
                                        background: v.online ? "#22c55e" : "#cbd5e1",
                                        border: "2px solid #fff",
                                    }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", flex: 1, alignItems: "center" }}>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 700 }}>{v.name}</p>
                                        <p style={{ fontSize: 11, color: "#94a3b8" }}>{v.email}</p>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {(v.skills || []).slice(0, 2).map((s, i) => (
                                            <span key={i} style={{
                                                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                                padding: "2px 6px", borderRadius: 4,
                                                background: "#f1f5f9", color: "#64748b",
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                    <div style={{ textAlign: "right", paddingRight: 16 }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600,
                                            padding: "3px 8px", borderRadius: 4,
                                            background: v.online ? "rgba(34,197,94,0.08)" : "#f8fafc",
                                            color: v.online ? "#16a34a" : "#94a3b8",
                                        }}>{v.online ? "Online" : "Offline"}</span>
                                    </div>
                                </div>
                            </div>
                            <button style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 16px", borderRadius: 8,
                                background: "#1de2d1", color: "#0f172a",
                                fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                                Assign
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
