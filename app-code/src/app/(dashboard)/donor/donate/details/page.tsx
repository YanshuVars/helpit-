import Link from "next/link";

export default function DonateDetailsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/donor/donate" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Your Details</h1>
            </div>

            {/* Summary Card */}
            <div className="bg-[var(--primary)]/10 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Donating to</p>
                        <p className="font-bold">Hope Foundation</p>
                    </div>
                    <p className="text-2xl font-bold text-[var(--primary)]">₹1,000</p>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <input type="text" placeholder="Enter your name" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Email *</label>
                    <input type="email" placeholder="your@email.com" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input type="tel" placeholder="+91 98765 43210" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">PAN Number (for 80G tax benefit)</label>
                    <input type="text" placeholder="ABCDE1234F" className="w-full h-12 rounded-xl border border-gray-200 px-4 uppercase" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Message to NGO (optional)</label>
                    <textarea placeholder="Your message..." rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none" />
                </div>

                {/* Anonymous */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded accent-[var(--primary)]" />
                    <div>
                        <p className="font-semibold text-sm">Make donation anonymous</p>
                        <p className="text-xs text-gray-500">Your name won&apos;t be visible to the NGO</p>
                    </div>
                </label>
            </div>

            {/* Continue Button */}
            <Link
                href="/donor/donate/payment"
                className="block w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-center shadow-lg"
            >
                Proceed to Payment
            </Link>
        </div>
    );
}
