"use client";

import { useState } from "react";

// Mock reports data
const mockReports = [
    {
        id: "1",
        type: "NGO_REPORT",
        status: "PENDING",
        priority: "HIGH",
        reporter: { name: "Rahul Sharma", id: "u1" },
        reportedEntity: { name: "Help All Trust", type: "NGO", id: "ngo1" },
        reason: "Suspected fraudulent activities",
        description: "This NGO is collecting donations but not using them for the stated purpose. Multiple beneficiaries have complained about not receiving aid.",
        evidence: ["screenshot1.png", "receipt.pdf", "whatsapp_chat.jpg"],
        createdAt: "2 hours ago",
        assignedTo: null,
    },
    {
        id: "2",
        type: "USER_REPORT",
        status: "IN_REVIEW",
        priority: "MEDIUM",
        reporter: { name: "Priya Patel", id: "u2" },
        reportedEntity: { name: "Amit Kumar", type: "USER", id: "u3" },
        reason: "Harassment in chat",
        description: "User is sending inappropriate messages and harassing volunteers.",
        evidence: ["chat_log.txt"],
        createdAt: "5 hours ago",
        assignedTo: { name: "Admin User", id: "admin1" },
    },
    {
        id: "3",
        type: "CONTENT_REPORT",
        status: "PENDING",
        priority: "LOW",
        reporter: { name: "Sneha Gupta", id: "u4" },
        reportedEntity: { name: "Post #1234", type: "POST", id: "post1" },
        reason: "Inappropriate content",
        description: "This post contains misleading information about donation usage.",
        evidence: ["screenshot.png"],
        createdAt: "1 day ago",
        assignedTo: null,
    },
    {
        id: "4",
        type: "NGO_REPORT",
        status: "RESOLVED",
        priority: "HIGH",
        reporter: { name: "Vikram Singh", id: "u5" },
        reportedEntity: { name: "Quick Help NGO", type: "NGO", id: "ngo2" },
        reason: "Fake registration documents",
        description: "The NGO submitted fake registration documents. Verified with government registry.",
        evidence: ["fake_cert.pdf", "real_cert.pdf"],
        createdAt: "3 days ago",
        assignedTo: { name: "Admin User", id: "admin1" },
        resolution: "NGO suspended and reported to authorities",
        resolvedAt: "2 days ago",
    },
    {
        id: "5",
        type: "USER_REPORT",
        status: "DISMISSED",
        priority: "LOW",
        reporter: { name: "Anita Desai", id: "u6" },
        reportedEntity: { name: "Rajesh Verma", type: "USER", id: "u7" },
        reason: "Spam messages",
        description: "User is sending promotional messages in volunteer groups.",
        evidence: [],
        createdAt: "1 week ago",
        assignedTo: { name: "Admin User", id: "admin1" },
        resolution: "False report - user was sharing legitimate event information",
        resolvedAt: "6 days ago",
    },
];

const statusFilters = ["ALL", "PENDING", "IN_REVIEW", "RESOLVED", "DISMISSED"];
const priorityFilters = ["ALL", "HIGH", "MEDIUM", "LOW"];
const typeFilters = ["ALL", "NGO_REPORT", "USER_REPORT", "CONTENT_REPORT"];

export default function ModerationReportsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const filteredReports = mockReports.filter((report) => {
        const matchesSearch = report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reportedEntity.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
        const matchesPriority = priorityFilter === "ALL" || report.priority === priorityFilter;
        const matchesType = typeFilter === "ALL" || report.type === typeFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "IN_REVIEW": return "bg-blue-100 text-blue-700";
            case "RESOLVED": return "bg-green-100 text-green-700";
            case "DISMISSED": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return "bg-red-100 text-red-700";
            case "MEDIUM": return "bg-amber-100 text-amber-700";
            case "LOW": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "NGO_REPORT": return "domain";
            case "USER_REPORT": return "person";
            case "CONTENT_REPORT": return "article";
            default: return "report";
        }
    };

    const openReportDetail = (report: typeof mockReports[0]) => {
        setSelectedReport(report);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Moderation Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Review and manage user reports</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-600">pending</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                            <p className="text-xs text-gray-500">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600">visibility</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">5</p>
                            <p className="text-xs text-gray-500">In Review</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">89</p>
                            <p className="text-xs text-gray-500">Resolved</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600">priority_high</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">3</p>
                            <p className="text-xs text-gray-500">High Priority</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                    >
                        {statusFilters.map((status) => (
                            <option key={status} value={status}>
                                {status === "ALL" ? "All Status" : status.replace("_", " ")}
                            </option>
                        ))}
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                    >
                        {priorityFilters.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority === "ALL" ? "All Priority" : priority}
                            </option>
                        ))}
                    </select>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                    >
                        {typeFilters.map((type) => (
                            <option key={type} value={type}>
                                {type === "ALL" ? "All Types" : type.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.map((report) => (
                    <div
                        key={report.id}
                        className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openReportDetail(report)}
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.type === "NGO_REPORT" ? "bg-purple-100" :
                                report.type === "USER_REPORT" ? "bg-blue-100" :
                                    "bg-gray-100"
                                }`}>
                                <span className={`material-symbols-outlined ${report.type === "NGO_REPORT" ? "text-purple-600" :
                                    report.type === "USER_REPORT" ? "text-blue-600" :
                                        "text-gray-600"
                                    }`}>
                                    {getTypeIcon(report.type)}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-gray-900 truncate">{report.reason}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(report.priority)}`}>
                                        {report.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Reported by: {report.reporter.name}</span>
                                    <span>•</span>
                                    <span>Against: {report.reportedEntity.name}</span>
                                    <span>•</span>
                                    <span>{report.createdAt}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                                    {report.status.replace("_", " ")}
                                </span>
                                {report.evidence.length > 0 && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">attach_file</span>
                                        {report.evidence.length} files
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Detail Modal */}
            {showDetailModal && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">Report Details</h2>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedReport.status)}`}>
                                    {selectedReport.status.replace("_", " ")}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Report Info */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Report Type</p>
                                    <p className="text-sm font-medium">{selectedReport.type.replace("_", " ")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Priority</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(selectedReport.priority)}`}>
                                        {selectedReport.priority}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Reporter</p>
                                    <p className="text-sm font-medium">{selectedReport.reporter.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Reported Entity</p>
                                    <p className="text-sm font-medium">{selectedReport.reportedEntity.name} ({selectedReport.reportedEntity.type})</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{selectedReport.description}</p>
                        </div>

                        {/* Evidence */}
                        {selectedReport.evidence.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Evidence ({selectedReport.evidence.length} files)</h3>
                                <div className="space-y-2">
                                    {selectedReport.evidence.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-400">description</span>
                                                <span className="text-sm">{file}</span>
                                            </div>
                                            <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resolution (if resolved) */}
                        {selectedReport.resolution && (
                            <div className="bg-green-50 rounded-xl p-4">
                                <h3 className="font-medium text-green-800 mb-1">Resolution</h3>
                                <p className="text-sm text-green-700">{selectedReport.resolution}</p>
                                {selectedReport.resolvedAt && (
                                    <p className="text-xs text-green-600 mt-2">Resolved {selectedReport.resolvedAt}</p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {selectedReport.status !== "RESOLVED" && selectedReport.status !== "DISMISSED" && (
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                    Assign to Me
                                </button>
                                <button className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                    Dismiss
                                </button>
                                <button className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg">gavel</span>
                                    Take Action
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
