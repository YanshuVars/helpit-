import Link from "next/link";

interface TopBarProps {
    title?: string;
    showNotifications?: boolean;
    showMenu?: boolean;
}

export function TopBar({
    title = "Helpit",
    showNotifications = true,
    showMenu = true
}: TopBarProps) {
    return (
        <header className="sticky top-0 z-50 bg-[var(--background-light)]/80 backdrop-blur-md border-b border-gray-200">
            <div className="flex items-center p-4 justify-between">
                <div className="flex size-10 shrink-0 items-center justify-start">
                    {showMenu && (
                        <span className="material-symbols-outlined text-2xl text-[#111318]">menu</span>
                    )}
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-[#111318]">
                    {title}
                </h2>
                <div className="flex size-10 items-center justify-end relative">
                    {showNotifications && (
                        <Link href="/notifications">
                            <span className="material-symbols-outlined text-2xl text-[#111318]">notifications</span>
                            <span className="absolute top-2 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
