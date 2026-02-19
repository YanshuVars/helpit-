"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface NGO {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    registration_number: string | null;
    verification_status: string;
    status: string;
    category: string | null;
    city: string | null;
    state: string | null;
    total_donations_received: number;
    volunteer_count: number;
    member_count: number;
    rating: number;
    created_at: string;
    updated_at: string;
}

export default function AdminNGOsPage() {
    const supabase = createClient();
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");

    useEffect(() => {
        fetchNGOs();
    }, [statusFilter, verificationFilter]);

    async function fetchNGOs() {
        setLoading(true);
        try {
            let query = supabase
                .from("ngos")
                .select("*")
                .order("created_at", { ascending: false });

            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }
            if (verificationFilter !== "all") {
                query = query.eq("verification_status", verificationFilter);
            }

            const { data, error } = await query.limit(50);

            if (data) {
                setNgos(data as NGO[]);
            }
        } catch (error) {
            console.error("Error fetching NGOs:", error);
        } finally {
            setLoading(false);
        }
    }

    async function verifyNGO(ngoId: string) {
        try {
            const { error } = await supabase
                .from("ngos")
                .update({ verification_status: "VERIFIED" })
                .eq("id", ngoId);

            if (error) throw error;
            fetchNGOs();
        } catch (error) {
            console.error("Error verifying NGO:", error);
            alert("Failed to verify NGO");
        }
    }

    async function suspendNGO(ngoId: string) {
        try {
            const { error } = await supabase
                .from("ngos")
                .update({ status: "SUSPENDED" })
                .eq("id", ngoId);

            if (error) throw error;
            fetchNGOs();
        } catch (error) {
            console.error("Error suspending NGO:", error);
            alert("Failed to suspend NGO");
        }
    }

    const filteredNGOs = ngos.filter(ngo =>
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-green-100 text-green-700";
            case "SUSPENDED": return "bg-red-100 text-red-700";
            case "INACTIVE": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getVerificationColor = (status: string) => {
        switch (status) {
            case "VERIFIED": return "bg-green-100 text-green-700";
            case "PENDING": return "bg-yellow-100 text-yellow-700";
            case "REJECTED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">NGOs</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage registered NGOs</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search NGOs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-gray-200 bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
                <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-gray-200 bg-white"
                >
                    <option value="all">All Verification</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* NGO List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : filteredNGOs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">domain</span>
                    <p className="text-gray-500 mt-2">No NGOs found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">NGO</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Location</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Verification</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Donations</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Volunteers</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredNGOs.map((ngo) => (
                                    <tr key={ngo.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-sm">{ngo.name}</p>
                                                <p className="text-xs text-gray-500">{ngo.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {[ngo.city, ngo.state].filter(Boolean).join(", ") || "N/A"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(ngo.status)}`}>
                                                {ngo.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getVerificationColor(ngo.verification_status)}`}>
                                                {ngo.verification_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                                            {formatCurrency(ngo.total_donations_received || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {ngo.volunteer_count || 0}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {ngo.verification_status === "PENDING" && (
                                                    <button
                                                        onClick={() => verifyNGO(ngo.id)}
                                                        className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {ngo.status === "ACTIVE" && (
                                                    <button
                                                        onClick={() => suspendNGO(ngo.id)}
                                                        className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200"
                                                    >
                                                        Suspend
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
