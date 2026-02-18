"use client";

import { useState } from "react";
import Link from "next/link";

// Mock NGOs data
const mockNGOs = [
    {
        id: "1",
        name: "Save Children Foundation",
        email: "contact@savechildren.org",
        registration: "REG/2015/12345",
        status: "VERIFIED",
        verificationStatus: "APPROVED",
        plan: "PREMIUM",
        members: 23,
        volunteers: 234,
        totalDonations: 456000,
        joined: "Mar 15, 2023",
        lastActive: "2 hours ago",
        category: "CHILDREN",
        location: "Mumbai, Maharashtra"
    },
    {
        id: "2",
        name: "Green Earth Initiative",
        email: "info@greenearth.org",
        registration: "REG/2018/54321",
        status: "VERIFIED",
        verificationStatus: "APPROVED",
        plan: "STANDARD",
        members: 15,
        volunteers: 189,
        totalDonations: 345000,
        joined: "Jun 22, 2023",
        lastActive: "1 hour ago",
        category: "ENVIRONMENT",
        location: "Delhi, NCR"
    },
    {
        id: "3",
        name: "Hope Foundation",
        email: "hope@hopefound.org",
        registration: "REG/2024/11111",
        status: "PENDING",
        verificationStatus: "PENDING",
        plan: "FREE",
        members: 5,
        volunteers: 0,
        totalDonations: 0,
        joined: "Feb 1, 2026",
        lastActive: "1 day ago",
        category: "GENERAL",
        location: "Bangalore, Karnataka"
    },
    {
        id: "4",
        name: "Food for All",
        email: "contact@foodforall.org",
        registration: "REG/2019/22222",
        status: "VERIFIED",
        verificationStatus: "APPROVED",
        plan: "PREMIUM",
        members: 18,
        volunteers: 156,
        totalDonations: 289000,
        joined: "Aug 10, 2023",
        lastActive: "30 min ago",
        category: "FOOD",
        location: "Chennai, Tamil Nadu"
    },
    {
        id: "5",
        name: "Help All Trust",
        email: "help@helpall.org",
        registration: "REG/2020/33333",
        status: "SUSPENDED",
        verificationStatus: "APPROVED",
        plan: "STANDARD",
        members: 12,
        volunteers: 45,
        totalDonations: 120000,
        joined: "Jan 5, 2024",
        lastActive: "1 month ago",
        category: "GENERAL",
        location: "Kolkata, West Bengal"
    },
    {
        id: "6",
        name: "Care All Trust",
        email: "care@careall.org",
        registration: "REG/2024/44444",
        status: "PENDING",
        verificationStatus: "PENDING",
        plan: "FREE",
        members: 3,
        volunteers: 0,
        totalDonations: 0,
        joined: "Jan 28, 2026",
        lastActive: "3 days ago",
        category: "HEALTH",
        location: "Hyderabad, Telangana"
    },
];

const statusFilters = ["ALL", "VERIFIED", "PENDING", "SUSPENDED"];
const verificationFilters = ["ALL", "APPROVED", "PENDING", "REJECTED"];
const planFilters = ["ALL", "FREE", "STANDARD", "PREMIUM"];

