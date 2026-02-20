export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-layout">
            {/* Brand panel — hidden on mobile via CSS */}
            <div className="auth-brand">
                {/* Decorative gradient circles */}
                <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                }} />
                <div style={{
                    position: 'absolute', bottom: -40, left: -40,
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)'
                }} />

                <div className="auth-brand-logo">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: 'var(--color-primary)', color: '#fff',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 18
                        }}>H</span>
                        Helpit
                    </span>
                </div>

                <h1 className="auth-brand-tagline">
                    Connecting communities to make a difference
                </h1>
                <p className="auth-brand-subtitle">
                    Join thousands of NGOs, donors, and volunteers working together to create meaningful change in communities around the world.
                </p>

                {/* Stats */}
                <div style={{
                    display: 'flex', gap: 32, marginTop: 48
                }}>
                    {[
                        { value: '500+', label: 'NGOs Listed' },
                        { value: '10K+', label: 'Active Volunteers' },
                        { value: '₹2Cr+', label: 'Donations Raised' },
                    ].map(stat => (
                        <div key={stat.label}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>{stat.value}</div>
                            <div style={{ fontSize: 12, color: '#C4B5E8', marginTop: 2 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
}
