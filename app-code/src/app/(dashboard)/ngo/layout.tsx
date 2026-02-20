'use client';

import { DashboardShell } from "@/components/layout";

export default function NGOLayout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
