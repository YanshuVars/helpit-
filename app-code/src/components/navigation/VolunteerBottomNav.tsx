"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    icon: string;
    label: string;
    href: string;
}

const volunteerNavItems: NavItem[] = [
    { icon: "home", label: "Home", href: "/volunteer" },
    { icon: "explore", label: "Opportunities", href: "/volunteer/opportunities" },
    { icon: "assignment", label: "Tasks", href: "/volunteer/assignments" },
    { icon: "chat_bubble", label: "Messages", href: "/messages" },
    { icon: "person", label: "Profile", href: "/volunteer/profile" },
];

export function VolunteerBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-b-0 border-l-0 border-r-0 rounded-t-2xl pb-safe md:left-1/2 md:-translate-x-1/2 md:max-w-[430px] md:bottom-4 md:rounded-2xl md:border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-20 px-2">
                {volunteerNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 ${isActive ? "text-[var(--primary)] -translate-y-1" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-[var(--primary)]/10" : "bg-transparent"}`}>
                                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                    {item.icon}
                                </span>
                            </div>
                            <span className={`text-[10px] font-medium transition-opacity ${isActive ? "opacity-100 font-bold" : "opacity-70"}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
