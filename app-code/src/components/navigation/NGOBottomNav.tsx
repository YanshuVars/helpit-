"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    icon: string;
    label: string;
    href: string;
}

const ngoNavItems: NavItem[] = [
    { icon: "dashboard", label: "Dashboard", href: "/ngo" },
    { icon: "assignment", label: "Requests", href: "/ngo/requests" },
    { icon: "group", label: "Volunteers", href: "/ngo/volunteers" },
    { icon: "chat_bubble", label: "Messages", href: "/messages" },
    { icon: "more_horiz", label: "More", href: "/ngo/settings" },
];

export function NGOBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe md:left-1/2 md:-translate-x-1/2 md:max-w-[430px]">
            <div className="flex items-center justify-around h-20 px-4">
                {ngoNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 ${isActive ? "text-[var(--primary)]" : "text-gray-400"
                                }`}
                        >
                            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
