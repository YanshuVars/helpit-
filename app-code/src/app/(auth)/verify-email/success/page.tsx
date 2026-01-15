import Link from "next/link";

export default function VerifyEmailSuccessPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8 items-center justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-green-600 text-5xl">verified</span>
            </div>
            <h1 className="text-2xl font-bold text-center">Email Verified!</h1>
            <p className="text-[var(--foreground-muted)] text-sm pt-2 text-center max-w-xs">
                Your email has been successfully verified. You can now access all features.
            </p>

            <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
                <Link href="/login" className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl text-center">
                    Continue to Login
                </Link>
            </div>
        </div>
    );
}
