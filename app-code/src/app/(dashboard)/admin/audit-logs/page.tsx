"use client";

import { useState } from "react";

/* ── mock data ── */
const mockAuditLogs = [
    { id: "1", timestamp: "2026-02-18T12:30:00Z", action: "USER_SUSPENDED", category: "USER_MANAGEMENT", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "u8", name: "Meera Joshi", type: "USER" }, details: "User suspended for policy violation", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { reason: "Spam activities", duration: "30 days" } },
    { id: "2", timestamp: "2026-02-18T11:45:00Z", action: "NGO_VERIFIED", category: "NGO_MANAGEMENT", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "ngo4", name: "Green Earth Initiative", type: "NGO" }, details: "NGO verification approved after document review", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { documentsReviewed: 5, verificationNotes: "All documents verified" } },
    { id: "3", timestamp: "2026-02-18T10:15:00Z", action: "DONATION_REFUNDED", category: "DONATION", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "don123", name: "Donation #DON-123", type: "DONATION" }, details: "Refund processed for failed service delivery", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { amount: 5000, reason: "Service not delivered", refundId: "REF-456" } },
    { id: "4", timestamp: "2026-02-18T09:30:00Z", action: "REPORT_RESOLVED", category: "MODERATION", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "rpt5", name: "Report #RPT-005", type: "REPORT" }, details: "Report resolved - NGO suspended", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { reportType: "NGO_REPORT", action: "SUSPEND_NGO" } },
    { id: "5", timestamp: "2026-02-17T16:45:00Z", action: "ROLE_CHANGED", category: "USER_MANAGEMENT", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "u5", name: "Vikram Singh", type: "USER" }, details: "User role changed from VOLUNTEER to NGO_COORDINATOR", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { previousRole: "VOLUNTEER", newRole: "NGO_COORDINATOR" } },
    { id: "6", timestamp: "2026-02-17T14:20:00Z", action: "NGO_SUSPENDED", category: "NGO_MANAGEMENT", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "ngo5", name: "Help All Trust", type: "NGO" }, details: "NGO suspended due to fraudulent activities", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { reason: "Fraudulent activities", reportId: "RPT-004" } },
    { id: "7", timestamp: "2026-02-17T11:00:00Z", action: "SETTINGS_CHANGED", category: "PLATFORM", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "platform", name: "Platform Settings", type: "SETTINGS" }, details: "Updated donation minimum amount from ₹100 to ₹200", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { setting: "donation_min_amount", oldValue: 100, newValue: 200 } },
    { id: "8", timestamp: "2026-02-16T15:30:00Z", action: "CONTENT_REMOVED", category: "MODERATION", actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" }, target: { id: "post789", name: "Post #789", type: "POST" }, details: "Post removed for violating community guidelines", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0.0", metadata: { reason: "Misinformation", authorId: "u10" } },
];

