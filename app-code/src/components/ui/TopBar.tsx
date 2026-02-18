"use client";

import Link from "next/link";
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
    return (
        <>
            <header className="sticky top-0 z-40 bg-[var(--background-light)]/95 backdrop-blur-md border-b border-gray-200/80">
                <div className="flex items-center p-4 justify-between">
                    <div className="flex size-10 shrink-0 items-center justify-start">
                        {showBack ? (
                            <button
                                onClick={onBack}
                                className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                aria-label="Go back"
                            >
                                <span className="material-symbols-outlined text-2xl text-[#111318]">arrow_back</span>
                            </button>
                        ) : showMenu ? (
                            <button
                                className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                aria-label="Open menu"
                            >
                                <span className="material-symbols-outlined text-2xl text-[#111318]">menu</span>
                            </button>
                        ) : null}
                    </div>

                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-[#111318]">
                        {title}
                    </h2>

                    <div className="flex size-10 items-center justify-end gap-1">
                        {showSearch && (
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                aria-label="Search (⌘K)"
                            >
                                <span className="material-symbols-outlined text-2xl text-[#111318]">search</span>
                            </button>
                        )}

                        {showNotifications && (
                            <Link
                                href="/notifications"
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
                            >
                                <span className="material-symbols-outlined text-2xl text-[#111318]">notifications</span>
                                <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </Link>
                        )}

                        {rightAction}
                    </div>
                </div>

                {/* Quick Search Bar - Alternative to Command Palette */}
                {showSearch && (
                    <div className="px-4 pb-3">
                        <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100/80 hover:bg-gray-100 rounded-xl transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-gray-400">search</span>
                            <span className="flex-1 text-gray-500 text-sm">Search or jump to...</span>
                            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-gray-400 bg-white rounded-md border border-gray-200 shadow-sm">
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
