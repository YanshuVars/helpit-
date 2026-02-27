'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface NGO {
    id: string; name: string; category: string;
    followers_count: number; verification_status: string; logo_url: string | null;
    description?: string;
}

interface FollowCount {
    following_ngo_id: string;
    count: number;
}

type CategoryType = 'ALL' | 'EDUCATION' | 'ENVIRONMENT' | 'MEDICAL' | 'COMMUNITY' | 'ANIMAL_CARE' | 'OTHER';

const categories = [
    { label: 'All', value: 'ALL', icon: 'apps' },
    { label: 'Education', value: 'EDUCATION', icon: 'school' },
    { label: 'Environment', value: 'ENVIRONMENT', icon: 'eco' },
    { label: 'Healthcare', value: 'MEDICAL', icon: 'local_hospital' },
    { label: 'Community', value: 'COMMUNITY', icon: 'groups' },
    { label: 'Animals', value: 'ANIMAL_CARE', icon: 'pets' },
];

const catColors: Record<string, { bg: string; text: string; light: string }> = {
    EDUCATION: { bg: '#dbeafe', text: '#1e40af', light: 'rgba(59,130,246,0.1)' },
    ENVIRONMENT: { bg: '#dcfce7', text: '#166534', light: 'rgba(22,163,74,0.1)' },
    MEDICAL: { bg: '#fce7f3', text: '#9d174d', light: 'rgba(236,72,153,0.1)' },
    COMMUNITY: { bg: '#fef3c7', text: '#92400e', light: 'rgba(245,158,11,0.1)' },
    ANIMAL_CARE: { bg: '#ede9fe', text: '#5b21b6', light: 'rgba(139,92,246,0.1)' },
    OTHER: { bg: '#f1f5f9', text: '#475569', light: 'rgba(100,116,139,0.1)' },
};

