"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "./CommandPalette";

interface TopBarProps {
    title?: string;
    showNotifications?: boolean;
    showMenu?: boolean;
    showSearch?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export function TopBar({
    title = "Helpit",
    showNotifications = true,
    showMenu = true,
    showSearch = true,
    showBack = false,
    onBack,
    rightAction,
}: TopBarProps) {
    const pathname = usePathname();

    // Derive role prefix from current path for role-aware navigation
    const rolePrefix = pathname.startsWith('/volunteer') ? '/volunteer'
        : pathname.startsWith('/donor') ? '/donor'
            : pathname.startsWith('/ngo') ? '/ngo'
                : pathname.startsWith('/admin') ? '/admin'
                    : '';

    return (
        <>
            <header className="sticky top-0 z-40 glass-panel border-b-0 rounded-b-2xl mx-2 mt-2 shadow-sm">
                <div className="flex items-center p-3 justify-between">
                    <div className="flex size-10 shrink-0 items-center justify-start">
                        {showBack ? (
                            <button
                                onClick={onBack}
                                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[var(--background-subtle)] active:bg-gray-200 transition-colors text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                aria-label="Go back"
                            >
                                <span className="material-symbols-outlined text-2xl">arrow_back</span>
                            </button>
                        ) : showMenu ? (
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[var(--background-subtle)] active:bg-gray-200 transition-colors text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                aria-label="Open menu"
                            >
                                <span className="material-symbols-outlined text-2xl">menu</span>
                            </button>
                        ) : null}
                    </div>

                    <h2 className="text-lg font-display font-bold leading-tight tracking-tight flex-1 text-center text-[var(--foreground)]">
                        {title}
                    </h2>

                    <div className="flex size-10 items-center justify-end gap-1">
                        {showSearch && (
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[var(--background-subtle)] active:bg-gray-200 transition-colors text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                aria-label="Search (⌘K)"
                            >
                                <span className="material-symbols-outlined text-2xl">search</span>
                            </button>
                        )}

                        {showNotifications && (
                            <Link
                                href={`${rolePrefix}/notifications`}
                                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[var(--background-subtle)] active:bg-gray-200 transition-colors relative text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                            >
                                <span className="material-symbols-outlined text-2xl">notifications</span>
                                <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-[var(--error)] ring-2 ring-white"></span>
                            </Link>
                        )}

                        {rightAction}
                    </div>
                </div>

                {/* Quick Search Bar - Alternative to Command Palette */}
                {showSearch && (
                    <div className="px-3 pb-3">
                        <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 bg-[var(--background-subtle)] hover:bg-gray-100 rounded-xl transition-colors text-left border border-transparent hover:border-[var(--border)]"
                        >
                            <span className="material-symbols-outlined text-[var(--foreground-muted)]">search</span>
                            <span className="flex-1 text-[var(--foreground-muted)] text-sm">Search or jump to...</span>
                            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-[var(--foreground-muted)] bg-white rounded-md border border-[var(--border)] shadow-sm">
                                <span className="text-[10px]">⌘</span>
                                <span className="text-[10px]">K</span>
                            </kbd>
                        </button>
                    </div>
                )}
            </header>

            <CommandPalette />
        </>
    );
}

export default TopBar;
