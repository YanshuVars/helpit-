"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    roles?: {
        role: string;
    }[];
    ngo_members?: {
        ngo_id: string;
        ngo_name?: string;
    }[];
}

export default function UserManagementPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const roleFilters = ["ALL", "PLATFORM_ADMIN", "NGO_ADMIN", "NGO_COORDINATOR", "NGO_MEMBER", "VOLUNTEER", "INDIVIDUAL"];
    const statusFilters = ["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"];

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    async function fetchUsers() {
        setLoading(true);
        try {
            // Fetch users with their roles
            const { data: usersData, error } = await supabase
                .from("users")
                .select(`
                    *,
                    roles:user_roles(role),
                    ngo_members:ngo_members(ngo_id, ngos(name))
                `)
                .order("created_at", { ascending: false })
                .limit(100);

            if (usersData) {
                // Process the data to get user roles
                const processedUsers = usersData.map((user: any) => ({
                    ...user,
                    roles: user.roles?.map((r: any) => r.role) || [],
                    ngo_members: user.ngo_members?.map((nm: any) => ({
                        ngo_id: nm.ngo_id,
                        ngo_name: nm.ngos?.name
                    })) || []
                }));
                setUsers(processedUsers);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateUserStatus(userId: string, newStatus: string) {
        try {
            const { error } = await supabase
                .from("users")
                .update({ status: newStatus })
                .eq("id", userId);

            if (error) throw error;
            fetchUsers();
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status");
        }
    }

    const filteredUsers = users.filter((user) => {
        const fullName = user.full_name || "";
        const matchesSearch =
            fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const userRole = user.roles?.[0] || "INDIVIDUAL";
        const matchesRole = roleFilter === "ALL" || userRole === roleFilter;
        const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getPrimaryRole = (user: User): string => {
        if (user.roles && user.roles.length > 0) {
            const r = user.roles[0];
            if (typeof r === 'string') return r;
            return (r as any).role || 'INDIVIDUAL';
        }
        return 'INDIVIDUAL';
    };

    const getNGOName = (user: User) => {
        if (user.ngo_members && user.ngo_members.length > 0) {
            return user.ngo_members[0].ngo_name;
        }
        return null;
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "PLATFORM_ADMIN": return "bg-red-100 text-red-700";
            case "NGO_ADMIN": return "bg-purple-100 text-purple-700";
            case "NGO_COORDINATOR": return "bg-blue-100 text-blue-700";
            case "NGO_MEMBER": return "bg-cyan-100 text-cyan-700";
            case "VOLUNTEER": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-green-100 text-green-700";
            case "INACTIVE": return "bg-gray-100 text-gray-700";
            case "SUSPENDED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

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

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-500 text-sm mt-1">Manage platform users</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-gray-200 bg-white"
                >
                    {roleFilters.map(role => (
                        <option key={role} value={role}>
                            {role === "ALL" ? "All Roles" : role.replace("_", " ")}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-gray-200 bg-white"
                >
                    {statusFilters.map(status => (
                        <option key={status} value={status}>
                            {status === "ALL" ? "All Status" : status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm text-blue-700">{selectedUsers.length} user(s) selected</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                selectedUsers.forEach(id => updateUserStatus(id, "SUSPENDED"));
                                setSelectedUsers([]);
                            }}
                            className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg"
                        >
                            Suspend
                        </button>
                        <button
                            onClick={() => {
                                selectedUsers.forEach(id => updateUserStatus(id, "ACTIVE"));
                                setSelectedUsers([]);
                            }}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg"
                        >
                            Activate
                        </button>
                    </div>
                </div>
            )}

            {/* User List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">person</span>
                    <p className="text-gray-500 mt-2">No users found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === filteredUsers.length}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded"
                                        />
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">User</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Role</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">NGO</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Joined</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => {
                                    const role = getPrimaryRole(user);
                                    const ngoName = getNGOName(user);
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleSelectUser(user.id)}
                                                    className="w-4 h-4 rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{user.full_name || "Unknown"}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRoleBadgeColor(role)}`}>
                                                    {role.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadgeColor(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {ngoName || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {formatDistanceToNow(user.created_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {user.status === "ACTIVE" && (
                                                        <button
                                                            onClick={() => updateUserStatus(user.id, "SUSPENDED")}
                                                            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200"
                                                        >
                                                            Suspend
                                                        </button>
                                                    )}
                                                    {user.status === "SUSPENDED" && (
                                                        <button
                                                            onClick={() => updateUserStatus(user.id, "ACTIVE")}
                                                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
