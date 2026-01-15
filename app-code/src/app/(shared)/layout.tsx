export default function SharedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background-light)] flex justify-center">
            <div className="app-container">
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

