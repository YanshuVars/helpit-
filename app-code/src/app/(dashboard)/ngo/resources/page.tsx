"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Resource {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: string;
    last_updated: string;
}

const statusMap: Record<string, { color: string; bg: string; label: string }> = {
    available: { color: "#059669", bg: "rgba(16,185,129,0.08)", label: "Available" },
    low: { color: "#d97706", bg: "rgba(245,158,11,0.08)", label: "Low Stock" },
    depleted: { color: "#dc2626", bg: "rgba(239,68,68,0.08)", label: "Depleted" },
    reserved: { color: "#2563eb", bg: "rgba(59,130,246,0.08)", label: "Reserved" },
};

const catIcons: Record<string, { icon: string; bg: string; color: string }> = {
    Medical: { icon: "medical_services", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    Food: { icon: "restaurant", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
    Water: { icon: "water_drop", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    Shelter: { icon: "house", bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
    Clothing: { icon: "checkroom", bg: "rgba(236,72,153,0.1)", color: "#db2777" },
    Equipment: { icon: "construction", bg: "rgba(100,116,139,0.1)", color: "#475569" },
};

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

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
                .from("resources")
                .select("id, name, category, quantity, unit, status, updated_at")
                .eq("ngo_id", membership.ngo_id)
                .order("updated_at", { ascending: false })
                .limit(30);

            setResources((data || []).map((r: any) => ({ ...r, last_updated: r.updated_at })));
            setLoading(false);
        }
        load();
    }, []);

    const totalItems = resources.reduce((s, r) => s + r.quantity, 0);
    const lowItems = resources.filter(r => r.status === "low" || r.status === "depleted").length;
    const categories = new Set(resources.map(r => r.category));

    const filtered = resources.filter(r =>
        !search || r.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Resources & Inventory</h2>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Track supplies, equipment, and materials across relief programs.</p>
                </div>
                <button style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#1de2d1", color: "#0f172a",
                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Add Resource
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 18,
                    border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Total Items</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginTop: 6 }}>{totalItems}</p>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(29,226,209,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ color: "#1de2d1", fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                        </div>
                    </div>
                </div>
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 18,
                    border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Low / Depleted</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: lowItems > 0 ? "#f59e0b" : "#0f172a", marginTop: 6 }}>{lowItems}</p>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ color: "#d97706", fontVariationSettings: "'FILL' 1" }}>warning</span>
                        </div>
                    </div>
                </div>
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 18,
                    border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Categories</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginTop: 6 }}>{categories.size}</p>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ color: "#7c3aed", fontVariationSettings: "'FILL' 1" }}>category</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div style={{
                position: "relative", marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8",
                }}>search</span>
                <input
                    type="text" placeholder="Search resources..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{
                        width: "100%", height: 44, paddingLeft: 42, borderRadius: 10,
                        border: "1px solid #e2e8f0", fontSize: 13, outline: "none",
                    }}
                />
            </div>

            {/* Resources Table */}
            <div style={{
                background: "#fff", borderRadius: 12,
                border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                overflow: "hidden",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "rgba(248,250,252,0.5)", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Resource</th>
                            <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Category</th>
                            <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>Quantity</th>
                            <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                            <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "right" }}>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => {
                            const ci = catIcons[r.category] || catIcons.Equipment;
                            const sm = statusMap[r.status] || statusMap.available;
                            return (
                                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 34, height: 34, borderRadius: 8,
                                                background: ci.bg, display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: ci.color }}>{ci.icon}</span>
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{r.category}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                                        {r.quantity} {r.unit || "units"}
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600, padding: "3px 10px",
                                            borderRadius: 20, background: sm.bg, color: sm.color,
                                        }}>{sm.label}</span>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>
                                        {r.last_updated ? new Date(r.last_updated).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 8 }}>inventory</span>
                                    <p>No resources tracked yet</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
