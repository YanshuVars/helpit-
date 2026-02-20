"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Resource {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    min_stock: number;
    location: string | null;
    notes: string | null;
    updated_at: string;
}

const categoryIcons: Record<string, string> = {
    FOOD: "lunch_dining",
    MEDICAL: "medical_services",
    CLOTHING: "checkroom",
    SHELTER: "night_shelter",
    EQUIPMENT: "construction",
    OTHER: "inventory_2",
};

export default function NGOResourcesPage() {
    const supabase = createClient();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "", category: "FOOD", quantity: "", unit: "units", min_stock: "10", location: "", notes: "",
    });

    useEffect(() => { fetchResources(); }, []);

    async function fetchResources() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const { data: ngoData } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", user.id).single();

            if (ngoData?.ngo_id) {
                const { data: resourcesData } = await supabase
                    .from("resources").select("*")
                    .eq("ngo_id", ngoData.ngo_id)
                    .order("name", { ascending: true });
                if (resourcesData) setResources(resourcesData as Resource[]);
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally { setLoading(false); }
    }

    async function handleAddResource(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: ngoData } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", user.id).single();
            if (!ngoData?.ngo_id) return;

            await supabase.from("resources").insert({
                ngo_id: ngoData.ngo_id,
                name: formData.name,
                category: formData.category,
                quantity: parseInt(formData.quantity) || 0,
                unit: formData.unit,
                min_stock: parseInt(formData.min_stock) || 10,
                location: formData.location || null,
                notes: formData.notes || null,
            });

            setShowAddModal(false);
            setFormData({ name: "", category: "FOOD", quantity: "", unit: "units", min_stock: "10", location: "", notes: "" });
            fetchResources();
        } catch (error) {
            console.error("Error adding resource:", error);
            alert("Failed to add resource");
        } finally { setSubmitting(false); }
    }

    async function updateQuantity(resourceId: string, delta: number) {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return;
        const newQty = Math.max(0, resource.quantity + delta);
        setResources(resources.map(r => r.id === resourceId ? { ...r, quantity: newQty } : r));
        try {
            await supabase.from("resources").update({ quantity: newQty }).eq("id", resourceId);
        } catch (error) {
            console.error("Error updating quantity:", error);
            fetchResources();
        }
    }

    const getStockStatus = (resource: Resource) => {
        if (resource.quantity === 0) return { label: "OUT", bg: '#FEE2E2', color: '#DC2626' };
        if (resource.quantity <= resource.min_stock) return { label: "LOW", bg: '#FFF3E0', color: '#E65100' };
        return { label: "OK", bg: '#E8F5E9', color: '#2E7D32' };
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title">Resources</h1>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Add
                </button>
            </div>

            {/* Stats Summary */}
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card">
                    <div className="stat-card-label">Total Items</div>
                    <div className="stat-card-value">{resources.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Low Stock</div>
                    <div className="stat-card-value" style={{ color: '#E65100' }}>
                        {resources.filter(r => r.quantity > 0 && r.quantity <= r.min_stock).length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Out of Stock</div>
                    <div className="stat-card-value" style={{ color: '#DC2626' }}>
                        {resources.filter(r => r.quantity === 0).length}
                    </div>
                </div>
            </div>

            {/* Resource List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {resources.length === 0 ? (
                    <div className="empty-state-container">
                        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>inventory</span>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No resources tracked yet</p>
                    </div>
                ) : (
                    resources.map(resource => {
                        const stock = getStockStatus(resource);
                        const icon = categoryIcons[resource.category] || "inventory_2";
                        return (
                            <div key={resource.id} className="card" style={{ padding: '16px 18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                                        background: 'var(--color-primary-soft)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>{icon}</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{resource.name}</span>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700,
                                                padding: '2px 6px', borderRadius: 'var(--radius-full)',
                                                background: stock.bg, color: stock.color,
                                            }}>{stock.label}</span>
                                        </div>
                                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            {resource.category} {resource.location ? `· ${resource.location}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                                    <button
                                        onClick={() => updateQuantity(resource.id, -1)}
                                        style={{
                                            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                                    </button>
                                    <span style={{ minWidth: 60, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>
                                        {resource.quantity} {resource.unit}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(resource.id, 1)}
                                        style={{
                                            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Resource Modal */}
            {showAddModal && (
                <>
                    <div onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'fixed', left: '50%', top: '50%', zIndex: 50,
                        width: '100%', maxWidth: 440, transform: 'translate(-50%, -50%)',
                        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--color-bg-card)', zIndex: 1 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Add Resource</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddResource}>
                            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div className="form-group">
                                    <label className="field-label">Resource Name *</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="field-input" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="field-input">
                                        <option value="FOOD">Food</option>
                                        <option value="MEDICAL">Medical</option>
                                        <option value="CLOTHING">Clothing</option>
                                        <option value="SHELTER">Shelter</option>
                                        <option value="EQUIPMENT">Equipment</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div className="form-group">
                                        <label className="field-label">Quantity</label>
                                        <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="field-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">Unit</label>
                                        <input type="text" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="field-input" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Minimum Stock Alert</label>
                                    <input type="number" value={formData.min_stock} onChange={e => setFormData({ ...formData, min_stock: e.target.value })} className="field-input" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Storage Location</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Warehouse A" className="field-input" />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Notes</label>
                                    <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={2} className="field-input field-textarea" />
                                </div>
                            </div>
                            <div style={{ padding: '14px 18px', borderTop: '1px solid var(--color-border-subtle)', position: 'sticky', bottom: 0, background: 'var(--color-bg-card)' }}>
                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 42, fontSize: 14, fontWeight: 700, opacity: submitting ? 0.5 : 1 }}>
                                    {submitting ? "Adding..." : "Add Resource"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
