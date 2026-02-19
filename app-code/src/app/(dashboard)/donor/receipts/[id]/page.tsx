"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Use useParams for Client Component
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface DonationReceipt {
    id: string;
    amount: number;
    created_at: string;
    payment_method: string;
    receipt_number: string | null;
    payment_id: string | null; // Transaction ID
    ngo: {
        name: string;
        pan_number: string | null;
        logo_url: string | null;
    };
}

export default function DonationReceiptPage() {
    const params = useParams();
    const id = params?.id as string;

    const [donation, setDonation] = useState<DonationReceipt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDonation();
        }
    }, [id]);

    async function fetchDonation() {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("donations")
                .select(`
                    id,
                    amount,
                    created_at,
                    payment_method,
                    receipt_number,
                    payment_id,
                    ngo:ngos(name, pan_number, logo_url)
                `)
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data) {
                // @ts-ignore
                setDonation(data as DonationReceipt);
            }
        } catch (error) {
            console.error("Error fetching donation:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="p-8 text-center">
                <p>Receipt not found.</p>
                <Link href="/donor/history" className="text-[var(--primary)] underline">Back to history</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/donor/history" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Donation Receipt</h1>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-[var(--primary)] text-white p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-3 flex items-center justify-center overflow-hidden">
                        {donation.ngo?.logo_url ? (
                            <img src={donation.ngo.logo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                        )}
                    </div>
                    <p className="text-sm opacity-90 font-medium">Helpit Donation Receipt</p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                    <div className="text-center pb-6 border-b border-gray-100">
                        <p className="text-4xl font-bold text-gray-900">{formatCurrency(donation.amount)}</p>
                        <p className="text-sm text-gray-500 mt-1">Donated on {format(new Date(donation.created_at), "MMMM d, yyyy")}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Receipt No.</span>
                            <span className="text-sm font-semibold text-gray-900">{donation.receipt_number || "PENDING"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Transaction ID</span>
                            <span className="text-sm font-semibold text-gray-900">{donation.payment_id || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">NGO</span>
                            <span className="text-sm font-semibold text-gray-900">{donation.ngo?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Payment Method</span>
                            <span className="text-sm font-semibold text-gray-900">{donation.payment_method || "Online"}</span>
                        </div>
                        {donation.ngo?.pan_number && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">80G (PAN)</span>
                                <span className="text-sm font-semibold text-gray-900">{donation.ngo.pan_number}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">This receipt is valid for tax deduction under Section 80G of the Income Tax Act.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-semibold text-sm hover:bg-gray-50 bg-white">
                    <span className="material-symbols-outlined">share</span>
                    Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary)]/90 shadow-sm shadow-[var(--primary)]/30">
                    <span className="material-symbols-outlined">download</span>
                    Download PDF
                </button>
            </div>
        </div>
    );
}
