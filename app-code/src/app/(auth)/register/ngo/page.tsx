import Link from "next/link";

export default function NGORegisterPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8 overflow-y-auto">
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/register" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">NGO Registration</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Organization Name</label>
                    <input type="text" placeholder="Enter NGO name" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Registration Number</label>
                    <input type="text" placeholder="NGO registration number" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Category</label>
                    <select className="w-full h-14 rounded-xl border border-[var(--border)] px-4 bg-white">
                        <option value="">Select category</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="environment">Environment</option>
                        <option value="animal-welfare">Animal Welfare</option>
                        <option value="disaster-relief">Disaster Relief</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Contact Email</label>
                    <input type="email" placeholder="organization@email.com" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Contact Phone</label>
                    <input type="tel" placeholder="Enter phone number" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Address</label>
                    <textarea placeholder="Full address" className="w-full h-24 rounded-xl border border-[var(--border)] px-4 py-3 resize-none"></textarea>
                </div>

                {/* Document Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Verification Documents</label>
                    <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-[var(--foreground-muted)]">cloud_upload</span>
                        <p className="text-sm text-[var(--foreground-muted)] mt-2">Upload registration certificate, 80G certificate</p>
                        <button className="mt-3 text-[var(--primary)] text-sm font-semibold">Browse Files</button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Admin Password</label>
                    <input type="password" placeholder="Create admin password" className="w-full h-14 rounded-xl border border-[var(--border)] px-4" />
                </div>

                <button className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl mt-4">
                    Submit for Verification
                </button>
                <p className="text-xs text-center text-[var(--foreground-muted)]">
                    Your application will be reviewed within 2-3 business days
                </p>
            </div>
        </div>
    );
}
