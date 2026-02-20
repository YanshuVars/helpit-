import Link from "next/link";

export default function DonateSuccessPage() {
    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
            {/* Success Animation */}
            <div style={{
                width: 88, height: 88, borderRadius: '50%', background: 'var(--color-success-bg, #E8F5E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                animation: 'bounce 1s ease-in-out'
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--color-success)' }}>check_circle</span>
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Thank You!</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 22 }}>
                Your donation of <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹1,000</span> to Hope Foundation was successful.
            </p>

            {/* Details Card */}
            <div className="card" style={{ width: '100%', padding: 16, marginBottom: 22, textAlign: 'left' }}>
                {[
                    { label: 'Transaction ID', value: 'TXN123456789' },
                    { label: 'Date', value: 'Jan 13, 2026' },
                    { label: 'NGO', value: 'Hope Foundation' },
                ].map((row, i, arr) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{row.value}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                <Link href="/donor/receipts/1" className="btn btn-secondary" style={{ justifyContent: 'center', width: '100%', textDecoration: 'none' }}>Download Receipt</Link>
                <Link href="/donor" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', textDecoration: 'none' }}>Back to Home</Link>
            </div>
        </div>
    );
}
