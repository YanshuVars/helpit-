"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface Donation {
    id: string; amount: number; created_at: string; status: string;
    ngo: { name: string; logo_url: string | null };
}

export default function DonationHistoryPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalDonated, setTotalDonated] = useState(0);

    useEffect(() => { fetchDonations(); }, []);

    async function fetchDonations() {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: donationsData, error } = await supabase.from("donations")
                .select(`id, amount, created_at, status, ngo:ngos(name, logo_url)`)
                .eq("donor_id", user.id).order("created_at", { ascending: false });

            if (error) throw error;
            if (donationsData) {
                // @ts-ignore - supabase types might be slightly off with deep joins
                setDonations(donationsData as Donation[]);
                const total = donationsData.reduce((acc, curr) => curr.status === 'COMPLETED' ? acc + curr.amount : acc, 0);
                setTotalDonated(total);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    }

    const statusColor: Record<string, { bg: string; text: string }> = {
        COMPLETED: { bg: 'var(--color-success-bg, #E8F5E9)', text: 'var(--color-success)' },
        PENDING: { bg: '#FFF8E1', text: '#F9A825' },
        FAILED: { bg: '#FFEBEE', text: '#E53935' },
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <Link href="/donor" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                    </Link>
                    <h1 className="page-title">Donation History</h1>
                </div>
                <div className="dashboard-loading"><span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Link href="/donor" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Donation History</h1>
            </div>

            {/* Summary */}
            <div className="card" style={{ padding: 18, background: 'var(--color-primary-bg)', borderColor: 'var(--color-primary)', borderWidth: 1 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Donated</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)', marginTop: 4 }}>{formatCurrency(totalDonated)}</p>
            </div>

            {/* List */}
            {donations.length === 0 ? (
                <div className="empty-state-container">
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-text-disabled)' }}>volunteer_activism</span>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No donations yet.</p>
                    <Link href="/donor/discover" className="btn btn-primary" style={{ marginTop: 12, textDecoration: 'none' }}>Donate to an NGO</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {donations.map(donation => {
                        const sc = statusColor[donation.status] || statusColor.PENDING;
                        return (
                            <Link key={donation.id} href={`/donor/receipts/${donation.id}`} className="card-interactive" style={{ padding: 14, textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-bg)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
                                        }}>
                                            {donation.ngo?.logo_url ? (
                                                <img src={donation.ngo.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>volunteer_activism</span>
                                            )}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 14 }}>{donation.ngo?.name || "Unknown NGO"}</p>
                                            <p style={{ fontSize: 11, color: 'var(--color-text-disabled)' }}>{format(new Date(donation.created_at), "MMM d, yyyy")}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-success)' }}>+{formatCurrency(donation.amount)}</p>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: sc.bg, color: sc.text }}>{donation.status}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
