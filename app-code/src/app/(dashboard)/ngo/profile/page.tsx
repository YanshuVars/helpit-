'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useNgoContext } from '@/lib/hooks/use-ngo-context';
import { formatCurrency } from '@/lib/utils';

interface NgoFullProfile {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    email: string;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string | null;
    logo_url: string | null;
    banner_url: string | null;
    categories: string[];
    tags: string[];
    registration_number: string;
    pan_number: string | null;
    has_80g: boolean;
    has_12a: boolean;
    verification_status: string;
    plan: string;
    social_links: Record<string, string>;
    total_donations_received: number;
    total_requests_resolved: number;
    volunteer_count: number;
    rating: number;
    created_at: string;
}

const categoryLabels: Record<string, string> = {
    EDUCATION: 'Education', ENVIRONMENT: 'Environment', MEDICAL: 'Medical',
    COMMUNITY: 'Community', ANIMAL_CARE: 'Animal Care', FOOD: 'Food & Nutrition',
    SHELTER: 'Shelter', CLOTHING: 'Clothing', EMERGENCY: 'Emergency Response',
    ELDERLY_CARE: 'Elderly Care', CHILD_CARE: 'Child Care',
    DISABILITY_SUPPORT: 'Disability Support', OTHER: 'Other',
};

const categoryIcons: Record<string, string> = {
    EDUCATION: 'school', ENVIRONMENT: 'eco', MEDICAL: 'local_hospital',
    COMMUNITY: 'groups', ANIMAL_CARE: 'pets', FOOD: 'restaurant',
    SHELTER: 'home', CLOTHING: 'checkroom', EMERGENCY: 'emergency',
    ELDERLY_CARE: 'elderly', CHILD_CARE: 'child_care',
    DISABILITY_SUPPORT: 'accessible', OTHER: 'category',
};