export default function NGOManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [verificationFilter, setVerificationFilter] = useState("ALL");
    const [planFilter, setPlanFilter] = useState("ALL");
    const [selectedNGOs, setSelectedNGOs] = useState<string[]>([]);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedNGO, setSelectedNGO] = useState<typeof mockNGOs[0] | null>(null);

    const filteredNGOs = mockNGOs.filter((ngo) => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ngo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ngo.registration.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || ngo.status === statusFilter;
        const matchesVerification = verificationFilter === "ALL" || ngo.verificationStatus === verificationFilter;
        const matchesPlan = planFilter === "ALL" || ngo.plan === planFilter;
        return matchesSearch && matchesStatus && matchesVerification && matchesPlan;
    });

    const toggleSelectAll = () => {
        if (selectedNGOs.length === filteredNGOs.length) {
            setSelectedNGOs([]);
        } else {
            setSelectedNGOs(filteredNGOs.map(n => n.id));
        }
    };

    const toggleSelectNGO = (ngoId: string) => {
        if (selectedNGOs.includes(ngoId)) {
            setSelectedNGOs(selectedNGOs.filter(id => id !== ngoId));
        } else {
            setSelectedNGOs([...selectedNGOs, ngoId]);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "VERIFIED": return "bg-green-100 text-green-700";
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "SUSPENDED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPlanBadgeColor = (plan: string) => {
        switch (plan) {
            case "PREMIUM": return "bg-purple-100 text-purple-700";
            case "STANDARD": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const openVerifyModal = (ngo: typeof mockNGOs[0]) => {
        setSelectedNGO(ngo);
        setShowVerifyModal(true);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">NGO Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Verify and manage registered NGOs</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/ngos?filter=pending"
                        className="flex items-center gap-2 px-4 py-2 border border-amber-300 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100"
                    >
                        <span className="material-symbols-outlined text-lg">pending</span>
                        <span className="text-sm font-medium">23 Pending</span>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-xs text-gray-500">Total NGOs</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-green-600">892</p>
                    <p className="text-xs text-gray-500">Verified</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-amber-600">23</p>
                    <p className="text-xs text-gray-500">Pending Verification</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-purple-600">156</p>
                    <p className="text-xs text-gray-500">Premium Plan</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-red-600">12</p>
                    <p className="text-xs text-gray-500">Suspended</p>
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
                            placeholder="Search by name, email, or registration..."
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
                                {status === "ALL" ? "All Status" : status}
                            </option>
                        ))}
                    </select>

                    {/* Verification Filter */}
                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                    >
                        {verificationFilters.map((v) => (
                            <option key={v} value={v}>
                                {v === "ALL" ? "All Verifications" : v}
                            </option>
                        ))}
                    </select>

                    {/* Plan Filter */}
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                    >
                        {planFilters.map((plan) => (
                            <option key={plan} value={plan}>
                                {plan === "ALL" ? "All Plans" : plan}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedNGOs.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                        {selectedNGOs.length} NGO{selectedNGOs.length > 1 ? "s" : ""} selected
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Verify Selected
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            Suspend
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* NGOs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedNGOs.length === filteredNGOs.length && filteredNGOs.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donations</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredNGOs.map((ngo) => (
                                <tr key={ngo.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedNGOs.includes(ngo.id)}
                                            onChange={() => toggleSelectNGO(ngo.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-medium text-sm">
                                                {ngo.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                                                <p className="text-xs text-gray-500">{ngo.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(ngo.status)}`}>
                                            {ngo.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(ngo.plan)}`}>
                                            {ngo.plan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm text-gray-900">{ngo.members} members</p>
                                            <p className="text-xs text-gray-500">{ngo.volunteers} volunteers</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-900">₹{ngo.totalDonations.toLocaleString()}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {ngo.verificationStatus === "PENDING" && (
                                                <button
                                                    onClick={() => openVerifyModal(ngo)}
                                                    className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"
                                                    title="Verify"
                                                >
                                                    <span className="material-symbols-outlined text-lg">verified</span>
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/ngos/${ngo.id}`}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </Link>
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            {ngo.status !== "SUSPENDED" && (
                                                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                                                    <span className="material-symbols-outlined text-lg">block</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {filteredNGOs.length} of {mockNGOs.length} NGOs
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

            {/* Verification Modal */}
            {showVerifyModal && selectedNGO && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowVerifyModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Verify NGO: {selectedNGO.name}</h2>
                            <button
                                onClick={() => setShowVerifyModal(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* NGO Info */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Registration Number</p>
                                    <p className="text-sm font-medium">{selectedNGO.registration}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Category</p>
                                    <p className="text-sm font-medium">{selectedNGO.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="text-sm font-medium">{selectedNGO.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium">{selectedNGO.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Submitted Documents</h3>
                            <div className="space-y-2">
                                {["Registration Certificate", "80G Certificate", "PAN Card", "Bank Statement", "ID Proof"].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400">description</span>
                                            <span className="text-sm">{doc}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
                                            <span className="text-green-600 text-sm">✓ Verified</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Verification Notes</label>
                            <textarea
                                className="w-full mt-1 h-24 px-3 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                placeholder="Add any notes about the verification..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowVerifyModal(false)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-xl hover:bg-red-50">
                                Reject
                            </button>
                            <button className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700">
                                Approve & Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
