import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

const mockRequests = [
    { id: "1", title: "Emergency Food Relief", category: "FOOD", urgency: "CRITICAL", status: "OPEN", volunteers: 3, created: "2h ago" },
    { id: "2", title: "Medical Supplies Needed", category: "MEDICAL", urgency: "HIGH", status: "IN_PROGRESS", volunteers: 5, created: "1d ago" },
    { id: "3", title: "Shelter for Flood Victims", category: "DISASTER", urgency: "HIGH", status: "OPEN", volunteers: 2, created: "3d ago" },
    { id: "4", title: "School Supplies Drive", category: "OTHER", urgency: "MEDIUM", status: "RESOLVED", volunteers: 8, created: "1w ago" },
];

const urgencyColors = {
    CRITICAL: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
};

const statusColors = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-700",
};

export default function NGORequestsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Help Requests"
                showBack
                fallbackRoute="/ngo"
                rightAction={
                    <Link
                        href="/ngo/requests/create"
                        className="flex items-center gap-1.5 bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-semibold min-h-[44px]"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        New
                    </Link>
                }
            />

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {["All", "Open", "In Progress", "Resolved"].map((tab, i) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap min-h-[44px] ${i === 0 ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Request List */}
            <div className="flex flex-col gap-4">
                {mockRequests.map((request) => (
                    <Link
                        key={request.id}
                        href={`/ngo/requests/${request.id}`}
                        className="block bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-base">{request.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${urgencyColors[request.urgency as keyof typeof urgencyColors]}`}>
                                {request.urgency}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[request.status as keyof typeof statusColors]}`}>
                                {request.status.replace("_", " ")}
                            </span>
                            <span className="text-xs text-gray-500">{request.category}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{request.volunteers} volunteers</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">{request.created}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

