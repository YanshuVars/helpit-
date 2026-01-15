import Link from "next/link";

export default function IndividualRegisterPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8">
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/register" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">Individual Signup</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Full Name</label>
                    <input type="text" placeholder="Enter your name" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Email Address</label>
                    <input type="email" placeholder="Enter your email" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Phone Number</label>
                    <input type="tel" placeholder="Enter your phone" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Password</label>
                    <input type="password" placeholder="Create a password" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Confirm Password</label>
                    <input type="password" placeholder="Confirm your password" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>

                <button className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl mt-4">
                    Create Account
                </button>
            </div>
        </div>
    );
}
