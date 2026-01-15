import { PageHeader } from "@/components/ui/PageHeader";

export default function NGOVolunteersPage() {
    const volunteers = [
        { id: "v1", name: "John Doe", skills: ["First Aid", "Driving"], hours: 45, tasks: 12, status: "active" },
        { id: "v2", name: "Jane Smith", skills: ["Teaching", "Counseling"], hours: 78, tasks: 23, status: "active" },
        { id: "v3", name: "Mike Wilson", skills: ["Cooking"], hours: 32, tasks: 8, status: "inactive" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Volunteers"
                showBack
                fallbackRoute="/ngo"
                rightAction={<span className="text-sm text-gray-500">{volunteers.length} total</span>}
            />

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input type="text" placeholder="Search volunteers..." className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4" />
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
                {volunteers.map((v) => (
                    <div key={v.id} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg shrink-0">
                                {v.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold truncate">{v.name}</p>
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${v.status === "active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                                </div>
                                <p className="text-xs text-gray-500">{v.hours} hrs • {v.tasks} tasks</p>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400">chat</span>
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {v.skills.map((skill) => (
                                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

