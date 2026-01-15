export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background-light)] flex items-center justify-center">
            <div className="mobile-shell bg-white shadow-2xl md:rounded-[3rem] border border-gray-100 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
