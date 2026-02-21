"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface PlatformStats {
    totalUsers: number; newUsersThisMonth: number; totalNGOs: number; activeNGOs: number;
    pendingNGOs: number; totalVolunteers: number; activeVolunteers: number; totalDonors: number;
    totalDonations: number; monthlyDonations: number; openRequests: number; resolvedRequests: number;
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
        DONATION: "#16a34a", NGO_REGISTERED: "#1de2d1",
        USER_REPORT: "#dc2626", VERIFICATION: "#2563eb",
        REQUEST_RESOLVED: "#16a34a",
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    const thStyle: React.CSSProperties = {
        textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700,
        color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
    };
    const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14 };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Platform Admin</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Monitor and manage the Helpit platform</p>
                </div>
                <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{
                    padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0',
                    background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a',
                    cursor: 'pointer', outline: 'none',
                }}>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { icon: 'groups', label: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: `+${stats.newUsersThisMonth} new`, subColor: '#16a34a', color: '#3b82f6' },
                    { icon: 'domain', label: 'Active NGOs', value: stats.activeNGOs, sub: `${stats.pendingNGOs} pending`, subColor: '#d97706', color: '#1de2d1' },
                    { icon: 'volunteer_activism', label: 'Volunteers', value: stats.totalVolunteers.toLocaleString(), sub: `${stats.activeVolunteers} active`, subColor: '#16a34a', color: '#8b5cf6' },
                    { icon: 'favorite', label: 'Donors', value: stats.totalDonors.toLocaleString(), sub: null, subColor: '', color: '#f43f5e' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', padding: 22, borderRadius: 16,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: `${s.color}15`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{s.label}</p>
                        {s.sub && <p style={{ fontSize: 12, fontWeight: 600, color: s.subColor, marginTop: 4 }}>{s.sub}</p>}
                    </div>
                ))}
            </div>

            {/* Financial Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Donations', value: formatCurrency(stats.totalDonations), sub: 'All time', color: '#16a34a' },
                    { label: 'Monthly Donations', value: formatCurrency(stats.monthlyDonations), sub: 'This month', color: '#1de2d1' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', padding: 22, borderRadius: 16,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <p style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>{s.sub}</p>
                    </div>
                ))}
                <div style={{
                    background: '#fff', padding: 22, borderRadius: 16,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', gap: 28 }}>
                        <div>
                            <p style={{ fontSize: 26, fontWeight: 800, color: '#f59e0b' }}>{stats.openRequests}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Open</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 26, fontWeight: 800, color: '#16a34a' }}>{stats.resolvedRequests}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Resolved</p>
                        </div>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 8 }}>Help Requests</p>
                </div>
            </div>

            {/* Two-col: Pending + Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Pending Verifications */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Pending Verifications</h3>
                        <Link href="/admin/ngos" style={{ fontSize: 13, fontWeight: 600, color: '#1de2d1', textDecoration: 'none' }}>View All →</Link>
                    </div>
                    {pendingNGOs.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No pending verifications</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {pendingNGOs.map(ngo => (
                                <div key={ngo.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: 14, borderRadius: 12, background: '#fafbfc',
                                }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: 'rgba(29,226,209,0.08)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#1de2d1' }}>domain</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{ngo.name}</p>
                                        <p style={{ fontSize: 12, color: '#94a3b8' }}>{ngo.category} • {ngo.submitted}</p>
                                    </div>
                                    <Link href={`/admin/ngos?id=${ngo.id}`} style={{
                                        padding: '6px 14px', borderRadius: 8,
                                        background: '#1de2d1', color: '#0f172a',
                                        fontSize: 12, fontWeight: 700, textDecoration: 'none',
                                    }}>Review</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Recent Activity</h3>
                        <Link href="/admin/audit-logs" style={{ fontSize: 13, fontWeight: 600, color: '#1de2d1', textDecoration: 'none' }}>View All →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {activities.map(a => (
                            <div key={a.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: 12, borderRadius: 12, background: '#fafbfc',
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: `${colorMap[a.type] || '#94a3b8'}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: colorMap[a.type] || '#94a3b8' }}>{iconMap[a.type] || 'info'}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{a.message}</p>
                                    <p style={{ fontSize: 11, color: '#94a3b8' }}>{a.time}</p>
                                </div>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                    background: a.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                                    color: a.status === 'COMPLETED' ? '#16a34a' : '#d97706',
                                }}>{a.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top NGOs Table */}
            <div style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Top Performing NGOs</h3>
                    <Link href="/admin/ngos" style={{ fontSize: 13, fontWeight: 600, color: '#1de2d1', textDecoration: 'none' }}>View All →</Link>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Rank', 'NGO Name', 'Total Donations', 'Volunteers', 'Rating'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {topNGOs.map((ngo, i) => (
                                <tr key={ngo.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                    <td style={tdStyle}>
                                        <span style={{
                                            width: 26, height: 26, borderRadius: '50%',
                                            background: i === 0 ? '#1de2d1' : i === 1 ? '#94a3b8' : '#f1f5f9',
                                            color: i < 2 ? '#fff' : '#64748b',
                                            fontSize: 12, fontWeight: 700, display: 'inline-flex',
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>{i + 1}</span>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>{ngo.name}</td>
                                    <td style={{ ...tdStyle, color: '#16a34a', fontWeight: 600 }}>{formatCurrency(ngo.donations)}</td>
                                    <td style={{ ...tdStyle, color: '#64748b' }}>{ngo.volunteers}</td>
                                    <td style={tdStyle}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f59e0b' }}>star</span>
                                            <span style={{ fontWeight: 600 }}>{ngo.rating.toFixed(1)}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {topNGOs.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No NGO data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
