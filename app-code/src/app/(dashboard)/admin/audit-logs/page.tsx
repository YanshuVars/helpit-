"use client";

import { useState } from "react";

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
        USER_MANAGEMENT: '#3b82f6', NGO_MANAGEMENT: '#1de2d1',
        DONATION: '#16a34a', MODERATION: '#dc2626', PLATFORM: '#8b5cf6',
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

    const thStyle: React.CSSProperties = {
        textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700,
        color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
    };
    const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14 };
    const selectStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0',
        background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer', outline: 'none',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Audit Logs</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Track all platform activities and changes</p>
                </div>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                    borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
                    fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>Export Logs
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Actions Today', value: '1,234', color: '#0f172a' },
                    { label: 'User Management', value: '456', color: '#3b82f6' },
                    { label: 'NGO Management', value: '234', color: '#1de2d1' },
                    { label: 'Moderation Actions', value: '89', color: '#dc2626' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', padding: 22, borderRadius: 16,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <p style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 20,
                border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 14,
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 22 }}>search</span>
                        <input type="text" placeholder="Search by actor, target, or details..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px 10px 46px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none' }}
                            onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selectStyle}>
                        {categoryFilters.map(c => <option key={c} value={c}>{c === "ALL" ? "All Categories" : c.replace(/_/g, " ")}</option>)}
                    </select>
                    <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={selectStyle}>
                        {actionFilters.map(a => <option key={a} value={a}>{a === "ALL" ? "All Actions" : a.replace(/_/g, " ")}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>From:</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>To:</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none' }} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Timestamp', 'Action', 'Actor', 'Target', 'Details', 'IP'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => {
                                const { date, time } = fmtTs(log.timestamp);
                                const cc = catColor[log.category] || '#94a3b8';
                                return (
                                    <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 150ms' }}
                                        onClick={() => setSelectedLog(log)}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                                        <td style={tdStyle}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{date}</p>
                                            <p style={{ fontSize: 11, color: '#94a3b8' }}>{time}</p>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: 10,
                                                    background: `${cc}15`, display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: cc }}>{actionIcon[log.action] || 'info'}</span>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{log.action.replace(/_/g, " ")}</p>
                                                    <p style={{ fontSize: 11, color: '#94a3b8' }}>{log.category.replace(/_/g, " ")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{log.actor.name}</p>
                                            <p style={{ fontSize: 11, color: '#94a3b8' }}>{log.actor.role.replace(/_/g, " ")}</p>
                                        </td>
                                        <td style={tdStyle}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{log.target.name}</p>
                                            <p style={{ fontSize: 11, color: '#94a3b8' }}>{log.target.type}</p>
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: 13 }}>{log.details}</td>
                                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>{log.ipAddress}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 13, color: '#94a3b8' }}>Showing {filteredLogs.length} of {mockAuditLogs.length} logs</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button disabled style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, fontWeight: 600, color: '#cbd5e1', cursor: 'not-allowed' }}>Previous</button>
                        <button style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedLog(null)} />
                    <div style={{
                        position: 'relative', width: '100%', maxWidth: 520,
                        background: '#fff', borderRadius: 20, padding: 28,
                        boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                        display: 'flex', flexDirection: 'column', gap: 20,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Log Details</h2>
                            <button onClick={() => setSelectedLog(null)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: 14, padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Timestamp</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{fmtTs(selectedLog.timestamp).date} at {fmtTs(selectedLog.timestamp).time}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Category</p>
                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${catColor[selectedLog.category] || '#94a3b8'}15`, color: catColor[selectedLog.category] || '#94a3b8' }}>{selectedLog.category.replace(/_/g, " ")}</span>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Actor</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{selectedLog.actor.name}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Target</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{selectedLog.target.name}</p>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Action Details</p>
                            <p style={{ fontSize: 14, color: '#64748b', background: '#f8fafc', borderRadius: 12, padding: 14, lineHeight: 1.6 }}>{selectedLog.details}</p>
                        </div>
                        {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Additional Data</p>
                                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14 }}>
                                    {Object.entries(selectedLog.metadata).map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ color: '#94a3b8' }}>{k}:</span>
                                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>IP Address</p>
                                <p style={{ fontSize: 13, fontFamily: 'monospace', color: '#0f172a', marginTop: 2 }}>{selectedLog.ipAddress}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>User Agent</p>
                                <p style={{ fontSize: 13, color: '#0f172a', marginTop: 2 }}>{selectedLog.userAgent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
