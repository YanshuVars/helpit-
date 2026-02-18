"use client";

import { AppShell } from "@/components/ui/AppShell";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppShell title="Admin" showSearch showNotifications>
            {children}
        </AppShell>
    );
}
