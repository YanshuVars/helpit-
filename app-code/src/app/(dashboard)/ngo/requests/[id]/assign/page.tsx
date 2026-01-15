import Link from "next/link";

const availableVolunteers = [
    { id: "v4", name: "Alice Brown", skills: ["First Aid", "Driving"], distance: "0.5 km", available: true },
    { id: "v5", name: "Bob Johnson", skills: ["Cooking", "Counseling"], distance: "1.2 km", available: true },
    { id: "v6", name: "Carol White", skills: ["Teaching", "Photography"], distance: "2.3 km", available: true },
    { id: "v7", name: "David Lee", skills: ["First Aid", "Translation"], distance: "3.1 km", available: false },
];

export default function AssignVolunteersPage() {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/ngo/requests/1" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Assign Volunteers</h1>
            </div>

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                    type="text"
                    placeholder="Search volunteers..."
                    className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary)] text-white">All</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100">Nearby</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100">Available Now</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100">First Aid</button>
            </div>

            {/* Volunteer List */}
            <div className="space-y-3">
                {availableVolunteers.map((volunteer) => (
                    <div key={volunteer.id} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white font-bold">
                                {volunteer.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{volunteer.name}</p>
                                    {volunteer.available ? (
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    ) : (
                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {volunteer.distance}
                                </div>
                            </div>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-semibold ${volunteer.available
                                        ? "bg-[var(--primary)] text-white"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                disabled={!volunteer.available}
                            >
                                Assign
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {volunteer.skills.map((skill) => (
                                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
