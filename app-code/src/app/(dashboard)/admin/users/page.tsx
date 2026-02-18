"use client";

import { useState } from "react";

// Mock users data
const mockUsers = [
    { id: "1", name: "Rahul Sharma", email: "rahul@example.com", role: "VOLUNTEER", status: "ACTIVE", joined: "Jan 15, 2026", ngo: null, lastActive: "2 hours ago" },
    { id: "2", name: "Priya Patel", email: "priya@example.com", role: "NGO_ADMIN", status: "ACTIVE", joined: "Dec 10, 2025", ngo: "Save Children Foundation", lastActive: "1 hour ago" },
    { id: "3", name: "Amit Kumar", email: "amit@example.com", role: "DONOR", status: "ACTIVE", joined: "Jan 20, 2026", ngo: null, lastActive: "5 hours ago" },
    { id: "4", name: "Sneha Gupta", email: "sneha@example.com", role: "VOLUNTEER", status: "INACTIVE", joined: "Nov 5, 2025", ngo: null, lastActive: "2 weeks ago" },
    { id: "5", name: "Vikram Singh", email: "vikram@example.com", role: "NGO_COORDINATOR", status: "ACTIVE", joined: "Oct 22, 2025", ngo: "Green Earth Initiative", lastActive: "30 min ago" },
    { id: "6", name: "Anita Desai", email: "anita@example.com", role: "DONOR", status: "ACTIVE", joined: "Jan 8, 2026", ngo: null, lastActive: "1 day ago" },
    { id: "7", name: "Rajesh Verma", email: "rajesh@example.com", role: "INDIVIDUAL", status: "PENDING", joined: "Feb 1, 2026", ngo: null, lastActive: "Never" },
    { id: "8", name: "Meera Joshi", email: "meera@example.com", role: "NGO_ADMIN", status: "SUSPENDED", joined: "Sep 15, 2025", ngo: "Help All Trust", lastActive: "1 month ago" },
];

const roleFilters = ["ALL", "VOLUNTEER", "DONOR", "NGO_ADMIN", "NGO_COORDINATOR", "NGO_MEMBER", "INDIVIDUAL"];
const statusFilters = ["ALL", "ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"];

export default function UserManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    const toggleSelectUser = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "NGO_ADMIN": return "bg-purple-100 text-purple-700";
            case "NGO_COORDINATOR": return "bg-blue-100 text-blue-700";
            case "NGO_MEMBER": return "bg-cyan-100 text-cyan-700";
            case "VOLUNTEER": return "bg-green-100 text-green-700";
            case "DONOR": return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-green-100 text-green-700";
            case "INACTIVE": return "bg-gray-100 text-gray-700";
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "SUSPENDED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const viewUserDetails = (user: typeof mockUsers[0]) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all platform users</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    <span className="text-sm font-medium">Add User</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">26,490</p>
                    <p className="text-xs text-gray-500">Total Users</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-green-600">24,123</p>
                    <p className="text-xs text-gray-500">Active Users</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-amber-600">456</p>
                    <p className="text-xs text-gray-500">Pending Verification</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-red-600">89</p>
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
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 bg-white"
                    >
                        {roleFilters.map((role) => (
                            <option key={role} value={role}>
                                {role === "ALL" ? "All Roles" : role.replace("_", " ")}
                            </option>
                        ))}
                    </select>

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
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                        {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            Activate
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

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelectUser(user.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-900">{user.ngo || "-"}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-500">{user.lastActive}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => viewUserDetails(user)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
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
                        Showing {filteredUsers.length} of {mockUsers.length} users
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

            {/* User Detail Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowUserModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">User Details</h2>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-medium">
                                {selectedUser.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{selectedUser.name}</p>
                                <p className="text-gray-500">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Role</p>
                                <p className="text-sm font-medium">{selectedUser.role.replace("_", " ")}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="text-sm font-medium">{selectedUser.status}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm font-medium">{selectedUser.joined}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Last Active</p>
                                <p className="text-sm font-medium">{selectedUser.lastActive}</p>
                            </div>
                        </div>

                        {selectedUser.ngo && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Associated NGO</p>
                                <p className="text-sm font-medium">{selectedUser.ngo}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button className="flex-1 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                                Edit User
                            </button>
                            <button className="flex-1 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                                Suspend User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
