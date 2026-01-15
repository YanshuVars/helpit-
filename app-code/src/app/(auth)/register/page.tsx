import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">Sign Up</h2>
                <div className="w-10"></div>
            </div>

            {/* Branding */}
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg mb-6">
                    <span className="material-symbols-outlined text-white text-4xl">volunteer_activism</span>
                </div>
                <h1 className="text-3xl font-bold text-center">Choose Your Role</h1>
                <p className="text-[var(--foreground-muted)] text-base pt-2 text-center">
                    How would you like to contribute?
                </p>
            </div>

            {/* Role Cards */}
            <div className="flex flex-col gap-4 mt-10">
                <Link href="/register/individual" className="flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-blue-50/50 transition-all group">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[var(--primary)] text-2xl">person</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Individual / Donor</h3>
                        <p className="text-[var(--foreground-muted)] text-sm">Discover NGOs and make donations</p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--foreground-muted)] group-hover:text-[var(--primary)]">chevron_right</span>
                </Link>

                <Link href="/register/volunteer" className="flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-blue-50/50 transition-all group">
                    <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-green-600 text-2xl">volunteer_activism</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Volunteer</h3>
                        <p className="text-[var(--foreground-muted)] text-sm">Find opportunities and help NGOs</p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--foreground-muted)] group-hover:text-[var(--primary)]">chevron_right</span>
                </Link>

                <Link href="/register/ngo" className="flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-blue-50/50 transition-all group">
                    <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-orange-600 text-2xl">business</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">NGO / Organization</h3>
                        <p className="text-[var(--foreground-muted)] text-sm">Manage your organization and volunteers</p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--foreground-muted)] group-hover:text-[var(--primary)]">chevron_right</span>
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 pb-4 text-center">
                <p className="text-[var(--foreground-muted)] text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[var(--primary)] font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