export default function DonorDiscoverPage() {
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
    const [followedNgoIds, setFollowedNgoIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchNgos() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const { data: followed } = await supabase.from('follows').select('following_ngo_id').eq('follower_id', session.user.id);
                if (followed) setFollowedNgoIds(new Set(followed.map(f => f.following_ngo_id)));
            }

            let query = supabase.from('ngos').select('id, name, categories, verification_status, logo_url, description').eq('verification_status', 'APPROVED').order('created_at', { ascending: false });
            if (activeCategory !== 'ALL') query = query.contains('categories', [activeCategory]);
            if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);

            const { data } = await query.limit(20);
            const ngosData = (data || []).map(n => ({
                id: n.id, name: n.name, category: n.categories?.[0] || 'Other',
                followers_count: 0, verification_status: n.verification_status,
                logo_url: n.logo_url, description: n.description || '',
            }));

            // Fetch follower counts for these NGOs
            if (ngosData.length > 0) {
                const ngoIds = ngosData.map(n => n.id);
                for (const ngo of ngosData) {
                    const { count } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_ngo_id', ngo.id);
                    ngo.followers_count = count || 0;
                }
            }

            setNgos(ngosData);
            setLoading(false);
        }
        const debounce = setTimeout(fetchNgos, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, activeCategory]);

    const toggleFollow = async (ngoId: string) => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const isFollowing = followedNgoIds.has(ngoId);
        if (isFollowing) {
            await supabase.from('follows').delete().eq('follower_id', session.user.id).eq('following_ngo_id', ngoId);
            setFollowedNgoIds(prev => { const next = new Set(prev); next.delete(ngoId); return next; });
        } else {
            await supabase.from('follows').insert({ follower_id: session.user.id, following_ngo_id: ngoId });
            setFollowedNgoIds(prev => new Set(prev).add(ngoId));
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Discover NGOs
                </h2>
                <p style={{ color: '#64748b', fontSize: 15 }}>
                    Find and support causes that align with your values. Browse verified organizations making a real impact.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 20,
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#94a3b8', fontSize: 22,
                        }}>search</span>
                        <input
                            type="text" placeholder="Search NGOs by name, cause, or location..."
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px 12px 46px',
                                borderRadius: 12, border: '1px solid #e2e8f0',
                                background: '#f8fafc', fontSize: 14, color: '#0f172a',
                                outline: 'none', transition: 'border-color 200ms',
                            }}
                            onFocus={e => e.target.style.borderColor = '#1de2d1'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {categories.map(cat => {
                        const isActive = activeCategory === cat.value;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value as CategoryType)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '8px 16px', borderRadius: 999,
                                    border: isActive ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                                    background: isActive ? 'rgba(29,226,209,0.08)' : '#fff',
                                    color: isActive ? '#0d9488' : '#64748b',
                                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 200ms',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{cat.icon}</span>
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* NGO Grid */}
            {ngos.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: 64,
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #e2e8f0',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>search_off</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 12 }}>No NGOs found</h3>
                    <p style={{ color: '#94a3b8', marginTop: 4, fontSize: 14 }}>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="r-grid-cards" style={{ gap: 20 }}>
                    {ngos.map(ngo => {
                        const cc = catColors[ngo.category] || catColors.OTHER;
                        return (
                            <div key={ngo.id} style={{
                                background: '#fff', borderRadius: 16,
                                border: '1px solid #e2e8f0', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'box-shadow 300ms, transform 300ms',
                                cursor: 'pointer',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {/* Card Header with gradient */}
                                <div style={{
                                    height: 80, position: 'relative',
                                    background: `linear-gradient(135deg, ${cc.bg}, ${cc.light})`,
                                }}>
                                    {/* Category Badge */}
                                    <span style={{
                                        position: 'absolute', top: 12, left: 12,
                                        padding: '4px 10px', borderRadius: 999,
                                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                                        fontSize: 11, fontWeight: 600, color: cc.text,
                                    }}>{ngo.category}</span>
                                    {ngo.verification_status === 'APPROVED' && (
                                        <span style={{
                                            position: 'absolute', top: 12, right: 12,
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '4px 10px', borderRadius: 999,
                                            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                                            fontSize: 11, fontWeight: 600, color: '#059669',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                                            Verified
                                        </span>
                                    )}
                                </div>

                                <div style={{ padding: 20, paddingTop: 0, position: 'relative' }}>
                                    {/* Logo */}
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 14,
                                        background: ngo.logo_url ? `url("${ngo.logo_url}") center/cover` : `linear-gradient(135deg, #1de2d1, #0ea5e9)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: 22, fontWeight: 800,
                                        border: '3px solid #fff', marginTop: -28,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}>
                                        {!ngo.logo_url && ngo.name.charAt(0)}
                                    </div>

                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 12 }}>{ngo.name}</h3>
                                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                                        {ngo.followers_count.toLocaleString()} supporters
                                    </p>
                                    {ngo.description && (
                                        <p style={{
                                            fontSize: 13, color: '#94a3b8', marginTop: 8,
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>{ngo.description}</p>
                                    )}

                                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                        <Link
                                            href={`/donor/donate/${ngo.id}`}
                                            style={{
                                                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                padding: '10px 16px', borderRadius: 10,
                                                background: '#1de2d1', color: '#0f172a',
                                                fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                                transition: 'background 200ms',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>volunteer_activism</span>
                                            Donate
                                        </Link>
                                        <button
                                            onClick={e => { e.preventDefault(); toggleFollow(ngo.id); }}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                                padding: '10px 16px', borderRadius: 10,
                                                border: followedNgoIds.has(ngo.id) ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                                                background: followedNgoIds.has(ngo.id) ? 'rgba(29,226,209,0.08)' : '#fff',
                                                color: followedNgoIds.has(ngo.id) ? '#0d9488' : '#64748b',
                                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                                transition: 'all 200ms',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                                {followedNgoIds.has(ngo.id) ? 'favorite' : 'favorite_border'}
                                            </span>
                                            {followedNgoIds.has(ngo.id) ? 'Following' : 'Follow'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
