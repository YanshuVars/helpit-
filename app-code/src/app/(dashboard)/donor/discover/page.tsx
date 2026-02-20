'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface NGO {
    id: string; name: string; category: string;
    followers_count: number; verification_status: string; logo_url: string | null;
}

type CategoryType = 'ALL' | 'EDUCATION' | 'ENVIRONMENT' | 'MEDICAL' | 'COMMUNITY' | 'ANIMAL_CARE' | 'OTHER';

const categories = [
    { label: 'All', value: 'ALL' }, { label: 'Education', value: 'EDUCATION' },
    { label: 'Environment', value: 'ENVIRONMENT' }, { label: 'Healthcare', value: 'MEDICAL' },
    { label: 'Community', value: 'COMMUNITY' }, { label: 'Animals', value: 'ANIMAL_CARE' },
];

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
                const { data: followed } = await supabase.from('ngo_followers').select('ngo_id').eq('user_id', session.user.id);
                if (followed) setFollowedNgoIds(new Set(followed.map(f => f.ngo_id)));
            }

            let query = supabase.from('ngos').select('id, name, categories, followers_count, verification_status, logo_url').eq('status', 'ACTIVE').order('followers_count', { ascending: false });
            if (activeCategory !== 'ALL') query = query.contains('categories', [activeCategory]);
            if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);

            const { data } = await query.limit(20);
            const ngosData = (data || []).map(n => ({
                id: n.id, name: n.name, category: n.categories?.[0] || 'Other',
                followers_count: n.followers_count || 0, verification_status: n.verification_status, logo_url: n.logo_url,
            }));
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
            await supabase.from('ngo_followers').delete().eq('user_id', session.user.id).eq('ngo_id', ngoId);
            setFollowedNgoIds(prev => { const next = new Set(prev); next.delete(ngoId); return next; });
        } else {
            await supabase.from('ngo_followers').insert({ user_id: session.user.id, ngo_id: ngoId });
            setFollowedNgoIds(prev => new Set(prev).add(ngoId));
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Link href="/donor" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Discover NGOs</h1>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-disabled)', fontSize: 20 }}>search</span>
                <input type="text" placeholder="Search NGOs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="field-input" style={{ paddingLeft: 38 }} />
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                {categories.map(cat => (
                    <button key={cat.value} onClick={() => setActiveCategory(cat.value as CategoryType)}
                        className={activeCategory === cat.value ? "tab-pill tab-pill-active" : "tab-pill"}
                        style={{ whiteSpace: 'nowrap' }}
                    >{cat.label}</button>
                ))}
            </div>

            {/* NGO List */}
            {ngos.length === 0 ? (
                <div className="empty-state-container">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-text-disabled)' }}>search_off</span>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>No NGOs found</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ngos.map(ngo => (
                        <Link key={ngo.id} href={`/donor/donate/${ngo.id}`} className="card-interactive" style={{ padding: 14, textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                    background: ngo.logo_url ? `url("${ngo.logo_url}") center/cover` : 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700,
                                }}>
                                    {!ngo.logo_url && ngo.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ngo.name}</span>
                                        {ngo.verification_status === 'VERIFIED' && <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 14, flexShrink: 0 }}>verified</span>}
                                    </div>
                                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{ngo.category} • {ngo.followers_count.toLocaleString()} followers</p>
                                </div>
                                <button
                                    onClick={e => { e.preventDefault(); toggleFollow(ngo.id); }}
                                    className={followedNgoIds.has(ngo.id) ? "btn btn-secondary" : "btn btn-primary"}
                                    style={{ fontSize: 12, padding: '6px 14px', minHeight: 0, flexShrink: 0 }}
                                >{followedNgoIds.has(ngo.id) ? 'Following' : 'Follow'}</button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
