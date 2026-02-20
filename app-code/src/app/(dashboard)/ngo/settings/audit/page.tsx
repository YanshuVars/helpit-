import Link from "next/link";

const auditLogs = [
    { id: "1", action: "MEMBER_ADDED", actor: "Sarah Admin", target: "Jane Member", timestamp: "2 hours ago" },
    { id: "2", action: "REQUEST_CREATED", actor: "John Coordinator", target: "Emergency Food Relief", timestamp: "5 hours ago" },
    { id: "3", action: "VOLUNTEER_ASSIGNED", actor: "Sarah Admin", target: "Mike Wilson", timestamp: "1 day ago" },
    { id: "4", action: "PROFILE_UPDATED", actor: "Sarah Admin", target: "Organization Profile", timestamp: "2 days ago" },
    { id: "5", action: "REQUEST_RESOLVED", actor: "John Coordinator", target: "Medical Supplies", timestamp: "1 week ago" },
];

const actionIcons: Record<string, { icon: string; bg: string; color: string }> = {
    MEMBER_ADDED: { icon: "person_add", bg: "#E8F5E9", color: "#2E7D32" },
    REQUEST_CREATED: { icon: "add_circle", bg: "#E3F2FD", color: "#1565C0" },
    VOLUNTEER_ASSIGNED: { icon: "assignment_ind", bg: "#EDE7F6", color: "#4527A0" },
    PROFILE_UPDATED: { icon: "edit", bg: "#FFF3E0", color: "#E65100" },
    REQUEST_RESOLVED: { icon: "check_circle", bg: "#E8F5E9", color: "#2E7D32" },
};

export default function NGOAuditLogPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <Link href="/ngo/settings" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to settings
                </Link>
                <h1 className="page-title">Audit Log</h1>
            </div>

            {/* Filters */}
            <div className="tabs-row">
                <button className="tab-pill tab-pill-active">All</button>
                <button className="tab-pill">Members</button>
                <button className="tab-pill">Requests</button>
                <button className="tab-pill">Volunteers</button>
            </div>

            {/* Log List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {auditLogs.map(log => {
                    const { icon, bg, color } = actionIcons[log.action] || { icon: "info", bg: "#F5F5F5", color: "#616161" };
                    return (
                        <div key={log.id} className="card" style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: '50%',
                                    background: bg, color: color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13 }}>
                                        <span style={{ fontWeight: 600 }}>{log.actor}</span>
                                        {" "}
                                        <span style={{ color: 'var(--color-text-body)' }}>{log.action.replace(/_/g, " ").toLowerCase()}</span>
                                        {" "}
                                        <span style={{ fontWeight: 600 }}>{log.target}</span>
                                    </p>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginTop: 3 }}>{log.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
