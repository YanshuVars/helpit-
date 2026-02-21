"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

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
    PROCESSING: { bg: "rgba(59,130,246,0.08)", text: "#2563eb", ring: "rgba(37,99,235,0.2)" },
    FAILED: { bg: "rgba(239,68,68,0.08)", text: "#dc2626", ring: "rgba(220,38,38,0.2)" },
};

const paymentIcons: Record<string, { icon: string; bg: string; color: string }> = {
    UPI: { icon: "qr_code_2", bg: "rgba(16,185,129,0.1)", color: "#059669" },
    BANK: { icon: "account_balance", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    CARD: { icon: "credit_card", bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
    WIRE: { icon: "currency_exchange", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

export default function DonationsDashboardPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalReceived, setTotalReceived] = useState(0);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: membership } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", session.user.id).single();
            if (!membership) { setLoading(false); return; }

            const { data } = await supabase
                .from("donations")
                .select("id, donor_name, amount, status, payment_method, created_at")
                .eq("ngo_id", membership.ngo_id)
                .order("created_at", { ascending: false })
                .limit(20);

            const donList = data || [];
            setDonations(donList);
            setTotalReceived(donList.reduce((sum, d) => sum + (d.amount || 0), 0));
            setLoading(false);
        }
        load();
    }, []);

    const stats = [
        { label: "Total Received", value: formatCurrency(totalReceived), icon: "account_balance_wallet", iconBg: "rgba(29,226,209,0.1)", iconColor: "#1de2d1", trend: "+12%", up: true },
        { label: "This Month", value: formatCurrency(Math.floor(totalReceived * 0.25)), icon: "calendar_month", iconBg: "rgba(59,130,246,0.1)", iconColor: "#2563eb", trend: "+8%", up: true },
        { label: "Active Donors", value: donations.length, icon: "group", iconBg: "rgba(139,92,246,0.1)", iconColor: "#7c3aed", trend: "4 New", up: null },
        { label: "Avg Donation", value: formatCurrency(donations.length ? Math.floor(totalReceived / donations.length) : 0), icon: "analytics", iconBg: "rgba(245,158,11,0.1)", iconColor: "#d97706", trend: "-2%", up: false },
    ];

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumbs + Header */}
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
                    <button style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "9px 16px", borderRadius: 8,
                        border: "1px solid #e2e8f0", background: "#fff",
                        fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                        Export
                    </button>
                    <button style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "9px 16px", borderRadius: 8,
                        background: "#1de2d1", color: "#0f172a",
                        fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Add Donation
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
                        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                            {s.up !== null && (
                                <span style={{
                                    display: "flex", alignItems: "center", fontWeight: 600,
                                    color: s.up ? "#059669" : "#dc2626",
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 2 }}>
                                        {s.up ? "trending_up" : "trending_down"}
                                    </span>
                                    {s.trend}
                                </span>
                            )}
                            {s.up === null && (
                                <span style={{ display: "flex", alignItems: "center", fontWeight: 600, color: "#64748b" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 2 }}>add_circle</span>
                                    {s.trend}
                                </span>
                            )}
                            <span style={{ color: "#94a3b8" }}>vs last month</span>
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
                                            {d.payment_method || "UPI"}
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

                {/* Pagination */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", borderTop: "1px solid #e2e8f0",
                }}>
                    <p style={{ fontSize: 13, color: "#64748b" }}>
                        Showing 1 to {donations.length} of {donations.length} results
                    </p>
                    <div style={{ display: "flex", gap: 0 }}>
                        <button style={{
                            padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: "4px 0 0 4px",
                            background: "#fff", cursor: "pointer",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#94a3b8" }}>chevron_left</span>
                        </button>
                        <button style={{
                            padding: "6px 14px", background: "#1de2d1",
                            color: "#0f172a", fontWeight: 700, fontSize: 13, border: "none",
                        }}>1</button>
                        <button style={{
                            padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: "0 4px 4px 0",
                            background: "#fff", cursor: "pointer",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#94a3b8" }}>chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
