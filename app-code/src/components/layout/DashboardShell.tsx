"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { PageHeader } from "./PageHeader";

interface DashboardShellProps {
    children: React.ReactNode;
    actionButton?: {
        label: string;
        icon?: string;
        onClick: () => void;
    };
}

export function DashboardShell({ children, actionButton }: DashboardShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setSidebarCollapsed((prev) => !prev);
    }, []);

    const handleMobileClose = useCallback(() => {
        setMobileOpen(false);
    }, []);

    const handleMenuClick = useCallback(() => {
        setMobileOpen(true);
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={handleToggle}
                mobileOpen={mobileOpen}
                onMobileClose={handleMobileClose}
            />

            <div className={`main-area ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
                <PageHeader
                    onMenuClick={handleMenuClick}
                    actionButton={actionButton}
                />

                <main className="page-content animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardShell;
