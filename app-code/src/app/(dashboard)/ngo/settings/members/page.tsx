"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    joined: string;
    initials: string;
    color: string;
    userId: string;
}

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#e11d48", "#0284c7"];
const roleColors: Record<string, { bg: string; text: string }> = {
    NGO_ADMIN: { bg: "rgba(239,68,68,0.08)", text: "#dc2626" },
    NGO_COORDINATOR: { bg: "rgba(59,130,246,0.08)", text: "#2563eb" },
    NGO_MEMBER: { bg: "rgba(29,226,209,0.08)", text: "#0f766e" },
};

const roleLabels: Record<string, string> = {
    NGO_ADMIN: "Admin",
    NGO_COORDINATOR: "Coordinator",
    NGO_MEMBER: "Member",
};

export default function TeamMembersPage() {
    const { ngoId, isAdmin, loading: ctxLoading } = useNgoContext();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("NGO_MEMBER");
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            const { data, error } = await supabase
                .from("ngo_members")
                .select("id, role, joined_at, user_id, user:users!user_id(full_name, email)")
                .eq("ngo_id", ngoId)
                .limit(30);

            if (error) {
                console.error("Error fetching members:", error);
                toast.error("Failed to load team members.");
            }

            setMembers((data || []).map((m: any, i: number) => {
                const u = Array.isArray(m.user) ? m.user[0] : m.user;
                const name = u?.full_name || "Unknown";
                const words = name.split(" ");
                const initials = words.length >= 2
                    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
                    : name.slice(0, 2).toUpperCase();
                return {
                    id: m.id,
                    userId: m.user_id,
                    name,
                    email: u?.email || "",
                    role: m.role || "NGO_MEMBER",
                    joined: new Date(m.joined_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    initials,
                    color: COLORS[i % COLORS.length],
                };
            }));
            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    async function handleInvite() {
        if (!ngoId || !isAdmin) {
            toast.error("Only admins can invite members.");
            return;
        }
        if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setInviting(true);
        const supabase = createClient();

        // Find user by email
        const { data: userResult, error: userError } = await supabase
            .from("users")
            .select("id, full_name, email")
            .eq("email", inviteEmail.trim().toLowerCase())
            .limit(1);

        if (userError || !userResult || userResult.length === 0) {
            toast.error("No registered user found with that email. They must sign up first.");
            setInviting(false);
            return;
        }

        const user = userResult[0];

        // Check if already a member
        const existing = members.find(m => m.userId === user.id);
        if (existing) {
            toast.error(`${user.full_name} is already a member of this organization.`);
            setInviting(false);
            return;
        }

        // Insert into ngo_members
        const { error: insertError } = await supabase.from("ngo_members").insert({
            ngo_id: ngoId,
            user_id: user.id,
            role: inviteRole,
        });

        if (insertError) {
            if (insertError.code === "23505") {
                toast.error("This user is already a member.");
            } else {
                toast.error(`Failed to add member: ${insertError.message}`);
            }
        } else {
            toast.success(`${user.full_name} has been added as ${roleLabels[inviteRole] || inviteRole}!`);
            const idx = members.length;
            const name = user.full_name || "Unknown";
            const words = name.split(" ");
            const initials = words.length >= 2
                ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
                : name.slice(0, 2).toUpperCase();
            setMembers(prev => [...prev, {
                id: crypto.randomUUID(),
                userId: user.id,
                name,
                email: user.email,
                role: inviteRole,
                joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                initials,
                color: COLORS[idx % COLORS.length],
            }]);
            setInviteEmail("");
            setInviteRole("NGO_MEMBER");
            setShowInvite(false);
        }
        setInviting(false);
    }

    async function handleRemoveMember(memberId: string, memberName: string) {
        if (!isAdmin) return;
        if (!confirm(`Remove ${memberName} from the organization?`)) return;
        const supabase = createClient();
        const { error } = await supabase.from("ngo_members").delete().eq("id", memberId);
        if (error) {
            toast.error(`Failed to remove member: ${error.message}`);
        } else {
            toast.success(`${memberName} removed from team.`);
            setMembers(prev => prev.filter(m => m.id !== memberId));
        }
    }

    async function handleRoleChange(memberId: string, newRole: string) {
        if (!isAdmin) return;
        const supabase = createClient();
        const { error } = await supabase
            .from("ngo_members")
            .update({ role: newRole })
            .eq("id", memberId);

        if (error) {
            toast.error(`Failed to update role: ${error.message}`);
        } else {
            toast.success("Member role updated!");
            setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
        }
    }

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Team Members</h2>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Manage your organization's team and access roles.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowInvite(!showInvite)} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "10px 20px", borderRadius: 8,
                        background: "#1de2d1", color: "#0f172a",
                        fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                        Invite Member
                    </button>
                )}
            </div>

            {/* Invite Form */}
            {showInvite && (
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 20,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    marginBottom: 24,
                }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1de2d1" }}>person_add</span>
                        Add Team Member
                    </h4>
                    <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Email Address *</label>
                            <input
                                type="email" placeholder="user@example.com"
                                value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                                style={{
                                    width: "100%", height: 40, padding: "0 12px", borderRadius: 8,
                                    border: "1px solid #e2e8f0", fontSize: 13, outline: "none",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Role</label>
                            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                                style={{
                                    height: 40, padding: "0 12px", borderRadius: 8,
                                    border: "1px solid #e2e8f0", fontSize: 13, minWidth: 140,
                                }}>
                                <option value="NGO_ADMIN">Admin</option>
                                <option value="NGO_COORDINATOR">Coordinator</option>
                                <option value="NGO_MEMBER">Member</option>
                            </select>
                        </div>
                        <button onClick={handleInvite} disabled={inviting} style={{
                            height: 40, padding: "0 20px", borderRadius: 8,
                            background: "#1de2d1", color: "#0f172a",
                            fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                        }}>{inviting ? "Adding..." : "Add"}</button>
                        <button onClick={() => setShowInvite(false)} style={{
                            height: 40, padding: "0 14px", borderRadius: 8,
                            border: "1px solid #e2e8f0", background: "#fff",
                            fontSize: 13, cursor: "pointer",
                        }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Members Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {members.length === 0 ? (
                    <div style={{
                        gridColumn: "1 / -1", padding: 48, textAlign: "center",
                        background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#cbd5e1" }}>group_off</span>
                        <p style={{ marginTop: 12, color: "#94a3b8" }}>No team members found</p>
                    </div>
                ) : members.map(m => {
                    const rc = roleColors[m.role] || roleColors.NGO_MEMBER;
                    return (
                        <div key={m.id} style={{
                            background: "#fff", borderRadius: 12, padding: 20,
                            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: "50%",
                                    background: `${m.color}1a`,
                                    color: m.color,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 700,
                                }}>{m.initials}</div>
                                {isAdmin && (
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <select
                                            value={m.role}
                                            onChange={e => handleRoleChange(m.id, e.target.value)}
                                            style={{
                                                fontSize: 11, padding: "2px 6px", borderRadius: 4,
                                                border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer",
                                            }}
                                        >
                                            <option value="NGO_ADMIN">Admin</option>
                                            <option value="NGO_COORDINATOR">Coordinator</option>
                                            <option value="NGO_MEMBER">Member</option>
                                        </select>
                                        <button onClick={() => handleRemoveMember(m.id, m.name)} style={{
                                            background: "none", border: "none", cursor: "pointer", padding: 2,
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#dc2626" }}>close</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{m.name}</h4>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{m.email}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                                    background: rc.bg, color: rc.text,
                                }}>{roleLabels[m.role] || m.role}</span>
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>Joined {m.joined}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
