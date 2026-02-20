"use client";

import { useState } from "react";

/* ── mock data ── */
const mockReports = [
    { id: "1", type: "NGO_REPORT", status: "PENDING", priority: "HIGH", reporter: { name: "Rahul Sharma", id: "u1" }, reportedEntity: { name: "Help All Trust", type: "NGO", id: "ngo1" }, reason: "Suspected fraudulent activities", description: "This NGO is collecting donations but not using them for the stated purpose. Multiple beneficiaries have complained about not receiving aid.", evidence: ["screenshot1.png", "receipt.pdf", "whatsapp_chat.jpg"], createdAt: "2 hours ago", assignedTo: null },
    { id: "2", type: "USER_REPORT", status: "IN_REVIEW", priority: "MEDIUM", reporter: { name: "Priya Patel", id: "u2" }, reportedEntity: { name: "Amit Kumar", type: "USER", id: "u3" }, reason: "Harassment in chat", description: "User is sending inappropriate messages and harassing volunteers.", evidence: ["chat_log.txt"], createdAt: "5 hours ago", assignedTo: { name: "Admin User", id: "admin1" } },
    { id: "3", type: "CONTENT_REPORT", status: "PENDING", priority: "LOW", reporter: { name: "Sneha Gupta", id: "u4" }, reportedEntity: { name: "Post #1234", type: "POST", id: "post1" }, reason: "Inappropriate content", description: "This post contains misleading information about donation usage.", evidence: ["screenshot.png"], createdAt: "1 day ago", assignedTo: null },
    { id: "4", type: "NGO_REPORT", status: "RESOLVED", priority: "HIGH", reporter: { name: "Vikram Singh", id: "u5" }, reportedEntity: { name: "Quick Help NGO", type: "NGO", id: "ngo2" }, reason: "Fake registration documents", description: "The NGO submitted fake registration documents. Verified with government registry.", evidence: ["fake_cert.pdf", "real_cert.pdf"], createdAt: "3 days ago", assignedTo: { name: "Admin User", id: "admin1" }, resolution: "NGO suspended and reported to authorities", resolvedAt: "2 days ago" },
    { id: "5", type: "USER_REPORT", status: "DISMISSED", priority: "LOW", reporter: { name: "Anita Desai", id: "u6" }, reportedEntity: { name: "Rajesh Verma", type: "USER", id: "u7" }, reason: "Spam messages", description: "User is sending promotional messages in volunteer groups.", evidence: [] as string[], createdAt: "1 week ago", assignedTo: { name: "Admin User", id: "admin1" }, resolution: "False report - user was sharing legitimate event information", resolvedAt: "6 days ago" },
];

const statusFilters = ["ALL", "PENDING", "IN_REVIEW", "RESOLVED", "DISMISSED"];
const priorityFilters = ["ALL", "HIGH", "MEDIUM", "LOW"];
const typeFilters = ["ALL", "NGO_REPORT", "USER_REPORT", "CONTENT_REPORT"];

