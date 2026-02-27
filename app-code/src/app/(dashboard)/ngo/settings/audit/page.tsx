"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";

interface AuditEntry {
    id: string;
    action: string;
    category: string;
    target_type: string;
    target_id: string;
    details: string;
    actor_id: string;
    actor_name: string;
    created_at: string;
}

const catIcons: Record<string, { icon: string; bg: string; color: string }> = {
    USER_MANAGEMENT: { icon: "group", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    NGO_MANAGEMENT: { icon: "business", bg: "rgba(29,226,209,0.1)", color: "#0f766e" },
    DONATION: { icon: "payments", bg: "rgba(16,185,129,0.1)", color: "#059669" },
    MODERATION: { icon: "gavel", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    PLATFORM: { icon: "settings", bg: "rgba(100,116,139,0.1)", color: "#64748b" },
};

export default function AuditLogPage() {
    const { ngoId, loading: ctxLoading } = useNgoContext();
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [hasRealData, setHasRealData] = useState(false);

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            // Query audit_logs using correct schema columns
            const { data, error } = await supabase
                .from("audit_logs")
                .select("id, action, category, target_type, target_id, details, metadata, actor_id, created_at")
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) {
                console.error("Audit logs query error:", error);
                setEntries([]);
                setHasRealData(false);
                setLoading(false);
                return;
            }

            if (data && data.length > 0) {
                setHasRealData(true);
                // Fetch actor names
                const userIds = [...new Set(data.map(d => d.actor_id).filter(Boolean))];
                let userMap: Record<string, string> = {};
                if (userIds.length > 0) {
                    const { data: users } = await supabase
                        .from("users")
                        .select("id, full_name")
                        .in("id", userIds);
                    if (users) {
                        userMap = Object.fromEntries(users.map(u => [u.id, u.full_name]));
                    }
                }

                setEntries(data.map(d => ({
                    id: d.id,
                    action: d.action || "Action",
                    category: d.category || "PLATFORM",
                    target_type: d.target_type || "",
                    target_id: d.target_id || "",
                    details: d.details || (d.metadata ? JSON.stringify(d.metadata).slice(0, 150) : ""),
                    actor_id: d.actor_id || "",
                    actor_name: userMap[d.actor_id] || "System",
                    created_at: d.created_at,
                })));
            } else {
                setHasRealData(false);
                setEntries([]);
            }
            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    const filtered = entries.filter(e =>
        !search || e.action.toLowerCase().includes(search.toLowerCase()) ||
        e.actor_name.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Audit Log</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Complete record of all administrative actions for transparency.</p>
            </div>

            {!hasRealData && (
                <div style={{
                    padding: 16, marginBottom: 20, borderRadius: 10,
                    background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#2563eb" }}>info</span>
                    <p style={{ fontSize: 13, color: "#475569" }}>
                        No audit entries recorded yet. Actions like creating requests, updating profiles, and managing team members will appear here automatically once the audit logging system is fully connected.
                    </p>
                </div>
            )}

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 20 }}>
                <span className="material-symbols-outlined" style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8",
                }}>search</span>
                <input
                    type="text" placeholder="Search actions, users..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{
                        width: "100%", height: 44, paddingLeft: 42, borderRadius: 10,
                        border: "1px solid #e2e8f0", fontSize: 13, outline: "none",
                    }}
                />
            </div>

            {/* Timeline */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 64,
                    background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#cbd5e1" }}>history</span>
                    <p style={{ marginTop: 12, color: "#94a3b8" }}>No audit entries found</p>
                </div>
            ) : (
                <div style={{
                    background: "#fff", borderRadius: 12,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                }}>
                    {filtered.map((e, i) => {
                        const ci = catIcons[e.category] || catIcons.PLATFORM;
                        const isLast = i === filtered.length - 1;
                        return (
                            <div key={e.id} style={{
                                display: "flex", gap: 16, padding: "16px 20px",
                                borderBottom: isLast ? "none" : "1px solid #f1f5f9",
                            }}>
                                <div style={{ position: "relative" }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: ci.bg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: ci.color }}>{ci.icon}</span>
                                    </div>
                                    {!isLast && (
                                        <div style={{
                                            position: "absolute", left: "50%", top: 40, bottom: -16,
                                            width: 1, background: "#f1f5f9", transform: "translateX(-50%)",
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <p style={{ fontSize: 13, fontWeight: 700 }}>{e.action}</p>
                                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                            {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            {" "}
                                            {new Date(e.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    {e.details && (
                                        <p style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{e.details}</p>
                                    )}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                                        <p style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>person</span>
                                            {e.actor_name}
                                        </p>
                                        {e.target_type && (
                                            <span style={{
                                                fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                                background: "#f1f5f9", color: "#64748b",
                                            }}>{e.target_type}</span>
                                        )}
                                        <span style={{
                                            fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                            background: ci.bg, color: ci.color,
                                        }}>{e.category.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
