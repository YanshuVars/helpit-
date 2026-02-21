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

const avatarColors = ['#dbeafe', '#dcfce7', '#fce7f3', '#fef3c7', '#ede9fe', '#fee2e2', '#cffafe'];
const avatarTextColors = ['#1e40af', '#166534', '#9d174d', '#92400e', '#5b21b6', '#991b1b', '#0e7490'];

export default function DonationHistoryPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalDonated, setTotalDonated] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

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

    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        COMPLETED: { bg: '#dcfce7', text: '#166534', label: 'Completed' },
        PENDING: { bg: '#fef3c7', text: '#92400e', label: 'Processing' },
        FAILED: { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
    };

    const filteredDonations = donations.filter(d =>
        !searchQuery || d.ngo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Donation History</h2>
                    <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>View and manage your past contributions and download receipts.</p>
                </div>
                <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 10,
                    border: '1px solid #e2e8f0', background: '#fff',
                    fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                    Export CSV
                </button>
            </div>

            {/* Summary Cards */}
            <div className="r-grid-3">
                {[
                    { label: 'Total Donated', value: formatCurrency(totalDonated), icon: 'monetization_on', color: '#1de2d1' },
                    { label: 'Tax Deductible', value: formatCurrency(Math.floor(totalDonated * 0.5)), icon: 'receipt_long', color: '#1de2d1' },
                    { label: 'Impact', value: `${donations.length} NGOs`, icon: 'volunteer_activism', color: '#1de2d1' },
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: '#fff', padding: 22, borderRadius: 16,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: stat.color }}>{stat.icon}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters & Controls */}
            <div style={{
                background: '#fff', padding: 16, borderRadius: '16px 16px 0 0',
                border: '1px solid #e2e8f0', borderBottom: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
            }}>
                <div style={{ position: 'relative', minWidth: 280 }}>
                    <span className="material-symbols-outlined" style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        color: '#94a3b8', fontSize: 20,
                    }}>search</span>
                    <input
                        type="text" placeholder="Search by NGO name..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 14px 10px 40px',
                            borderRadius: 10, border: '1px solid #e2e8f0',
                            background: '#f8fafc', fontSize: 13, color: '#0f172a',
                            outline: 'none',
                        }}
                        onFocus={e => e.target.style.borderColor = '#1de2d1'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: '#fff', borderRadius: '0 0 16px 16px',
                border: '1px solid #e2e8f0', borderTop: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                {['Date', 'NGO Name', 'Amount (₹)', 'Status', 'Receipt'].map((h, i) => (
                                    <th key={h} style={{
                                        padding: '14px 24px', fontSize: 11, fontWeight: 700,
                                        color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
                                        textAlign: i === 4 ? 'right' : 'left',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonations.map((donation, idx) => {
                                const sc = statusConfig[donation.status] || statusConfig.PENDING;
                                const colorIdx = idx % avatarColors.length;
                                const initials = (donation.ngo?.name || 'UN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                                return (
                                    <tr key={donation.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 150ms' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px', fontSize: 13, color: '#0f172a' }}>
                                            {format(new Date(donation.created_at), "MMM dd, yyyy")}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                                    background: avatarColors[colorIdx],
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11, fontWeight: 800, color: avatarTextColors[colorIdx],
                                                }}>{initials}</div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{donation.ngo?.name || 'Unknown NGO'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                                            {formatCurrency(donation.amount)}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                display: 'inline-flex', padding: '3px 10px', borderRadius: 999,
                                                fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.text,
                                            }}>{sc.label}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            {donation.status === 'COMPLETED' ? (
                                                <Link href={`/donor/receipts/${donation.id}`} style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: 8,
                                                    borderRadius: 999, color: '#1de2d1', textDecoration: 'none',
                                                    transition: 'background 200ms',
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,226,209,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>download</span>
                                                </Link>
                                            ) : (
                                                <span style={{ color: '#cbd5e1', padding: 8, display: 'inline-flex' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>pending</span>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDonations.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>volunteer_activism</span>
                                        <p style={{ fontWeight: 600 }}>No donations yet.</p>
                                        <Link href="/donor/discover" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            marginTop: 12, padding: '10px 20px', borderRadius: 10,
                                            background: '#1de2d1', color: '#0f172a',
                                            fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                        }}>Donate to an NGO</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {filteredDonations.length > 0 && (
                    <div style={{
                        padding: '14px 24px', borderTop: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                            Showing <strong style={{ color: '#0f172a' }}>1</strong> to <strong style={{ color: '#0f172a' }}>{filteredDonations.length}</strong> of <strong style={{ color: '#0f172a' }}>{donations.length}</strong> results
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
