"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface Resource {
    id: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    min_quantity: number;
    is_low_stock: boolean;
    storage_location: string;
    updated_at: string;
}

const categoryLabels: Record<string, string> = {
    FOOD: "Food",
    MEDICAL: "Medical",
    CLOTHING: "Clothing",
    EQUIPMENT: "Equipment",
    VEHICLE: "Vehicle",
    OTHER: "Other",
};

const categoryIcons: Record<string, { icon: string; bg: string; color: string }> = {
    FOOD: { icon: "restaurant", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
    MEDICAL: { icon: "medical_services", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    CLOTHING: { icon: "checkroom", bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
    EQUIPMENT: { icon: "construction", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    VEHICLE: { icon: "directions_car", bg: "rgba(16,185,129,0.1)", color: "#059669" },
    OTHER: { icon: "category", bg: "rgba(100,116,139,0.1)", color: "#64748b" },
};

const categories = ['FOOD', 'MEDICAL', 'CLOTHING', 'EQUIPMENT', 'VEHICLE', 'OTHER'] as const;

export default function ResourcesPage() {
    const { ngoId, canWrite, loading: ctxLoading } = useNgoContext();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formCategory, setFormCategory] = useState("FOOD");
    const [formQuantity, setFormQuantity] = useState(0);
    const [formUnit, setFormUnit] = useState("units");
    const [formMinQty, setFormMinQty] = useState(0);
    const [formLocation, setFormLocation] = useState("");

    useEffect(() => {
        async function load() {
            if (ctxLoading || !ngoId) { setLoading(false); return; }
            const supabase = createClient();
            const { data, error } = await supabase
                .from("resources")
                .select("id, name, description, category, quantity, unit, min_quantity, is_low_stock, storage_location, updated_at")
                .eq("ngo_id", ngoId)
                .order("updated_at", { ascending: false });

            if (error) {
                console.error("Error fetching resources:", error);
                toast.error("Failed to load resources.");
            }
            setResources((data || []).map((r: any) => ({
                ...r,
                description: r.description || "",
                unit: r.unit || "units",
                storage_location: r.storage_location || "",
            })));
            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    function resetForm() {
        setFormName("");
        setFormDesc("");
        setFormCategory("FOOD");
        setFormQuantity(0);
        setFormUnit("units");
        setFormMinQty(0);
        setFormLocation("");
        setEditingId(null);
        setShowForm(false);
    }

    function startEdit(r: Resource) {
        setEditingId(r.id);
        setFormName(r.name);
        setFormDesc(r.description);
        setFormCategory(r.category);
        setFormQuantity(r.quantity);
        setFormUnit(r.unit);
        setFormMinQty(r.min_quantity);
        setFormLocation(r.storage_location);
        setShowForm(true);
    }

    async function handleSave() {
        if (!ngoId || !canWrite) {
            toast.error("You don't have permission to manage resources.");
            return;
        }
        if (!formName.trim()) {
            toast.error("Resource name is required.");
            return;
        }
        setSaving(true);
        const supabase = createClient();
        const isLowStock = formQuantity <= formMinQty;

        if (editingId) {
            // UPDATE
            const { error } = await supabase
                .from("resources")
                .update({
                    name: formName.trim(),
                    description: formDesc.trim() || null,
                    category: formCategory,
                    quantity: formQuantity,
                    unit: formUnit.trim(),
                    min_quantity: formMinQty,
                    is_low_stock: isLowStock,
                    storage_location: formLocation.trim() || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", editingId);

            if (error) {
                toast.error(`Failed to update: ${error.message}`);
            } else {
                toast.success("Resource updated!");
                setResources(prev => prev.map(r => r.id === editingId ? {
                    ...r,
                    name: formName.trim(),
                    description: formDesc.trim(),
                    category: formCategory,
                    quantity: formQuantity,
                    unit: formUnit.trim(),
                    min_quantity: formMinQty,
                    is_low_stock: isLowStock,
                    storage_location: formLocation.trim(),
                    updated_at: new Date().toISOString(),
                } : r));
                resetForm();
            }
        } else {
            // INSERT
            const { data: newRes, error } = await supabase
                .from("resources")
                .insert({
                    ngo_id: ngoId,
                    name: formName.trim(),
                    description: formDesc.trim() || null,
                    category: formCategory,
                    quantity: formQuantity,
                    unit: formUnit.trim(),
                    min_quantity: formMinQty,
                    is_low_stock: isLowStock,
                    storage_location: formLocation.trim() || null,
                })
                .select("id, updated_at")
                .single();

            if (error) {
                toast.error(`Failed to add resource: ${error.message}`);
            } else {
                toast.success("Resource added!");
                setResources(prev => [{
                    id: newRes.id,
                    name: formName.trim(),
                    description: formDesc.trim(),
                    category: formCategory,
                    quantity: formQuantity,
                    unit: formUnit.trim(),
                    min_quantity: formMinQty,
                    is_low_stock: isLowStock,
                    storage_location: formLocation.trim(),
                    updated_at: newRes.updated_at,
                }, ...prev]);
                resetForm();
            }
        }
        setSaving(false);
    }

    async function handleDelete(resId: string, name: string) {
        if (!confirm(`Delete "${name}" from your inventory? This cannot be undone.`)) return;
        const supabase = createClient();
        const { error } = await supabase.from("resources").delete().eq("id", resId);
        if (error) {
            toast.error(`Failed to delete: ${error.message}`);
        } else {
            toast.success(`"${name}" removed from inventory.`);
            setResources(prev => prev.filter(r => r.id !== resId));
        }
    }

    async function handleQuickQuantity(resId: string, delta: number) {
        const resource = resources.find(r => r.id === resId);
        if (!resource) return;
        const newQty = Math.max(0, resource.quantity + delta);
        const isLowStock = newQty <= resource.min_quantity;

        const supabase = createClient();
        const { error } = await supabase
            .from("resources")
            .update({ quantity: newQty, is_low_stock: isLowStock, updated_at: new Date().toISOString() })
            .eq("id", resId);

        if (error) {
            toast.error(`Failed to update quantity: ${error.message}`);
        } else {
            setResources(prev => prev.map(r => r.id === resId ? { ...r, quantity: newQty, is_low_stock: isLowStock, updated_at: new Date().toISOString() } : r));
        }
    }

    const filtered = resources.filter(r =>
        !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
    );

    const totalItems = resources.reduce((s, r) => s + r.quantity, 0);
    const lowStockCount = resources.filter(r => r.is_low_stock && r.quantity > 0).length;
    const depleted = resources.filter(r => r.quantity === 0).length;
    const uniqueCategories = new Set(resources.map(r => r.category)).size;

    const inputStyle = {
        width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
        border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
    };

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
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Resources</h1>
                    <p style={{ color: "#64748b", fontSize: 15, marginTop: 4 }}>Track and manage your organization's inventory.</p>
                </div>
                {canWrite && (
                    <button onClick={() => { resetForm(); setShowForm(true); }} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "10px 20px", borderRadius: 8,
                        background: "#1de2d1", color: "#0f172a",
                        fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Add Resource
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                    { label: "Total Items", value: totalItems, icon: "inventory_2", color: "#2563eb" },
                    { label: "Low Stock", value: lowStockCount, icon: "warning", color: "#d97706" },
                    { label: "Depleted", value: depleted, icon: "error", color: "#dc2626" },
                    { label: "Categories", value: uniqueCategories, icon: "category", color: "#059669" },
                ].map(c => (
                    <div key={c.label} style={{
                        background: '#fff', borderRadius: 12, padding: 16,
                        border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 10,
                            background: `${c.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span className="material-symbols-outlined" style={{ color: c.color, fontSize: 22 }}>{c.icon}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{c.value}</p>
                            <p style={{ fontSize: 12, color: '#94a3b8' }}>{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #e2e8f0', marginBottom: 24,
                }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
                        {editingId ? "Edit Resource" : "Add New Resource"}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Name *</label>
                            <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Rice Bags" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Category</label>
                            <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={inputStyle}>
                                {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Description</label>
                            <input type="text" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Brief description" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Quantity</label>
                            <input type="number" min={0} value={formQuantity} onChange={e => setFormQuantity(Number(e.target.value))} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Unit</label>
                            <input type="text" value={formUnit} onChange={e => setFormUnit(e.target.value)} placeholder="e.g. kg, boxes, units" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Min Quantity (low stock threshold)</label>
                            <input type="number" min={0} value={formMinQty} onChange={e => setFormMinQty(Number(e.target.value))} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Storage Location</label>
                            <input type="text" value={formLocation} onChange={e => setFormLocation(e.target.value)} placeholder="e.g. Warehouse A" style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                        <button onClick={resetForm} style={{
                            padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                            background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{
                            padding: '8px 18px', borderRadius: 8, border: 'none',
                            background: '#1de2d1', color: '#0f172a', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}>
                            {saving ? "Saving..." : editingId ? "Update" : "Add Resource"}
                        </button>
                    </div>
                </div>
            )}

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 20 }}>
                <span className="material-symbols-outlined" style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8",
                }}>search</span>
                <input
                    type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{
                        width: "100%", height: 44, paddingLeft: 42, borderRadius: 10,
                        border: "1px solid #e2e8f0", fontSize: 13, outline: "none",
                    }}
                />
            </div>

            {/* Resources List */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 64,
                    background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#cbd5e1" }}>inventory_2</span>
                    <p style={{ marginTop: 12, color: "#94a3b8" }}>No resources found</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                    {filtered.map(r => {
                        const ci = categoryIcons[r.category] || categoryIcons.OTHER;
                        const stockStatus = r.quantity === 0 ? "Depleted" : r.is_low_stock ? "Low Stock" : "Available";
                        const stockColor = r.quantity === 0 ? "#dc2626" : r.is_low_stock ? "#d97706" : "#059669";
                        return (
                            <div key={r.id} style={{
                                background: '#fff', borderRadius: 12, padding: 18,
                                border: '1px solid #e2e8f0',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            background: ci.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ color: ci.color, fontSize: 20 }}>{ci.icon}</span>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</h4>
                                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{categoryLabels[r.category] || r.category}</span>
                                        </div>
                                    </div>
                                    {canWrite && (
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            <button onClick={() => startEdit(r)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#64748b' }}>edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(r.id, r.name)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#dc2626' }}>delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {canWrite && (
                                            <button onClick={() => handleQuickQuantity(r.id, -1)} style={{
                                                width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0',
                                                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                                            </button>
                                        )}
                                        <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', minWidth: 40, textAlign: 'center' }}>
                                            {r.quantity}
                                        </span>
                                        {canWrite && (
                                            <button onClick={() => handleQuickQuantity(r.id, 1)} style={{
                                                width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0',
                                                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                                            </button>
                                        )}
                                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.unit}</span>
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                                        background: `${stockColor}14`, color: stockColor,
                                    }}>{stockStatus}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                                    <span>Min: {r.min_quantity} {r.unit}</span>
                                    <span>Updated {new Date(r.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
