import Link from "next/link";

export default function VolunteerOpportunitiesPage() {
    const opportunities = [
        { id: "1", title: "Food Distribution Drive", ngo: "Hope Foundation", distance: "0.8 km", urgency: "HIGH", volunteers: 3 },
        { id: "2", title: "Teaching Session", ngo: "EduChild", distance: "2.1 km", urgency: "MEDIUM", volunteers: 1 },
        { id: "3", title: "Medical Camp Assistance", ngo: "HealthFirst", distance: "3.5 km", urgency: "HIGH", volunteers: 5 },
    ];

    const urgencyColor: Record<string, { bg: string; text: string }> = {
        HIGH: { bg: '#FFEBEE', text: '#E53935' },
        MEDIUM: { bg: '#FFF8E1', text: '#F9A825' },
        LOW: { bg: '#E8F5E9', text: '#2E7D32' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Link href="/volunteer" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Find Opportunities</h1>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-disabled)', fontSize: 20 }}>search</span>
                <input type="text" placeholder="Search opportunities..." className="field-input" style={{ paddingLeft: 38 }} />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                <button className="tab-pill tab-pill-active">All</button>
                <button className="tab-pill">Nearby</button>
                <button className="tab-pill">Urgent</button>
                <button className="tab-pill">My Skills</button>
                <Link href="/volunteer/opportunities/map" className="tab-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>map</span> Map
                </Link>
            </div>

            {/* Opportunities List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {opportunities.map(opp => {
                    const uc = urgencyColor[opp.urgency] || urgencyColor.MEDIUM;
                    return (
                        <div key={opp.id} className="card" style={{ padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>{opp.title}</h3>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{opp.ngo}</p>
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: uc.bg, color: uc.text }}>{opp.urgency}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--color-text-disabled)', marginBottom: 12 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> {opp.distance}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group</span> {opp.volunteers} needed
                                </span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>Apply</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
