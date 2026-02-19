"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface Donation {
    id: string;
    amount: number;
    created_at: string;
    status: string;
    ngo: {
        name: string;
        logo_url: string | null;
    };
}

export default function DonationHistoryPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalDonated, setTotalDonated] = useState(0);

    useEffect(() => {
        fetchDonations();
    }, []);

    async function fetchDonations() {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data: donationsData, error } = await supabase
                .from("donations")
                .select(`
                    id,
                    amount,
                    created_at,
                    status,
                    ngo:ngos(name, logo_url)
                `)
                .eq("donor_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (donationsData) {
                // @ts-ignore - supabase types might be slightly off with deep joins if not fully typed
                setDonations(donationsData as Donation[]);

                const total = donationsData.reduce((acc, curr) => {
                    return curr.status === 'COMPLETED' ? acc + curr.amount : acc;
                }, 0);
                setTotalDonated(total);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <PageHeader title="Donation History" showBack fallbackRoute="/donor" />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Donation History" showBack fallbackRoute="/donor" />

            {/* Summary */}
            <div className="bg-[var(--primary)]/10 rounded-xl p-5 border border-[var(--primary)]/20">
                <p className="text-sm text-gray-600 font-medium">Total Donated</p>
                <p className="text-3xl font-bold text-[var(--primary)] mt-1">{formatCurrency(totalDonated)}</p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {donations.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <span className="material-symbols-outlined text-4xl text-gray-300">volunteer_activism</span>
                        <p className="text-gray-500 mt-2">No donations yet.</p>
                        <Link href="/donor/discover" className="text-[var(--primary)] font-semibold mt-2 inline-block">
                            Donate to an NGO
                        </Link>
                    </div>
                ) : (
                    donations.map((donation) => (
                        <Link key={donation.id} href={`/donor/receipts/${donation.id}`} className="block bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center overflow-hidden">
                                        {donation.ngo?.logo_url ? (
                                            <img src={donation.ngo.logo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-[var(--primary)]">volunteer_activism</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{donation.ngo?.name || "Unknown NGO"}</p>
                                        <p className="text-xs text-gray-500">{format(new Date(donation.created_at), "MMM d, yyyy")}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+{formatCurrency(donation.amount)}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${donation.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {donation.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
