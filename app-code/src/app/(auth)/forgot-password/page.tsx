import Link from "next/link";

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8">
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/login" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">Reset Password</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col items-center justify-center mt-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[var(--primary)] text-4xl">lock_reset</span>
                </div>
                <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
                <p className="text-[var(--foreground-muted)] text-sm pt-2 text-center max-w-xs">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            <div className="flex flex-col gap-4 mt-10">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Email Address</label>
                    <input type="email" placeholder="Enter your email" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <button className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl mt-4">
                    Send Reset Link
                </button>
            </div>

            <div className="mt-auto pt-8 pb-4 text-center">
                <Link href="/login" className="text-[var(--primary)] text-sm font-semibold">
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
