"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditRequestPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [urgency, setUrgency] = useState("HIGH");
    const [location, setLocation] = useState("");
    const [visibility, setVisibility] = useState("public");

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data } = await supabase.from("requests").select("*").eq("id", id).single();
            if (data) {
                setTitle(data.title || "");
                setDescription(data.description || "");
                setCategory(data.category || "");
                setUrgency(data.urgency || "HIGH");
                setLocation(data.location || "");
                setVisibility(data.visibility || "public");
            }
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

    return (
        <div>
            {/* Breadcrumbs */}
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                <Link href="/ngo" style={{ color: "#94a3b8", textDecoration: "none" }}>Dashboard</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <Link href="/ngo/requests" style={{ color: "#94a3b8", textDecoration: "none" }}>Help Requests</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <span style={{ color: "#0f172a", fontWeight: 500 }}>Edit Request</span>
            </nav>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Edit Request</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Modify the details for the existing relief effort.</p>
                </div>
                <Link href={`/ngo/requests/${id}`} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "9px 18px", borderRadius: 8,
                    border: "1px solid #e2e8f0", background: "#fff",
                    color: "#475569", fontSize: 13, fontWeight: 700, textDecoration: "none",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                    View Live
                </Link>
            </div>

            {/* Split Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, paddingBottom: 100 }}>
                {/* Left: Context */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{
                        background: "#fff", borderRadius: 12, padding: 20,
                        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 16 }}>Request Context</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div>
                                <p style={{ fontSize: 11, color: "#94a3b8" }}>Request ID</p>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>{id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 8,
                                background: "#f8fafc", border: "1px solid #f1f5f9",
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "rgba(29,226,209,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>calendar_today</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>Created Date</p>
                                    <p style={{ fontSize: 12, fontWeight: 700 }}>Recently</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: "rgba(29,226,209,0.04)", borderRadius: 12, padding: 16,
                        border: "1px solid rgba(29,226,209,0.1)",
                    }}>
                        <div style={{ display: "flex", gap: 10 }}>
                            <span className="material-symbols-outlined" style={{ color: "#1de2d1", fontSize: 20, marginTop: 2 }}>info</span>
                            <div>
                                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Audit Trail</h4>
                                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                                    Updates to this form are logged for transparency in humanitarian aid delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <form style={{
                    background: "#fff", borderRadius: 12,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    padding: 24, display: "flex", flexDirection: "column", gap: 20,
                }}>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Request Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{
                            width: "100%", height: 46, padding: "0 14px", borderRadius: 8,
                            border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                        }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={{
                                width: "100%", height: 46, padding: "0 14px", borderRadius: 8,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none", appearance: "none",
                                background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center`,
                            }}>
                                <option>Medical</option>
                                <option>Food</option>
                                <option>Water</option>
                                <option>Shelter</option>
                                <option>Education</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Urgency Level</label>
                            <div style={{ display: "flex", gap: 0, background: "#f1f5f9", borderRadius: 8, padding: 4 }}>
                                {["LOW", "MEDIUM", "CRITICAL"].map(u => (
                                    <button key={u} type="button" onClick={() => setUrgency(u)}
                                        style={{
                                            flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                            border: "none", cursor: "pointer",
                                            background: urgency === u
                                                ? u === "CRITICAL" ? "#ef4444" : u === "MEDIUM" ? "#1de2d1" : "#f1f5f9"
                                                : "transparent",
                                            color: urgency === u
                                                ? u === "CRITICAL" ? "#fff" : "#0f172a"
                                                : "#64748b",
                                            boxShadow: urgency === u ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                                        }}
                                    >{u}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Location</label>
                        <div style={{ position: "relative" }}>
                            <span className="material-symbols-outlined" style={{
                                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                                color: "#94a3b8",
                            }}>location_on</span>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                                style={{
                                    width: "100%", height: 46, paddingLeft: 40, paddingRight: 14, borderRadius: 8,
                                    border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                                }} />
                        </div>
                        <div style={{
                            marginTop: 14, height: 140, borderRadius: 8,
                            background: "#f1f5f9", border: "1px solid #e2e8f0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#cbd5e1" }}>map</span>
                        </div>
                    </div>

                    {/* Visibility */}
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Visibility Setting</label>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Public requests can be seen by all registered volunteers.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <label onClick={() => setVisibility("public")} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, cursor: "pointer",
                                border: visibility === "public" ? "2px solid #1de2d1" : "2px solid #e2e8f0",
                                background: visibility === "public" ? "rgba(29,226,209,0.04)" : "#fff",
                            }}>
                                <span className="material-symbols-outlined" style={{ color: "#1de2d1" }}>public</span>
                                <div><p style={{ fontSize: 13, fontWeight: 700 }}>Public</p><p style={{ fontSize: 11, color: "#64748b" }}>Open to everyone</p></div>
                            </label>
                            <label onClick={() => setVisibility("private")} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, cursor: "pointer",
                                border: visibility === "private" ? "2px solid #1de2d1" : "2px solid #e2e8f0",
                            }}>
                                <span className="material-symbols-outlined" style={{ color: "#94a3b8" }}>lock</span>
                                <div><p style={{ fontSize: 13, fontWeight: 700 }}>Private</p><p style={{ fontSize: 11, color: "#64748b" }}>Invite-only</p></div>
                            </label>
                        </div>
                    </div>
                </form>
            </div>

            {/* Sticky Bottom Bar */}
            <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
                borderTop: "1px solid #e2e8f0", padding: "12px 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                zIndex: 40,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                    Last saved: 2 minutes ago
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => router.back()} style={{
                        padding: "9px 20px", borderRadius: 8,
                        border: "1px solid #e2e8f0", background: "#fff",
                        color: "#475569", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}>Cancel</button>
                    <button style={{
                        padding: "9px 24px", borderRadius: 8,
                        background: "#1de2d1", color: "#0f172a",
                        fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                        boxShadow: "0 4px 16px rgba(29,226,209,0.2)",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
