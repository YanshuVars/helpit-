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
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe md:left-1/2 md:-translate-x-1/2 md:max-w-[430px]">
            <div className="flex items-center justify-around h-20 px-4">
                {donorNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    if (item.isCenter) {
                        return (
                            <div key={item.href} className="relative -top-4">
                                <Link
                                    href={item.href}
                                    className="w-14 h-14 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </Link>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-400">
                                    {item.label}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 ${isActive ? "text-[var(--primary)]" : "text-gray-400"
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-[10px] font-semibold">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