export default function NgoProfilePage() {
    const { ngoId, loading: ctxLoading } = useNgoContext();
    const [profile, setProfile] = useState<NgoFullProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [memberCount, setMemberCount] = useState(0);
    const [donationStats, setDonationStats] = useState({ total: 0, count: 0, monthly: 0 });

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();

            const { data, error } = await supabase
                .from('ngos')
                .select('*')
                .eq('id', ngoId)
                .single();

            if (error || !data) {
                console.error('Error loading NGO profile:', error);
                setLoading(false);
                return;
            }
            setProfile(data as NgoFullProfile);

            // Member count
            const { count: members } = await supabase
                .from('ngo_members')
                .select('*', { count: 'exact', head: true })
                .eq('ngo_id', ngoId);
            setMemberCount(members || 0);

            // Donation stats
            const { data: donations } = await supabase
                .from('donations')
                .select('amount, created_at')
                .eq('ngo_id', ngoId)
                .eq('status', 'COMPLETED');

            if (donations) {
                const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
                const now = new Date();
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthly = donations
                    .filter(d => new Date(d.created_at) >= monthStart)
                    .reduce((sum, d) => sum + (d.amount || 0), 0);
                setDonationStats({ total, count: donations.length, monthly });
            }

            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    if (loading || ctxLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ textAlign: 'center', padding: 80 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#cbd5e1' }}>domain_disabled</span>
                <h3 style={{ marginTop: 16, fontWeight: 700, color: '#0f172a' }}>No Profile Found</h3>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>Unable to load organization profile.</p>
            </div>
        );
    }

    const verificationColor = profile.verification_status === 'APPROVED'
        ? { bg: '#dcfce7', text: '#059669', label: 'Verified' }
        : profile.verification_status === 'PENDING'
            ? { bg: '#fef3c7', text: '#d97706', label: 'Pending Verification' }
            : { bg: '#fee2e2', text: '#dc2626', label: 'Not Verified' };

    const joinDate = new Date(profile.created_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const cardStyle = {
        background: '#fff', borderRadius: 16, padding: 24,
        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    };

    const sectionTitle = {
        fontSize: 11, fontWeight: 700 as const, textTransform: 'uppercase' as const,
        letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
    };

    const infoRow = (icon: string, label: string, value: string | null) => value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#94a3b8' }}>{icon}</span>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', marginTop: 2 }}>{value}</p>
            </div>
        </div>
    ) : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ── Hero Banner ── */}
            <div style={{
                borderRadius: 20, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                minHeight: 220,
            }}>
                {/* Decorative pattern */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.05,
                    backgroundImage: 'radial-gradient(circle at 25% 50%, #1de2d1 0%, transparent 50%), radial-gradient(circle at 75% 50%, #0ea5e9 0%, transparent 50%)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.1,
                    background: 'linear-gradient(135deg, #1de2d1, transparent 60%)',
                }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 28 }}>
                    {/* Logo */}
                    <div style={{
                        width: 100, height: 100, borderRadius: 20, flexShrink: 0,
                        background: profile.logo_url
                            ? `url("${profile.logo_url}") center/cover`
                            : 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 40, fontWeight: 900,
                        border: '3px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}>
                        {!profile.logo_url && profile.name.charAt(0)}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                                {profile.name}
                            </h1>
                            <span style={{
                                padding: '4px 12px', borderRadius: 999,
                                background: verificationColor.bg,
                                color: verificationColor.text,
                                fontSize: 11, fontWeight: 700,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                    {profile.verification_status === 'APPROVED' ? 'verified' : 'pending'}
                                </span>
                                {verificationColor.label}
                            </span>
                        </div>
                        {profile.description && (
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 600 }}>
                                {profile.description}
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                            {profile.categories.map(cat => (
                                <span key={cat} style={{
                                    padding: '4px 12px', borderRadius: 999,
                                    background: 'rgba(29,226,209,0.15)', color: '#1de2d1',
                                    fontSize: 12, fontWeight: 600,
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                        {categoryIcons[cat] || 'category'}
                                    </span>
                                    {categoryLabels[cat] || cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <Link href="/ngo/settings/profile" style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', fontSize: 13, fontWeight: 700,
                        textDecoration: 'none', display: 'inline-flex',
                        alignItems: 'center', gap: 6, transition: 'all 200ms',
                        flexShrink: 0,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="r-grid-4">
                {[
                    { icon: 'payments', label: 'Total Donations', value: formatCurrency(donationStats.total), color: '#16a34a', sub: `${donationStats.count} donations` },
                    { icon: 'trending_up', label: 'This Month', value: formatCurrency(donationStats.monthly), color: '#1de2d1', sub: 'Monthly revenue' },
                    { icon: 'group', label: 'Team Members', value: memberCount.toString(), color: '#3b82f6', sub: 'Active members' },
                    { icon: 'task_alt', label: 'Requests Resolved', value: (profile.total_requests_resolved || 0).toString(), color: '#f59e0b', sub: 'All time' },
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

            {/* ── Two Column Layout ── */}
            <div className="r-two-col">
                {/* Left: Contact & Location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Contact Info */}
                    <div style={cardStyle}>
                        <div style={sectionTitle}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>contact_mail</span>
                            Contact Information
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {infoRow('mail', 'Email', profile.email)}
                            {infoRow('phone', 'Phone', profile.phone)}
                            {infoRow('language', 'Website', profile.website)}
                        </div>
                    </div>

                    {/* Location */}
                    <div style={cardStyle}>
                        <div style={sectionTitle}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>
                            Location
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {infoRow('home', 'Address', profile.address)}
                            {infoRow('location_city', 'City', profile.city)}
                            {infoRow('map', 'State', profile.state)}
                            {infoRow('pin_drop', 'Pincode', profile.pincode)}
                            {infoRow('public', 'Country', profile.country)}
                        </div>
                    </div>
                </div>

                {/* Right: Registration & Compliance + Plan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Registration Details */}
                    <div style={cardStyle}>
                        <div style={sectionTitle}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                            Registration & Compliance
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc' }}>
                                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Registration Number</p>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4, fontFamily: 'monospace' }}>
                                    {profile.registration_number}
                                </p>
                            </div>
                            {profile.pan_number && (
                                <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc' }}>
                                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>PAN Number</p>
                                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4, fontFamily: 'monospace' }}>
                                        {profile.pan_number}
                                    </p>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={{
                                    padding: 16, borderRadius: 12,
                                    background: profile.has_80g ? '#f0fdf4' : '#f8fafc',
                                    border: `1px solid ${profile.has_80g ? '#bbf7d0' : '#e2e8f0'}`,
                                    textAlign: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{
                                        fontSize: 28, color: profile.has_80g ? '#059669' : '#cbd5e1',
                                    }}>{profile.has_80g ? 'check_circle' : 'cancel'}</span>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>80G Certificate</p>
                                    <p style={{ fontSize: 11, color: profile.has_80g ? '#059669' : '#94a3b8', marginTop: 2 }}>
                                        {profile.has_80g ? 'Tax Exemption Active' : 'Not Available'}
                                    </p>
                                </div>
                                <div style={{
                                    padding: 16, borderRadius: 12,
                                    background: profile.has_12a ? '#f0fdf4' : '#f8fafc',
                                    border: `1px solid ${profile.has_12a ? '#bbf7d0' : '#e2e8f0'}`,
                                    textAlign: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{
                                        fontSize: 28, color: profile.has_12a ? '#059669' : '#cbd5e1',
                                    }}>{profile.has_12a ? 'check_circle' : 'cancel'}</span>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>12A Certificate</p>
                                    <p style={{ fontSize: 11, color: profile.has_12a ? '#059669' : '#94a3b8', marginTop: 2 }}>
                                        {profile.has_12a ? 'Income Tax Exempt' : 'Not Available'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plan & Meta */}
                    <div style={cardStyle}>
                        <div style={sectionTitle}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
                            Organization Details
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 13, color: '#64748b' }}>Current Plan</span>
                                <span style={{
                                    padding: '4px 12px', borderRadius: 999,
                                    background: profile.plan === 'FREE' ? '#f1f5f9' : '#ede9fe',
                                    color: profile.plan === 'FREE' ? '#64748b' : '#7c3aed',
                                    fontSize: 12, fontWeight: 700,
                                }}>{profile.plan || 'FREE'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 13, color: '#64748b' }}>Public Slug</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>/{profile.slug}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 13, color: '#64748b' }}>Rating</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f59e0b' }}>star</span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                                        {(profile.rating || 0).toFixed(1)}
                                    </span>
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                                <span style={{ fontSize: 13, color: '#64748b' }}>Member Since</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{joinDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {profile.tags && profile.tags.length > 0 && (
                        <div style={cardStyle}>
                            <div style={sectionTitle}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>sell</span>
                                Tags
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {profile.tags.map(tag => (
                                    <span key={tag} style={{
                                        padding: '5px 14px', borderRadius: 999,
                                        background: '#f1f5f9', color: '#475569',
                                        fontSize: 12, fontWeight: 600,
                                    }}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
