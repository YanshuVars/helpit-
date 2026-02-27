'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-toastify';

interface NGOInfo {
    name: string;
    logo_url: string | null;
    categories: string[] | null;
}

const paymentMethods = [
    { id: 'UPI', label: 'UPI / QR Code', desc: 'Pay using Google Pay, PhonePe, Paytm', icon: 'qr_code_2', color: '#059669', bg: '#dcfce7' },
    { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay', icon: 'credit_card', color: '#2563eb', bg: '#dbeafe' },
    { id: 'NET_BANKING', label: 'Net Banking', desc: 'All major banks supported', icon: 'account_balance', color: '#7c3aed', bg: '#ede9fe' },
];

function DonatePaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ngoId = searchParams.get('ngoId') || '';
    const amount = parseInt(searchParams.get('amount') || '0');
    const purpose = searchParams.get('purpose') || 'General Donation';
    const frequency = searchParams.get('frequency') || 'one-time';
    const isAnonymous = searchParams.get('isAnonymous') === 'true';
    const message = searchParams.get('message') || '';

    const [ngo, setNgo] = useState<NGOInfo | null>(null);
    const [selectedMethod, setSelectedMethod] = useState('UPI');
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNgo() {
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();
            const { data } = await supabase.from('ngos')
                .select('name, logo_url, categories')
                .eq('id', ngoId).single();
            setNgo(data);
            setLoading(false);
        }
        fetchNgo();
    }, [ngoId]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error('Please log in to donate');
                setProcessing(false);
                return;
            }

            // Create the donation record
            const { data: donation, error } = await supabase.from('donations').insert({
                ngo_id: ngoId,
                donor_id: session.user.id,
                amount: amount,
                is_recurring: frequency !== 'one-time',
                recurring_frequency: frequency === 'one-time' ? null : frequency.toUpperCase(),
                is_anonymous: isAnonymous,
                message: message || null,
                payment_method: selectedMethod,
                status: 'COMPLETED', // Simulated payment success
                receipt_number: `RCP-${Date.now().toString(36).toUpperCase()}`,
                payment_id: `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            }).select('id').single();

            if (error) {
                console.error('Donation error:', error);
                toast.error('Donation failed. Please try again.');
                setProcessing(false);
                return;
            }

            // Redirect to success page with donation ID
            router.push(`/donor/donate/success?donationId=${donation.id}`);
        } catch (e) {
            console.error('Payment error:', e);
            toast.error('Something went wrong');
            setProcessing(false);
        }
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
                    Payment Method
                </h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                    Choose how you&apos;d like to complete your donation.
                </p>
            </div>

            <div className="r-main-side" style={{ alignItems: 'start' }}>
                {/* Left Column - Payment Methods */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>
                            Select Payment Method
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {paymentMethods.map(m => {
                                const isSelected = selectedMethod === m.id;
                                return (
                                    <label key={m.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        padding: 18, borderRadius: 14, cursor: 'pointer',
                                        border: isSelected ? '2px solid #1de2d1' : '1px solid #e2e8f0',
                                        background: isSelected ? 'rgba(29,226,209,0.04)' : '#fff',
                                        transition: 'all 200ms',
                                    }}>
                                        <input type="radio" name="payment" value={m.id}
                                            checked={isSelected} onChange={() => setSelectedMethod(m.id)}
                                            style={{ display: 'none' }} />
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 12,
                                            background: m.bg, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 24, color: m.color }}>{m.icon}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{m.label}</p>
                                            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{m.desc}</p>
                                        </div>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            border: isSelected ? '6px solid #1de2d1' : '2px solid #cbd5e1',
                                            transition: 'all 200ms', flexShrink: 0,
                                        }} />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Security Info */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 20,
                        border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: '#dcfce7', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#059669' }}>lock</span>
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>256-bit SSL Encrypted</p>
                            <p style={{ fontSize: 12, color: '#94a3b8' }}>Your payment information is fully secured and encrypted.</p>
                        </div>
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
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{ngo?.name || 'Unknown NGO'}</p>
                            <p style={{ fontSize: 12, color: '#64748b' }}>{ngo?.categories?.[0] || ''} · Verified</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                        {[
                            { label: 'Donation Amount', value: `₹${amount.toLocaleString()}` },
                            { label: 'Purpose', value: purpose },
                            { label: 'Payment Method', value: paymentMethods.find(m => m.id === selectedMethod)?.label || '' },
                        ].map((row, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
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
                        <span style={{ fontSize: 24, fontWeight: 800, color: '#1de2d1' }}>₹{amount.toLocaleString()}</span>
                    </div>

                    <button onClick={handlePayment} disabled={processing} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', height: 48, borderRadius: 12, marginTop: 16,
                        background: '#1de2d1', color: '#0f172a',
                        fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(29,226,209,0.2)',
                        opacity: processing ? 0.6 : 1,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{processing ? 'sync' : 'lock'}</span>
                        {processing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
                    </button>

                    <p style={{ fontSize: 11, textAlign: 'center', color: '#94a3b8', marginTop: 12 }}>
                        100% of your donation goes directly to the NGO
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DonatePaymentPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}><span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span></div>}>
            <DonatePaymentContent />
        </Suspense>
    );
}
