"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for admin dashboard
const platformStats = {
    totalNGOs: 1247,
    activeNGOs: 892,
    pendingVerifications: 23,
    totalVolunteers: 15420,
    activeVolunteers: 8734,
    totalDonors: 9823,
    totalDonations: 45678900,
    monthlyDonations: 3456700,
    openRequests: 456,
    resolvedRequests: 1234,
    totalUsers: 26490,
    newUsersThisMonth: 1234,
};

const recentActivity = [
    { id: 1, type: "NGO_REGISTERED", message: "New NGO 'Hope Foundation' registered", time: "5 min ago", status: "PENDING" },
    { id: 2, type: "DONATION", message: "₹25,000 donation to 'Save Children NGO'", time: "12 min ago", status: "COMPLETED" },
    { id: 3, type: "USER_REPORT", message: "Report submitted against 'Help All NGO'", time: "25 min ago", status: "PENDING" },
    { id: 4, type: "VERIFICATION", message: "Green Earth NGO verified successfully", time: "1 hour ago", status: "COMPLETED" },
    { id: 5, type: "REQUEST_RESOLVED", message: "Emergency food request resolved", time: "2 hours ago", status: "COMPLETED" },
];

const pendingVerifications = [
    { id: 1, name: "Hope Foundation", type: "NGO", submitted: "2 days ago", documents: 5 },
    { id: 2, name: "Care All Trust", type: "NGO", submitted: "3 days ago", documents: 4 },
    { id: 3, name: "Helping Hands", type: "NGO", submitted: "5 days ago", documents: 6 },
];

const topNGOs = [
    { id: 1, name: "Save Children Foundation", donations: 456000, volunteers: 234, rating: 4.8 },
    { id: 2, name: "Green Earth Initiative", donations: 345000, volunteers: 189, rating: 4.7 },
    { id: 3, name: "Food for All", donations: 289000, volunteers: 156, rating: 4.9 },
    { id: 4, name: "Education First", donations: 234000, volunteers: 123, rating: 4.6 },
    { id: 5, name: "Health Care Trust", donations: 198000, volunteers: 98, rating: 4.8 },
];

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState("month");

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
                            <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Total Users</p>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">+{platformStats.newUsersThisMonth} this month</p>
                </div>

                {/* Active NGOs */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-600">domain</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{platformStats.activeNGOs}</p>
                            <p className="text-xs text-gray-500">Active NGOs</p>
                        </div>
                    </div>
                    <p className="text-xs text-orange-600 mt-2">{platformStats.pendingVerifications} pending verification</p>
                </div>

                {/* Volunteers */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600">volunteer_activism</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{platformStats.activeVolunteers.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Active Volunteers</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{platformStats.totalVolunteers.toLocaleString()} total</p>
                </div>

                {/* Donations */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-600">payments</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">₹{(platformStats.monthlyDonations / 100000).toFixed(1)}L</p>
                            <p className="text-xs text-gray-500">Monthly Donations</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">₹{(platformStats.totalDonations / 10000000).toFixed(1)}Cr total</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
                    <p className="text-3xl font-bold">{platformStats.totalNGOs}</p>
                    <p className="text-sm opacity-80">Registered NGOs</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
                    <p className="text-3xl font-bold">{platformStats.totalDonors}</p>
                    <p className="text-sm opacity-80">Total Donors</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
                    <p className="text-3xl font-bold">{platformStats.resolvedRequests}</p>
                    <p className="text-sm opacity-80">Resolved Requests</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
                    <p className="text-3xl font-bold">{platformStats.openRequests}</p>
                    <p className="text-sm opacity-80">Open Requests</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === "NGO_REGISTERED" ? "bg-purple-100" :
                                        activity.type === "DONATION" ? "bg-green-100" :
                                            activity.type === "USER_REPORT" ? "bg-red-100" :
                                                activity.type === "VERIFICATION" ? "bg-blue-100" :
                                                    "bg-gray-100"
                                    }`}>
                                    <span className={`material-symbols-outlined text-lg ${activity.type === "NGO_REGISTERED" ? "text-purple-600" :
                                            activity.type === "DONATION" ? "text-green-600" :
                                                activity.type === "USER_REPORT" ? "text-red-600" :
                                                    activity.type === "VERIFICATION" ? "text-blue-600" :
                                                        "text-gray-600"
                                        }`}>
                                        {activity.type === "NGO_REGISTERED" ? "domain_add" :
                                            activity.type === "DONATION" ? "payments" :
                                                activity.type === "USER_REPORT" ? "report" :
                                                    activity.type === "VERIFICATION" ? "verified" :
                                                        "check_circle"}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 truncate">{activity.message}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === "PENDING"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-green-100 text-green-700"
                                    }`}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <Link href="/admin/activity" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all activity →
                        </Link>
                    </div>
                </div>

                {/* Pending Verifications */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Pending Verifications</h2>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            {platformStats.pendingVerifications}
                        </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pendingVerifications.map((ngo) => (
                            <div key={ngo.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                                        <p className="text-xs text-gray-500">{ngo.documents} documents • {ngo.submitted}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded-lg hover:bg-green-50 text-green-600">
                                            <span className="material-symbols-outlined text-lg">check</span>
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <Link href="/admin/ngos?filter=pending" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all pending →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Top NGOs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Top Performing NGOs</h2>
                    <Link href="/admin/ngos" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donations</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteers</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topNGOs.map((ngo) => (
                                <tr key={ngo.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-900">₹{ngo.donations.toLocaleString()}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-900">{ngo.volunteers}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                                            <span className="text-sm text-gray-900">{ngo.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/ngos/${ngo.id}`}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                    href="/admin/users"
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600">manage_accounts</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Manage Users</p>
                        <p className="text-xs text-gray-500">{platformStats.totalUsers.toLocaleString()} users</p>
                    </div>
                </Link>

                <Link
                    href="/admin/ngos"
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600">domain</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Manage NGOs</p>
                        <p className="text-xs text-gray-500">{platformStats.totalNGOs} registered</p>
                    </div>
                </Link>

                <Link
                    href="/admin/reports"
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600">report</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Reports</p>
                        <p className="text-xs text-gray-500">12 pending</p>
                    </div>
                </Link>

                <Link
                    href="/admin/audit-logs"
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600">history</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Audit Logs</p>
                        <p className="text-xs text-gray-500">View history</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
