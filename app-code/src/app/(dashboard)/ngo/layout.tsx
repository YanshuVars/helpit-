'use client';

import { DashboardShell } from "@/components/layout";
import { QueryProvider } from "@/lib/providers/query-provider";
import { NgoProvider } from "@/lib/hooks/use-ngo-context";
import { Toaster } from "sonner";

export default function NGOLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <NgoProvider>
                <DashboardShell>{children}</DashboardShell>
                <Toaster position="top-right" richColors />
            </NgoProvider>
        </QueryProvider>
    );
}
