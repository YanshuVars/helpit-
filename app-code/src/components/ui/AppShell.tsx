"use client";

import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";

interface AppShellProps {
    children: ReactNode;
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    showSearch?: boolean;
    showNotifications?: boolean;
    showMenu?: boolean;
    rightAction?: ReactNode;
    bottomNav?: ReactNode;
}

export function AppShell({
    children,
    title = "Helpit",
    showBack = false,
    onBack,
    showSearch = true,
    showNotifications = true,
    showMenu = true,
    rightAction,
    bottomNav,
}: AppShellProps) {
    return (
        <div className="min-h-screen bg-[var(--background-light)]">
            {/* Top Navigation */}
            <TopBar
                title={title}
                showBack={showBack}
                onBack={onBack}
                showSearch={showSearch}
                showNotifications={showNotifications}
                showMenu={showMenu}
                rightAction={rightAction}
            />

            {/* Main Content */}
            <main className="page-content">
                {children}
            </main>

            {/* Bottom Navigation (if provided) */}
            {bottomNav && (
                <div className="bottom-nav">
                    {bottomNav}
                </div>
            )}

            {/* Global Command Palette */}
            <CommandPalette />
        </div>
    );
}

export default AppShell;
