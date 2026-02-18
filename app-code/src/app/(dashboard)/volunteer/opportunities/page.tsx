import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";

export default function VolunteerOpportunitiesPage() {
    const opportunities = [
        { id: "1", title: "Food Distribution Drive", ngo: "Hope Foundation", distance: "0.8 km", urgency: "HIGH", volunteers: 3 },
        { id: "2", title: "Teaching Session", ngo: "EduChild", distance: "2.1 km", urgency: "MEDIUM", volunteers: 1 },
        { id: "3", title: "Medical Camp Assistance", ngo: "HealthFirst", distance: "3.5 km", urgency: "HIGH", volunteers: 5 },
    ];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Find Opportunities" showBack fallbackRoute="/volunteer" />

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input type="text" placeholder="Search opportunities..." className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4" />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--primary)] text-white whitespace-nowrap min-h-[44px]">All</button>
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 whitespace-nowrap min-h-[44px]">Nearby</button>
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 whitespace-nowrap min-h-[44px]">Urgent</button>
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 whitespace-nowrap min-h-[44px]">My Skills</button>
                <Link href="/volunteer/opportunities/map" className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 whitespace-nowrap min-h-[44px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">map</span>
                    Map
                </Link>
            </div>

            {/* Opportunities List */}
            <div className="flex flex-col gap-4">
                {opportunities.map((opp) => (
                    <div key={opp.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold">{opp.title}</h3>
                                <p className="text-xs text-gray-500">{opp.ngo}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${opp.urgency === "HIGH" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {opp.urgency}
                            </span>
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
                        <button className="w-full py-3 rounded-lg bg-[var(--primary)] text-white text-sm font-bold min-h-[44px]">
                            Apply
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

