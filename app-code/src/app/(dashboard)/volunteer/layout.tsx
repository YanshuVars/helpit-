import { TopBar } from "@/components/ui/TopBar";
import { VolunteerBottomNav } from "@/components/navigation/VolunteerBottomNav";

export default function VolunteerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background-light)] flex justify-center">
            <div className="app-container flex flex-col bg-[var(--background-light)]">
                <TopBar title="Helpit" showMenu={true} showNotifications={true} />
                <main className="flex-1 page-content">
                    {children}
                </main>
                <VolunteerBottomNav />
            </div>
        </div>
    );
}

