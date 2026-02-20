"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface NGO {
    id: string; name: string; email: string; phone: string | null;
    registration_number: string | null; verification_status: string; status: string;
    category: string | null; city: string | null; state: string | null;
    total_donations_received: number; volunteer_count: number; member_count: number;
    rating: number; created_at: string; updated_at: string;
}

export default function AdminNGOsPage() {
    const supabase = createClient();
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");

    useEffect(() => { fetchNGOs(); }, [statusFilter, verificationFilter]);

    async function fetchNGOs() {
        setLoading(true);
        try {
            let query = supabase.from("ngos").select("*").order("created_at", { ascending: false });
            if (statusFilter !== "all") query = query.eq("status", statusFilter);
            if (verificationFilter !== "all") query = query.eq("verification_status", verificationFilter);
            const { data } = await query.limit(50);
            if (data) setNgos(data as NGO[]);
        } catch (e) { console.error("Error fetching NGOs:", e); }
        finally { setLoading(false); }
    }

    async function verifyNGO(ngoId: string) {
        try {
            const { error } = await supabase.from("ngos").update({ verification_status: "VERIFIED" }).eq("id", ngoId);
            if (error) throw error; fetchNGOs();
        } catch (e) { console.error("Error verifying NGO:", e); alert("Failed to verify NGO"); }
    }

    async function suspendNGO(ngoId: string) {
        try {
            const { error } = await supabase.from("ngos").update({ status: "SUSPENDED" }).eq("id", ngoId);
            if (error) throw error; fetchNGOs();
        } catch (e) { console.error("Error suspending NGO:", e); alert("Failed to suspend NGO"); }
    }

    const filteredNGOs = ngos.filter(n =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusColor: Record<string, string> = { ACTIVE: "var(--color-success)", SUSPENDED: "var(--color-danger)", INACTIVE: "var(--foreground-muted)" };
    const verColor: Record<string, string> = { VERIFIED: "var(--color-success)", PENDING: "var(--color-warning)", REJECTED: "var(--color-danger)" };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div>
                <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>NGOs</h1>
                <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Manage registered NGOs</p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <input type="text" placeholder="Search NGOs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="field-input" style={{ flex: 1, minWidth: 200 }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
                <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    <option value="all">All Verification</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* NGO table */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div className="spinner" /></div>
            ) : filteredNGOs.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--foreground-light)" }}>domain</span>
                    <p style={{ color: "var(--foreground-muted)", marginTop: 8 }}>No NGOs found</p>
                </div>
            ) : (
                <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--background-subtle)" }}>
                                    {["NGO", "Location", "Status", "Verification", "Donations", "Volunteers", "Actions"].map(h => (
                                        <th key={h} style={{ textAlign: "left", padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNGOs.map((ngo) => {
                                    const sc = statusColor[ngo.status] || "var(--foreground-muted)";
                                    const vc = verColor[ngo.verification_status] || "var(--foreground-muted)";
                                    return (
                                        <tr key={ngo.id} style={{ borderTop: "1px solid var(--border-light)" }}>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <p style={{ fontWeight: 600, fontSize: "var(--font-sm)" }}>{ngo.name}</p>
                                                <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{ngo.email}</p>
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>
                                                {[ngo.city, ngo.state].filter(Boolean).join(", ") || "N/A"}
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <span className="tab-pill" style={{ background: `${sc}20`, color: sc, fontSize: "var(--font-xs)" }}>{ngo.status}</span>
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <span className="tab-pill" style={{ background: `${vc}20`, color: vc, fontSize: "var(--font-xs)" }}>{ngo.verification_status}</span>
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--color-success)", fontWeight: 500 }}>
                                                {formatCurrency(ngo.total_donations_received || 0)}
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>
                                                {ngo.volunteer_count || 0}
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                                                    {ngo.verification_status === "PENDING" && (
                                                        <button className="btn-secondary" style={{ fontSize: "var(--font-xs)", color: "var(--color-success)", padding: "4px 12px" }}
                                                            onClick={() => verifyNGO(ngo.id)}>Verify</button>
                                                    )}
                                                    {ngo.status === "ACTIVE" && (
                                                        <button className="btn-secondary" style={{ fontSize: "var(--font-xs)", color: "var(--color-danger)", padding: "4px 12px" }}
                                                            onClick={() => suspendNGO(ngo.id)}>Suspend</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
