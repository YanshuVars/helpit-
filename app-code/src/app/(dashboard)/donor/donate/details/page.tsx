import Link from "next/link";

export default function DonateDetailsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
                <Link href="/donor/donate" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Your Details</h1>
            </div>

            {/* Summary Card */}
            <div className="card" style={{ padding: 16, background: 'var(--color-primary-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Donating to</p>
                        <p style={{ fontWeight: 700, fontSize: 15 }}>Hope Foundation</p>
                    </div>
                    <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)' }}>₹1,000</p>
                </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                    <label className="field-label">Full Name *</label>
                    <input type="text" placeholder="Enter your name" className="field-input" />
                </div>
                <div>
                    <label className="field-label">Email *</label>
                    <input type="email" placeholder="your@email.com" className="field-input" />
                </div>
                <div>
                    <label className="field-label">Phone</label>
                    <input type="tel" placeholder="+91 98765 43210" className="field-input" />
                </div>
                <div>
                    <label className="field-label">PAN Number (for 80G tax benefit)</label>
                    <input type="text" placeholder="ABCDE1234F" className="field-input" style={{ textTransform: 'uppercase' }} />
                </div>
                <div>
                    <label className="field-label">Message to NGO (optional)</label>
                    <textarea placeholder="Your message..." rows={3} className="field-input" style={{ minHeight: 80, resize: 'none' }} />
                </div>

                {/* Anonymous checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 20, height: 20, borderRadius: 6, accentColor: 'var(--color-primary)' }} />
                    <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>Make donation anonymous</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Your name won&apos;t be visible to the NGO</p>
                    </div>
                </label>
            </div>

            <Link href="/donor/donate/payment" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                Proceed to Payment
            </Link>
        </div>
    );
}
