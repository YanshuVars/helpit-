'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface DonorProfile {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    pan_number: string | null;
    role: string;
    created_at: string;
}

export default function DonorProfilePage() {
    const [user, setUser] = useState<DonorProfile | null>(null);
    const [stats, setStats] = useState({ totalDonated: 0, totalDonations: 0, monthlyDonated: 0, ngosSupported: 0 });
    const [followedNgos, setFollowedNgos] = useState<{ id: string; name: string; logo_url: string | null }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const supabase = createClient();
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) { setLoading(false); return; }

                // User data
                const { data: userData } = await supabase.from('users').select('*').eq('id', authUser.id).single();
                if (userData) setUser(userData as DonorProfile);

                // Donation stats
                const { data: donations } = await supabase
                    .from('donations')
                    .select('amount, status, ngo_id, created_at')
                    .eq('donor_id', authUser.id);

                if (donations) {
                    const completed = donations.filter(d => d.status === 'COMPLETED');
                    const totalDonated = completed.reduce((sum, d) => sum + (d.amount || 0), 0);
                    const uniqueNgos = new Set(completed.map(d => d.ngo_id).filter(Boolean));

                    const now = new Date();
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    const monthlyDonated = completed
                        .filter(d => new Date(d.created_at) >= monthStart)
                        .reduce((sum, d) => sum + (d.amount || 0), 0);

                    setStats({
                        totalDonated,
                        totalDonations: completed.length,
                        monthlyDonated,
                        ngosSupported: uniqueNgos.size,
                    });
                }

                // Followed NGOs
                const { data: follows } = await supabase
                    .from('follows')
                    .select('ngo:ngos(id, name, logo_url)')
                    .eq('follower_id', authUser.id)
                    .limit(8);

                if (follows) {
                    setFollowedNgos(follows.map((f: any) => ({
                        id: f.ngo?.id || '',
                        name: f.ngo?.name || 'Unknown',
                        logo_url: f.ngo?.logo_url || null,
                    })).filter(n => n.id));
                }
            } catch (error) {
                console.error('Error fetching donor profile:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: 80 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#cbd5e1' }}>person_off</span>
                <h3 style={{ marginTop: 16, fontWeight: 700, color: '#0f172a' }}>Profile Not Found</h3>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>Unable to load your profile.</p>
            </div>
        );
    }

    const joinDate = new Date(user.created_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const cardStyle = {
        background: '#fff', borderRadius: 16, padding: 24,
        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ── Hero Banner ── */}
            <div style={{
                borderRadius: 20, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #f43f5e 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1de2d1 0%, transparent 50%)',
                }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '36px 40px', display: 'flex', alignItems: 'center', gap: 28 }}>
                    {/* Avatar */}
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
                        background: user.avatar_url
                            ? `url("${user.avatar_url}") center/cover`
                            : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 40, fontWeight: 900,
                        border: '3px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}>
                        {!user.avatar_url && (user.full_name?.charAt(0) || 'D')}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            {user.full_name}
                        </h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '4px 12px', borderRadius: 999,
                                background: 'rgba(244,63,94,0.15)', color: '#fb7185',
                                fontSize: 12, fontWeight: 600,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>favorite</span>
                                Donor
                            </span>
                            <span style={{
                                padding: '4px 12px', borderRadius: 999,
                                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                                fontSize: 12, fontWeight: 600,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                                Member since {joinDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="r-grid-4">
                {[
                    { icon: 'payments', label: 'Total Donated', value: formatCurrency(stats.totalDonated), color: '#16a34a', sub: `${stats.totalDonations} donations` },
                    { icon: 'trending_up', label: 'This Month', value: formatCurrency(stats.monthlyDonated), color: '#1de2d1', sub: 'Current month' },
                    { icon: 'domain', label: 'NGOs Supported', value: stats.ngosSupported.toString(), color: '#3b82f6', sub: 'Unique organizations' },
                    { icon: 'savings', label: 'Tax Saved (Est.)', value: formatCurrency(Math.floor(stats.totalDonated * 0.5)), color: '#f59e0b', sub: 'Under 80G benefit' },
                ].map(s => (
                    <div key={s.label} style={cardStyle}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `${s.color}12`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Two Columns ── */}
            <div className="r-two-col">
                {/* Left: Personal Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={cardStyle}>
                        <h3 style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                            Personal Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {[
                                { icon: 'badge', label: 'Full Name', value: user.full_name },
                                { icon: 'mail', label: 'Email', value: user.email },
                                { icon: 'phone', label: 'Phone', value: user.phone },
                                { icon: 'location_on', label: 'Location', value: user.location },
                                { icon: 'description', label: 'PAN Number', value: user.pan_number ? `${user.pan_number.substring(0, 3)}****${user.pan_number.slice(-2)}` : null },
                            ].filter(r => r.value).map(r => (
                                <div key={r.label} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 0', borderBottom: '1px solid #f1f5f9',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#94a3b8' }}>{r.icon}</span>
                                    <div>
                                        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{r.label}</p>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', marginTop: 2 }}>{r.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {user.bio && (
                            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: '#f8fafc' }}>
                                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>About</p>
                                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{user.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Followed NGOs + Quick Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Followed NGOs */}
                    <div style={cardStyle}>
                        <h3 style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span>
                            NGOs You Follow ({followedNgos.length})
                        </h3>
                        {followedNgos.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {followedNgos.map(ngo => (
                                    <div key={ngo.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: 12, borderRadius: 12, background: '#fafbfc',
                                    }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            background: ngo.logo_url
                                                ? `url("${ngo.logo_url}") center/cover`
                                                : 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
                                        }}>
                                            {!ngo.logo_url && ngo.name.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{ngo.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 24 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#cbd5e1' }}>search</span>
                                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>You haven&apos;t followed any NGOs yet.</p>
                                <Link href="/donor/discover" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    marginTop: 12, padding: '8px 16px', borderRadius: 8,
                                    background: '#1de2d1', color: '#0f172a',
                                    fontSize: 12, fontWeight: 700, textDecoration: 'none',
                                }}>Discover NGOs</Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div style={cardStyle}>
                        <h3 style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>link</span>
                            Quick Actions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { icon: 'credit_card', label: 'Make a Donation', href: '/donor/donate', color: '#16a34a' },
                                { icon: 'history', label: 'View Donation History', href: '/donor/history', color: '#3b82f6' },
                                { icon: 'receipt_long', label: 'Download Receipts', href: '/donor/receipts', color: '#f59e0b' },
                                { icon: 'search', label: 'Discover NGOs', href: '/donor/discover', color: '#8b5cf6' },
                            ].map(link => (
                                <Link key={link.href} href={link.href} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 14px', borderRadius: 12, textDecoration: 'none',
                                    background: '#fafbfc', transition: 'background 200ms',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fafbfc'}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: link.color }}>{link.icon}</span>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{link.label}</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#cbd5e1', marginLeft: 'auto' }}>chevron_right</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
