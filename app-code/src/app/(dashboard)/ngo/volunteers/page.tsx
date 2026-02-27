"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";

interface VolRow {
    id: string;
    name: string;
    email: string;
    skills: string[];
    hours: number;
    availability: boolean;
    joined: string;
    initials: string;
    color: string;
    lastActive: string | null;
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
    available: { dot: "#10b981", text: "#059669", label: "Available" },
    unavailable: { dot: "#f59e0b", text: "#d97706", label: "Unavailable" },
};

export default function VolunteersDirectoryPage() {
    const { ngoId, loading: ctxLoading } = useNgoContext();
    const [volunteers, setVolunteers] = useState<VolRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            // Get volunteers who have assignments with this NGO
            const { data: assignments } = await supabase
                .from("volunteer_assignments")
                .select(`
                    volunteer_id,
                    hours_logged,
                    help_requests!inner(ngo_id)
                `)
                .eq("help_requests.ngo_id", ngoId);

            // Group hours by volunteer
            const hoursMap = new Map<string, number>();
            const volIds = new Set<string>();
            (assignments || []).forEach((a: any) => {
                volIds.add(a.volunteer_id);
                hoursMap.set(a.volunteer_id, (hoursMap.get(a.volunteer_id) || 0) + Number(a.hours_logged || 0));
            });

            if (volIds.size === 0) {
                // Fallback: get all users with volunteer role
                const { data: allVols } = await supabase
                    .from("users")
                    .select("id, full_name, email, skills, availability, created_at, last_active_at")
                    .eq("role", "VOLUNTEER")
                    .limit(50);

                setVolunteers(
                    (allVols || []).map((p: any, i: number) => {
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
                            hours: 0,
                            availability: p.availability || false,
                            joined: new Date(p.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                            initials,
                            color: `${c.bg}|${c.text}`,
                            lastActive: p.last_active_at,
                        };
                    })
                );
                setLoading(false);
                return;
            }

            // Fetch volunteer profiles
            const { data: vols } = await supabase
                .from("users")
                .select("id, full_name, email, skills, availability, created_at, last_active_at")
                .in("id", Array.from(volIds));

            setVolunteers(
                (vols || []).map((p: any, i: number) => {
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
                        hours: Math.round(hoursMap.get(p.id) || 0),
                        availability: p.availability || false,
                        joined: new Date(p.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                        initials,
                        color: `${c.bg}|${c.text}`,
                        lastActive: p.last_active_at,
                    };
                })
            );
            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    const filtered = volunteers.filter(v => {
        if (statusFilter === "available" && !v.availability) return false;
        if (statusFilter === "unavailable" && v.availability) return false;
        if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Volunteers</h2>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                        Manage and track {volunteers.length} volunteers across all programs.
                    </p>
                </div>
            </div>

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
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: "100%", height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: 8, border: "none", background: "#f8fafc", fontSize: 13, outline: "none" }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    style={{ height: 38, padding: "0 12px", borderRadius: 8, border: "none", background: "#f8fafc", fontSize: 13, outline: "none", minWidth: 120 }}>
                    <option value="">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
            </div>

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
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>group_off</span>
                                        <p>No volunteers found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((v) => {
                                const [cbg, ctxt] = v.color.split("|");
                                const s = v.availability ? statusMap.available : statusMap.unavailable;
                                return (
                                    <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: "50%",
                                                    background: cbg, color: ctxt,
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
                                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
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

                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", borderTop: "1px solid #e2e8f0",
                }}>
                    <p style={{ fontSize: 13, color: "#94a3b8" }}>
                        Showing {filtered.length} of {volunteers.length} volunteers
                    </p>
                </div>
            </div>
        </div>
    );
}
