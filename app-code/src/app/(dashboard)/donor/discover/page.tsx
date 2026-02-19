'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from "@/components/ui/PageHeader";

interface NGO {
    id: string;
    name: string;
    category: string;
    followers_count: number;
    verification_status: string;
    logo_url: string | null;
}

type CategoryType = 'ALL' | 'EDUCATION' | 'ENVIRONMENT' | 'MEDICAL' | 'COMMUNITY' | 'ANIMAL_CARE' | 'OTHER';

const categories = [
    { label: 'All', value: 'ALL' },
    { label: 'Education', value: 'EDUCATION' },
    { label: 'Environment', value: 'ENVIRONMENT' },
    { label: 'Healthcare', value: 'MEDICAL' },
    { label: 'Community', value: 'COMMUNITY' },
    { label: 'Animals', value: 'ANIMAL_CARE' },
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

            // Get current user
            const { data: { session } } = await supabase.auth.getSession();

            // Get followed NGO IDs
            if (session) {
                const { data: followed } = await supabase
                    .from('ngo_followers')
                    .select('ngo_id')
                    .eq('user_id', session.user.id);

                if (followed) {
                    setFollowedNgoIds(new Set(followed.map(f => f.ngo_id)));
                }
            }

            // Get NGOs
            let query = supabase
                .from('ngos')
                .select('id, name, categories, followers_count, verification_status, logo_url')
                .eq('status', 'ACTIVE')
                .order('followers_count', { ascending: false });

            if (activeCategory !== 'ALL') {
                query = query.contains('categories', [activeCategory]);
            }

            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`);
            }

            const { data } = await query.limit(20);

            const ngosData = (data || []).map(n => ({
                id: n.id,
                name: n.name,
                category: n.categories?.[0] || 'Other',
                followers_count: n.followers_count || 0,
                verification_status: n.verification_status,
                logo_url: n.logo_url,
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

        if (!session) {
            // Redirect to login
            return;
        }

        const isFollowing = followedNgoIds.has(ngoId);

        if (isFollowing) {
            await supabase
                .from('ngo_followers')
                .delete()
                .eq('user_id', session.user.id)
                .eq('ngo_id', ngoId);

            setFollowedNgoIds(prev => {
                const next = new Set(prev);
                next.delete(ngoId);
                return next;
            });
        } else {
            await supabase
                .from('ngo_followers')
                .insert({ user_id: session.user.id, ngo_id: ngoId });

            setFollowedNgoIds(prev => new Set(prev).add(ngoId));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Discover NGOs" showBack fallbackRoute="/donor" />

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                    type="text"
                    placeholder="Search NGOs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 pl-10 pr-4"
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {categories.map((cat, i) => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value as CategoryType)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap min-h-[44px] ${activeCategory === cat.value ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* NGO List */}
            {ngos.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">search_off</span>
                    <p className="text-gray-500">No NGOs found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {ngos.map((ngo) => (
                        <Link key={ngo.id} href={`/donor/donate/${ngo.id}`} className="block bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-xl font-bold shrink-0"
                                    style={{ backgroundImage: ngo.logo_url ? `url("${ngo.logo_url}")` : undefined, backgroundSize: 'cover' }}
                                >
                                    {!ngo.logo_url && ngo.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold truncate">{ngo.name}</h3>
                                        {ngo.verification_status === 'VERIFIED' && <span className="material-symbols-outlined text-[var(--primary)] text-sm shrink-0">verified</span>}
                                    </div>
                                    <p className="text-xs text-gray-500">{ngo.category} • {ngo.followers_count.toLocaleString()} followers</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFollow(ngo.id);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] shrink-0 ${followedNgoIds.has(ngo.id) ? 'bg-gray-100 text-gray-600' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}
                                >
                                    {followedNgoIds.has(ngo.id) ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
