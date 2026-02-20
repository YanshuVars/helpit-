"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface User {
    id: string; email: string; full_name: string | null; avatar_url: string | null;
    phone: string | null; status: string; created_at: string; updated_at: string;
    roles?: { role: string }[];
    ngo_members?: { ngo_id: string; ngo_name?: string }[];
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

    useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const { data: usersData } = await supabase
                .from("users")
                .select(`*, roles:user_roles(role), ngo_members:ngo_members(ngo_id, ngos(name))`)
                .order("created_at", { ascending: false }).limit(100);
            if (usersData) {
                setUsers(usersData.map((u: any) => ({
                    ...u,
                    roles: u.roles?.map((r: any) => r.role) || [],
                    ngo_members: u.ngo_members?.map((nm: any) => ({ ngo_id: nm.ngo_id, ngo_name: nm.ngos?.name })) || [],
                })));
            }
        } catch (e) { console.error("Error fetching users:", e); }
        finally { setLoading(false); }
    }

    async function updateUserStatus(userId: string, newStatus: string) {
        try {
            const { error } = await supabase.from("users").update({ status: newStatus }).eq("id", userId);
            if (error) throw error;
            fetchUsers();
        } catch (e) { console.error("Error updating user status:", e); alert("Failed to update user status"); }
    }

    const filteredUsers = users.filter((u) => {
        const matchesSearch = (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const userRole = u.roles?.[0] || "INDIVIDUAL";
        const matchesRole = roleFilter === "ALL" || userRole === roleFilter;
        const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getPrimaryRole = (u: User): string => {
        if (u.roles && u.roles.length > 0) { const r = u.roles[0]; return typeof r === "string" ? r : (r as any).role || "INDIVIDUAL"; }
        return "INDIVIDUAL";
    };
    const getNGOName = (u: User) => u.ngo_members?.[0]?.ngo_name || null;

    const roleColor: Record<string, string> = {
        PLATFORM_ADMIN: "var(--color-danger)", NGO_ADMIN: "var(--primary)",
        NGO_COORDINATOR: "var(--color-info)", NGO_MEMBER: "#06B6D4",
        VOLUNTEER: "var(--color-success)",
    };
    const statusColor: Record<string, string> = {
        ACTIVE: "var(--color-success)", SUSPENDED: "var(--color-danger)", INACTIVE: "var(--foreground-muted)",
    };

    const toggleSelectAll = () => setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
    const toggleSelectUser = (id: string) => setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Users</h1>
                <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>Manage platform users</p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="field-input" style={{ flex: 1, minWidth: 200 }} />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    {roleFilters.map(r => <option key={r} value={r}>{r === "ALL" ? "All Roles" : r.replace(/_/g, " ")}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field-input" style={{ width: "auto" }}>
                    {statusFilters.map(s => <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>)}
                </select>
            </div>

            {/* Bulk actions */}
            {selectedUsers.length > 0 && (
                <div className="card" style={{ background: "var(--color-info-bg, #DBEAFE)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--font-sm)", color: "var(--color-info)" }}>{selectedUsers.length} user(s) selected</span>
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        <button className="btn-secondary" style={{ color: "var(--color-danger)", fontSize: "var(--font-xs)" }}
                            onClick={() => { selectedUsers.forEach(id => updateUserStatus(id, "SUSPENDED")); setSelectedUsers([]); }}>Suspend</button>
                        <button className="btn-secondary" style={{ color: "var(--color-success)", fontSize: "var(--font-xs)" }}
                            onClick={() => { selectedUsers.forEach(id => updateUserStatus(id, "ACTIVE")); setSelectedUsers([]); }}>Activate</button>
                    </div>
                </div>
            )}

            {/* User table */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div className="spinner" /></div>
            ) : filteredUsers.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--foreground-light)" }}>person</span>
                    <p style={{ color: "var(--foreground-muted)", marginTop: 8 }}>No users found</p>
                </div>
            ) : (
                <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--background-subtle)" }}>
                                    <th style={{ padding: "var(--space-sm) var(--space-md)", textAlign: "left" }}>
                                        <input type="checkbox" checked={selectedUsers.length === filteredUsers.length} onChange={toggleSelectAll} />
                                    </th>
                                    {["User", "Role", "Status", "NGO", "Joined", "Actions"].map(h => (
                                        <th key={h} style={{ textAlign: "left", padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-xs)", fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => {
                                    const role = getPrimaryRole(user);
                                    const ngoName = getNGOName(user);
                                    const rc = roleColor[role] || "var(--foreground-muted)";
                                    const sc = statusColor[user.status] || "var(--foreground-muted)";
                                    return (
                                        <tr key={user.id} style={{ borderTop: "1px solid var(--border-light)" }}>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} />
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "var(--font-sm)", overflow: "hidden" }}>
                                                        {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase())}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: "var(--font-sm)" }}>{user.full_name || "Unknown"}</p>
                                                        <p style={{ fontSize: "var(--font-xs)", color: "var(--foreground-muted)" }}>{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <span className="tab-pill" style={{ background: `${rc}20`, color: rc, fontSize: "var(--font-xs)" }}>{role.replace(/_/g, " ")}</span>
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                <span className="tab-pill" style={{ background: `${sc}20`, color: sc, fontSize: "var(--font-xs)" }}>{user.status}</span>
                                            </td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>{ngoName || "-"}</td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--foreground-muted)" }}>{formatDistanceToNow(user.created_at)}</td>
                                            <td style={{ padding: "var(--space-sm) var(--space-md)" }}>
                                                {user.status === "ACTIVE" && (
                                                    <button className="btn-secondary" style={{ fontSize: "var(--font-xs)", color: "var(--color-danger)", padding: "4px 12px" }}
                                                        onClick={() => updateUserStatus(user.id, "SUSPENDED")}>Suspend</button>
                                                )}
                                                {user.status === "SUSPENDED" && (
                                                    <button className="btn-secondary" style={{ fontSize: "var(--font-xs)", color: "var(--color-success)", padding: "4px 12px" }}
                                                        onClick={() => updateUserStatus(user.id, "ACTIVE")}>Activate</button>
                                                )}
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
