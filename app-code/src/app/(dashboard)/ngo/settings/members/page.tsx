import Link from "next/link";

const members = [
    { id: "m1", name: "Sarah Admin", email: "sarah@hopefoundation.org", role: "ADMIN", joined: "Jan 2023" },
    { id: "m2", name: "John Coordinator", email: "john@hopefoundation.org", role: "COORDINATOR", joined: "Mar 2023" },
    { id: "m3", name: "Jane Member", email: "jane@hopefoundation.org", role: "MEMBER", joined: "Jun 2024" },
];

export default function NGOMembersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/ngo/settings" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Team Members</h1>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)]">
                <span className="material-symbols-outlined">person_add</span>
                <span className="font-semibold">Invite Member</span>
            </button>

            <div className="space-y-3">
                {members.map((member) => (
                    <div key={member.id} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                                {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <span className="material-symbols-outlined text-gray-400">more_vert</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${member.role === "ADMIN" ? "bg-red-100 text-red-700" :
                                    member.role === "COORDINATOR" ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-700"
                                }`}>
                                {member.role}
                            </span>
                            <span className="text-xs text-gray-400">Joined {member.joined}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
