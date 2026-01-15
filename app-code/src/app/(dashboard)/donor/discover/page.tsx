import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DonorDiscoverPage() {
    const ngos = [
        { id: "n1", name: "Hope Foundation", category: "Community", followers: 1234, verified: true },
        { id: "n2", name: "GreenEarth", category: "Environment", followers: 567, verified: true },
        { id: "n3", name: "EduChild", category: "Education", followers: 890, verified: true },
        { id: "n4", name: "HealthFirst", category: "Healthcare", followers: 432, verified: false },
    ];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Discover NGOs" showBack fallbackRoute="/donor" />

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input type="text" placeholder="Search NGOs..." className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4" />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {["All", "Education", "Environment", "Healthcare", "Community", "Animals"].map((cat, i) => (
                    <button key={cat} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap min-h-[44px] ${i === 0 ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* NGO List */}
            <div className="flex flex-col gap-4">
                {ngos.map((ngo) => (
                    <Link key={ngo.id} href={`/donor/donate/${ngo.id}`} className="block bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-xl font-bold shrink-0">
                                {ngo.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <h3 className="font-bold truncate">{ngo.name}</h3>
                                    {ngo.verified && <span className="material-symbols-outlined text-[var(--primary)] text-sm shrink-0">verified</span>}
                                </div>
                                <p className="text-xs text-gray-500">{ngo.category} • {ngo.followers.toLocaleString()} followers</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold min-h-[44px] shrink-0">
                                Follow
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

