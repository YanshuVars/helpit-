'use client';

import { DashboardShell } from "@/components/layout";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
