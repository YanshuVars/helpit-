import { TopBar } from "@/components/ui/TopBar";
import { DonorBottomNav } from "@/components/navigation/DonorBottomNav";

export default function DonorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background-light)] flex justify-center">
            <div className="app-container flex flex-col">
                <TopBar title="Helpit" />
                <main className="flex-1 page-content">
                    {children}
                </main>
                <DonorBottomNav />
            </div>
        </div>
    );
}

