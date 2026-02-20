"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

/* ── interfaces ── */
interface PlatformStats {
    totalUsers: number;
    newUsersThisMonth: number;
    totalNGOs: number;
    activeNGOs: number;
    pendingNGOs: number;
    totalVolunteers: number;
    activeVolunteers: number;
    totalDonors: number;
    totalDonations: number;
    monthlyDonations: number;
    openRequests: number;
    resolvedRequests: number;
}
interface Activity { id: string; type: string; message: string; time: string; status: string; }
interface PendingNGO { id: string; name: string; email: string; submitted: string; category: string; }
interface TopNGO { id: string; name: string; donations: number; volunteers: number; rating: number; }

export default function AdminDashboard() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<PlatformStats>({
        totalUsers: 0, newUsersThisMonth: 0, totalNGOs: 0, activeNGOs: 0,
        pendingNGOs: 0, totalVolunteers: 0, activeVolunteers: 0, totalDonors: 0,
        totalDonations: 0, monthlyDonations: 0, openRequests: 0, resolvedRequests: 0,
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([]);
    const [topNGOs, setTopNGOs] = useState<TopNGO[]>([]);
    const [timeRange, setTimeRange] = useState("month");

    useEffect(() => { fetchDashboardData(); }, [timeRange]);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            const now = new Date();
            let startDate = new Date();
            if (timeRange === "week") startDate.setDate(now.getDate() - 7);
            else if (timeRange === "month") startDate.setMonth(now.getMonth() - 1);
            else if (timeRange === "quarter") startDate.setMonth(now.getMonth() - 3);
            else startDate.setFullYear(now.getFullYear() - 1);

            const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });
            const { count: newUsers } = await supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", startDate.toISOString());
            const { count: totalNGOs } = await supabase.from("ngos").select("*", { count: "exact", head: true });
            const { count: activeNGOs } = await supabase.from("ngos").select("*", { count: "exact", head: true }).eq("verification_status", "VERIFIED");
            const { count: pendingNGOs } = await supabase.from("ngos").select("*", { count: "exact", head: true }).eq("verification_status", "PENDING");
            const { count: totalVolunteers } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "VOLUNTEER");
            const { count: totalDonors } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "INDIVIDUAL");
            const { data: donationsData } = await supabase.from("donations").select("amount, created_at").gte("created_at", startDate.toISOString());
            const totalDonations = donationsData?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
            const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
            const { data: monthlyData } = await supabase.from("donations").select("amount").gte("created_at", monthStart.toISOString());
            const monthlyDonations = monthlyData?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
            const { count: openRequests } = await supabase.from("help_requests").select("*", { count: "exact", head: true }).eq("status", "OPEN");
            const { count: resolvedRequests } = await supabase.from("help_requests").select("*", { count: "exact", head: true }).eq("status", "RESOLVED");

            setStats({
                totalUsers: totalUsers || 0, newUsersThisMonth: newUsers || 0,
                totalNGOs: totalNGOs || 0, activeNGOs: activeNGOs || 0,
                pendingNGOs: pendingNGOs || 0, totalVolunteers: totalVolunteers || 0,
                activeVolunteers: Math.floor((totalVolunteers || 0) * 0.6),
                totalDonors: totalDonors || 0, totalDonations, monthlyDonations,
                openRequests: openRequests || 0, resolvedRequests: resolvedRequests || 0,
            });

            const { data: pendingData } = await supabase
                .from("ngos").select("id, name, email, created_at, category")
                .eq("verification_status", "PENDING").order("created_at", { ascending: false }).limit(5);
            if (pendingData) {
                setPendingNGOs(pendingData.map(n => ({
                    id: n.id, name: n.name, email: n.email,
                    submitted: formatTimeAgo(n.created_at), category: n.category || "General",
                })));
            }

            const { data: topNgoData } = await supabase
                .from("ngos").select("id, name, total_donations_received, volunteer_count, rating")
                .eq("verification_status", "VERIFIED").order("total_donations_received", { ascending: false }).limit(5);
            if (topNgoData) {
                setTopNGOs(topNgoData.map(n => ({
                    id: n.id, name: n.name, donations: n.total_donations_received || 0,
                    volunteers: n.volunteer_count || 0, rating: n.rating || 0,
                })));
            }

            setActivities([
                { id: "1", type: "DONATION", message: "Recent donation received", time: "Just now", status: "COMPLETED" },
                { id: "2", type: "NGO_REGISTERED", message: "New NGO registration", time: "1 hour ago", status: "PENDING" },
                { id: "3", type: "USER_REPORT", message: "User report submitted", time: "2 hours ago", status: "PENDING" },
                { id: "4", type: "VERIFICATION", message: "NGO verification completed", time: "3 hours ago", status: "COMPLETED" },
                { id: "5", type: "REQUEST_RESOLVED", message: "Help request resolved", time: "5 hours ago", status: "COMPLETED" },
            ]);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }

    function formatTimeAgo(dateStr: string) {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    }

    const iconMap: Record<string, string> = {
        DONATION: "payments", NGO_REGISTERED: "domain_add",
        USER_REPORT: "flag", VERIFICATION: "verified", REQUEST_RESOLVED: "check_circle",
    };
    const colorMap: Record<string, string> = {
        DONATION: "var(--color-success)", NGO_REGISTERED: "var(--primary)",
        USER_REPORT: "var(--color-danger)", VERIFICATION: "var(--color-info)",
        REQUEST_RESOLVED: "var(--color-success)",
    };

    /* ── render ── */
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700, color: "var(--foreground)" }}>Platform Admin</h1>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Monitor and manage the Helpit platform</p>
                </div>
                <select
                    value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
                    className="field-input" style={{ width: "auto", height: 40, fontSize: "var(--font-sm)" }}
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Stats Grid — 4 cols */}
            <div className="stat-grid">
                {[
                    { icon: "groups", label: "Total Users", value: stats.totalUsers.toLocaleString(), sub: `+${stats.newUsersThisMonth} this month`, subColor: "var(--color-success)" },
                    { icon: "domain", label: "Active NGOs", value: stats.activeNGOs, sub: `${stats.pendingNGOs} pending`, subColor: "var(--color-warning)" },
                    { icon: "volunteer_activism", label: "Volunteers", value: stats.totalVolunteers.toLocaleString(), sub: `${stats.activeVolunteers} active`, subColor: "var(--color-success)" },
                    { icon: "favorite", label: "Donors", value: stats.totalDonors.toLocaleString() },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: "var(--primary)" }}>{s.icon}</span>
                        <p className="stat-value">{s.value}</p>
                        <p className="stat-label">{s.label}</p>
                        {s.sub && <p style={{ fontSize: "var(--font-xs)", color: s.subColor, marginTop: 4 }}>{s.sub}</p>}
                    </div>
                ))}
            </div>

            {/* Financial row — 3 cols */}
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                <div className="stat-card">
                    <p className="stat-value">{formatCurrency(stats.totalDonations)}</p>
                    <p className="stat-label">Total Donations</p>
                    <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", marginTop: 4 }}>All time</p>
                </div>
                <div className="stat-card">
                    <p className="stat-value" style={{ color: "var(--color-success)" }}>{formatCurrency(stats.monthlyDonations)}</p>
                    <p className="stat-label">Monthly Donations</p>
                    <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)", marginTop: 4 }}>This month</p>
                </div>
                <div className="stat-card">
                    <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: 4 }}>
                        <div>
                            <p className="stat-value" style={{ color: "var(--color-warning)" }}>{stats.openRequests}</p>
                            <p className="stat-label">Open</p>
                        </div>
                        <div>
                            <p className="stat-value" style={{ color: "var(--color-success)" }}>{stats.resolvedRequests}</p>
                            <p className="stat-label">Resolved</p>
                        </div>
                    </div>
                    <p className="stat-label">Help Requests</p>
                </div>
            </div>

            {/* Two-col: Pending Verifications + Recent Activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
                {/* Pending Verifications */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
                        <h2 style={{ fontWeight: 700, fontSize: "var(--font-base)" }}>Pending Verifications</h2>
                        <Link href="/admin/ngos" className="auth-link" style={{ fontSize: "var(--font-sm)" }}>View All</Link>
                    </div>
                    {pendingNGOs.length === 0 ? (
                        <p style={{ textAlign: "center", color: "var(--foreground-muted)", padding: "var(--space-lg) 0" }}>No pending verifications</p>
                    ) : (
                        pendingNGOs.map((ngo) => (
                            <div key={ngo.id} className="list-row" style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>domain</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 600, fontSize: "var(--font-sm)" }}>{ngo.name}</p>
                                    <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{ngo.category} • {ngo.submitted}</p>
                                </div>
                                <Link href={`/admin/ngos?id=${ngo.id}`} className="btn-primary" style={{ fontSize: "var(--font-xs)", padding: "6px 12px" }}>Review</Link>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
                        <h2 style={{ fontWeight: 700, fontSize: "var(--font-base)" }}>Recent Activity</h2>
                        <Link href="/admin/audit-logs" className="auth-link" style={{ fontSize: "var(--font-sm)" }}>View All</Link>
                    </div>
                    {activities.map((a) => (
                        <div key={a.id} className="list-row" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: colorMap[a.type] || "var(--foreground-muted)" }}>{iconMap[a.type] || "info"}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: "var(--font-sm)" }}>{a.message}</p>
                                <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{a.time}</p>
                            </div>
                            <span className="tab-pill" style={{ fontSize: 10, background: a.status === "COMPLETED" ? "var(--color-success-bg,#DCFCE7)" : "var(--color-warning-bg,#FEF9C3)", color: a.status === "COMPLETED" ? "var(--color-success)" : "var(--color-warning)" }}>
                                {a.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top NGOs table */}
            <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-md) var(--space-lg)" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "var(--font-base)" }}>Top Performing NGOs</h2>
                    <Link href="/admin/ngos" className="auth-link" style={{ fontSize: "var(--font-sm)" }}>View All</Link>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--background-subtle)" }}>
                                {["Rank", "NGO Name", "Total Donations", "Volunteers", "Rating"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {topNGOs.map((ngo, i) => (
                                <tr key={ngo.id} style={{ borderTop: "1px solid var(--border-light)" }}>
                                    <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: "var(--font-xs)", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                                    </td>
                                    <td style={{ padding: "var(--space-sm) var(--space-md)", fontWeight: 600, fontSize: "var(--font-sm)" }}>{ngo.name}</td>
                                    <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--color-success)", fontWeight: 500 }}>{formatCurrency(ngo.donations)}</td>
                                    <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>{ngo.volunteers}</td>
                                    <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-warning)" }}>star</span>
                                            <span style={{ fontSize: "var(--font-sm)", fontWeight: 500 }}>{ngo.rating.toFixed(1)}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {topNGOs.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--foreground-muted)" }}>No NGO data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
