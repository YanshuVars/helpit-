import Link from "next/link";

export default function DonatePaymentPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/donor/donate/details" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Payment</h1>
            </div>

            {/* Amount Summary */}
            <div className="bg-[var(--primary)]/10 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-[var(--primary)]">₹1,000</p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
                <p className="text-sm font-medium">Select Payment Method</p>

                <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-[var(--primary)]">
                    <input type="radio" name="payment" defaultChecked className="accent-[var(--primary)]" />
                    <span className="material-symbols-outlined text-green-600">account_balance</span>
                    <span className="font-semibold">UPI</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-[var(--primary)]">
                    <input type="radio" name="payment" className="accent-[var(--primary)]" />
                    <span className="material-symbols-outlined text-blue-600">credit_card</span>
                    <span className="font-semibold">Credit/Debit Card</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-[var(--primary)]">
                    <input type="radio" name="payment" className="accent-[var(--primary)]" />
                    <span className="material-symbols-outlined text-purple-600">account_balance_wallet</span>
                    <span className="font-semibold">Net Banking</span>
                </label>
            </div>

            {/* Pay Button */}
            <Link
                href="/donor/donate/success"
                className="block w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-center shadow-lg"
            >
                Pay ₹1,000
            </Link>

            <p className="text-xs text-center text-gray-400">
                Secured by Razorpay. 100% of your donation goes to the NGO.
            </p>
        </div>
    );
}
