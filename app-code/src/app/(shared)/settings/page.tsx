import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold">Settings</h1>

            {/* Profile Section */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                        A
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg">Alex Johnson</p>
                        <p className="text-sm text-gray-500">alex@email.com</p>
                    </div>
                    <button className="text-[var(--primary)] text-sm font-semibold">Edit</button>
                </div>
            </div>

            {/* Settings Items */}
            <div className="space-y-3">
                <Link href="/notifications/settings" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <span className="material-symbols-outlined text-gray-600">notifications</span>
                    <span className="flex-1 font-medium">Notifications</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>

                <Link href="/settings/privacy" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <span className="material-symbols-outlined text-gray-600">lock</span>
                    <span className="flex-1 font-medium">Privacy & Security</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>

                <Link href="/settings/help" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <span className="material-symbols-outlined text-gray-600">help</span>
                    <span className="flex-1 font-medium">Help & Support</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>

                <Link href="/settings/about" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <span className="material-symbols-outlined text-gray-600">info</span>
                    <span className="flex-1 font-medium">About Helpit</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>
            </div>

            {/* Logout */}
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-200 text-red-500 font-semibold">
                <span className="material-symbols-outlined">logout</span>
                Log Out
            </button>

            <p className="text-center text-xs text-gray-400">
                Version 1.0.0
            </p>
        </div>
    );
}
