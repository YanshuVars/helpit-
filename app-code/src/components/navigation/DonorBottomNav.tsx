"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    icon: string;
    label: string;
    href: string;
    isCenter?: boolean;
}

const donorNavItems: NavItem[] = [
    { icon: "home", label: "Home", href: "/donor" },
    { icon: "explore", label: "Discover", href: "/donor/discover" },
    { icon: "add", label: "Donate", href: "/donor/donate", isCenter: true },
    { icon: "receipt_long", label: "Activity", href: "/donor/history" },
    { icon: "person", label: "Profile", href: "/settings" },
];

export function DonorBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-b-0 border-l-0 border-r-0 rounded-t-2xl pb-safe md:left-1/2 md:-translate-x-1/2 md:max-w-[430px] md:bottom-4 md:rounded-2xl md:border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between h-20 px-6">
                {donorNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    if (item.isCenter) {
                        return (
                            <div key={item.href} className="relative -top-6">
                                <Link
                                    href={item.href}
                                    className="w-14 h-14 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white rounded-full flex items-center justify-center shadow-lg shadow-[var(--primary)]/40 active:scale-95 transition-transform border-4 border-[var(--background)]"
                                >
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </Link>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-[var(--foreground-muted)] whitespace-nowrap mt-1">
                                    {item.label}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-[var(--primary)] -translate-y-1" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                }`}
                        >
                            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                            <span className={`text-[10px] font-medium transition-opacity ${isActive ? "opacity-100 font-bold" : "opacity-70"}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
