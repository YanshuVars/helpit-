"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

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

interface Activity {
    id: string;
    type: string;
    message: string;
    time: string;
    status: string;
}

interface PendingNGO {
    id: string;
    name: string;
    email: string;
    submitted: string;
    category: string;
}

interface TopNGO {
    id: string;
    name: string;
    donations: number;
    volunteers: number;
    rating: number;
}

export default function AdminDashboard() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<PlatformStats>({
        totalUsers: 0,
        newUsersThisMonth: 0,
        totalNGOs: 0,
        activeNGOs: 0,
        pendingNGOs: 0,
        totalVolunteers: 0,
        activeVolunteers: 0,
        totalDonors: 0,
        totalDonations: 0,
        monthlyDonations: 0,
        openRequests: 0,
        resolvedRequests: 0,
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([]);
    const [topNGOs, setTopNGOs] = useState<TopNGO[]>([]);
    const [timeRange, setTimeRange] = useState("month");

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            // Get date range for filtering
            const now = new Date();
            let startDate = new Date();
            if (timeRange === "week") {
                startDate.setDate(now.getDate() - 7);
            } else if (timeRange === "month") {
                startDate.setMonth(now.getMonth() - 1);
            } else if (timeRange === "quarter") {
                startDate.setMonth(now.getMonth() - 3);
            } else {
                startDate.setFullYear(now.getFullYear() - 1);
            }

            // Fetch users count
            const { count: totalUsers } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true });

            // Fetch new users this month
            const { count: newUsers } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true })
                .gte("created_at", startDate.toISOString());

            // Fetch NGOs
            const { count: totalNGOs } = await supabase
                .from("ngos")
                .select("*", { count: "exact", head: true });

            const { count: activeNGOs } = await supabase
                .from("ngos")
                .select("*", { count: "exact", head: true })
                .eq("verification_status", "VERIFIED");

            const { count: pendingNGOs } = await supabase
                .from("ngos")
                .select("*", { count: "exact", head: true })
                .eq("verification_status", "PENDING");

            // Fetch volunteers (users with VOLUNTEER role)
            const { count: totalVolunteers } = await supabase
                .from("user_roles")
                .select("*", { count: "exact", head: true })
                .eq("role", "VOLUNTEER");

            // Fetch donors
            const { count: totalDonors } = await supabase
                .from("user_roles")
                .select("*", { count: "exact", head: true })
                .eq("role", "INDIVIDUAL");

            // Fetch donations
            const { data: donationsData } = await supabase
                .from("donations")
                .select("amount, created_at")
                .gte("created_at", startDate.toISOString());

            const totalDonations = donationsData?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

            // Fetch monthly donations
            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            const { data: monthlyData } = await supabase
                .from("donations")
                .select("amount")
                .gte("created_at", monthStart.toISOString());
            const monthlyDonations = monthlyData?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

            // Fetch help requests
            const { count: openRequests } = await supabase
                .from("help_requests")
                .select("*", { count: "exact", head: true })
                .eq("status", "OPEN");

            const { count: resolvedRequests } = await supabase
                .from("help_requests")
                .select("*", { count: "exact", head: true })
                .eq("status", "RESOLVED");

            // Set stats
            setStats({
                totalUsers: totalUsers || 0,
                newUsersThisMonth: newUsers || 0,
                totalNGOs: totalNGOs || 0,
                activeNGOs: activeNGOs || 0,
                pendingNGOs: pendingNGOs || 0,
                totalVolunteers: totalVolunteers || 0,
                activeVolunteers: Math.floor((totalVolunteers || 0) * 0.6),
                totalDonors: totalDonors || 0,
                totalDonations,
                monthlyDonations,
                openRequests: openRequests || 0,
                resolvedRequests: resolvedRequests || 0,
            });

            // Fetch pending NGOs
            const { data: pendingData } = await supabase
                .from("ngos")
                .select("id, name, email, created_at, category")
                .eq("verification_status", "PENDING")
                .order("created_at", { ascending: false })
                .limit(5);

            if (pendingData) {
                setPendingNGOs(pendingData.map(n => ({
                    id: n.id,
                    name: n.name,
                    email: n.email,
                    submitted: formatTimeAgo(n.created_at),
                    category: n.category || "General",
                })));
            }

            // Fetch top NGOs by donations
            const { data: topNgoData } = await supabase
                .from("ngos")
                .select("id, name, total_donations_received, volunteer_count, rating")
                .eq("verification_status", "VERIFIED")
                .order("total_donations_received", { ascending: false })
                .limit(5);

            if (topNgoData) {
                setTopNGOs(topNgoData.map(n => ({
                    id: n.id,
                    name: n.name,
                    donations: n.total_donations_received || 0,
                    volunteers: n.volunteer_count || 0,
                    rating: n.rating || 0,
                })));
            }

            // Fetch recent activities (from audit logs or use mock for now)
            // For now, we'll use mock activities
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
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    }

    function getActivityIcon(type: string) {
        switch (type) {
            case "DONATION": return "payments";
            case "NGO_REGISTERED": return "domain_add";
            case "USER_REPORT": return "flag";
            case "VERIFICATION": return "verified";
            case "REQUEST_RESOLVED": return "check_circle";
            default: return "info";
        }
    }

    function getActivityColor(type: string) {
        switch (type) {
            case "DONATION": return "bg-green-100 text-green-600";
            case "NGO_REGISTERED": return "bg-purple-100 text-purple-600";
            case "USER_REPORT": return "bg-red-100 text-red-600";
            case "VERIFICATION": return "bg-blue-100 text-blue-600";
            case "REQUEST_RESOLVED": return "bg-green-100 text-green-600";
            default: return "bg-gray-100 text-gray-600";
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 pb-8">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor and manage the Helpit platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600">groups</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Total Users</p>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">+{stats.newUsersThisMonth} this month</p>
                </div>

                {/* Active NGOs */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-600">domain</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeNGOs}</p>
                            <p className="text-xs text-gray-500">Active NGOs</p>
                        </div>
                    </div>
                    <p className="text-xs text-orange-600 mt-2">{stats.pendingNGOs} pending verification</p>
                </div>

                {/* Volunteers */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600">volunteer_activism</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Volunteers</p>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">{stats.activeVolunteers} active</p>
                </div>

                {/* Donors */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-600">favorite</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalDonors.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Donors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Total Donations */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Donations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalDonations)}</p>
                    <p className="text-xs text-gray-400 mt-1">All time</p>
                </div>

                {/* Monthly Donations */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Monthly Donations</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.monthlyDonations)}</p>
                    <p className="text-xs text-gray-400 mt-1">This month</p>
                </div>

                {/* Requests */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Help Requests</p>
                    <div className="flex items-center gap-4 mt-1">
                        <div>
                            <p className="text-2xl font-bold text-orange-600">{stats.openRequests}</p>
                            <p className="text-xs text-gray-400">Open</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{stats.resolvedRequests}</p>
                            <p className="text-xs text-gray-400">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Verifications */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Pending Verifications</h2>
                        <Link href="/admin/ngos" className="text-sm text-[var(--primary)] font-semibold">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {pendingNGOs.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No pending verifications
                            </div>
                        ) : (
                            pendingNGOs.map((ngo) => (
                                <div key={ngo.id} className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-purple-600">domain</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{ngo.name}</p>
                                        <p className="text-xs text-gray-500">{ngo.category} • {ngo.submitted}</p>
                                    </div>
                                    <Link
                                        href={`/admin/ngos?id=${ngo.id}`}
                                        className="px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg"
                                    >
                                        Review
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Recent Activity</h2>
                        <Link href="/admin/audit-logs" className="text-sm text-[var(--primary)] font-semibold">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {activities.map((activity) => (
                            <div key={activity.id} className="p-4 flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                    <span className="material-symbols-outlined text-sm">{getActivityIcon(activity.type)}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activity.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top NGOs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Top Performing NGOs</h2>
                    <Link href="/admin/ngos" className="text-sm text-[var(--primary)] font-semibold">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Rank</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">NGO Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Total Donations</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Volunteers</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topNGOs.map((ngo, index) => (
                                <tr key={ngo.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-sm">{ngo.name}</td>
                                    <td className="px-4 py-3 text-sm text-green-600 font-medium">{formatCurrency(ngo.donations)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{ngo.volunteers}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                            <span className="text-sm font-medium">{ngo.rating.toFixed(1)}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {topNGOs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        No NGO data available
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
