'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface VolunteerAssignment {
    id: string;
    status: string;
    hours_spent: number;
    request: {
        id: string;
        title: string;
        ngo: {
            name: string;
        };
    };
}

interface VolunteerDashboardData {
    user: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        is_available: boolean;
    } | null;
    stats: {
        hoursContributed: number;
        tasksCompleted: number;
        ngosSupported: number;
    };
    assignments: VolunteerAssignment[];
    nearbyRequests: Array<{
        id: string;
        title: string;
        urgency: string;
        ngo_name: string;
        location: string;
        image_url: string | null;
    }>;
}

export default function VolunteerDashboardPage() {
    const [data, setData] = useState<VolunteerDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState(false);

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
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (!userData) {
                setLoading(false);
                return;
            }

            setAvailability(userData.is_available || false);

            const { data: assignments } = await supabase
                .from('volunteer_assignments')
                .select('id, status, hours_spent, request_id')
                .eq('volunteer_id', session.user.id);

            // Get request details
            const requestIds = (assignments || []).map(a => a.request_id).filter(Boolean);
            let requestsData: Record<string, { title: string; ngo_name: string }> = {};

            if (requestIds.length > 0) {
                const { data: requests } = await supabase
                    .from('requests')
                    .select('id, title, ngo:ngos(name)')
                    .in('id', requestIds);

                (requests || []).forEach(r => {
                    requestsData[r.id] = {
                        title: r.title,
                        ngo_name: (r.ngo as unknown as { name: string })?.name || 'Unknown NGO',
                    };
                });
            }

            const completedAssignments = (assignments || []).filter(a => a.status === 'COMPLETED');
            const activeAssignments = (assignments || []).filter(a => a.status === 'ACTIVE');

            const hoursContributed = completedAssignments.reduce((sum, a) => sum + (a.hours_spent || 0), 0);
            const tasksCompleted = completedAssignments.length;

            const { data: memberships } = await supabase
                .from('ngo_members')
                .select('ngo_id')
                .eq('user_id', session.user.id);

            const ngosSupported = memberships?.length || 0;

            const { data: urgentRequests } = await supabase
                .from('requests')
                .select('id, title, urgency, image_url, ngo:ngos(name), city')
                .eq('status', 'ACTIVE')
                .eq('urgency', 'HIGH')
                .limit(5);

            const nearbyRequests = (urgentRequests || []).map(r => ({
                id: r.id,
                title: r.title,
                urgency: r.urgency,
                ngo_name: (r.ngo as unknown as { name: string })?.name || 'Unknown NGO',
                location: r.city || 'Location TBD',
                image_url: r.image_url,
            }));

            setData({
                user: {
                    id: userData.id,
                    full_name: userData.full_name || 'Volunteer',
                    avatar_url: userData.avatar_url,
                    is_available: userData.is_available || false,
                },
                stats: {
                    hoursContributed,
                    tasksCompleted,
                    ngosSupported,
                },
                assignments: activeAssignments.slice(0, 3).map(a => {
                    const requestInfo = requestsData[a.request_id] || { title: 'Unknown Request', ngo_name: 'Unknown NGO' };
                    return {
                        id: a.id,
                        request: {
                            id: a.request_id,
                            title: requestInfo.title,
                            ngo: {
                                name: requestInfo.ngo_name,
                            },
                            status: a.status,
                        },
                        status: a.status,
                        hours_spent: a.hours_spent || 0,
                    };
                }),
                nearbyRequests,
            });
            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    const toggleAvailability = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const newAvailability = !availability;
        setAvailability(newAvailability);

        await supabase
            .from('users')
            .update({ is_available: newAvailability })
            .eq('id', session.user.id);
    };

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
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">volunteer_activism</span>
                <h2 className="text-xl font-bold mb-2">Welcome, Volunteer!</h2>
                <p className="text-gray-500 mb-4">Complete your profile to start volunteering.</p>
                <Link href="/register/volunteer" className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold">
                    Complete Profile
                </Link>
            </div>
        );
    }

    const firstName = data.user.full_name.split(' ')[0] || 'Volunteer';

    return (
        <div className="flex flex-col">
            {/* Hero: Profile Greeting */}
            <section className="section-spacing">
                <div className="flex gap-4 items-center">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-white shadow-md"
                        style={{ backgroundImage: data.user.avatar_url ? `url("${data.user.avatar_url}")` : 'url("https://via.placeholder.com/64")' }}
                    ></div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[22px] font-bold leading-tight tracking-[-0.02em]">Hello, {firstName}</p>
                        <p className="text-[#616e89] text-[15px] font-normal mt-1">Ready to make an impact today?</p>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="section-spacing">
                <div className="flex gap-3">
                    <div className="flex-1 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 min-h-[120px] bg-white shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[var(--primary)] w-6 h-6 shrink-0 text-[22px]">schedule</span>
                        <div>
                            <p className="text-[#616e89] text-[11px] font-semibold uppercase tracking-wider mb-1">Hours</p>
                            <p className="text-[26px] font-bold tracking-tight leading-none">{data.stats.hoursContributed}</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 min-h-[120px] bg-white shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[var(--primary)] w-6 h-6 shrink-0 text-[22px]">task_alt</span>
                        <div>
                            <p className="text-[#616e89] text-[11px] font-semibold uppercase tracking-wider mb-1">Tasks</p>
                            <p className="text-[26px] font-bold tracking-tight leading-none">{data.stats.tasksCompleted}</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 min-h-[120px] bg-white shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[var(--primary)] w-6 h-6 shrink-0 text-[22px]">volunteer_activism</span>
                        <div>
                            <p className="text-[#616e89] text-[11px] font-semibold uppercase tracking-wider mb-1">NGOs</p>
                            <p className="text-[26px] font-bold tracking-tight leading-none">{data.stats.ngosSupported}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Availability Toggle */}
            <section className="section-spacing">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-[16px]">Available to help now?</p>
                        <p className="text-[13px] text-[#616e89]">Coordinators can ping you for urgent tasks</p>
                    </div>
                    <button
                        onClick={toggleAvailability}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${availability ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
                    >
                        <span className={`translate-x-5 pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${availability ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                </div>
            </section>

            {/* Active Assignments */}
            {data.assignments.length > 0 && (
                <section className="full-bleed mb-6">
                    <div className="flex items-center justify-between section-header">
                        <h2 className="text-[18px] font-bold leading-tight tracking-[-0.015em]">Your Active Tasks</h2>
                        <Link href="/volunteer/assignments" className="text-[var(--primary)] text-[14px] font-semibold">See All</Link>
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        {data.assignments.map(assignment => (
                            <Link
                                key={assignment.id}
                                href={`/volunteer/assignments/${assignment.id}`}
                                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
                            >
                                <div>
                                    <p className="font-semibold">{assignment.request.title}</p>
                                    <p className="text-sm text-gray-500">{assignment.request.ngo.name}</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Nearby Urgent Requests */}
            <section className="full-bleed">
                <div className="flex items-center justify-between section-header">
                    <h2 className="text-[18px] font-bold leading-tight tracking-[-0.015em]">Nearby Urgent Requests</h2>
                    <Link href="/volunteer/opportunities" className="text-[var(--primary)] text-[14px] font-semibold">See All</Link>
                </div>

                {data.nearbyRequests.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">search_off</span>
                        <p className="text-gray-500">No urgent requests nearby</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory -mr-5 pr-5">
                        <div className="flex items-stretch gap-4">
                            {data.nearbyRequests.map(request => (
                                <div
                                    key={request.id}
                                    className="snap-start flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 w-[85vw] max-w-[320px] overflow-hidden"
                                >
                                    <div className="relative w-full h-[170px] overflow-hidden">
                                        {request.urgency === 'HIGH' && (
                                            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">bolt</span> URGENT
                                            </div>
                                        )}
                                        <div
                                            className="w-full h-full bg-center bg-no-repeat bg-cover"
                                            style={{ backgroundImage: request.image_url ? `url("${request.image_url}")` : 'url("https://via.placeholder.com/320x170")' }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-col gap-3 p-4">
                                        <div>
                                            <p className="text-[16px] font-bold leading-tight">{request.title}</p>
                                            <div className="flex items-center gap-1.5 mt-2 text-[#616e89]">
                                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                <span className="text-[13px]">{request.location} • {request.ngo_name}</span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/volunteer/opportunities"
                                            className="w-full py-3 rounded-xl bg-[var(--primary)] text-white text-[14px] font-bold text-center hover:bg-[var(--primary-hover)] transition-colors"
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
