import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">Login</h2>
                <div className="w-10"></div>
            </div>

            {/* Branding */}
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg mb-6">
                    <span className="material-symbols-outlined text-white text-4xl">volunteer_activism</span>
                </div>
                <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
                <p className="text-[var(--foreground-muted)] text-base pt-2 text-center">
                    Support your community today.
                </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-1 mt-10">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4 text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                    />
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <label className="text-sm font-medium pl-1">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full h-14 rounded-xl border border-[var(--border)] px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                            <span className="material-symbols-outlined">visibility</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end mt-2">
                    <Link href="/forgot-password" className="text-[var(--primary)] text-sm font-semibold hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl mt-8 shadow-lg transition-all active:scale-[0.98]">
                    Login
                </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-[var(--foreground-muted)] text-sm font-medium">Or continue with</span>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-3 border border-[var(--border)] h-14 rounded-xl hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-medium">Continue with Google</span>
                </button>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 pb-4 text-center">
                <p className="text-[var(--foreground-muted)] text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-[var(--primary)] font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
