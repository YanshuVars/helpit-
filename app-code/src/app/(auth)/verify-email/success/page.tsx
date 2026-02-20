import Link from "next/link";

export default function VerifyEmailSuccessPage() {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#E8F5E9', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-success)', fontSize: 32 }}>verified</span>
            </div>

            <h1>Email Verified!</h1>
            <p className="auth-subtitle" style={{ maxWidth: 300, margin: '0 auto' }}>
                Your email has been successfully verified. You can now access all features.
            </p>

            <div style={{ marginTop: 24 }}>
                <Link href="/login" className="auth-submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', lineHeight: '44px' }}>
                    Continue to Login
                </Link>
            </div>
        </div>
    );
}
