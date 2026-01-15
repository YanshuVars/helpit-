import Link from "next/link";

export default function NGOProfileSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/ngo/settings" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Organization Profile</h1>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white text-3xl font-bold">
                    HF
                </div>
                <button className="mt-3 text-[var(--primary)] text-sm font-semibold">Change Logo</button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Organization Name</label>
                    <input type="text" defaultValue="Hope Foundation" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Username</label>
                    <input type="text" defaultValue="@hopefoundation" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea rows={3} defaultValue="Helping communities since 2010..." className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <input type="email" defaultValue="contact@hopefoundation.org" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Website</label>
                    <input type="url" defaultValue="https://hopefoundation.org" className="w-full h-12 rounded-xl border border-gray-200 px-4" />
                </div>
            </div>

            <button className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl">
                Save Changes
            </button>
        </div>
    );
}
