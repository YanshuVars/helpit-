"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuditEntry {
    id: string;
    action: string;
    actor_name: string;
    details: string;
    created_at: string;
    category: string;
}

const catIcons: Record<string, { icon: string; bg: string; color: string }> = {
    settings: { icon: "settings", bg: "rgba(100,116,139,0.1)", color: "#64748b" },
    members: { icon: "group", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    requests: { icon: "assignment", bg: "rgba(29,226,209,0.1)", color: "#0f766e" },
    donations: { icon: "payments", bg: "rgba(16,185,129,0.1)", color: "#059669" },
    security: { icon: "shield", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
};

// Placeholder data for demo; replace with Supabase query if audit_logs table exists
const DEMO_ENTRIES: AuditEntry[] = [
    { id: "1", action: "Updated organization profile", actor_name: "Admin User", details: "Changed description and contact email", created_at: new Date(Date.now() - 3600000).toISOString(), category: "settings" },
    { id: "2", action: "Added team member", actor_name: "Admin User", details: "Invited priya@example.com as editor", created_at: new Date(Date.now() - 7200000).toISOString(), category: "members" },
    { id: "3", action: "Created help request", actor_name: "Field Lead", details: "Medical supplies for relief camp", created_at: new Date(Date.now() - 86400000).toISOString(), category: "requests" },
    { id: "4", action: "Processed donation", actor_name: "System", details: "₹50,000 from Rajesh Mehta via UPI", created_at: new Date(Date.now() - 172800000).toISOString(), category: "donations" },
    { id: "5", action: "Password changed", actor_name: "Admin User", details: "Security credentials updated", created_at: new Date(Date.now() - 259200000).toISOString(), category: "security" },
    { id: "6", action: "Assigned volunteer", actor_name: "Coordinator", details: "Assigned to Medical Camp request", created_at: new Date(Date.now() - 345600000).toISOString(), category: "requests" },
];

export default function AuditLogPage() {
    const [entries, setEntries] = useState<AuditEntry[]>(DEMO_ENTRIES);
    const [search, setSearch] = useState("");

    const filtered = entries.filter(e =>
        !search || e.action.toLowerCase().includes(search.toLowerCase()) || e.actor_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Audit Log</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Complete record of all administrative actions for transparency.</p>
            </div>

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
            <div style={{
                background: "#fff", borderRadius: 12,
                border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                overflow: "hidden",
            }}>
                {filtered.map((e, i) => {
                    const ci = catIcons[e.category] || catIcons.settings;
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
                                <p style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{e.details}</p>
                                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>person</span>
                                    {e.actor_name}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
