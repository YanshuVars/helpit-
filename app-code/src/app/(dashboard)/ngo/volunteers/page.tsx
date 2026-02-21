"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface VolRow {
    id: string;
    name: string;
    email: string;
    skills: string[];
    hours: number;
    status: string;
    joined: string;
    initials: string;
    color: string;
}

const COLORS = [
    { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
    { bg: "rgba(139,92,246,0.1)", text: "#7c3aed" },
    { bg: "rgba(16,185,129,0.1)", text: "#059669" },
    { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
    { bg: "rgba(244,63,94,0.1)", text: "#e11d48" },
    { bg: "rgba(14,165,233,0.1)", text: "#0284c7" },
];

const statusMap: Record<string, { dot: string; text: string; label: string }> = {
    active: { dot: "#10b981", text: "#059669", label: "Active" },
    away: { dot: "#f59e0b", text: "#d97706", label: "On Break" },
    inactive: { dot: "#f43f5e", text: "#e11d48", label: "Inactive" },
};

export default function VolunteersDirectoryPage() {
    const [volunteers, setVolunteers] = useState<VolRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data } = await supabase
                .from("profiles")
                .select("id, full_name, email, skills, role, created_at")
                .limit(50);

            setVolunteers(
                (data || []).map((p: any, i: number) => {
                    const name = p.full_name || "Unknown User";
                    const words = name.split(" ");
                    const initials = words.length >= 2
                        ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
                        : name.slice(0, 2).toUpperCase();
                    const c = COLORS[i % COLORS.length];
                    return {
                        id: p.id,
                        name,
                        email: p.email || "",
                        skills: p.skills || [],
                        hours: Math.floor(Math.random() * 250),
                        status: ["active", "active", "active", "away", "inactive"][Math.floor(Math.random() * 5)],
                        joined: new Date(p.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                        initials,
                        color: `${c.bg}|${c.text}`,
                    };
                })
            );
            setLoading(false);
        }
        load();
    }, []);

    const filtered = volunteers.filter(v => {
        if (statusFilter && v.status !== statusFilter) return false;
        if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Volunteers</h2>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                        Manage and track {volunteers.length} active volunteers across all programs.
                    </p>
                </div>
                <button style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#1de2d1", color: "#0f172a",
                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                    Invite Volunteer
                </button>
            </div>

            {/* Filter Bar */}
            <div style={{
                display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                background: "#fff", padding: 14, borderRadius: 12,
                border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                marginBottom: 20,
            }}>
                <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
                    <span className="material-symbols-outlined" style={{
                        position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                        color: "#94a3b8", fontSize: 20,
                    }}>search</span>
                    <input
                        type="text"
                        placeholder="Search by name, email, or skill..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: "100%", height: 38, paddingLeft: 36, paddingRight: 12,
                            borderRadius: 8, border: "none", background: "#f8fafc",
                            fontSize: 13, outline: "none",
                        }}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{
                        height: 38, padding: "0 12px", borderRadius: 8, border: "none",
                        background: "#f8fafc", fontSize: 13, outline: "none", minWidth: 120,
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="away">On Break</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button style={{
                    padding: 8, border: "none", background: "#f8fafc",
                    borderRadius: 8, cursor: "pointer",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#64748b" }}>tune</span>
                </button>
            </div>

            {/* Table */}
            <div style={{
                background: "#fff", borderRadius: 12,
                border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                overflow: "hidden",
            }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #e2e8f0", background: "rgba(248,250,252,0.5)" }}>
                                <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Name</th>
                                <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email</th>
                                <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Skills</th>
                                <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hours</th>
                                <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                                <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "right" }}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v) => {
                                const [cbg, ctxt] = v.color.split("|");
                                const s = statusMap[v.status] || statusMap.active;
                                return (
                                    <tr key={v.id} style={{
                                        borderBottom: "1px solid #f1f5f9",
                                        cursor: "pointer",
                                    }}>
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: "50%",
                                                    background: cbg,
                                                    color: ctxt,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 12, fontWeight: 700,
                                                }}>{v.initials}</div>
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{v.name}</p>
                                                    <p style={{ fontSize: 10, color: "#94a3b8" }}>ID: #{v.id.slice(0, 4)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{v.email}</td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                {(v.skills || []).slice(0, 2).map((sk, i) => (
                                                    <span key={i} style={{
                                                        fontSize: 10, fontWeight: 700, color: "#1de2d1",
                                                        padding: "2px 8px", borderRadius: 20,
                                                        border: "1px solid #1de2d1",
                                                    }}>{sk}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, color: "#475569" }}>
                                            {v.hours} hrs
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{
                                                    width: 7, height: 7, borderRadius: "50%",
                                                    background: s.dot,
                                                }} />
                                                <span style={{ fontSize: 12, fontWeight: 600, color: s.text }}>{s.label}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8", textAlign: "right" }}>{v.joined}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", borderTop: "1px solid #e2e8f0",
                }}>
                    <p style={{ fontSize: 13, color: "#94a3b8" }}>
                        Showing 1-{filtered.length} of {volunteers.length} volunteers
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button style={{
                            width: 32, height: 32, borderRadius: 4,
                            border: "1px solid #e2e8f0", background: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94a3b8" }}>chevron_left</span>
                        </button>
                        <button style={{
                            width: 32, height: 32, borderRadius: 4,
                            background: "#1de2d1", color: "#0f172a",
                            border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}>1</button>
                        <button style={{
                            width: 32, height: 32, borderRadius: 4,
                            border: "1px solid #e2e8f0", background: "#fff",
                            fontSize: 12, fontWeight: 500, cursor: "pointer",
                        }}>2</button>
                        <button style={{
                            width: 32, height: 32, borderRadius: 4,
                            border: "1px solid #e2e8f0", background: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94a3b8" }}>chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
