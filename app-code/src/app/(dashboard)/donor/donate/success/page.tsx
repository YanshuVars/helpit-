import Link from "next/link";

export default function DonateSuccessPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
            {/* Success Animation */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
            </div>

            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-6">Your donation of <span className="font-bold text-[var(--primary)]">₹1,000</span> to Hope Foundation was successful.</p>

            {/* Details Card */}
            <div className="w-full bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Transaction ID</span>
                    <span className="text-sm font-medium">TXN123456789</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="text-sm font-medium">Jan 13, 2026</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">NGO</span>
                    <span className="text-sm font-medium">Hope Foundation</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
                <Link href="/donor/receipts/1" className="w-full py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] font-semibold text-center">
                    Download Receipt
                </Link>
                <Link href="/donor" className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl text-center">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
