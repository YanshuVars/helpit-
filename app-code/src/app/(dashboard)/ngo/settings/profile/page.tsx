import Link from "next/link";

export default function NGOProfileSettingsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <Link href="/ngo/settings" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to settings
                </Link>
                <h1 className="page-title">Organization Profile</h1>
            </div>

            {/* Profile Picture */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: 80, height: 80, borderRadius: 16,
                    background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 28, fontWeight: 700,
                }}>HF</div>
                <button className="auth-link" style={{ marginTop: 10, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Change Logo</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                    <label className="field-label">Organization Name</label>
                    <input type="text" defaultValue="Hope Foundation" className="field-input" />
                </div>
                <div className="form-group">
                    <label className="field-label">Username</label>
                    <input type="text" defaultValue="@hopefoundation" className="field-input" />
                </div>
                <div className="form-group">
                    <label className="field-label">Bio</label>
                    <textarea rows={3} defaultValue="Helping communities since 2010..." className="field-input field-textarea" />
                </div>
                <div className="form-group">
                    <label className="field-label">Contact Email</label>
                    <input type="email" defaultValue="contact@hopefoundation.org" className="field-input" />
                </div>
                <div className="form-group">
                    <label className="field-label">Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="field-input" />
                </div>
                <div className="form-group">
                    <label className="field-label">Website</label>
                    <input type="url" defaultValue="https://hopefoundation.org" className="field-input" />
                </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46, fontSize: 15, fontWeight: 700 }}>
                Save Changes
            </button>
        </div>
    );
}