export default function ModerationReportsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const filteredReports = mockReports.filter((r) => {
        const matchesSearch = r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.reportedEntity.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (statusFilter === "ALL" || r.status === statusFilter) &&
            (priorityFilter === "ALL" || r.priority === priorityFilter) &&
            (typeFilter === "ALL" || r.type === typeFilter);
    });

    const statusColor: Record<string, string> = { PENDING: "var(--color-warning)", IN_REVIEW: "var(--color-info)", RESOLVED: "var(--color-success)", DISMISSED: "var(--foreground-muted)" };
    const priorityColor: Record<string, string> = { HIGH: "var(--color-danger)", MEDIUM: "var(--color-warning)", LOW: "var(--color-success)" };
    const typeIcon: Record<string, string> = { NGO_REPORT: "domain", USER_REPORT: "person", CONTENT_REPORT: "article" };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Moderation Reports</h1>
                <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Review and manage user reports</p>
            </div>

            {/* Stats */}
            <div className="stat-grid">
                {[
                    { icon: "pending", label: "Pending", value: 12, color: "var(--color-warning)" },
                    { icon: "visibility", label: "In Review", value: 5, color: "var(--color-info)" },
                    { icon: "check_circle", label: "Resolved", value: 89, color: "var(--color-success)" },
                    { icon: "priority_high", label: "High Priority", value: 3, color: "var(--color-danger)" },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: s.color }}>{s.icon}</span>
                        <p className="stat-value">{s.value}</p>
                        <p className="stat-label">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                    <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--foreground-light)" }}>search</span>
                    <input type="text" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="field-input" style={{ paddingLeft: 40 }} />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    {statusFilters.map(s => <option key={s} value={s}>{s === "ALL" ? "All Status" : s.replace("_", " ")}</option>)}
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    {priorityFilters.map(p => <option key={p} value={p}>{p === "ALL" ? "All Priority" : p}</option>)}
                </select>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    {typeFilters.map(t => <option key={t} value={t}>{t === "ALL" ? "All Types" : t.replace("_", " ")}</option>)}
                </select>
            </div>

            {/* Report cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {filteredReports.map((r) => {
                    const sc = statusColor[r.status] || "var(--foreground-muted)";
                    const pc = priorityColor[r.priority] || "var(--foreground-muted)";
                    return (
                        <div key={r.id} className="card" style={{ cursor: "pointer" }}
                            onClick={() => { setSelectedReport(r); setShowDetailModal(true); }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)" }}>
                                <div style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>{typeIcon[r.type] || "report"}</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: 4 }}>
                                        <h3 style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason}</h3>
                                        <span className="tab-pill" style={{ fontSize: 10, background: `${pc}20`, color: pc }}>{r.priority}</span>
                                    </div>
                                    <p style={{ fontSize: "var(--font-sm)", color: "var(--foreground-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 8 }}>{r.description}</p>
                                    <div style={{ display: "flex", gap: "var(--space-md)", fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>
                                        <span>By: {r.reporter.name}</span><span>•</span>
                                        <span>Against: {r.reportedEntity.name}</span><span>•</span>
                                        <span>{r.createdAt}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                    <span className="tab-pill" style={{ background: `${sc}20`, color: sc, fontSize: "var(--font-xs)" }}>{r.status.replace("_", " ")}</span>
                                    {r.evidence.length > 0 && (
                                        <span style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>attach_file</span>{r.evidence.length} files
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail modal */}
            {showDetailModal && selectedReport && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowDetailModal(false)} />
                    <div className="card" style={{ position: "relative", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                <h2 style={{ fontSize: "var(--font-lg)", fontWeight: 600 }}>Report Details</h2>
                                <span className="tab-pill" style={{ fontSize: "var(--font-xs)", background: `${statusColor[selectedReport.status] || "var(--foreground-muted)"}20`, color: statusColor[selectedReport.status] }}>{selectedReport.status.replace("_", " ")}</span>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} style={{ padding: 8, borderRadius: "var(--radius-md)", border: "none", background: "transparent", cursor: "pointer" }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div style={{ background: "var(--background-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                                <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Report Type</p><p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{selectedReport.type.replace("_", " ")}</p></div>
                                <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Priority</p><span className="tab-pill" style={{ fontSize: "var(--font-xs)", background: `${priorityColor[selectedReport.priority]}20`, color: priorityColor[selectedReport.priority] }}>{selectedReport.priority}</span></div>
                                <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Reporter</p><p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{selectedReport.reporter.name}</p></div>
                                <div><p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>Reported Entity</p><p style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{selectedReport.reportedEntity.name} ({selectedReport.reportedEntity.type})</p></div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontWeight: 500, marginBottom: 8 }}>Description</h3>
                            <p style={{ fontSize: "var(--font-sm)", color: "var(--foreground-muted)", background: "var(--background-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-sm)" }}>{selectedReport.description}</p>
                        </div>

                        {selectedReport.evidence.length > 0 && (
                            <div>
                                <h3 style={{ fontWeight: 500, marginBottom: 8 }}>Evidence ({selectedReport.evidence.length} files)</h3>
                                {selectedReport.evidence.map((f, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-sm)", background: "var(--background-subtle)", borderRadius: "var(--radius-lg)", marginBottom: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                            <span className="material-symbols-outlined" style={{ color: "var(--foreground-light)" }}>description</span>
                                            <span style={{ fontSize: "var(--font-sm)" }}>{f}</span>
                                        </div>
                                        <button className="auth-link" style={{ fontSize: "var(--font-sm)" }}>View</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedReport.resolution && (
                            <div style={{ background: "var(--color-success-bg, #DCFCE7)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)" }}>
                                <h3 style={{ fontWeight: 500, color: "var(--color-success)", marginBottom: 4 }}>Resolution</h3>
                                <p style={{ fontSize: "var(--font-sm)", color: "var(--color-success)" }}>{selectedReport.resolution}</p>
                                {selectedReport.resolvedAt && <p style={{ fontSize: "var(--font-xs)", color: "var(--color-success)", marginTop: 8, opacity: 0.8 }}>Resolved {selectedReport.resolvedAt}</p>}
                            </div>
                        )}

                        {selectedReport.status !== "RESOLVED" && selectedReport.status !== "DISMISSED" && (
                            <div style={{ display: "flex", gap: "var(--space-sm)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--border-light)" }}>
                                <button className="btn-secondary" style={{ flex: 1 }}>Assign to Me</button>
                                <button className="btn-secondary" style={{ flex: 1, color: "var(--color-danger)", borderColor: "var(--color-danger)" }}>Dismiss</button>
                                <button className="btn-primary" style={{ flex: 1, background: "var(--color-danger)" }}>Take Action</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
