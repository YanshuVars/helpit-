import Link from "next/link";

const members = [
    { id: "m1", name: "Sarah Admin", email: "sarah@hopefoundation.org", role: "ADMIN", joined: "Jan 2023" },
    { id: "m2", name: "John Coordinator", email: "john@hopefoundation.org", role: "COORDINATOR", joined: "Mar 2023" },
    { id: "m3", name: "Jane Member", email: "jane@hopefoundation.org", role: "MEMBER", joined: "Jun 2024" },
];

const roleStyle: Record<string, { bg: string; color: string }> = {
    ADMIN: { bg: '#FEE2E2', color: '#DC2626' },
    COORDINATOR: { bg: '#E3F2FD', color: '#1565C0' },
    MEMBER: { bg: '#F5F5F5', color: '#616161' },
};

export default function NGOMembersPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <Link href="/ngo/settings" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to settings
                </Link>
                <h1 className="page-title">Team Members</h1>
            </div>

            <button style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 0', borderRadius: 'var(--radius-md)',
                border: '2px dashed var(--color-border)', background: 'none',
                color: 'var(--color-text-muted)', cursor: 'pointer',
                transition: 'all 150ms ease',
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person_add</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Invite Member</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {members.map(member => {
                    const rStyle = roleStyle[member.role] || { bg: '#F5F5F5', color: '#616161' };
                    return (
                        <div key={member.id} className="card" style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: 16, flexShrink: 0,
                                }}>{member.name.charAt(0)}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: 14 }}>{member.name}</p>
                                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{member.email}</p>
                                </div>
                                <button className="btn btn-secondary" style={{ padding: '6px 8px', minHeight: 0 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>more_vert</span>
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border-subtle)' }}>
                                <span style={{
                                    fontSize: 10, fontWeight: 700,
                                    padding: '3px 8px', borderRadius: 'var(--radius-full)',
                                    background: rStyle.bg, color: rStyle.color,
                                }}>{member.role}</span>
                                <span style={{ fontSize: 11, color: 'var(--color-text-disabled)' }}>Joined {member.joined}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
