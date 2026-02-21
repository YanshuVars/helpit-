import Link from "next/link";

const opportunities = [
    { id: "1", title: "Food Distribution Drive", ngo: "Hope Foundation", distance: "0.8 km", urgency: "HIGH", volunteers: 3, date: "Feb 25, 2026", category: "Community", icon: "restaurant" },
    { id: "2", title: "Teaching Session", ngo: "EduChild", distance: "2.1 km", urgency: "MEDIUM", volunteers: 1, date: "Feb 28, 2026", category: "Education", icon: "school" },
    { id: "3", title: "Medical Camp Assistance", ngo: "HealthFirst", distance: "3.5 km", urgency: "HIGH", volunteers: 5, date: "Mar 2, 2026", category: "Medical", icon: "local_hospital" },
    { id: "4", title: "Beach Cleanup Drive", ngo: "GreenEarth", distance: "5.0 km", urgency: "LOW", volunteers: 10, date: "Mar 5, 2026", category: "Environment", icon: "eco" },
    { id: "5", title: "Animal Shelter Support", ngo: "PawCare", distance: "1.2 km", urgency: "MEDIUM", volunteers: 2, date: "Mar 8, 2026", category: "Animals", icon: "pets" },
];

const urgencyConfig: Record<string, { bg: string; text: string; label: string }> = {
    HIGH: { bg: '#fee2e2', text: '#dc2626', label: 'Urgent' },
    MEDIUM: { bg: '#fef3c7', text: '#d97706', label: 'Moderate' },
    LOW: { bg: '#dcfce7', text: '#16a34a', label: 'Flexible' },
};

const catColors: Record<string, { bg: string; text: string }> = {
    Community: { bg: '#fef3c7', text: '#92400e' },
    Education: { bg: '#dbeafe', text: '#1e40af' },
    Medical: { bg: '#fce7f3', text: '#9d174d' },
    Environment: { bg: '#dcfce7', text: '#166534' },
    Animals: { bg: '#ede9fe', text: '#5b21b6' },
};

export default function VolunteerOpportunitiesPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Volunteer Opportunities
                </h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                    Find opportunities near you and make a real difference in your community.
                </p>
            </div>

            {/* Search + Map Toggle */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 20,
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#94a3b8', fontSize: 22,
                        }}>search</span>
                        <input
                            type="text" placeholder="Search opportunities by name, skill, or NGO..."
                            style={{
                                width: '100%', padding: '12px 16px 12px 46px',
                                borderRadius: 12, border: '1px solid #e2e8f0',
                                background: '#f8fafc', fontSize: 14, color: '#0f172a',
                                outline: 'none',
                            }}
                            onFocus={e => e.target.style.borderColor = '#1de2d1'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                    <Link href="/volunteer/opportunities/map" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '12px 20px', borderRadius: 12,
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 13, fontWeight: 700, color: '#0f172a', textDecoration: 'none',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>map</span>
                        Map View
                    </Link>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {['All', 'Nearby', 'Urgent', 'My Skills', 'Education', 'Environment'].map((f, i) => (
                        <button key={f} style={{
                            padding: '7px 14px', borderRadius: 999,
                            border: i === 0 ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                            background: i === 0 ? 'rgba(29,226,209,0.08)' : '#fff',
                            color: i === 0 ? '#0d9488' : '#64748b',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Opportunities Grid */}
            <div className="r-grid-cards" style={{ gap: 20 }}>
                {opportunities.map(opp => {
                    const uc = urgencyConfig[opp.urgency] || urgencyConfig.MEDIUM;
                    const cc = catColors[opp.category] || { bg: '#f1f5f9', text: '#475569' };
                    return (
                        <div key={opp.id} style={{
                            background: '#fff', borderRadius: 16,
                            border: '1px solid #e2e8f0', overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 300ms, transform 300ms',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ padding: 22 }}>
                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12,
                                            background: cc.bg, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: cc.text }}>{opp.icon}</span>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{opp.title}</h3>
                                            <p style={{ fontSize: 12, color: '#64748b' }}>{opp.ngo}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: 999,
                                        fontSize: 11, fontWeight: 700,
                                        background: uc.bg, color: uc.text,
                                    }}>{uc.label}</span>
                                </div>

                                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                    {[
                                        { icon: 'location_on', val: opp.distance },
                                        { icon: 'event', val: opp.date },
                                        { icon: 'group', val: `${opp.volunteers} needed` },
                                    ].map(m => (
                                        <span key={m.icon} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{m.icon}</span>
                                            {m.val}
                                        </span>
                                    ))}
                                </div>

                                <button style={{
                                    width: '100%', padding: '10px 16px', borderRadius: 10,
                                    background: '#1de2d1', color: '#0f172a',
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                    border: 'none', transition: 'background 200ms',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>how_to_reg</span>
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
