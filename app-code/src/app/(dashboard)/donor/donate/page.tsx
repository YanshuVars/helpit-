"use client";

import Link from "next/link";
import { useState } from "react";

export default function DonatePage() {
    const [amount, setAmount] = useState<number | null>(1000);
    const [customAmount, setCustomAmount] = useState("");

    const presetAmounts = [500, 1000, 2500, 5000, 10000];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/donor" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Make a Donation</h1>
            </div>

            {/* Select NGO */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-medium mb-3">Select an NGO to donate to:</p>
                <select className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white">
                    <option value="">Choose an NGO</option>
                    <option value="n1">Hope Foundation</option>
                    <option value="n2">GreenEarth</option>
                    <option value="n3">EduChild</option>
                </select>
            </div>

            {/* Amount Selection */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-medium mb-3">Select Amount</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {presetAmounts.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => { setAmount(preset); setCustomAmount(""); }}
                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${amount === preset
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                    : "bg-white border-gray-200 hover:border-[var(--primary)]"
                                }`}
                        >
                            ₹{preset.toLocaleString()}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                    <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
                        className="w-full h-12 rounded-xl border border-gray-200 pl-8 pr-4"
                    />
                </div>
            </div>

            {/* Monthly Toggle */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                <div>
                    <p className="font-semibold text-sm">Make it monthly</p>
                    <p className="text-xs text-gray-500">Support consistently for more impact</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200">
                    <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition"></span>
                </div>
            </div>

            {/* Continue Button */}
            <Link
                href={`/donor/donate/details`}
                className="block w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-center shadow-lg"
            >
                Continue • ₹{(amount || parseInt(customAmount) || 0).toLocaleString()}
            </Link>
        </div>
    );
}
