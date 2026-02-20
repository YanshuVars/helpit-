"use client";

import DashboardShell from "@/components/layout/DashboardShell";

export default function SharedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell>{children}</DashboardShell>;
}
