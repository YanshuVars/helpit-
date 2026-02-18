"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface CommandItem {
    id: string;
    title: string;
    description?: string;
    icon: string;
    category: "navigation" | "actions" | "search" | "recent";
    href?: string;
    action?: () => void;
    keywords?: string[];
}

interface CommandPaletteProps {
    items?: CommandItem[];
}

export function CommandPalette({ items: customItems }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Default command items based on user role
    const defaultItems: CommandItem[] = [
        // Navigation
        { id: "nav-dashboard", title: "Go to Dashboard", icon: "dashboard", category: "navigation", href: "/ngo" },
        { id: "nav-requests", title: "View Requests", icon: "request_quote", category: "navigation", href: "/ngo/requests" },
        { id: "nav-volunteers", title: "Manage Volunteers", icon: "groups", category: "navigation", href: "/ngo/volunteers" },
        { id: "nav-donations", title: "View Donations", icon: "payments", category: "navigation", href: "/ngo/donations" },
        { id: "nav-messages", title: "Messages", icon: "chat", category: "navigation", href: "/messages" },
        { id: "nav-notifications", title: "Notifications", icon: "notifications", category: "navigation", href: "/notifications" },
        { id: "nav-settings", title: "Settings", icon: "settings", category: "navigation", href: "/ngo/settings" },
        { id: "nav-profile", title: "My Profile", icon: "person", category: "navigation", href: "/volunteer/profile" },

        // Actions
        { id: "action-new-request", title: "Create New Request", icon: "add_circle", category: "actions", action: () => router.push("/ngo/requests/create") },
        { id: "action-find-work", title: "Find Opportunities", icon: "search", category: "actions", action: () => router.push("/volunteer/opportunities") },
        { id: "action-donate", title: "Make a Donation", icon: "favorite", category: "actions", action: () => router.push("/donor/discover") },
        { id: "action-logout", title: "Log Out", icon: "logout", category: "actions", action: () => console.log("Logout") },

        // Search
        { id: "search-ngo", title: "Search NGOs", icon: "domain", category: "search", href: "/ngos" },
        { id: "search-requests", title: "Search Requests", icon: "help", category: "search", href: "/requests" },
        { id: "search-events", title: "Search Events", icon: "event", category: "search", href: "/events" },
    ];

    const items = customItems || defaultItems;

    // Filter items based on query
    const filteredItems = items.filter((item) => {
        if (!query) return true;
        const searchText = `${item.title} ${item.description || ""} ${item.keywords?.join(" ") || ""}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
    });

    // Group items by category
    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open command palette with Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => {
                    if (!prev) {
                        // Reset state when opening
                        setQuery("");
                        setSelectedIndex(0);
                    }
                    return !prev;
                });
            }

            // Close with Escape
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when opened (DOM side effect only)
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);



    const handleSelect = useCallback((item: CommandItem) => {
        setIsOpen(false);
        if (item.action) {
            item.action();
        } else if (item.href) {
            router.push(item.href);
        }
    }, [router]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredItems[selectedIndex]) {
                handleSelect(filteredItems[selectedIndex]);
            }
        }
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            navigation: "Navigation",
            actions: "Quick Actions",
            search: "Search",
            recent: "Recent",
        };
        return labels[category] || category;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={() => setIsOpen(false)}
            />

            {/* Command Palette Dialog */}
            <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 animate-scaleIn">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                        <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Search commands, pages, or actions..."
                            className="flex-1 text-lg bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
                        />
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md border border-gray-200">
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {filteredItems.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                <p>No results found for &quot;{query}&quot;</p>
                            </div>
                        ) : (
                            Object.entries(groupedItems).map(([category, categoryItems]) => (
                                <div key={category} className="mb-2">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {getCategoryLabel(category)}
                                    </div>
                                    {categoryItems.map((item) => {
                                        const globalIndex = filteredItems.indexOf(item);
                                        const isSelected = globalIndex === selectedIndex;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150
                          ${isSelected
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "hover:bg-gray-50 text-gray-700"
                                                    }
                        `}
                                            >
                                                <span className={`
                          material-symbols-outlined text-xl shrink-0
                          ${isSelected ? "text-blue-600" : "text-gray-400"}
                        `}>
                                                    {item.icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{item.title}</div>
                                                    {item.description && (
                                                        <div className="text-sm text-gray-500 truncate">{item.description}</div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-blue-600 text-lg">arrow_forward</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↵</kbd>
                                Select
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">⌘</kbd>
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">K</kbd>
                            to open
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

// Hook to use command palette anywhere
export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return { isOpen, setIsOpen };
}

export default CommandPalette;
