import Link from "next/link";

const auditLogs = [
    { id: "1", action: "MEMBER_ADDED", actor: "Sarah Admin", target: "Jane Member", timestamp: "2 hours ago" },
    { id: "2", action: "REQUEST_CREATED", actor: "John Coordinator", target: "Emergency Food Relief", timestamp: "5 hours ago" },
    { id: "3", action: "VOLUNTEER_ASSIGNED", actor: "Sarah Admin", target: "Mike Wilson", timestamp: "1 day ago" },
    { id: "4", action: "PROFILE_UPDATED", actor: "Sarah Admin", target: "Organization Profile", timestamp: "2 days ago" },
    { id: "5", action: "REQUEST_RESOLVED", actor: "John Coordinator", target: "Medical Supplies", timestamp: "1 week ago" },
];

const actionIcons: Record<string, { icon: string; color: string }> = {
    MEMBER_ADDED: { icon: "person_add", color: "bg-green-100 text-green-600" },
    REQUEST_CREATED: { icon: "add_circle", color: "bg-blue-100 text-blue-600" },
    VOLUNTEER_ASSIGNED: { icon: "assignment_ind", color: "bg-purple-100 text-purple-600" },
    PROFILE_UPDATED: { icon: "edit", color: "bg-orange-100 text-orange-600" },
    REQUEST_RESOLVED: { icon: "check_circle", color: "bg-green-100 text-green-600" },
};

export default function NGOAuditLogPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/ngo/settings" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Audit Log</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary)] text-white whitespace-nowrap">All</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 whitespace-nowrap">Members</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 whitespace-nowrap">Requests</button>
                <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 whitespace-nowrap">Volunteers</button>
            </div>

            {/* Log List */}
            <div className="space-y-3">
                {auditLogs.map((log) => {
                    const { icon, color } = actionIcons[log.action] || { icon: "info", color: "bg-gray-100 text-gray-600" };
                    return (
                        <div key={log.id} className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                                    <span className="material-symbols-outlined">{icon}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-semibold">{log.actor}</span>
                                        {" "}
                                        <span className="text-gray-600">{log.action.replace(/_/g, " ").toLowerCase()}</span>
                                        {" "}
                                        <span className="font-semibold">{log.target}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
