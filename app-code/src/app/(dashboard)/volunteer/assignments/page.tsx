import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export default function VolunteerAssignmentsPage() {
    const assignments = [
        { id: "a1", title: "Food Distribution", ngo: "Hope Foundation", status: "IN_PROGRESS", date: "Today, 2:00 PM" },
        { id: "a2", title: "Teaching Session", ngo: "EduChild", status: "ASSIGNED", date: "Tomorrow, 10:00 AM" },
        { id: "a3", title: "Medical Camp", ngo: "HealthFirst", status: "COMPLETED", date: "Jan 10, 2026" },
    ];

    const statusStyles = {
        ASSIGNED: "bg-blue-100 text-blue-700",
        IN_PROGRESS: "bg-purple-100 text-purple-700",
        COMPLETED: "bg-green-100 text-green-700",
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="My Assignments" showBack fallbackRoute="/volunteer" />

            {/* Tabs */}
            <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--primary)] text-white min-h-[44px]">Active</button>
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 min-h-[44px]">Completed</button>
            </div>

            {/* Assignments List */}
            <div className="flex flex-col gap-4">
                {assignments.map((assignment) => (
                    <Link
                        key={assignment.id}
                        href={`/volunteer/assignments/${assignment.id}`}
                        className="block bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold">{assignment.title}</h3>
                                <p className="text-xs text-gray-500">{assignment.ngo}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${statusStyles[assignment.status as keyof typeof statusStyles]}`}>
                                {assignment.status.replace("_", " ")}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {assignment.date}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

