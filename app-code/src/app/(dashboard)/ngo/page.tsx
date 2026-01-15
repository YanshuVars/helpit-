import Link from "next/link";

export default function NGODashboardPage() {
    return (
        <div className="flex flex-col">
            {/* ═══════════════════════════════════════════════════════════════
          QUICK ACTIONS SECTION (Hero Zone)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <h3 className="text-[18px] font-bold leading-tight section-header">Quick Actions</h3>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    <Link
                        href="/ngo/requests/create"
                        className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[var(--primary)] text-white px-5 shadow-sm active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        <span className="text-sm font-semibold">Create Request</span>
                    </Link>
                    <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-gray-200 text-[#111318] px-5 shadow-sm active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-xl">calendar_add_on</span>
                        <span className="text-sm font-semibold">Create Event</span>
                    </button>
                    <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-gray-200 text-[#111318] px-5 shadow-sm active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-xl">file_download</span>
                        <span className="text-sm font-semibold">Export Report</span>
                    </button>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          PERFORMANCE STATS (2x2 Grid with Breathing Room)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <h3 className="text-[18px] font-bold leading-tight section-header">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-[13px] font-medium">Active Requests</p>
                            <span className="material-symbols-outlined text-[var(--primary)] text-xl">pending_actions</span>
                        </div>
                        <p className="text-[28px] font-bold tracking-tight leading-none">24</p>
                        <p className="text-[var(--success)] text-[12px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +5% this week
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-[13px] font-medium">Volunteers</p>
                            <span className="material-symbols-outlined text-[var(--primary)] text-xl">groups</span>
                        </div>
                        <p className="text-[28px] font-bold tracking-tight leading-none">158</p>
                        <p className="text-[var(--success)] text-[12px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +12% this week
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-[13px] font-medium">Donations</p>
                            <span className="material-symbols-outlined text-[var(--primary)] text-xl">payments</span>
                        </div>
                        <p className="text-[28px] font-bold tracking-tight leading-none">₹4,200</p>
                        <p className="text-[var(--success)] text-[12px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +8% this week
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-[13px] font-medium">Events</p>
                            <span className="material-symbols-outlined text-[var(--primary)] text-xl">event_available</span>
                        </div>
                        <p className="text-[28px] font-bold tracking-tight leading-none">3</p>
                        <p className="text-gray-500 text-[12px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">remove</span>
                            No change
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          RECENT ACTIVITY (Section with Clear Header)
      ═══════════════════════════════════════════════════════════════ */}
            <section>
                <div className="flex items-center justify-between section-header">
                    <h3 className="text-[18px] font-bold leading-tight">Recent Activity</h3>
                    <button className="text-[var(--primary)] text-[14px] font-semibold">View all</button>
                </div>

                <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                    <div className="divide-y divide-gray-100">
                        {/* Activity Item 1 */}
                        <div className="flex items-start gap-4 p-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--primary)]">person_add</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-[#111318]">John Doe joined as a volunteer</p>
                                <p className="text-[12px] text-gray-500 mt-0.5">Assigned to Local Kitchen Project</p>
                                <p className="text-[10px] text-gray-400 uppercase mt-1.5">2m ago</p>
                            </div>
                        </div>

                        {/* Activity Item 2 */}
                        <div className="flex items-start gap-4 p-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-orange-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-500">priority_high</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-[#111318]">Food Drive marked as Urgent</p>
                                <p className="text-[12px] text-gray-500 mt-0.5">Updated by Admin Sarah</p>
                                <p className="text-[10px] text-gray-400 uppercase mt-1.5">15m ago</p>
                            </div>
                        </div>

                        {/* Activity Item 3 */}
                        <div className="flex items-start gap-4 p-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-green-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500">paid</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-[#111318]">Donation received: ₹500</p>
                                <p className="text-[12px] text-gray-500 mt-0.5">Anonymous donor via Razorpay</p>
                                <p className="text-[10px] text-gray-400 uppercase mt-1.5">1h ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

