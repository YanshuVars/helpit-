import Link from "next/link";

// Mock request data
const request = {
    id: "1",
    title: "Emergency Food Relief",
    description: "We need volunteers to help distribute food packages to families affected by the recent floods in the eastern district. Packages are ready at our warehouse and need to be delivered to approximately 50 families.",
    category: "FOOD",
    urgency: "CRITICAL",
    status: "OPEN",
    location: "Eastern District Community Center, 123 Main Street",
    createdBy: "Admin Sarah",
    createdAt: "2 hours ago",
    volunteers: [
        { id: "v1", name: "John Doe", avatar: "J", status: "ACCEPTED" },
        { id: "v2", name: "Jane Smith", avatar: "J", status: "IN_PROGRESS" },
        { id: "v3", name: "Mike Wilson", avatar: "M", status: "ASSIGNED" },
    ],
};

const urgencyMap: Record<string, { bg: string; color: string }> = {
    CRITICAL: { bg: '#FEE2E2', color: '#DC2626' },
    HIGH: { bg: '#FFF3E0', color: '#E65100' },
    MEDIUM: { bg: '#FFF8E1', color: '#F57F17' },
    LOW: { bg: '#E8F5E9', color: '#2E7D32' },
};

export default function RequestDetailPage() {
    const uStyle = urgencyMap[request.urgency] || { bg: '#F5F5F5', color: '#616161' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <Link href="/ngo/requests" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                        Back to requests
                    </Link>
                    <h1 className="page-title">{request.title}</h1>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Created {request.createdAt}</p>
                </div>
                <button className="btn btn-secondary" style={{ padding: '6px 10px', minHeight: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
                </button>
            </div>

            {/* Status Badges */}
            <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: uStyle.bg, color: uStyle.color }}>{request.urgency}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: '#E3F2FD', color: '#1565C0' }}>{request.status}</span>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)' }}>{request.category}</span>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: 18 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Description</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6 }}>{request.description}</p>
            </div>

            {/* Location */}
            <div className="card" style={{ padding: 18 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 18 }}>location_on</span>
                    Location
                </h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{request.location}</p>
                <div style={{ height: 100, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-text-disabled)', fontSize: 13 }}>Map</span>
                </div>
                <button className="auth-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 10, width: '100%', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>directions</span>
                    Get Directions
                </button>
            </div>

            {/* Assigned Volunteers */}
            <div className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 14 }}>Assigned Volunteers ({request.volunteers.length})</h3>
                    <Link href={`/ngo/requests/${request.id}/assign`} className="auth-link" style={{ fontSize: 13, fontWeight: 600 }}>+ Assign</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {request.volunteers.map(vol => (
                        <div key={vol.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: '50%',
                                background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 14,
                            }}>{vol.avatar}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 500, fontSize: 13 }}>{vol.name}</p>
                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{vol.status.replace("_", " ")}</p>
                            </div>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', minHeight: 0 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>chat</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Link href={`/ngo/requests/${request.id}/edit`} className="btn btn-secondary" style={{ justifyContent: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                    Edit
                </Link>
                <button className="btn btn-primary" style={{ background: 'var(--color-success)', justifyContent: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                    Mark Resolved
                </button>
            </div>
        </div>
    );
}
