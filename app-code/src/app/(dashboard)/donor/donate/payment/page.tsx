import Link from "next/link";

export default function DonatePaymentPage() {
    const methods = [
        { id: 'upi', label: 'UPI', icon: 'account_balance', color: '#2E7D32', default: true },
        { id: 'card', label: 'Credit/Debit Card', icon: 'credit_card', color: '#1565C0' },
        { id: 'net', label: 'Net Banking', icon: 'account_balance_wallet', color: '#6A1B9A' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
                <Link href="/donor/donate/details" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Payment</h1>
            </div>

            {/* Amount Summary */}
            <div className="card" style={{ padding: 20, background: 'var(--color-primary-bg)', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Total Amount</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)', marginTop: 4 }}>₹1,000</p>
            </div>

            {/* Payment Methods */}
            <div>
                <p className="field-label" style={{ marginBottom: 10 }}>Select Payment Method</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {methods.map(m => (
                        <label key={m.id} className="card-interactive" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                            <input type="radio" name="payment" defaultChecked={m.default} style={{ accentColor: 'var(--color-primary)' }} />
                            <span className="material-symbols-outlined" style={{ color: m.color, fontSize: 22 }}>{m.icon}</span>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Link href="/donor/donate/success" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                Pay ₹1,000
            </Link>

            <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--color-text-disabled)' }}>
                Secured by Razorpay. 100% of your donation goes to the NGO.
            </p>
        </div>
    );
}
