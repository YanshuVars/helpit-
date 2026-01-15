import Link from "next/link";

const notifications = [
    { id: "n1", type: "donation", title: "Donation Received", message: "₹500 donation from Anonymous", time: "2m ago", read: false },
    { id: "n2", type: "volunteer", title: "New Volunteer", message: "John Doe applied to your request", time: "15m ago", read: false },
    { id: "n3", type: "request", title: "Request Update", message: "Emergency Food Relief marked as critical", time: "1h ago", read: true },
    { id: "n4", type: "message", title: "New Message", message: "Sarah Admin sent you a message", time: "2h ago", read: true },
];

const iconMap: Record<string, { icon: string; bg: string; color: string }> = {
    donation: { icon: "payments", bg: "bg-green-100", color: "text-green-600" },
    volunteer: { icon: "person_add", bg: "bg-blue-100", color: "text-blue-600" },
    request: { icon: "priority_high", bg: "bg-orange-100", color: "text-orange-600" },
    message: { icon: "chat", bg: "bg-purple-100", color: "text-purple-600" },
};

export default function NotificationsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Notifications</h1>
                <button className="text-[var(--primary)] text-sm font-semibold">Mark all read</button>
            </div>

            <div className="space-y-3">
                {notifications.map((notif) => {
                    const { icon, bg, color } = iconMap[notif.type] || iconMap.message;
                    return (
                        <Link
                            key={notif.id}
                            href={`/notifications/${notif.id}`}
                            className={`block bg-white rounded-xl p-4 border ${notif.read ? "border-gray-200" : "border-[var(--primary)] bg-blue-50/50"}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                                    <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm">{notif.title}</p>
                                        <span className="text-[10px] text-gray-400">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                                </div>
                                {!notif.read && <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2"></div>}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
