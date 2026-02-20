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

    const statusColor: Record<string, string> = { MISSING: "var(--color-danger)", FOUND: "var(--color-success)", INVESTIGATING: "var(--color-warning)" };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Missing Persons</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Help find missing individuals</p>
                </div>
                <Link href="/missing-persons/report" className="btn-primary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Report Missing Person
                </Link>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                    <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--foreground-light)" }}>search</span>
                    <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="field-input" style={{ paddingLeft: 40 }} />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    <option value="ALL">All Status</option>
                    <option value="MISSING">Missing</option>
                    <option value="FOUND">Found</option>
                    <option value="INVESTIGATING">Investigating</option>
                </select>
            </div>

            {/* Cards */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div className="spinner" /></div>
            ) : filteredPersons.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--foreground-light)" }}>person_search</span>
                    <p style={{ color: "var(--foreground-muted)", marginTop: 8 }}>No records found</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-md)" }}>
                    {filteredPersons.map((p) => {
                        const sc = statusColor[p.status] || "var(--foreground-muted)";
                        return (
                            <div key={p.id} className="card">
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)" }}>
                                    <div style={{ width: 64, height: 64, borderRadius: "var(--radius-lg)", background: "var(--background-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--foreground-light)" }}>person</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                            <h3 style={{ fontWeight: 600, fontSize: "var(--font-base)" }}>{p.name}</h3>
                                            <span className="tab-pill" style={{ fontSize: 10, background: `${sc}20`, color: sc }}>{p.status}</span>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>
                                            <span>Age: {p.age}</span><span>Gender: {p.gender}</span>
                                        </div>
                                        <div style={{ marginTop: 8, fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>
                                            <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>{p.location}
                                            </p>
                                            <p style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
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
