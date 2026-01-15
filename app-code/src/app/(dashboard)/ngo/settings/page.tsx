import Link from "next/link";

export default function NGOSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold">Settings</h1>

            <div className="space-y-3">
                <Link href="/ngo/settings/profile" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--primary)]">business</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Organization Profile</p>
                        <p className="text-xs text-gray-500">Edit name, description, logo</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>

                <Link href="/ngo/settings/members" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">group</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Team Members</p>
                        <p className="text-xs text-gray-500">Manage admins and coordinators</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>

                <Link href="/ngo/settings/audit" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600">history</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Audit Log</p>
                        <p className="text-xs text-gray-500">View activity history</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>

                <Link href="/notifications/settings" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-600">notifications</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Notification Preferences</p>
                        <p className="text-xs text-gray-500">Email, push, in-app</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </Link>
            </div>
        </div>
    );
}
