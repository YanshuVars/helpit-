import Link from "next/link";

const availableVolunteers = [
    { id: "v4", name: "Alice Brown", skills: ["First Aid", "Driving"], distance: "0.5 km", available: true },
    { id: "v5", name: "Bob Johnson", skills: ["Cooking", "Counseling"], distance: "1.2 km", available: true },
    { id: "v6", name: "Carol White", skills: ["Teaching", "Photography"], distance: "2.3 km", available: true },
    { id: "v7", name: "David Lee", skills: ["First Aid", "Translation"], distance: "3.1 km", available: false },
];

export default function AssignVolunteersPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Link href="/ngo/requests/1" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to request
                </Link>
                <h1 className="page-title">Assign Volunteers</h1>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-disabled)', fontSize: 20 }}>search</span>
                <input type="text" placeholder="Search volunteers..." className="field-input" style={{ paddingLeft: 40 }} />
            </div>

            {/* Filters */}
            <div className="tabs-row">
                <button className="tab-pill tab-pill-active">All</button>
                <button className="tab-pill">Nearby</button>
                <button className="tab-pill">Available Now</button>
                <button className="tab-pill">First Aid</button>
            </div>

            {/* Volunteer List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {availableVolunteers.map(vol => (
                    <div key={vol.id} className="card" style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
                            }}>
                                {vol.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>{vol.name}</span>
                                    <span style={{
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: vol.available ? 'var(--color-success)' : 'var(--color-text-disabled)',
                                    }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                                    {vol.distance}
                                </div>
                            </div>
                            <button
                                className={`btn ${vol.available ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: 12, padding: '6px 14px', minHeight: 0, opacity: vol.available ? 1 : 0.5 }}
                                disabled={!vol.available}
                            >
                                Assign
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                            {vol.skills.map(skill => (
                                <span key={skill} style={{
                                    fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                    background: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)',
                                }}>{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
