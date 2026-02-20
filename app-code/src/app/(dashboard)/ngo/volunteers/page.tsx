import Link from "next/link";

const volunteers = [
    { id: "v1", name: "John Doe", skills: ["First Aid", "Driving"], hours: 45, tasks: 12, status: "active" },
    { id: "v2", name: "Jane Smith", skills: ["Teaching", "Counseling"], hours: 78, tasks: 23, status: "active" },
    { id: "v3", name: "Mike Wilson", skills: ["Cooking"], hours: 32, tasks: 8, status: "inactive" },
];

export default function NGOVolunteersPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title">Volunteers</h1>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{volunteers.length} total</span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-disabled)', fontSize: 20 }}>search</span>
                <input type="text" placeholder="Search volunteers..." className="field-input" style={{ paddingLeft: 40 }} />
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {volunteers.map(v => (
                    <div key={v.id} className="card" style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'var(--color-primary-soft)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-primary)', fontWeight: 700, fontSize: 16, flexShrink: 0,
                            }}>
                                {v.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>{v.name}</span>
                                    <span style={{
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: v.status === "active" ? 'var(--color-success)' : 'var(--color-text-disabled)',
                                    }} />
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.hours} hrs • {v.tasks} tasks</p>
                            </div>
                            <button className="btn btn-secondary" style={{ padding: '6px 10px', minHeight: 0 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>chat</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                            {v.skills.map(skill => (
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
