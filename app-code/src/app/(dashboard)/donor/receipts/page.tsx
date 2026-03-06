"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface DonationReceipt {
    id: string;
    amount: number;
    created_at: string;
    receipt_number: string | null;
    payment_method: string;
    ngo: { name: string; logo_url: string | null };
}

const avatarColors = ['#dbeafe', '#dcfce7', '#fce7f3', '#fef3c7', '#ede9fe', '#fee2e2', '#cffafe'];
const avatarTextColors = ['#1e40af', '#166534', '#9d174d', '#92400e', '#5b21b6', '#991b1b', '#0e7490'];

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<DonationReceipt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReceipts() {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase.from("donations")
                    .select(`id, amount, created_at, receipt_number, payment_method, ngo:ngos(name, logo_url)`)
                    .eq("donor_id", user.id)
                    .eq("status", "COMPLETED")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                // @ts-ignore
                if (data) setReceipts(data as DonationReceipt[]);
            } catch (error) {
                console.error("Error fetching receipts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReceipts();
    }, []);

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
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Receipts</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>View and download receipts for your completed donations.</p>
            </div>

            {/* Table */}
            <div style={{
                background: '#fff', borderRadius: 16,
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                overflow: 'hidden',
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                {['Date', 'NGO', 'Amount', 'Receipt No.', 'Payment', ''].map((h, i) => (
                                    <th key={h || 'actions'} style={{
                                        padding: '14px 24px', fontSize: 11, fontWeight: 700,
                                        color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
                                        textAlign: i === 5 ? 'right' : 'left',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt, idx) => {
                                const colorIdx = idx % avatarColors.length;
                                const initials = (receipt.ngo?.name || 'UN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                                return (
                                    <tr key={receipt.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 150ms' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px', fontSize: 13, color: '#0f172a' }}>
                                            {format(new Date(receipt.created_at), "MMM dd, yyyy")}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                                    background: avatarColors[colorIdx],
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11, fontWeight: 800, color: avatarTextColors[colorIdx],
                                                }}>{initials}</div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{receipt.ngo?.name || 'Unknown NGO'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                                            {formatCurrency(receipt.amount)}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>
                                            {receipt.receipt_number || `R-${receipt.id.slice(0, 8)}`}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 13, color: '#64748b' }}>
                                            {receipt.payment_method || 'Online'}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <Link href={`/donor/receipts/${receipt.id}`} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                padding: '6px 14px', borderRadius: 8,
                                                background: 'rgba(29,226,209,0.08)', color: '#0d9488',
                                                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                                                transition: 'background 200ms',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,226,209,0.15)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(29,226,209,0.08)'}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>receipt_long</span>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {receipts.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>receipt_long</span>
                                        <p style={{ fontWeight: 600 }}>No receipts yet.</p>
                                        <p style={{ fontSize: 13, marginTop: 4 }}>Complete a donation to receive a receipt.</p>
                                        <Link href="/donor/donate" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            marginTop: 16, padding: '10px 20px', borderRadius: 10,
                                            background: '#1de2d1', color: '#0f172a',
                                            fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                        }}>Make a Donation</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {receipts.length > 0 && (
                    <div style={{
                        padding: '14px 24px', borderTop: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                            Showing <strong style={{ color: '#0f172a' }}>{receipts.length}</strong> receipt{receipts.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