const categoryFilters = ["ALL", "USER_MANAGEMENT", "NGO_MANAGEMENT", "DONATION", "MODERATION", "PLATFORM"];
const actionFilters = ["ALL", "USER_SUSPENDED", "NGO_VERIFIED", "NGO_SUSPENDED", "ROLE_CHANGED", "DONATION_REFUNDED", "REPORT_RESOLVED", "SETTINGS_CHANGED", "CONTENT_REMOVED"];

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedLog, setSelectedLog] = useState<typeof mockAuditLogs[0] | null>(null);

    const filteredLogs = mockAuditLogs.filter((log) => {
        const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.target.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (categoryFilter === "ALL" || log.category === categoryFilter) &&
            (actionFilter === "ALL" || log.action === actionFilter);
    });

    const catColor: Record<string, string> = {
        USER_MANAGEMENT: "var(--color-info)", NGO_MANAGEMENT: "var(--primary)",
        DONATION: "var(--color-success)", MODERATION: "var(--color-danger)", PLATFORM: "var(--foreground-muted)",
    };
    const actionIcon: Record<string, string> = {
        USER_SUSPENDED: "block", NGO_VERIFIED: "verified", NGO_SUSPENDED: "domain_disabled",
        ROLE_CHANGED: "admin_panel_settings", DONATION_REFUNDED: "money_off",
        REPORT_RESOLVED: "task_alt", SETTINGS_CHANGED: "settings", CONTENT_REMOVED: "delete",
    };

    const fmtTs = (ts: string) => {
        const d = new Date(ts);
        return {
            date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Audit Logs</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Track all platform activities and changes</p>
                </div>
                <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>Export Logs
                </button>
            </div>

            {/* Stats row */}
            <div className="stat-grid">
                {[
                    { label: "Total Actions Today", value: "1,234" },
                    { label: "User Management", value: "456", color: "var(--color-info)" },
                    { label: "NGO Management", value: "234", color: "var(--primary)" },
                    { label: "Moderation Actions", value: "89", color: "var(--color-danger)" },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
                        <p className="stat-label">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
                    <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                        <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--foreground-light)" }}>search</span>
                        <input type="text" placeholder="Search by actor, target, or details..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="field-input" style={{ paddingLeft: 40 }} />
                    </div>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                        {categoryFilters.map(c => <option key={c} value={c}>{c === "ALL" ? "All Categories" : c.replace(/_/g, " ")}</option>)}
                    </select>
                    <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                        {actionFilters.map(a => <option key={a} value={a}>{a === "ALL" ? "All Actions" : a.replace(/_/g, " ")}</option>)}
                    </select>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label className="field-label" style={{ marginBottom: 0 }}>From:</label>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="field-input" style={{ width: "auto" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label className="field-label" style={{ marginBottom: 0 }}>To:</label>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="field-input" style={{ width: "auto" }} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--background-subtle)" }}>
                                {["Timestamp", "Action", "Actor", "Target", "Details", "IP"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => {
                                const { date, time } = fmtTs(log.timestamp);
                                const cc = catColor[log.category] || "var(--foreground-muted)";
                                return (
                                    <tr key={log.id} style={{ borderTop: "1px solid var(--border-light)", cursor: "pointer" }}
                                        onClick={() => setSelectedLog(log)}>
                                        <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                            <p style={{ fontSize: "var(--font-sm)" }}>{date}</p>
                                            <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{time}</p>
                                        </td>
                                        <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: `${cc}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: cc }}>{actionIcon[log.action] || "info"}</span>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{log.action.replace(/_/g, " ")}</p>
                                                    <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{log.category.replace(/_/g, " ")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                            <p style={{ fontSize: "var(--font-sm)" }}>{log.actor.name}</p>
                                            <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{log.actor.role.replace(/_/g, " ")}</p>
                                        </td>
                                        <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                            <p style={{ fontSize: "var(--font-sm)" }}>{log.target.name}</p>
                                            <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{log.target.type}</p>
                                        </td>
                                        <td style={{ padding: "var(--space-sm) var(--space-md)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>{log.details}</td>
                                        <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", fontFamily: "monospace", color: "var(--foreground-muted)" }}>{log.ipAddress}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: "var(--space-sm) var(--space-md)", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>Showing {filteredLogs.length} of {mockAuditLogs.length} logs</p>
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        <button className="btn-secondary" disabled style={{ fontSize: "var(--font-sm)", opacity: 0.5 }}>Previous</button>
                        <button className="btn-secondary" style={{ fontSize: "var(--font-sm)" }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Log detail modal */}
            {selectedLog && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedLog(null)} />
                    <div className="card" style={{ position: "relative", width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: "var(--font-lg)", fontWeight: 600 }}>Log Details</h2>
                            <button onClick={() => setSelectedLog(null)} style={{ padding: 8, border: "none", background: "transparent", cursor: "pointer", borderRadius: "var(--radius-md)" }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ background: "var(--background-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                            <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Timestamp</p><p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{fmtTs(selectedLog.timestamp).date} at {fmtTs(selectedLog.timestamp).time}</p></div>
                            <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Category</p><span className="tab-pill" style={{ fontSize: "var(--font-xs)", background: `${catColor[selectedLog.category]}20`, color: catColor[selectedLog.category] }}>{selectedLog.category.replace(/_/g, " ")}</span></div>
                            <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Actor</p><p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{selectedLog.actor.name}</p></div>
                            <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Target</p><p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{selectedLog.target.name}</p></div>
                        </div>
                        <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", marginBottom: 4 }}>Action Details</p><p style={{ fontSize: "var(--font-sm)", background: "var(--background-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-sm)" }}>{selectedLog.details}</p></div>
                        {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                            <div>
                                <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", marginBottom: 8 }}>Additional Data</p>
                                <div style={{ background: "var(--background-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-sm)" }}>
                                    {Object.entries(selectedLog.metadata).map(([k, v]) => (
                                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-sm)", padding: "4px 0" }}>
                                            <span style={{ color: "var(--foreground-muted)" }}>{k}:</span>
                                            <span style={{ fontWeight: 500 }}>{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--border-light)" }}>
                            <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>IP Address</p><p style={{ fontSize: "var(--font-sm)", fontFamily: "monospace" }}>{selectedLog.ipAddress}</p></div>
                            <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>User Agent</p><p style={{ fontSize: "var(--font-sm)" }}>{selectedLog.userAgent}</p></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
