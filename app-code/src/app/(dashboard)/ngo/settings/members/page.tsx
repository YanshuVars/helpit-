"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    joined: string;
    initials: string;
    color: string;
}

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#e11d48", "#0284c7"];
const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: "rgba(239,68,68,0.08)", text: "#dc2626" },
    editor: { bg: "rgba(59,130,246,0.08)", text: "#2563eb" },
    viewer: { bg: "rgba(100,116,139,0.08)", text: "#64748b" },
    member: { bg: "rgba(29,226,209,0.08)", text: "#0f766e" },
};

export default function TeamMembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }
            const { data: membership } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", session.user.id).single();
            if (!membership) { setLoading(false); return; }

            const { data } = await supabase
                .from("ngo_members")
                .select("id, role, created_at, user:profiles(full_name, email)")
                .eq("ngo_id", membership.ngo_id)
                .limit(20);

            setMembers((data || []).map((m: any, i: number) => {
                const name = m.user?.full_name || "Unknown";
                const words = name.split(" ");
                const initials = words.length >= 2
                    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
                    : name.slice(0, 2).toUpperCase();
                return {
                    id: m.id,
                    name,
                    email: m.user?.email || "",
                    role: m.role || "member",
                    joined: new Date(m.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    initials,
                    color: COLORS[i % COLORS.length],
                };
            }));
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
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
                <button style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#1de2d1", color: "#0f172a",
                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                    Invite Member
                </button>
            </div>

            {/* Members Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {members.map(m => {
                    const rc = roleColors[m.role] || roleColors.member;
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
                                <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#94a3b8" }}>more_horiz</span>
                                </button>
                            </div>
                            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{m.name}</h4>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{m.email}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                                    background: rc.bg, color: rc.text, textTransform: "capitalize",
                                }}>{m.role}</span>
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>Joined {m.joined}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
