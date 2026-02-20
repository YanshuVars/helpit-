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
        return <div className="dashboard-loading"><span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span></div>;
    }

    if (!donation) {
        return (
            <div className="empty-state-container" style={{ padding: 32, textAlign: 'center' }}>
                <p>Receipt not found.</p>
                <Link href="/donor/history" style={{ color: 'var(--color-primary)', textDecoration: 'underline', marginTop: 8, display: 'inline-block' }}>Back to history</Link>
            </div>
        );
    }

    const rows = [
        { label: 'Receipt No.', value: donation.receipt_number || 'PENDING' },
        { label: 'Transaction ID', value: donation.payment_id || 'N/A' },
        { label: 'NGO', value: donation.ngo?.name },
        { label: 'Payment Method', value: donation.payment_method || 'Online' },
        ...(donation.ngo?.pan_number ? [{ label: '80G (PAN)', value: donation.ngo.pan_number }] : []),
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
                <Link href="/donor/history" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Donation Receipt</h1>
            </div>

            {/* Receipt Card */}
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                {/* Header */}
                <div style={{ background: 'var(--color-primary)', color: '#fff', padding: 24, textAlign: 'center' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', margin: '0 auto 10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    }}>
                        {donation.ngo?.logo_url ? (
                            <img src={donation.ngo.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>volunteer_activism</span>
                        )}
                    </div>
                    <p style={{ fontSize: 13, opacity: 0.9, fontWeight: 500 }}>Helpit Donation Receipt</p>
                </div>

                {/* Details */}
                <div style={{ padding: 20 }}>
                    <div style={{ textAlign: 'center', paddingBottom: 18, borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <p style={{ fontSize: 32, fontWeight: 700 }}>{formatCurrency(donation.amount)}</p>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Donated on {format(new Date(donation.created_at), "MMMM d, yyyy")}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
                        {rows.map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{row.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{row.value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                        <p style={{ fontSize: 11, color: 'var(--color-text-disabled)' }}>This receipt is valid for tax deduction under Section 80G of the Income Tax Act.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span> Share
                </button>
                <button className="btn btn-primary" style={{ justifyContent: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span> Download PDF
                </button>
            </div>
        </div>
    );
}
