import { PageHeader } from "@/components/ui/PageHeader";

export default function NGODonationsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Donations" showBack fallbackRoute="/ngo" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Total Received</p>
                    <p className="text-2xl font-bold mt-2">₹1,24,500</p>
                </div>
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">This Month</p>
                    <p className="text-2xl font-bold mt-2">₹12,400</p>
                </div>
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Donors</p>
                    <p className="text-2xl font-bold mt-2">48</p>
                </div>
                <div className="bg-white rounded-xl p-5 min-h-[100px] border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Avg Donation</p>
                    <p className="text-2xl font-bold mt-2">₹2,594</p>
                </div>
            </div>

            {/* Recent Donations */}
            <div>
                <h2 className="font-bold mb-4">Recent Donations</h2>
                <div className="flex flex-col gap-4">
                    {[
                        { name: "Anonymous", amount: 5000, date: "2h ago", method: "UPI" },
                        { name: "Rajesh Kumar", amount: 2500, date: "1d ago", method: "Card" },
                        { name: "Priya Sharma", amount: 10000, date: "3d ago", method: "Bank Transfer" },
                    ].map((donation, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-green-600">payments</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{donation.name}</p>
                                <p className="text-xs text-gray-500">{donation.method} • {donation.date}</p>
                            </div>
                            <p className="font-bold text-green-600 shrink-0">+₹{donation.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

