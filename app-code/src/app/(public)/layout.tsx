// ... imports
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col font-sans text-[var(--foreground)]">
            <PublicNavbar />
            <main className="flex-1 pt-24 pb-12">
                {children}
            </main>
            <footer className="border-t border-[var(--border)] bg-white/50 backdrop-blur-sm py-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-[var(--foreground-muted)] text-sm">
                    <p>&copy; {new Date().getFullYear()} Helpit. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
