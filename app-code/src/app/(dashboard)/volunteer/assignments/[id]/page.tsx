import Link from "next/link";

export default function AssignmentDetailPage() {
    return (
        <div className="px-4 py-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/volunteer/assignments" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Assignment Details</h1>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-lg">Food Distribution</h2>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">IN PROGRESS</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Hope Foundation</p>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-semibold">60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/5 bg-[var(--primary)] rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--primary)]">calendar_today</span>
                    <div>
                        <p className="font-semibold text-sm">Date & Time</p>
                        <p className="text-sm text-gray-500">Today, 2:00 PM - 6:00 PM</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--primary)]">location_on</span>
                    <div>
                        <p className="font-semibold text-sm">Location</p>
                        <p className="text-sm text-gray-500">Community Center, Main Street</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--primary)]">person</span>
                    <div>
                        <p className="font-semibold text-sm">Coordinator</p>
                        <p className="text-sm text-gray-500">Sarah Admin</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm">
                    <span className="material-symbols-outlined">chat</span>
                    Contact NGO
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm">
                    <span className="material-symbols-outlined">check</span>
                    Mark Complete
                </button>
            </div>
        </div>
    );
}
