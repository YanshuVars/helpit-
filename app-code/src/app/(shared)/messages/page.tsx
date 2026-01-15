import Link from "next/link";

const conversations = [
    { id: "c1", name: "Hope Foundation", lastMessage: "Thanks for volunteering!", time: "2m ago", unread: 2, avatar: "H" },
    { id: "c2", name: "Sarah Admin", lastMessage: "Can you help with the event?", time: "1h ago", unread: 0, avatar: "S" },
    { id: "c3", name: "John Volunteer", lastMessage: "I'll be there!", time: "3h ago", unread: 0, avatar: "J" },
];

export default function MessagesPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">Messages</h1>

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input type="text" placeholder="Search conversations..." className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4" />
            </div>

            {/* Conversations */}
            <div className="space-y-2">
                {conversations.map((convo) => (
                    <Link key={convo.id} href={`/messages/${convo.id}`} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                            {convo.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold truncate">{convo.name}</p>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{convo.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                        </div>
                        {convo.unread > 0 && (
                            <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                                {convo.unread}
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
