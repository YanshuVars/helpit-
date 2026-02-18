"use client";

import { useState } from "react";

// Mock audit logs data
const mockAuditLogs = [
    {
        id: "1",
        timestamp: "2026-02-18T12:30:00Z",
        action: "USER_SUSPENDED",
        category: "USER_MANAGEMENT",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "u8", name: "Meera Joshi", type: "USER" },
        details: "User suspended for policy violation",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { reason: "Spam activities", duration: "30 days" }
    },
    {
        id: "2",
        timestamp: "2026-02-18T11:45:00Z",
        action: "NGO_VERIFIED",
        category: "NGO_MANAGEMENT",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "ngo4", name: "Green Earth Initiative", type: "NGO" },
        details: "NGO verification approved after document review",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { documentsReviewed: 5, verificationNotes: "All documents verified" }
    },
    {
        id: "3",
        timestamp: "2026-02-18T10:15:00Z",
        action: "DONATION_REFUNDED",
        category: "DONATION",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "don123", name: "Donation #DON-123", type: "DONATION" },
        details: "Refund processed for failed service delivery",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { amount: 5000, reason: "Service not delivered", refundId: "REF-456" }
    },
    {
        id: "4",
        timestamp: "2026-02-18T09:30:00Z",
        action: "REPORT_RESOLVED",
        category: "MODERATION",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "rpt5", name: "Report #RPT-005", type: "REPORT" },
        details: "Report resolved - NGO suspended",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { reportType: "NGO_REPORT", action: "SUSPEND_NGO" }
    },
    {
        id: "5",
        timestamp: "2026-02-17T16:45:00Z",
        action: "ROLE_CHANGED",
        category: "USER_MANAGEMENT",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "u5", name: "Vikram Singh", type: "USER" },
        details: "User role changed from VOLUNTEER to NGO_COORDINATOR",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { previousRole: "VOLUNTEER", newRole: "NGO_COORDINATOR" }
    },
    {
        id: "6",
        timestamp: "2026-02-17T14:20:00Z",
        action: "NGO_SUSPENDED",
        category: "NGO_MANAGEMENT",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "ngo5", name: "Help All Trust", type: "NGO" },
        details: "NGO suspended due to fraudulent activities",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { reason: "Fraudulent activities", reportId: "RPT-004" }
    },
    {
        id: "7",
        timestamp: "2026-02-17T11:00:00Z",
        action: "SETTINGS_CHANGED",
        category: "PLATFORM",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "platform", name: "Platform Settings", type: "SETTINGS" },
        details: "Updated donation minimum amount from ₹100 to ₹200",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { setting: "donation_min_amount", oldValue: 100, newValue: 200 }
    },
    {
        id: "8",
        timestamp: "2026-02-16T15:30:00Z",
        action: "CONTENT_REMOVED",
        category: "MODERATION",
        actor: { id: "admin1", name: "Admin User", role: "PLATFORM_ADMIN" },
        target: { id: "post789", name: "Post #789", type: "POST" },
        details: "Post removed for violating community guidelines",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0.0",
        metadata: { reason: "Misinformation", authorId: "u10" }
    },
];

const categoryFilters = ["ALL", "USER_MANAGEMENT", "NGO_MANAGEMENT", "DONATION", "MODERATION", "PLATFORM"];
const actionFilters = ["ALL", "USER_SUSPENDED", "NGO_VERIFIED", "NGO_SUSPENDED", "ROLE_CHANGED", "DONATION_REFUNDED", "REPORT_RESOLVED", "SETTINGS_CHANGED", "CONTENT_REMOVED"];

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedLog, setSelectedLog] = useState<typeof mockAuditLogs[0] | null>(null);

    const filteredLogs = mockAuditLogs.filter((log) => {
        const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.target.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter;
        const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
        return matchesSearch && matchesCategory && matchesAction;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "USER_MANAGEMENT": return "bg-blue-100 text-blue-700";
            case "NGO_MANAGEMENT": return "bg-purple-100 text-purple-700";
            case "DONATION": return "bg-green-100 text-green-700";
            case "MODERATION": return "bg-red-100 text-red-700";
            case "PLATFORM": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case "USER_SUSPENDED": return "block";
            case "NGO_VERIFIED": return "verified";
            case "NGO_SUSPENDED": return "domain_disabled";
            case "ROLE_CHANGED": return "admin_panel_settings";
            case "DONATION_REFUNDED": return "money_off";
            case "REPORT_RESOLVED": return "task_alt";
            case "SETTINGS_CHANGED": return "settings";
            case "CONTENT_REMOVED": return "delete";
            default: return "info";
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        };
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-500 text-sm mt-1">Track all platform activities and changes</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50">
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="text-sm font-medium">Export Logs</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-xs text-gray-500">Total Actions Today</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-blue-600">456</p>
                    <p className="text-xs text-gray-500">User Management</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-purple-600">234</p>
                    <p className="text-xs text-gray-500">NGO Management</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-red-600">89</p>
                    <p className="text-xs text-gray-500">Moderation Actions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by actor, target, or details..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                        >
                            {categoryFilters.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === "ALL" ? "All Categories" : cat.replace("_", " ")}
                                </option>
                            ))}
                        </select>

                        {/* Action Filter */}
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                        >
                            {actionFilters.map((action) => (
                                <option key={action} value={action}>
                                    {action === "ALL" ? "All Actions" : action.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">From:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="h-10 px-3 rounded-xl border border-gray-200"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">To:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="h-10 px-3 rounded-xl border border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLogs.map((log) => {
                                const { date, time } = formatTimestamp(log.timestamp);
                                return (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm text-gray-900">{date}</p>
                                                <p className="text-xs text-gray-500">{time}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(log.category)}`}>
                                                    <span className="material-symbols-outlined text-sm">{getActionIcon(log.action)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{log.action.replace("_", " ")}</p>
                                                    <p className="text-xs text-gray-500">{log.category.replace("_", " ")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm text-gray-900">{log.actor.name}</p>
                                                <p className="text-xs text-gray-500">{log.actor.role.replace("_", " ")}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm text-gray-900">{log.target.name}</p>
                                                <p className="text-xs text-gray-500">{log.target.type}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-gray-600 max-w-xs truncate">{log.details}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-gray-500 font-mono">{log.ipAddress}</p>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {filteredLogs.length} of {mockAuditLogs.length} logs
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedLog(null)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Log Details</h2>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Timestamp</p>
                                    <p className="text-sm font-medium">
                                        {formatTimestamp(selectedLog.timestamp).date} at {formatTimestamp(selectedLog.timestamp).time}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Category</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedLog.category)}`}>
                                        {selectedLog.category.replace("_", " ")}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Actor</p>
                                    <p className="text-sm font-medium">{selectedLog.actor.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Target</p>
                                    <p className="text-sm font-medium">{selectedLog.target.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Action Details</p>
                            <p className="text-sm bg-gray-50 rounded-xl p-3">{selectedLog.details}</p>
                        </div>

                        {/* Metadata */}
                        {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Additional Data</p>
                                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="text-gray-500">{key}:</span>
                                            <span className="text-gray-900 font-medium">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Technical Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500">IP Address</p>
                                <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">User Agent</p>
                                <p className="text-sm">{selectedLog.userAgent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
