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
            const { error } = await supabase.from("ngos").update({ verification_status: "APPROVED" }).eq("id", ngoId);
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

    const statusBadge: Record<string, { bg: string; text: string }> = {
        ACTIVE: { bg: '#dcfce7', text: '#16a34a' },
        SUSPENDED: { bg: '#fee2e2', text: '#dc2626' },
        INACTIVE: { bg: '#f1f5f9', text: '#94a3b8' },
    };
    const verBadge: Record<string, { bg: string; text: string }> = {
        VERIFIED: { bg: '#dcfce7', text: '#16a34a' },
        PENDING: { bg: '#fef3c7', text: '#d97706' },
        REJECTED: { bg: '#fee2e2', text: '#dc2626' },
    };

    const thStyle: React.CSSProperties = {
        textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700,
        color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
    };
    const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14 };
    const selectStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0',
        background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer', outline: 'none',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>NGO Management</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Manage registered NGOs and verifications</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 22 }}>search</span>
                    <input type="text" placeholder="Search NGOs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 46px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
                <select value={verificationFilter} onChange={e => setVerificationFilter(e.target.value)} style={selectStyle}>
                    <option value="all">All Verification</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : filteredNGOs.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
                    border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#cbd5e1' }}>domain</span>
                    <p style={{ color: '#94a3b8', marginTop: 10, fontSize: 14 }}>No NGOs found</p>
                </div>
            ) : (
                <div style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    {['NGO', 'Location', 'Status', 'Verification', 'Donations', 'Volunteers', 'Actions'].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNGOs.map(ngo => {
                                    const sb = statusBadge[ngo.status] || statusBadge.INACTIVE;
                                    const vb = verBadge[ngo.verification_status] || verBadge.PENDING;
                                    return (
                                        <tr key={ngo.id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 150ms' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: 10,
                                                        background: 'rgba(29,226,209,0.08)', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#1de2d1' }}>domain</span>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{ngo.name}</p>
                                                        <p style={{ fontSize: 11, color: '#94a3b8' }}>{ngo.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ ...tdStyle, color: '#64748b', fontSize: 13 }}>
                                                {[ngo.city, ngo.state].filter(Boolean).join(", ") || "N/A"}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sb.bg, color: sb.text }}>{ngo.status}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: vb.bg, color: vb.text }}>{ngo.verification_status}</span>
                                            </td>
                                            <td style={{ ...tdStyle, color: '#16a34a', fontWeight: 600, fontSize: 13 }}>
                                                {formatCurrency(ngo.total_donations_received || 0)}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#64748b', fontSize: 13 }}>
                                                {ngo.volunteer_count || 0}
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {ngo.verification_status === "PENDING" && (
                                                        <button onClick={() => verifyNGO(ngo.id)} style={{
                                                            padding: '5px 14px', borderRadius: 8, border: '1px solid #dcfce7',
                                                            background: '#f0fdf4', color: '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                        }}>Verify</button>
                                                    )}
                                                    {ngo.status === "ACTIVE" && (
                                                        <button onClick={() => suspendNGO(ngo.id)} style={{
                                                            padding: '5px 14px', borderRadius: 8, border: '1px solid #fee2e2',
                                                            background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                        }}>Suspend</button>
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
