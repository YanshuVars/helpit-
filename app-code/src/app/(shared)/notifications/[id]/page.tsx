import Link from "next/link";

export default function NotificationDetailPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Link href="/notifications" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Notification</h1>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-3xl">payments</span>
                </div>
                <h2 className="text-lg font-bold mb-2">Donation Received</h2>
                <p className="text-gray-600 text-sm mb-4">You received a donation of <span className="font-bold">₹500</span> from an anonymous donor.</p>
                <p className="text-xs text-gray-400">Received 2 minutes ago</p>
            </div>

            <Link href="/ngo/donations" className="block w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-center">
                View All Donations
            </Link>
        </div>
    );
}

