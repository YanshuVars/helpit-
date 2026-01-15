import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DonationHistoryPage() {
    const donations = [
        { id: "d1", ngo: "Hope Foundation", amount: 1000, date: "Jan 13, 2026", status: "COMPLETED" },
        { id: "d2", ngo: "GreenEarth", amount: 500, date: "Dec 15, 2025", status: "COMPLETED" },
        { id: "d3", ngo: "EduChild", amount: 2500, date: "Nov 20, 2025", status: "COMPLETED" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Donation History" showBack fallbackRoute="/donor" />

            {/* Summary */}
            <div className="bg-[var(--primary)]/10 rounded-xl p-5">
                <p className="text-sm text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-[var(--primary)]">₹12,500</p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {donations.map((donation) => (
                    <Link key={donation.id} href={`/donor/receipts/${donation.id}`} className="block bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[var(--primary)]">volunteer_activism</span>
                                </div>
                                <div>
                                    <p className="font-semibold">{donation.ngo}</p>
                                    <p className="text-xs text-gray-500">{donation.date}</p>
                                </div>
                            </div>
                            <p className="font-bold text-green-600">+₹{donation.amount.toLocaleString()}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

