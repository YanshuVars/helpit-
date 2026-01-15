import Link from "next/link";

// Mock request data
const request = {
    id: "1",
    title: "Emergency Food Relief",
    description: "We need volunteers to help distribute food packages to families affected by the recent floods in the eastern district. Packages are ready at our warehouse and need to be delivered to approximately 50 families.",
    category: "FOOD",
    urgency: "CRITICAL",
    status: "OPEN",
    location: "Eastern District Community Center, 123 Main Street",
    createdBy: "Admin Sarah",
    createdAt: "2 hours ago",
    volunteers: [
        { id: "v1", name: "John Doe", avatar: "J", status: "ACCEPTED" },
        { id: "v2", name: "Jane Smith", avatar: "J", status: "IN_PROGRESS" },
        { id: "v3", name: "Mike Wilson", avatar: "M", status: "ASSIGNED" },
    ],
};

export default function RequestDetailPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/ngo/requests" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-bold">{request.title}</h1>
                    <p className="text-xs text-gray-500">Created {request.createdAt}</p>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                    {request.urgency}
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">
                    {request.status}
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                    {request.category}
                </span>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--primary)]">location_on</span>
                    Location
                </h3>
                <p className="text-sm text-gray-600">{request.location}</p>
                <div className="h-32 rounded-lg bg-gray-100 mt-3 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Map</span>
                </div>
                <button className="w-full mt-3 text-[var(--primary)] text-sm font-semibold flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-lg">directions</span>
                    Get Directions
                </button>
            </div>

            {/* Assigned Volunteers */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Assigned Volunteers ({request.volunteers.length})</h3>
                    <Link href={`/ngo/requests/${request.id}/assign`} className="text-[var(--primary)] text-sm font-semibold">
                        + Assign
                    </Link>
                </div>
                <div className="space-y-3">
                    {request.volunteers.map((volunteer) => (
                        <div key={volunteer.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                                {volunteer.avatar}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{volunteer.name}</p>
                                <p className="text-xs text-gray-500">{volunteer.status.replace("_", " ")}</p>
                            </div>
                            <button className="p-1.5 rounded-full hover:bg-gray-100">
                                <span className="material-symbols-outlined text-gray-400">chat</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sticky bottom-24 bg-[var(--background-light)] pt-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm">
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Mark Resolved
                </button>
            </div>
        </div>
    );
}
