import Link from "next/link";

const messages = [
    { id: "m1", sender: "Hope Foundation", content: "Hi! Thanks for volunteering with us.", time: "10:30 AM", isMe: false },
    { id: "m2", sender: "Me", content: "Happy to help! When is the next event?", time: "10:32 AM", isMe: true },
    { id: "m3", sender: "Hope Foundation", content: "We have a food distribution drive this Saturday at 9 AM. Would you be able to join?", time: "10:35 AM", isMe: false },
    { id: "m4", sender: "Me", content: "Yes, count me in!", time: "10:36 AM", isMe: true },
    { id: "m5", sender: "Hope Foundation", content: "Thanks for volunteering!", time: "10:38 AM", isMe: false },
];

export default function ChatRoomPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background-light)]">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 flex items-center bg-white border-b border-gray-200 p-4 pb-2 justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="text-[#111318] flex size-10 shrink-0 items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[var(--primary)] to-blue-400 rounded-full w-10 h-10 shrink-0 flex items-center justify-center text-white font-bold">
                            H
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-[#111318] text-base font-bold leading-tight tracking-[-0.015em]">Hope Foundation</h2>
                            <p className="text-green-500 text-xs font-medium leading-normal">Online</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-transparent text-[#111318]">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </div>

            {/* Message Thread Container */}
            <div className="chat-scroll flex flex-col p-4 space-y-2 flex-1">
                {messages.map((msg) => (
                    msg.isMe ? (
                        /* Sent Message */
                        <div key={msg.id} className="flex items-end gap-2 self-end max-w-[85%] justify-end">
                            <div className="flex flex-col gap-1 items-end">
                                <div className="rounded-2xl rounded-br-sm px-4 py-3 bg-[var(--primary)] text-white shadow-sm">
                                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                </div>
                                <div className="flex items-center gap-1 mr-1">
                                    <p className="text-[#616e89] text-[10px]">{msg.time}</p>
                                    <span className="material-symbols-outlined text-[var(--primary)] text-[14px]">done_all</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Received Message */
                        <div key={msg.id} className="flex items-end gap-2 max-w-[85%]">
                            <div className="bg-gradient-to-br from-[var(--primary)] to-blue-400 rounded-full w-8 h-8 shrink-0 mb-1 flex items-center justify-center text-white text-xs font-bold">
                                H
                            </div>
                            <div className="flex flex-col gap-1 items-start">
                                <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-white text-[#111318] shadow-sm border border-gray-100">
                                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                </div>
                                <p className="text-[#616e89] text-[10px] ml-1">{msg.time}</p>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Bottom Input Bar */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 pb-8">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <button className="flex items-center justify-center w-10 h-10 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            className="w-full bg-gray-100 border-none rounded-full px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-[var(--primary)]/50 text-[#111318] placeholder:text-gray-500"
                            placeholder="Type a message..."
                            type="text"
                        />
                    </div>
                    <button className="flex items-center justify-center w-10 h-10 bg-[var(--primary)] text-white rounded-full shadow-md hover:bg-blue-600 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
