'use client';

import { useState } from 'react';
import Link from 'next/link';

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];
const purposes = ['Education Support', 'Medical Aid', 'Food & Nutrition', 'Disaster Relief', 'General Donation', 'Other'];

export default function DonateDetailsPage() {
    const [amount, setAmount] = useState(1000);
    const [customAmount, setCustomAmount] = useState('');
    const [purpose, setPurpose] = useState('General Donation');
    const [frequency, setFrequency] = useState('one-time');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const displayAmount = customAmount ? parseInt(customAmount) || 0 : amount;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Donation Details
                </h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                    Choose your donation amount and purpose.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
                {/* Left Column - Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Amount Section */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>payments</span>
                            Donation Amount
                        </h3>

                        {/* Amount Input */}
                        <div style={{ position: 'relative', marginBottom: 16 }}>
                            <span style={{
                                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                fontSize: 24, fontWeight: 700, color: '#64748b',
                            }}>₹</span>
                            <input
                                type="number" placeholder="Enter amount"
                                value={customAmount || amount}
                                onChange={e => { setCustomAmount(e.target.value); }}
                                style={{
                                    width: '100%', padding: '16px 16px 16px 40px',
                                    borderRadius: 12, border: '2px solid #e2e8f0',
                                    fontSize: 24, fontWeight: 700, color: '#0f172a',
                                    outline: 'none', transition: 'border-color 200ms',
                                }}
                                onFocus={e => e.target.style.borderColor = '#1de2d1'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Quick Amount Chips */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {quickAmounts.map(a => (
                                <button key={a}
                                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                                    style={{
                                        padding: '8px 16px', borderRadius: 999,
                                        border: (amount === a && !customAmount) ? '2px solid #1de2d1' : '1px solid #e2e8f0',
                                        background: (amount === a && !customAmount) ? 'rgba(29,226,209,0.08)' : '#fff',
                                        color: (amount === a && !customAmount) ? '#0d9488' : '#64748b',
                                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                        transition: 'all 200ms',
                                    }}
                                >₹{a.toLocaleString()}</button>
                            ))}
                        </div>
                    </div>

                    {/* Purpose Section */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>category</span>
                            Purpose
                        </h3>
                        <select
                            value={purpose} onChange={e => setPurpose(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px',
                                borderRadius: 12, border: '1px solid #e2e8f0',
                                background: '#f8fafc', fontSize: 14, color: '#0f172a',
                                outline: 'none', cursor: 'pointer',
                            }}
                        >
                            {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    {/* Frequency */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>repeat</span>
                            Donation Frequency
                        </h3>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {[
                                { id: 'one-time', label: 'One-time', icon: 'paid' },
                                { id: 'monthly', label: 'Monthly', icon: 'calendar_month' },
                                { id: 'quarterly', label: 'Quarterly', icon: 'date_range' },
                            ].map(f => (
                                <label key={f.id} style={{
                                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                    padding: 16, borderRadius: 12, cursor: 'pointer',
                                    border: frequency === f.id ? '2px solid #1de2d1' : '1px solid #e2e8f0',
                                    background: frequency === f.id ? 'rgba(29,226,209,0.05)' : '#fff',
                                    transition: 'all 200ms',
                                }}>
                                    <input type="radio" name="frequency" value={f.id} checked={frequency === f.id}
                                        onChange={() => setFrequency(f.id)} style={{ display: 'none' }} />
                                    <span className="material-symbols-outlined" style={{
                                        fontSize: 24, color: frequency === f.id ? '#0d9488' : '#94a3b8',
                                    }}>{f.icon}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: frequency === f.id ? '#0d9488' : '#64748b' }}>{f.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Message & Anonymous */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>chat</span>
                            Additional Details
                        </h3>
                        <textarea
                            placeholder="Add a message to the NGO (optional)"
                            rows={3}
                            style={{
                                width: '100%', padding: 14, borderRadius: 12,
                                border: '1px solid #e2e8f0', background: '#f8fafc',
                                fontSize: 14, color: '#0f172a', resize: 'none',
                                outline: 'none',
                            }}
                        />
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: 14, marginTop: 12, borderRadius: 12,
                            background: '#f8fafc', cursor: 'pointer',
                        }}>
                            <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)}
                                style={{ width: 18, height: 18, borderRadius: 4, accentColor: '#1de2d1' }} />
                            <div>
                                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Make donation anonymous</p>
                                <p style={{ fontSize: 12, color: '#94a3b8' }}>Your name won&apos;t be visible to the NGO</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    position: 'sticky', top: 80,
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Donation Summary</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 14, background: '#f8fafc', borderRadius: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 800, fontSize: 18,
                        }}>H</div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Hope Foundation</p>
                            <p style={{ fontSize: 12, color: '#64748b' }}>Education · Verified</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                        {[
                            { label: 'Donation Amount', value: `₹${displayAmount.toLocaleString()}` },
                            { label: 'Purpose', value: purpose },
                            { label: 'Frequency', value: frequency === 'one-time' ? 'One-time' : frequency.charAt(0).toUpperCase() + frequency.slice(1) },
                            { label: 'Tax Benefit (80G)', value: `₹${Math.floor(displayAmount * 0.5).toLocaleString()}` },
                        ].map((row, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
                            }}>
                                <span style={{ fontSize: 13, color: '#64748b' }}>{row.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 0', borderTop: '2px solid #e2e8f0',
                    }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Total</span>
                        <span style={{ fontSize: 24, fontWeight: 800, color: '#1de2d1' }}>₹{displayAmount.toLocaleString()}</span>
                    </div>

                    <Link href="/donor/donate/payment" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', height: 48, borderRadius: 12, marginTop: 16,
                        background: '#1de2d1', color: '#0f172a',
                        fontSize: 15, fontWeight: 700, textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(29,226,209,0.2)',
                        transition: 'background 200ms',
                    }}>
                        Proceed to Payment
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
