"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
    id: string;
    sender: string;
    content: string;
    time: string;
    isMe: boolean;
    status: "sent" | "delivered" | "read";
}

export default function ChatRoomPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "m1", sender: "Hope Foundation", content: "Hi! Thanks for volunteering with us.", time: "10:30 AM", isMe: false, status: "read" },
        { id: "m2", sender: "Me", content: "Happy to help! When is the next event?", time: "10:32 AM", isMe: true, status: "read" },
        { id: "m3", sender: "Hope Foundation", content: "We have a food distribution drive this Saturday at 9 AM. Would you be able to join?", time: "10:35 AM", isMe: false, status: "read" },
        { id: "m4", sender: "Me", content: "Yes, count me in!", time: "10:36 AM", isMe: true, status: "read" },
        { id: "m5", sender: "Hope Foundation", content: "Thanks for volunteering!", time: "10:38 AM", isMe: false, status: "read" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Simulate typing indicator
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTyping((prev) => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: `m${Date.now()}`,
            sender: "Me",
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            status: "sent",
        };

        setMessages([...messages, message]);
        setNewMessage("");

        // Simulate delivery status
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === message.id ? { ...msg, status: "delivered" } : msg
                )
            );
        }, 500);

        // Simulate read status
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === message.id ? { ...msg, status: "read" } : msg
                )
            );
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getStatusIcon = (status: Message["status"]) => {
        switch (status) {
            case "sent":
                return "check";
            case "delivered":
                return "done_all";
            case "read":
                return "done_all";
            default:
                return "check";
        }
    };

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
                            <h2 className="text-[#111318] text-base font-bold">Hope Foundation</h2>
                            <p className="text-green-500 text-xs font-medium">
                                {isTyping ? "typing..." : "Online"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-transparent text-[#111318] hover:bg-gray-100">
                        <span className="material-symbols-outlined">call</span>
                    </button>
                    <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-transparent text-[#111318] hover:bg-gray-100">
                        <span className="material-symbols-outlined">videocam</span>
                    </button>
                    <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-transparent text-[#111318] hover:bg-gray-100">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </div>

            {/* Message Thread Container */}
            <div className="chat-scroll flex flex-col p-4 space-y-2 flex-1">
                {/* Date divider */}
                <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
                </div>

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
                                    <span className={`material-symbols-outlined text-[14px] ${msg.status === "read" ? "text-blue-400" : "text-gray-400"}`}>
                                        {getStatusIcon(msg.status)}
                                    </span>
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

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex items-end gap-2 max-w-[85%]">
                        <div className="bg-gradient-to-br from-[var(--primary)] to-blue-400 rounded-full w-8 h-8 shrink-0 flex items-center justify-center text-white text-xs font-bold">
                            H
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3 bg-white shadow-sm border border-gray-100">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 pb-8">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <button className="flex items-center justify-center w-10 h-10 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">image</span>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            className="w-full bg-gray-100 border-none rounded-full px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-[var(--primary)]/50 text-[#111318] placeholder:text-gray-500"
                            placeholder="Type a message..."
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all ${newMessage.trim()
                                ? "bg-[var(--primary)] text-white hover:bg-blue-600 active:scale-95"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
