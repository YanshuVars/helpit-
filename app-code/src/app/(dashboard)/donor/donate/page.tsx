"use client";

import Link from "next/link";
import { useState } from "react";

export default function DonatePage() {
    const [amount, setAmount] = useState<number | null>(1000);
    const [customAmount, setCustomAmount] = useState("");
    const presetAmounts = [500, 1000, 2500, 5000, 10000];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
                <Link href="/donor" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Make a Donation</h1>
            </div>

            {/* Select NGO */}
            <div className="card" style={{ padding: 16 }}>
                <label className="field-label">Select an NGO to donate to:</label>
                <select className="field-input" style={{ marginTop: 8 }}>
                    <option value="">Choose an NGO</option>
                    <option value="n1">Hope Foundation</option>
                    <option value="n2">GreenEarth</option>
                    <option value="n3">EduChild</option>
                </select>
            </div>

            {/* Amount Selection */}
            <div className="card" style={{ padding: 16 }}>
                <label className="field-label">Select Amount</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '10px 0 14px' }}>
                    {presetAmounts.map(preset => (
                        <button key={preset} onClick={() => { setAmount(preset); setCustomAmount(""); }}
                            className={amount === preset ? "btn btn-primary" : "btn btn-secondary"}
                            style={{ justifyContent: 'center', fontSize: 13 }}
                        >₹{preset.toLocaleString()}</button>
                    ))}
                </div>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontWeight: 600 }}>₹</span>
                    <input type="number" placeholder="Enter custom amount" value={customAmount}
                        onChange={e => { setCustomAmount(e.target.value); setAmount(null); }}
                        className="field-input" style={{ paddingLeft: 28 }}
                    />
                </div>
            </div>

            {/* Monthly Toggle */}
            <div className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>Make it monthly</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Support consistently for more impact</p>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--color-border)', cursor: 'pointer', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 2, top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }} />
                </div>
            </div>

            {/* Continue Button */}
            <Link href="/donor/donate/details" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                Continue • ₹{(amount || parseInt(customAmount) || 0).toLocaleString()}
            </Link>
        </div>
    );
}
