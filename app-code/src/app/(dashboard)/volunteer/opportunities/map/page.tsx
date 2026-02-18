"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export default function OpportunitiesMapPage() {
    const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);

    const opportunities = [
        {
            id: "1",
            title: "Food Distribution Drive",
            ngo: "Hope Foundation",
            distance: "0.8 km",
            urgency: "HIGH",
            volunteers: 3,
            lat: 19.0760,
            lng: 72.8777,
            address: "123 Main Street, Mumbai"
        },
        {
            id: "2",
            title: "Teaching Session",
            ngo: "EduChild",
            distance: "2.1 km",
            urgency: "MEDIUM",
            volunteers: 1,
            lat: 19.0780,
            lng: 72.8790,
            address: "456 Education Lane, Mumbai"
        },
        {
            id: "3",
            title: "Medical Camp Assistance",
            ngo: "HealthFirst",
            distance: "3.5 km",
            urgency: "HIGH",
            volunteers: 5,
            lat: 19.0720,
            lng: 72.8850,
            address: "789 Health Ave, Mumbai"
        },
        {
            id: "4",
            title: "Elderly Care Visit",
            ngo: "Golden Years",
            distance: "1.2 km",
            urgency: "LOW",
            volunteers: 2,
            lat: 19.0790,
            lng: 72.8740,
            address: "321 Care Home Road, Mumbai"
        },
        {
            id: "5",
            title: "Beach Cleanup",
            ngo: "Green Earth",
            distance: "5.0 km",
            urgency: "MEDIUM",
            volunteers: 10,
            lat: 19.0650,
            lng: 72.8900,
            address: "Marine Drive Beach, Mumbai"
        },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-180px)]">
            <PageHeader title="Map View" showBack fallbackRoute="/volunteer/opportunities" />

            {/* Map Container */}
            <div className="flex-1 relative bg-gray-100 rounded-xl overflow-hidden">
                {/* Map Placeholder - In production, use Mapbox or Google Maps */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    {/* Grid Lines for visual effect */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }} />

                    {/* Simulated Map Markers */}
                    {opportunities.map((opp) => (
                        <button
                            key={opp.id}
                            onClick={() => setSelectedOpportunity(opp.id)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform ${selectedOpportunity === opp.id ? "scale-125" : "hover:scale-110"
                                }`}
                            style={{
                                left: `${((opp.lng - 72.87) / 0.03) * 20 + 50}%`,
                                top: `${((19.08 - opp.lat) / 0.02) * 20 + 40}%`
                            }}
                        >
                            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${opp.urgency === "HIGH" ? "bg-red-500" :
                                    opp.urgency === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
                                }`}>
                                <span className="material-symbols-outlined text-white text-lg">location_on</span>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full text-[10px] font-bold flex items-center justify-center">
                                    {opp.volunteers}
                                </span>
                            </div>
                        </button>
                    ))}

                    {/* Current Location Marker */}
                    <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: "50%", top: "50%" }}
                    >
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-600/30 rounded-full blur-sm" />
                    </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <span className="material-symbols-outlined">my_location</span>
                    </button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Urgency</p>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-xs">
                            <span className="w-3 h-3 bg-red-500 rounded-full" /> High
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <span className="w-3 h-3 bg-yellow-500 rounded-full" /> Medium
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <span className="w-3 h-3 bg-green-500 rounded-full" /> Low
                        </span>
                    </div>
                </div>
            </div>

            {/* Selected Opportunity Card */}
            {selectedOpportunity && (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-2xl p-4 animate-slideUp">
                    {(() => {
                        const opp = opportunities.find(o => o.id === selectedOpportunity);
                        if (!opp) return null;
                        return (
                            <>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-bold">{opp.title}</h3>
                                        <p className="text-xs text-gray-500">{opp.ngo}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOpportunity(null)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined text-gray-400">close</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {opp.distance}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">group</span>
                                        {opp.volunteers} needed
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/volunteer/opportunities`}
                                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-center text-sm font-semibold"
                                    >
                                        List View
                                    </Link>
                                    <button className="flex-1 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-bold">
                                        Apply Now
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
