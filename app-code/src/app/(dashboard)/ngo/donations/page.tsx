"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";

interface Donation {
    id: string;
    donor_name: string;
    amount: number;
    status: string;
    payment_method: string;
    created_at: string;
}

const statusStyles: Record<string, { bg: string; text: string; ring: string }> = {
    COMPLETED: { bg: "rgba(16,185,129,0.08)", text: "#059669", ring: "rgba(5,150,105,0.2)" },
    PENDING: { bg: "rgba(245,158,11,0.08)", text: "#d97706", ring: "rgba(217,119,6,0.2)" },
    FAILED: { bg: "rgba(239,68,68,0.08)", text: "#dc2626", ring: "rgba(220,38,38,0.2)" },
    REFUNDED: { bg: "rgba(100,116,139,0.08)", text: "#64748b", ring: "rgba(100,116,139,0.2)" },
};

const paymentIcons: Record<string, { icon: string; bg: string; color: string }> = {
    UPI: { icon: "qr_code_2", bg: "rgba(16,185,129,0.1)", color: "#059669" },
    NET_BANKING: { icon: "account_balance", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    CARD: { icon: "credit_card", bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
    WALLET: { icon: "account_balance_wallet", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

export default function DonationsDashboardPage() {
    const { ngoId, loading: ctxLoading } = useNgoContext();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalReceived, setTotalReceived] = useState(0);
    const [thisMonthTotal, setThisMonthTotal] = useState(0);
    const [uniqueDonors, setUniqueDonors] = useState(0);

    function exportCSV() {
        if (donations.length === 0) return;
        const header = "Donor,Amount (INR),Status,Payment Method,Date\n";
        const rows = donations.map(d =>
            `"${d.donor_name || 'Anonymous'}",${d.amount},"${d.status}","${d.payment_method || 'N/A'}","${new Date(d.created_at).toLocaleDateString()}"`
        ).join("\n");
        const csv = header + rows;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            // All donations for this NGO
            const { data } = await supabase
                .from("donations")
                .select("id, donor_name, amount, status, payment_method, created_at")
                .eq("ngo_id", ngoId)
                .order("created_at", { ascending: false })
                .limit(50);

            const donList = data || [];
            setDonations(donList);

            // Calculate real stats
            const completed = donList.filter(d => d.status === 'COMPLETED');
            setTotalReceived(completed.reduce((sum, d) => sum + (d.amount || 0), 0));

            // This month
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const thisMonth = completed.filter(d => d.created_at >= monthStart);
            setThisMonthTotal(thisMonth.reduce((sum, d) => sum + (d.amount || 0), 0));

            // Unique donors
            const donors = new Set(donList.map(d => d.donor_name).filter(Boolean));
            setUniqueDonors(donors.size);

            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    const stats = [
        { label: "Total Received", value: formatCurrency(totalReceived), icon: "account_balance_wallet", iconBg: "rgba(29,226,209,0.1)", iconColor: "#1de2d1" },
        { label: "This Month", value: formatCurrency(thisMonthTotal), icon: "calendar_month", iconBg: "rgba(59,130,246,0.1)", iconColor: "#2563eb" },
        { label: "Unique Donors", value: uniqueDonors, icon: "group", iconBg: "rgba(139,92,246,0.1)", iconColor: "#7c3aed" },
        { label: "Avg Donation", value: formatCurrency(donations.filter(d => d.status === 'COMPLETED').length ? Math.floor(totalReceived / donations.filter(d => d.status === 'COMPLETED').length) : 0), icon: "analytics", iconBg: "rgba(245,158,11,0.1)", iconColor: "#d97706" },
    ];

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                        <span>NGO Dashboard</span>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                        <span style={{ color: "#1de2d1", fontWeight: 600 }}>Donations</span>
                    </nav>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Donations Overview</h2>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={exportCSV} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "9px 16px", borderRadius: 8,
                        border: "1px solid #e2e8f0", background: "#fff",
                        fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        background: "#fff", borderRadius: 12, padding: 20,
                        border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{s.label}</p>
                                <p style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginTop: 8 }}>{s.value}</p>
                            </div>
                            <div style={{
                                width: 44, height: 44, borderRadius: 8, background: s.iconBg,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <span className="material-symbols-outlined" style={{ color: s.iconColor, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Donations Table */}
            <div style={{
                background: "#fff", borderRadius: 12,
                border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                overflow: "hidden",
            }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "rgba(248,250,252,0.5)", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Donor Name</th>
                                <th style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Payment Method</th>
                                <th style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Date & Time</th>
                                <th style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#64748b", textAlign: "right" }}>Amount</th>
                                <th style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#64748b", textAlign: "center" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((d) => {
                                const sStyle = statusStyles[d.status] || statusStyles.PENDING;
                                const pStyle = paymentIcons[d.payment_method] || paymentIcons.UPI;
                                return (
                                    <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: "50%",
                                                    background: pStyle.bg, display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: pStyle.color }}>{pStyle.icon}</span>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{d.donor_name || "Anonymous"}</p>
                                                    <p style={{ fontSize: 11, color: "#94a3b8" }}>ID: #{d.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>
                                            {d.payment_method?.replace('_', ' ') || "—"}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <p style={{ fontSize: 13 }}>{new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                            <p style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(d.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                                        </td>
                                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                            <span style={{ fontWeight: 700, color: "#059669" }}>+{formatCurrency(d.amount)}</span>
                                        </td>
                                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                                                background: sStyle.bg, color: sStyle.text,
                                                border: `1px solid ${sStyle.ring}`,
                                            }}>{d.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {donations.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>inbox</span>
                                        <p>No donations recorded yet</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
