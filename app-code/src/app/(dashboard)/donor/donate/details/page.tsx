'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Suspense } from 'react';

interface NGOInfo {
    id: string;
    name: string;
    logo_url: string | null;
    categories: string[] | null;
    verification_status: string;
}

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];
const purposes = ['Education Support', 'Medical Aid', 'Food & Nutrition', 'Disaster Relief', 'General Donation', 'Other'];

function DonateDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ngoId = searchParams.get('ngoId') || '';
    const initialAmount = parseInt(searchParams.get('amount') || '1000');

    const [ngo, setNgo] = useState<NGOInfo | null>(null);
    const [amount, setAmount] = useState(initialAmount);
    const [customAmount, setCustomAmount] = useState('');
    const [purpose, setPurpose] = useState('General Donation');
    const [frequency, setFrequency] = useState('one-time');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNgo() {
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();
            const { data } = await supabase.from('ngos')
                .select('id, name, logo_url, categories, verification_status')
                .eq('id', ngoId).single();
            setNgo(data);
            setLoading(false);
        }
        fetchNgo();
    }, [ngoId]);

    const displayAmount = customAmount ? parseInt(customAmount) || 0 : amount;

    const handleProceed = () => {
        const params = new URLSearchParams({
            ngoId: ngo?.id || '',
            amount: displayAmount.toString(),
            purpose,
            frequency,
            isAnonymous: isAnonymous.toString(),
            message,
        });
        router.push(`/donor/donate/payment?${params.toString()}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

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

            <div className="r-main-side" style={{ alignItems: 'start' }}>
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
                                type="number" min="1" placeholder="Enter amount"
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
                            rows={3} value={message} onChange={e => setMessage(e.target.value)}
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
                            background: ngo?.logo_url ? `url("${ngo.logo_url}") center/cover` : 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 800, fontSize: 18,
                        }}>{!ngo?.logo_url && (ngo?.name?.charAt(0) || 'N')}</div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{ngo?.name || 'Select an NGO'}</p>
                            <p style={{ fontSize: 12, color: '#64748b' }}>{ngo?.categories?.[0] || ''} · {ngo?.verification_status === 'APPROVED' ? 'Verified' : ''}</p>
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

                    <button onClick={handleProceed} disabled={!ngo || displayAmount <= 0} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', height: 48, borderRadius: 12, marginTop: 16,
                        background: '#1de2d1', color: '#0f172a',
                        fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(29,226,209,0.2)',
                        transition: 'background 200ms',
                        opacity: (!ngo || displayAmount <= 0) ? 0.5 : 1,
                    }}>
                        Proceed to Payment
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DonateDetailsPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}><span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span></div>}>
            <DonateDetailsContent />
        </Suspense>
    );
}
