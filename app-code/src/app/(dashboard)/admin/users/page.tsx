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

    const roleColor: Record<string, { bg: string; text: string }> = {
        PLATFORM_ADMIN: { bg: '#fee2e2', text: '#dc2626' },
        NGO_ADMIN: { bg: 'rgba(29,226,209,0.1)', text: '#0d9488' },
        NGO_COORDINATOR: { bg: '#dbeafe', text: '#2563eb' },
        NGO_MEMBER: { bg: '#e0f2fe', text: '#0284c7' },
        VOLUNTEER: { bg: '#dcfce7', text: '#16a34a' },
        INDIVIDUAL: { bg: '#f1f5f9', text: '#64748b' },
    };
    const statusBadge: Record<string, { bg: string; text: string }> = {
        ACTIVE: { bg: '#dcfce7', text: '#16a34a' },
        SUSPENDED: { bg: '#fee2e2', text: '#dc2626' },
        INACTIVE: { bg: '#f1f5f9', text: '#94a3b8' },
    };

    const toggleSelectAll = () => setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
    const toggleSelectUser = (id: string) => setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const thStyle: React.CSSProperties = {
        textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700,
        color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
    };
    const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14 };
    const selectStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0',
        background: '#fff', fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer', outline: 'none',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>User Management</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Manage platform users and access</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 22 }}>search</span>
                    <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 46px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#1de2d1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={selectStyle}>
                    {roleFilters.map(r => <option key={r} value={r}>{r === "ALL" ? "All Roles" : r.replace(/_/g, " ")}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                    {statusFilters.map(s => <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>)}
                </select>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div style={{
                    background: '#eff6ff', borderRadius: 14, padding: '14px 20px',
                    border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>check_circle</span>
                        {selectedUsers.length} user(s) selected
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { selectedUsers.forEach(id => updateUserStatus(id, "SUSPENDED")); setSelectedUsers([]); }}
                            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Suspend</button>
                        <button onClick={() => { selectedUsers.forEach(id => updateUserStatus(id, "ACTIVE")); setSelectedUsers([]); }}
                            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #dcfce7', background: '#f0fdf4', color: '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Activate</button>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
                    border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#cbd5e1' }}>person</span>
                    <p style={{ color: '#94a3b8', marginTop: 10, fontSize: 14 }}>No users found</p>
                </div>
            ) : (
                <div style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ ...thStyle, width: 44 }}>
                                        <input type="checkbox" checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onChange={toggleSelectAll}
                                            style={{ width: 16, height: 16, accentColor: '#1de2d1', cursor: 'pointer' }} />
                                    </th>
                                    {['User', 'Role', 'Status', 'NGO', 'Joined', 'Actions'].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => {
                                    const role = getPrimaryRole(user);
                                    const ngoName = getNGOName(user);
                                    const rc = roleColor[role] || roleColor.INDIVIDUAL;
                                    const sb = statusBadge[user.status] || statusBadge.INACTIVE;
                                    return (
                                        <tr key={user.id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 150ms' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                                            <td style={{ ...tdStyle, width: 44 }}>
                                                <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)}
                                                    style={{ width: 16, height: 16, accentColor: '#1de2d1', cursor: 'pointer' }} />
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: 10,
                                                        background: '#1de2d1', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: '#fff', fontWeight: 800, fontSize: 14, overflow: 'hidden',
                                                    }}>
                                                        {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            : (user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase())}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{user.full_name || "Unknown"}</p>
                                                        <p style={{ fontSize: 11, color: '#94a3b8' }}>{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.text }}>{role.replace(/_/g, " ")}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sb.bg, color: sb.text }}>{user.status}</span>
                                            </td>
                                            <td style={{ ...tdStyle, color: '#64748b', fontSize: 13 }}>{ngoName || "—"}</td>
                                            <td style={{ ...tdStyle, color: '#94a3b8', fontSize: 13 }}>{formatDistanceToNow(user.created_at)}</td>
                                            <td style={tdStyle}>
                                                {user.status === "ACTIVE" && (
                                                    <button onClick={() => updateUserStatus(user.id, "SUSPENDED")} style={{
                                                        padding: '5px 14px', borderRadius: 8, border: '1px solid #fee2e2',
                                                        background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                    }}>Suspend</button>
                                                )}
                                                {user.status === "SUSPENDED" && (
                                                    <button onClick={() => updateUserStatus(user.id, "ACTIVE")} style={{
                                                        padding: '5px 14px', borderRadius: 8, border: '1px solid #dcfce7',
                                                        background: '#f0fdf4', color: '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                    }}>Activate</button>
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
