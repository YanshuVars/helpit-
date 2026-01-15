import Link from "next/link";

export default function NotificationSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Notification Preferences</h1>
            </div>

            <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-sm text-gray-500 uppercase">Push Notifications</h3>
                    </div>

                    {["New volunteer applications", "Donation updates", "Request status changes", "Messages"].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-none">
                            <span className="text-sm font-medium">{item}</span>
                            <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[var(--primary)]">
                                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow"></span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-sm text-gray-500 uppercase">Email Notifications</h3>
                    </div>

                    {["Weekly summary", "Important updates only", "Marketing & tips"].map((item, i) => (
                        <div key={item} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-none">
                            <span className="text-sm font-medium">{item}</span>
                            <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent ${i < 2 ? "bg-[var(--primary)]" : "bg-gray-200"}`}>
                                <span className={`${i < 2 ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow`}></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
