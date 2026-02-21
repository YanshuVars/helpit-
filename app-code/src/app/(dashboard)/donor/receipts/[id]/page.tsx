"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface DonationReceipt {
    id: string; amount: number; created_at: string; payment_method: string;
    receipt_number: string | null; payment_id: string | null;
    ngo: { name: string; pan_number: string | null; logo_url: string | null };
}

export default function DonationReceiptPage() {
    const params = useParams();
    const id = params?.id as string;
    const [donation, setDonation] = useState<DonationReceipt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (id) fetchDonation(); }, [id]);

    async function fetchDonation() {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.from("donations")
                .select(`id, amount, created_at, payment_method, receipt_number, payment_id, ngo:ngos(name, pan_number, logo_url)`)
                .eq("id", id).single();
            if (error) throw error;
            // @ts-ignore
            if (data) setDonation(data as DonationReceipt);
        } catch (error) {
            console.error("Error fetching donation:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!donation) {
        return (
            <div style={{ textAlign: 'center', padding: 64 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>receipt_long</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 12 }}>Receipt not found</h3>
                <Link href="/donor/history" style={{ color: '#1de2d1', fontWeight: 600, fontSize: 14, marginTop: 8, display: 'inline-block' }}>← Back to history</Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link href="/donor/history" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        color: '#64748b', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                        History
                    </Link>
                    <span style={{ color: '#cbd5e1' }}>/</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Receipt #{donation.receipt_number || donation.id.slice(0, 8)}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 10,
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: 13, fontWeight: 700, color: '#0f172a', cursor: 'pointer',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
                        Print
                    </button>
                    <button style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 10,
                        background: '#1de2d1', color: '#0f172a',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        border: 'none', boxShadow: '0 2px 8px rgba(29,226,209,0.2)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Receipt Paper */}
            <div style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                maxWidth: 800, margin: '0 auto', width: '100%',
            }}>
                {/* Top Accent Bar */}
                <div style={{ height: 4, background: '#1de2d1' }} />

                <div style={{ padding: '40px 48px', position: 'relative' }}>
                    {/* Watermark */}
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', opacity: 0.03,
                        fontSize: 300, fontWeight: 900, color: '#0f172a',
                        pointerEvents: 'none', overflow: 'hidden',
                    }}>H</div>

                    {/* Header */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        paddingBottom: 32, borderBottom: '1px solid #f1f5f9', position: 'relative', zIndex: 1,
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8, background: '#1de2d1',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#0f172a', fontWeight: 800, fontSize: 18,
                                }}>H</div>
                                <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>Helpit Foundation</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                                <p>123 Charity Lane, Block C</p>
                                <p>Bangalore, Karnataka, 560001</p>
                                <p>contact@helpit.org | +91 98765 43210</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Donation Receipt</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receipt No:</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>{donation.receipt_number || `R-${donation.id.slice(0, 8)}`}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date:</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{format(new Date(donation.created_at), "MMM dd, yyyy")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 32, position: 'relative', zIndex: 1 }}>
                        {/* Donor Details */}
                        <div>
                            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#1de2d1', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: 8, borderBottom: '1px solid #f1f5f9', marginBottom: 16 }}>Donor Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Received with thanks from</p>
                                    <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>Donor</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Beneficiary NGO</p>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{donation.ngo?.name || 'Unknown NGO'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div>
                            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#1de2d1', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: 8, borderBottom: '1px solid #f1f5f9', marginBottom: 16 }}>Payment Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Amount</p>
                                        <p style={{ fontSize: 28, fontWeight: 800, color: '#1de2d1', marginTop: 2 }}>{formatCurrency(donation.amount)}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Mode</p>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{donation.payment_method || 'Online'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Transaction ID</p>
                                    <p style={{ fontSize: 13, fontFamily: 'monospace', color: '#64748b', marginTop: 2 }}>{donation.payment_id || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax Info */}
                    <div style={{
                        marginTop: 32, paddingTop: 32, borderTop: '1px solid #e2e8f0',
                        position: 'relative', zIndex: 1,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#1de2d1' }}>verified_user</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Tax Exemption Details</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.8 }}>
                            {donation.ngo?.pan_number && <p><strong>PAN:</strong> {donation.ngo.pan_number}</p>}
                            <p style={{ marginTop: 4, fontStyle: 'italic' }}>Donations to Helpit Foundation are exempt from tax under section 80G of the Income Tax Act, 1961.</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>This is a computer generated receipt</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
