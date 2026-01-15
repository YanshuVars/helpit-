import Link from "next/link";

export default function DonationReceiptPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/donor/history" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Donation Receipt</h1>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[var(--primary)] text-white p-4 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                    </div>
                    <p className="text-sm opacity-80">Helpit Donation Receipt</p>
                </div>

                {/* Details */}
                <div className="p-4 space-y-4">
                    <div className="text-center pb-4 border-b">
                        <p className="text-3xl font-bold">₹1,000</p>
                        <p className="text-sm text-gray-500">Donated on Jan 13, 2026</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Receipt No.</span>
                            <span className="text-sm font-medium">HLP-2026-001234</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Transaction ID</span>
                            <span className="text-sm font-medium">TXN123456789</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">NGO</span>
                            <span className="text-sm font-medium">Hope Foundation</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Payment Method</span>
                            <span className="text-sm font-medium">UPI</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">80G Number</span>
                            <span className="text-sm font-medium">DEL/AA3/0001/2020</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t text-center">
                        <p className="text-xs text-gray-400">This receipt is valid for tax deduction under Section 80G of the Income Tax Act.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-semibold text-sm">
                    <span className="material-symbols-outlined">share</span>
                    Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm">
                    <span className="material-symbols-outlined">download</span>
                    Download PDF
                </button>
            </div>
        </div>
    );
}
