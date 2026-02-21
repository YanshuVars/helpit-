"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MissingPerson {
    id: string; name: string; age: number; gender: string;
    lastSeen: string; location: string; photo: string | null;
    status: string; reportedAt: string;
}

export default function MissingPersonsPage() {
    const [persons, setPersons] = useState<MissingPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPersons([
                { id: "1", name: "Priya Mehta", age: 12, gender: "Female", lastSeen: "2 days ago", location: "Andheri, Mumbai", photo: null, status: "MISSING", reportedAt: "2026-02-16" },
                { id: "2", name: "Ravi Kumar", age: 8, gender: "Male", lastSeen: "1 week ago", location: "Connaught Place, Delhi", photo: null, status: "MISSING", reportedAt: "2026-02-11" },
                { id: "3", name: "Sita Sharma", age: 65, gender: "Female", lastSeen: "3 days ago", location: "Koramangala, Bangalore", photo: null, status: "FOUND", reportedAt: "2026-02-15" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const filteredPersons = persons.filter(p =>
        (statusFilter === "ALL" || p.status === statusFilter) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusBadge: Record<string, { bg: string; text: string }> = {
        MISSING: { bg: '#fee2e2', text: '#dc2626' },
        FOUND: { bg: '#dcfce7', text: '#16a34a' },
        INVESTIGATING: { bg: '#fef3c7', text: '#d97706' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Missing Persons</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Help find missing individuals</p>
                </div>
                <Link href="/missing-persons/report" style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                    borderRadius: 12, background: '#1de2d1', color: '#0f172a',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none', border: 'none',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Report Missing Person
                </Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 22 }}>search</span>
                    <input type="text" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 46px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
                    padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0',
                    background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer', outline: 'none',
                }}>
                    <option value="ALL">All Status</option>
                    <option value="MISSING">Missing</option>
                    <option value="FOUND">Found</option>
                    <option value="INVESTIGATING">Investigating</option>
                </select>
            </div>

            {/* Cards */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : filteredPersons.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
                    border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>person_search</span>
                    <p style={{ color: '#94a3b8', marginTop: 10 }}>No records found</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                    {filteredPersons.map(p => {
                        const sb = statusBadge[p.status] || statusBadge.INVESTIGATING;
                        return (
                            <div key={p.id} style={{
                                background: '#fff', borderRadius: 16, padding: 20,
                                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'all 200ms',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#1de2d1'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                                <div style={{ display: 'flex', alignItems: 'start', gap: 14 }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 14,
                                        background: '#f1f5f9', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#94a3b8' }}>person</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{p.name}</h3>
                                            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sb.bg, color: sb.text }}>{p.status}</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 13, color: '#64748b' }}>
                                            <span>Age: {p.age}</span><span>Gender: {p.gender}</span>
                                        </div>
                                        <div style={{ marginTop: 10, fontSize: 13, color: '#94a3b8' }}>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>{p.location}
                                            </p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>Last seen: {p.lastSeen}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
