"use client";

import { useState } from "react";

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

    const statusColor: Record<string, { bg: string; text: string }> = {
        PENDING: { bg: '#fef3c7', text: '#d97706' },
        IN_REVIEW: { bg: '#dbeafe', text: '#2563eb' },
        RESOLVED: { bg: '#dcfce7', text: '#16a34a' },
        DISMISSED: { bg: '#f1f5f9', text: '#94a3b8' },
    };
    const priorityColor: Record<string, { bg: string; text: string }> = {
        HIGH: { bg: '#fee2e2', text: '#dc2626' },
        MEDIUM: { bg: '#fef3c7', text: '#d97706' },
        LOW: { bg: '#dcfce7', text: '#16a34a' },
    };
    const typeIcon: Record<string, { icon: string; color: string }> = {
        NGO_REPORT: { icon: 'domain', color: '#1de2d1' },
        USER_REPORT: { icon: 'person', color: '#3b82f6' },
        CONTENT_REPORT: { icon: 'article', color: '#f59e0b' },
    };

    const selectStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0',
        background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer', outline: 'none',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Moderation Reports</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Review and manage user reports</p>
            </div>

            {/* Stats */}
            <div className="r-grid-4">
                {[
                    { icon: 'pending', label: 'Pending', value: 12, color: '#f59e0b' },
                    { icon: 'visibility', label: 'In Review', value: 5, color: '#3b82f6' },
                    { icon: 'check_circle', label: 'Resolved', value: 89, color: '#16a34a' },
                    { icon: 'priority_high', label: 'High Priority', value: 3, color: '#dc2626' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', padding: 22, borderRadius: 16,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: `${s.color}15`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 20,
                border: '1px solid #e2e8f0', display: 'flex', gap: 12, flexWrap: 'wrap',
            }}>
                <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 22 }}>search</span>
                    <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 46px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                    {statusFilters.map(s => <option key={s} value={s}>{s === "ALL" ? "All Status" : s.replace("_", " ")}</option>)}
                </select>
                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={selectStyle}>
                    {priorityFilters.map(p => <option key={p} value={p}>{p === "ALL" ? "All Priority" : p}</option>)}
                </select>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
                    {typeFilters.map(t => <option key={t} value={t}>{t === "ALL" ? "All Types" : t.replace("_", " ")}</option>)}
                </select>
            </div>

            {/* Report Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filteredReports.map(r => {
                    const sc = statusColor[r.status] || statusColor.PENDING;
                    const pc = priorityColor[r.priority] || priorityColor.MEDIUM;
                    const ti = typeIcon[r.type] || { icon: 'report', color: '#94a3b8' };
                    return (
                        <div key={r.id} onClick={() => { setSelectedReport(r); setShowDetailModal(true); }}
                            style={{
                                background: '#fff', borderRadius: 16, padding: 22,
                                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                cursor: 'pointer', transition: 'box-shadow 200ms, transform 200ms',
                                display: 'flex', alignItems: 'start', gap: 16,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 14,
                                background: `${ti.color}15`, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 24, color: ti.color }}>{ti.icon}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</h3>
                                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.text, flexShrink: 0 }}>{r.priority}</span>
                                </div>
                                <p style={{ fontSize: 13, color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8 }}>{r.description}</p>
                                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94a3b8' }}>
                                    <span>By: {r.reporter.name}</span><span>•</span>
                                    <span>Against: {r.reportedEntity.name}</span><span>•</span>
                                    <span>{r.createdAt}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                                <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text }}>{r.status.replace("_", " ")}</span>
                                {r.evidence.length > 0 && (
                                    <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>attach_file</span>{r.evidence.length} files
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedReport && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowDetailModal(false)} />
                    <div style={{
                        position: 'relative', width: '100%', maxWidth: 640, maxHeight: '90vh',
                        overflowY: 'auto', background: '#fff', borderRadius: 20, padding: 28,
                        boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                        display: 'flex', flexDirection: 'column', gap: 20,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Report Details</h2>
                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: (statusColor[selectedReport.status] || statusColor.PENDING).bg, color: (statusColor[selectedReport.status] || statusColor.PENDING).text }}>{selectedReport.status.replace("_", " ")}</span>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: 14, padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Report Type', value: selectedReport.type.replace("_", " ") },
                                { label: 'Priority', value: selectedReport.priority, isBadge: true },
                                { label: 'Reporter', value: selectedReport.reporter.name },
                                { label: 'Reported', value: `${selectedReport.reportedEntity.name} (${selectedReport.reportedEntity.type})` },
                            ].map(f => (
                                <div key={f.label}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{f.label}</p>
                                    {f.isBadge ? (
                                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: (priorityColor[f.value] || priorityColor.MEDIUM).bg, color: (priorityColor[f.value] || priorityColor.MEDIUM).text }}>{f.value}</span>
                                    ) : (
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{f.value}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 8 }}>Description</h3>
                            <p style={{ fontSize: 14, color: '#64748b', background: '#f8fafc', borderRadius: 12, padding: 14, lineHeight: 1.6 }}>{selectedReport.description}</p>
                        </div>

                        {selectedReport.evidence.length > 0 && (
                            <div>
                                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 8 }}>Evidence ({selectedReport.evidence.length} files)</h3>
                                {selectedReport.evidence.map((f, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: 12, background: '#f8fafc', borderRadius: 10, marginBottom: 8,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 18 }}>description</span>
                                            <span style={{ fontSize: 13, color: '#0f172a' }}>{f}</span>
                                        </div>
                                        <button style={{ color: '#1de2d1', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedReport.resolution && (
                            <div style={{ background: '#dcfce7', borderRadius: 12, padding: 16 }}>
                                <h3 style={{ fontWeight: 700, color: '#166534', marginBottom: 4, fontSize: 14 }}>Resolution</h3>
                                <p style={{ fontSize: 13, color: '#166534' }}>{selectedReport.resolution}</p>
                                {selectedReport.resolvedAt && <p style={{ fontSize: 11, color: '#16a34a', marginTop: 6 }}>Resolved {selectedReport.resolvedAt}</p>}
                            </div>
                        )}

                        {selectedReport.status !== "RESOLVED" && selectedReport.status !== "DISMISSED" && (
                            <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                                <button style={{ flex: 1, height: 42, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#0f172a', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Assign to Me</button>
                                <button style={{ flex: 1, height: 42, borderRadius: 10, border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Dismiss</button>
                                <button style={{ flex: 1, height: 42, borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Take Action</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
