"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "@/lib/utils";

interface Resource {
    id: string;
    ngo_id: string;
    name: string;
    description: string | null;
    category: string;
    quantity: number;
    unit: string | null;
    storage_location: string | null;
    min_quantity: number;
    is_low_stock: boolean;
    created_at: string;
    updated_at: string;
}

export default function NGOResourcesPage() {
    const supabase = createClient();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "OTHER",
        quantity: "",
        unit: "pieces",
        storage_location: "",
        min_quantity: "10",
    });

    const categories = ["all", "FOOD", "MEDICAL", "CLOTHING", "SHELTER", "EQUIPMENT", "VEHICLE", "OTHER"];

    useEffect(() => {
        fetchResources();
    }, []);

    async function fetchResources() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            // Get NGO ID for the user
            const { data: ngoData } = await supabase
                .from("ngo_members")
                .select("ngo_id")
                .eq("user_id", user.id)
                .single();

            if (ngoData?.ngo_id) {
                const { data: resourcesData, error } = await supabase
                    .from("resources")
                    .select("*")
                    .eq("ngo_id", ngoData.ngo_id)
                    .order("name", { ascending: true });

                if (resourcesData) {
                    setResources(resourcesData as Resource[]);
                }
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddResource(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get NGO ID
            const { data: ngoData } = await supabase
                .from("ngo_members")
                .select("ngo_id")
                .eq("user_id", user.id)
                .single();

            if (!ngoData?.ngo_id) {
                alert("You must be an NGO member to add resources");
                return;
            }

            const { error } = await supabase.from("resources").insert({
                ngo_id: ngoData.ngo_id,
                name: formData.name,
                description: formData.description || null,
                category: formData.category,
                quantity: parseInt(formData.quantity) || 0,
                unit: formData.unit,
                storage_location: formData.storage_location || null,
                min_quantity: parseInt(formData.min_quantity) || 0,
            });

            if (error) throw error;

            setShowAddModal(false);
            setFormData({
                name: "",
                description: "",
                category: "OTHER",
                quantity: "",
                unit: "pieces",
                storage_location: "",
                min_quantity: "10",
            });
            fetchResources();
        } catch (error) {
            console.error("Error adding resource:", error);
            alert("Failed to add resource");
        } finally {
            setSubmitting(false);
        }
    }

    async function updateQuantity(resourceId: string, newQuantity: number) {
        try {
            const { error } = await supabase
                .from("resources")
                .update({
                    quantity: newQuantity,
                    is_low_stock: newQuantity <= 10
                })
                .eq("id", resourceId);

            if (error) throw error;
            fetchResources();
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Failed to update quantity");
        }
    }

    const filteredResources = selectedCategory === "all"
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    const totalItems = resources.length;
    const lowStockCount = resources.filter(r => r.is_low_stock).length;
    const outOfStockCount = resources.filter(r => r.quantity === 0).length;

    const getStatusStyle = (resource: Resource) => {
        if (resource.quantity === 0) {
            return { bg: "bg-red-100", text: "text-red-700", label: "Out of Stock" };
        }
        if (resource.is_low_stock) {
            return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Low Stock" };
        }
        return { bg: "bg-green-100", text: "text-green-700", label: "Available" };
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "FOOD": return { icon: "restaurant", bg: "bg-green-100", text: "text-green-600" };
            case "MEDICAL": return { icon: "medical_services", bg: "bg-red-100", text: "text-red-600" };
            case "CLOTHING": return { icon: "checkroom", bg: "bg-purple-100", text: "text-purple-600" };
            case "SHELTER": return { icon: "home", bg: "bg-blue-100", text: "text-blue-600" };
            case "VEHICLE": return { icon: "directions_car", bg: "bg-orange-100", text: "text-orange-600" };
            default: return { icon: "inventory_2", bg: "bg-gray-100", text: "text-gray-600" };
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Resources" showBack fallbackRoute="/ngo" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Resources"
                showBack
                fallbackRoute="/ngo"
                rightAction={
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add
                    </button>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-[var(--primary)]">{totalItems}</p>
                    <p className="text-xs text-gray-500">Total Items</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-yellow-500">{lowStockCount}</p>
                    <p className="text-xs text-gray-500">Low Stock</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-red-500">{outOfStockCount}</p>
                    <p className="text-xs text-gray-500">Out of Stock</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap min-h-[44px] ${selectedCategory === cat
                            ? "bg-[var(--primary)] text-white"
                            : "bg-gray-100"
                            }`}
                    >
                        {cat === "all" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Resources List */}
            <div className="space-y-3">
                {filteredResources.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400">inventory_2</span>
                        <p className="text-gray-500 mt-2">No resources yet</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 text-[var(--primary)] font-semibold"
                        >
                            Add your first resource
                        </button>
                    </div>
                ) : (
                    filteredResources.map((resource) => {
                        const status = getStatusStyle(resource);
                        const catIcon = getCategoryIcon(resource.category);
                        return (
                            <div
                                key={resource.id}
                                className="bg-white rounded-xl p-4 border border-gray-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${catIcon.bg}`}>
                                            <span className={`material-symbols-outlined ${catIcon.text}`}>
                                                {catIcon.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{resource.name}</h3>
                                            <p className="text-xs text-gray-500">{resource.category}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg">inventory</span>
                                            {resource.quantity} {resource.unit}
                                        </span>
                                        {resource.storage_location && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-lg">location_on</span>
                                                {resource.storage_location}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Quick quantity adjustment */}
                                        <button
                                            onClick={() => updateQuantity(resource.id, Math.max(0, resource.quantity - 1))}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                        >
                                            <span className="material-symbols-outlined text-gray-400">remove</span>
                                        </button>
                                        <button
                                            onClick={() => updateQuantity(resource.id, resource.quantity + 1)}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                        >
                                            <span className="material-symbols-outlined text-gray-400">add</span>
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-gray-100">
                                            <span className="material-symbols-outlined text-gray-400">more_vert</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Resource Request Button */}
            <div className="sticky bottom-24 bg-[var(--background-light)] pt-4">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm">
                    <span className="material-symbols-outlined">request_quote</span>
                    Request Resources
                </button>
            </div>

            {/* Add Resource Modal */}
            {showAddModal && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Add Resource</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddResource}>
                            <div className="p-4 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Resource Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter resource name"
                                        required
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white"
                                    >
                                        <option value="FOOD">Food</option>
                                        <option value="MEDICAL">Medical</option>
                                        <option value="CLOTHING">Clothing</option>
                                        <option value="SHELTER">Shelter</option>
                                        <option value="EQUIPMENT">Equipment</option>
                                        <option value="VEHICLE">Vehicle</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description..."
                                        rows={2}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Quantity *</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="0"
                                            required
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Unit *</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white"
                                        >
                                            <option value="kg">Kilograms (kg)</option>
                                            <option value="liters">Liters</option>
                                            <option value="pieces">Pieces</option>
                                            <option value="kits">Kits</option>
                                            <option value="units">Units</option>
                                            <option value="boxes">Boxes</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Min Stock Alert</label>
                                        <input
                                            type="number"
                                            value={formData.min_quantity}
                                            onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                                            placeholder="10"
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Storage Location</label>
                                        <input
                                            type="text"
                                            value={formData.storage_location}
                                            onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
                                            placeholder="Location"
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl disabled:opacity-50"
                                >
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
