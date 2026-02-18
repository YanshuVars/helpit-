"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";

interface Resource {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: "available" | "low" | "out_of_stock";
    location: string;
    lastUpdated: string;
}

export default function NGOResourcesPage() {
    const resources: Resource[] = [
        { id: "r1", name: "Rice", category: "Food", quantity: 500, unit: "kg", status: "available", location: "Warehouse A", lastUpdated: "2 hours ago" },
        { id: "r2", name: "First Aid Kits", category: "Medical", quantity: 25, unit: "kits", status: "low", location: "Storage Room", lastUpdated: "1 day ago" },
        { id: "r3", name: "Blankets", category: "Clothing", quantity: 100, unit: "pieces", status: "available", location: "Warehouse B", lastUpdated: "3 days ago" },
        { id: "r4", name: "Water Bottles", category: "Food", quantity: 0, unit: "bottles", status: "out_of_stock", location: "Warehouse A", lastUpdated: "1 week ago" },
        { id: "r5", name: "Tents", category: "Shelter", quantity: 15, unit: "units", status: "available", location: "Warehouse B", lastUpdated: "5 days ago" },
    ];

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = ["all", "Food", "Medical", "Clothing", "Shelter", "Equipment"];

    const filteredResources = selectedCategory === "all"
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    const statusStyles = {
        available: "bg-green-100 text-green-700",
        low: "bg-yellow-100 text-yellow-700",
        out_of_stock: "bg-red-100 text-red-700",
    };

    const statusLabels = {
        available: "Available",
        low: "Low Stock",
        out_of_stock: "Out of Stock",
    };

    const totalItems = resources.length;
    const lowStockCount = resources.filter(r => r.status === "low").length;
    const outOfStockCount = resources.filter(r => r.status === "out_of_stock").length;

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
                        {cat === "all" ? "All" : cat}
                    </button>
                ))}
            </div>

            {/* Resources List */}
            <div className="space-y-3">
                {filteredResources.map((resource) => (
                    <div
                        key={resource.id}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${resource.category === "Food" ? "bg-green-100" :
                                    resource.category === "Medical" ? "bg-red-100" :
                                        resource.category === "Clothing" ? "bg-purple-100" :
                                            resource.category === "Shelter" ? "bg-blue-100" :
                                                "bg-gray-100"
                                    }`}>
                                    <span className={`material-symbols-outlined ${resource.category === "Food" ? "text-green-600" :
                                        resource.category === "Medical" ? "text-red-600" :
                                            resource.category === "Clothing" ? "text-purple-600" :
                                                resource.category === "Shelter" ? "text-blue-600" :
                                                    "text-gray-600"
                                        }`}>
                                        {resource.category === "Food" ? "restaurant" :
                                            resource.category === "Medical" ? "medical_services" :
                                                resource.category === "Clothing" ? "checkroom" :
                                                    resource.category === "Shelter" ? "home" :
                                                        "inventory_2"}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{resource.name}</h3>
                                    <p className="text-xs text-gray-500">{resource.category}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[resource.status]}`}>
                                {statusLabels[resource.status]}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">inventory</span>
                                    {resource.quantity} {resource.unit}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    {resource.location}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-full hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-gray-400">edit</span>
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-gray-400">more_vert</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
                        <div className="p-4 space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Resource Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter resource name"
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Category *</label>
                                <select className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white">
                                    <option value="">Select category</option>
                                    <option value="Food">Food</option>
                                    <option value="Medical">Medical</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Shelter">Shelter</option>
                                    <option value="Equipment">Equipment</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Quantity *</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Unit *</label>
                                    <select className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white">
                                        <option value="kg">Kilograms (kg)</option>
                                        <option value="liters">Liters</option>
                                        <option value="pieces">Pieces</option>
                                        <option value="kits">Kits</option>
                                        <option value="units">Units</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Storage Location</label>
                                <input
                                    type="text"
                                    placeholder="Where is this stored?"
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <button className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl">
                                Add Resource
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
