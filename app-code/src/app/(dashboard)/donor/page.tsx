'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow, formatCurrency } from '@/lib/utils';

interface DonorDashboardData {
    user: {
        id: string;
        full_name: string;
    } | null;
    stats: {
        totalDonated: number;
        impactCount: number;
    };
    followedNgos: Array<{
        id: string;
        name: string;
        logo_url: string | null;
    }>;
    recentDonations: Array<{
        id: string;
        amount: number;
        ngo_name: string;
        status: string;
        created_at: string;
    }>;
}

export default function DonorDashboardPage() {
    const [data, setData] = useState<DonorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            const supabase = createClient();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            const { data: userData } = await supabase
                .from('users')
                .select('id, full_name')
                .eq('id', session.user.id)
                .single();

            if (!userData) {
                setLoading(false);
                return;
            }

            // Get donor profile for stats
            const { data: donorProfile } = await supabase
                .from('donor_profiles')
                .select('total_donated, impact_count')
                .eq('user_id', session.user.id)
                .single();

            // Get followed NGOs
            const { data: followedNgos } = await supabase
                .from('ngo_followers')
                .select('ngo:ngos(id, name, logo_url)')
                .eq('user_id', session.user.id)
                .limit(5);

            const ngos = (followedNgos || []).map(f => ({
                id: (f.ngo as unknown as { id: string })?.id,
                name: (f.ngo as unknown as { name: string })?.name || 'Unknown',
                logo_url: (f.ngo as unknown as { logo_url: string })?.logo_url,
            }));

            // Get recent donations
            const { data: donations } = await supabase
                .from('donations')
                .select('id, amount, status, created_at, ngo:ngos(name)')
                .eq('donor_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            const recentDonations = (donations || []).map(d => ({
                id: d.id,
                amount: d.amount,
                ngo_name: (d.ngo as unknown as { name: string })?.name || 'Unknown NGO',
                status: d.status,
                created_at: d.created_at,
            }));

            const totalDonated = donorProfile?.total_donated || 0;
            const impactCount = donorProfile?.impact_count || 0;

            setData({
                user: {
                    id: userData.id,
                    full_name: userData.full_name || 'Donor',
                },
                stats: {
                    totalDonated,
                    impactCount,
                },
                followedNgos: ngos,
                recentDonations,
            });
            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    if (!data?.user) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">favorite</span>
                <h2 className="text-xl font-bold mb-2">Welcome, Donor!</h2>
                <p className="text-gray-500 mb-4">Complete your profile to start donating.</p>
                <Link href="/register/individual" className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold">
                    Complete Profile
                </Link>
            </div>
        );
    }

    const firstName = data.user.full_name.split(' ')[0] || 'Donor';

    return (
        <div className="flex flex-col">
            {/* Hero Zone: Welcome Greeting */}
            <section className="section-spacing">
                <h2 className="text-[24px] font-bold">Hi, {firstName}! 👋</h2>
                <p className="text-[15px] text-gray-500 mt-1">Your contributions are making a difference.</p>
            </section>

            {/* Impact Stats */}
            <section className="section-spacing">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-[var(--primary)]">
                            <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                            <p className="text-[14px] font-medium">Donated</p>
                        </div>
                        <p className="text-[26px] font-bold leading-tight">{formatCurrency(data.stats.totalDonated)}</p>
                        <Link href="/donor/history" className="text-[var(--success)] text-[12px] font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            View history
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-orange-500">
                            <span className="material-symbols-outlined text-lg">groups</span>
                            <p className="text-[14px] font-medium">Impacted</p>
                        </div>
                        <p className="text-[26px] font-bold leading-tight">{data.stats.impactCount}</p>
                        <p className="text-gray-500 text-[12px] font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            Lives helped
                        </p>
                    </div>
                </div>
            </section>

            {/* Followed NGOs */}
            <section className="section-spacing full-bleed">
                <div className="flex justify-between items-center section-header">
                    <h3 className="text-[18px] font-bold tracking-tight">Followed NGOs</h3>
                    <Link href="/donor/discover" className="text-[var(--primary)] text-[14px] font-semibold">See all</Link>
                </div>
                <div className="flex overflow-x-auto gap-4 hide-scrollbar -mr-5 pr-5">
                    {data.followedNgos.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <Link href="/donor/discover" className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined">add</span>
                            </Link>
                            <span className="text-[12px] font-medium text-center truncate w-16">Discover</span>
                        </div>
                    ) : (
                        <>
                            {data.followedNgos.map(ngo => (
                                <Link key={ngo.id} href={`/donor/discover/${ngo.id}`} className="flex flex-col items-center gap-2 shrink-0">
                                    <div className="w-16 h-16 rounded-full border-2 border-[var(--primary)] p-0.5">
                                        <div
                                            className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full"
                                            style={{ backgroundImage: ngo.logo_url ? `url("${ngo.logo_url}")` : 'url("https://via.placeholder.com/64")' }}
                                        ></div>
                                    </div>
                                    <span className="text-[12px] font-medium text-center truncate w-16">{ngo.name}</span>
                                </Link>
                            ))}
                            <Link href="/donor/discover" className="flex flex-col items-center gap-2 shrink-0">
                                <button className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                <span className="text-[12px] font-medium text-center truncate w-16">Discover</span>
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Recent Activity */}
            <section>
                <h3 className="text-[18px] font-bold tracking-tight section-header">Recent Activity</h3>

                {data.recentDonations.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                        <p className="text-gray-500">No recent donations</p>
                        <Link href="/donor/discover" className="mt-4 inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold">
                            Discover NGOs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                        {data.recentDonations.map(donation => (
                            <div key={donation.id} className="relative pl-14">
                                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-white z-10"></div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-[14px]">
                                            {donation.status === 'COMPLETED' ? 'Donation Confirmed' : 'Donation Pending'}
                                        </h4>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {formatDistanceToNow(donation.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-gray-600">
                                        Your donation of <span className="font-semibold text-[var(--primary)]">{formatCurrency(donation.amount)}</span> to <span className="font-semibold">{donation.ngo_name}</span>.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
