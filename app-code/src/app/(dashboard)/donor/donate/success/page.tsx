import Link from "next/link";

export default function DonateSuccessPage() {
    return (
        <div style={{
            minHeight: '80vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '0 24px',
        }}>
            {/* Success Card */}
            <div style={{
                background: '#fff', borderRadius: 24, padding: '48px 40px',
                border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                textAlign: 'center', maxWidth: 480, width: '100%',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                    <div style={{
                        position: 'absolute', inset: -12, borderRadius: '50%',
                        background: 'rgba(29,226,209,0.08)',
                        animation: 'pulse 2s infinite',
                    }} />
                    <div style={{
                        position: 'absolute', inset: -6, borderRadius: '50%',
                        background: 'rgba(29,226,209,0.12)',
                    }} />
                    <div style={{
                        width: 88, height: 88, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                    }}>
                        <span className="material-symbols-outlined" style={{
                            fontSize: 44, color: '#fff',
                            fontVariationSettings: "'FILL' 1",
                        }}>check_circle</span>
                    </div>
                </div>

                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                    Thank You! 🎉
                </h1>
                <p style={{ color: '#64748b', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
                    Your donation of <span style={{ fontWeight: 700, color: '#1de2d1' }}>₹1,000</span> to{' '}
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Hope Foundation</span> was successful.
                </p>

                {/* Transaction Details */}
                <div style={{
                    background: '#f8fafc', borderRadius: 14, padding: 20,
                    marginBottom: 24, textAlign: 'left',
                }}>
                    {[
                        { label: 'Transaction ID', value: 'TXN-2026-0001', icon: 'tag' },
                        { label: 'Date & Time', value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: 'calendar_today' },
                        { label: 'Beneficiary', value: 'Hope Foundation', icon: 'domain' },
                        { label: 'Amount', value: '₹1,000', icon: 'payments' },
                        { label: 'Payment Method', value: 'UPI', icon: 'qr_code_2' },
                    ].map((row, i, arr) => (
                        <div key={row.label} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0',
                            borderBottom: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#94a3b8' }}>{row.icon}</span>
                                <span style={{ fontSize: 13, color: '#64748b' }}>{row.label}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/donor/receipts/1" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        height: 48, borderRadius: 12,
                        border: '1.5px solid #e2e8f0', background: '#fff',
                        color: '#0f172a', fontSize: 14, fontWeight: 600,
                        textDecoration: 'none', transition: 'all 200ms',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>download</span>
                        Download Receipt
                    </Link>
                    <Link href="/donor" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        height: 48, borderRadius: 12,
                        background: '#1de2d1', color: '#0f172a',
                        fontSize: 14, fontWeight: 700, textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(29,226,209,0.2)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>volunteer_activism</span>
                        Donate Again
                    </Link>
                </div>

                {/* Contact Info */}
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20 }}>
                    Need help? Contact us at <span style={{ color: '#1de2d1', fontWeight: 600 }}>support@helpit.org</span>
                </p>
            </div>
        </div>
    );
}
