import Link from "next/link";

export default function DonorDashboardPage() {
    return (
        <div className="flex flex-col">
            {/* ═══════════════════════════════════════════════════════════════
          HERO ZONE: Welcome Greeting (Isolated)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <h2 className="text-[24px] font-bold">Hi, Alex! 👋</h2>
                <p className="text-[15px] text-gray-500 mt-1">Your contributions are making a difference.</p>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          IMPACT STATS (2 Column Grid)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-[var(--primary)]">
                            <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                            <p className="text-[14px] font-medium">Donated</p>
                        </div>
                        <p className="text-[26px] font-bold leading-tight">₹12,500</p>
                        <p className="text-[var(--success)] text-[12px] font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +15% this month
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-orange-500">
                            <span className="material-symbols-outlined text-lg">groups</span>
                            <p className="text-[14px] font-medium">Impacted</p>
                        </div>
                        <p className="text-[26px] font-bold leading-tight">42</p>
                        <p className="text-[var(--success)] text-[12px] font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +2 lives
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          FOLLOWED NGOS (Horizontal Scroll)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing full-bleed">
                <div className="flex justify-between items-center section-header">
                    <h3 className="text-[18px] font-bold tracking-tight">Followed NGOs</h3>
                    <Link href="/donor/discover" className="text-[var(--primary)] text-[14px] font-semibold">See all</Link>
                </div>
                <div className="flex overflow-x-auto gap-4 hide-scrollbar -mr-5 pr-5">
                    {/* NGO 1 - Active */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--primary)] p-0.5">
                            <div
                                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBN1GhlsQFnfRiQjapGOthQrxWq2YUSj6FRqnkY3OLI8QFO_EdzfoqogOqaRBZ1pU2ozkYxe1nALKrHFHYX6IIpwKdWAJCwfMXy-B0Koi2BMyllOfLG6JvnuqFkc32qMmSAJQlcoUEdmgl8Ya47TMq1OaY13KITG0PacY7OFISKLZ79Z-FiT8eJcGa8WrcVpIPPu4tD_f3KfhHzWO3ca4WC9D3lNkM_7b-LMnBgH_LM7pJN76DwRrFG1LiWj3b0VIXgCqB0LSjluss")' }}
                            ></div>
                        </div>
                        <span className="text-[12px] font-medium text-center truncate w-16">GreenEarth</span>
                    </div>

                    {/* NGO 2 */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-16 h-16 rounded-full border-2 border-transparent p-0.5">
                            <div
                                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDt0-S0vk0_z8kuYQ4gClS0-avARsn7_Wi0iDrKHgUr1eQTaypNqw74J6ImAZzc-V-LyIn_IGK-0kF9JfwUAwpiPQWsZAtN8KRrSiWqPUkTgEwq9IKkJDT56iZNElWse2SoeLvW78CdcGkJu4-UleLRKOMlmw_8SGEz0bDsAmJNQvl__nFnbP3V6SjYmDkFpVVazl8UbBUGvdxvOIOhOUg-PmtkFVsH6J0WJJGE8yhxtTEwkUqs7dey1zpczZWqPzFPOjPSCNT3srY")' }}
                            ></div>
                        </div>
                        <span className="text-[12px] font-medium text-center truncate w-16">EduChild</span>
                    </div>

                    {/* NGO 3 */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-16 h-16 rounded-full border-2 border-transparent p-0.5">
                            <div
                                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAWixPUgzD9Ts0SA-Z5CajeCFFWuY1i6bVdjf54lMcuNqhurA1vIfUJ_upnuEoFJtogjzwJ_lAHMwzQMZC9pnDoqVLITwRV1wmd3FY1ht56uY2Qt1pQ5d4oHNI1IADj26Qj5lmBtIFu5o83A6xGCKIjSRg0LQTfSGvyabSSmCFiql2zHXP0HWBHAQT87Md922XqqFNCNbR3qf7DNPOOYCl2z228hiq9ByHkTf2KE_94oZ-chz87KpiSnZGu2bYt6tO2FNkO2afkFE")' }}
                            ></div>
                        </div>
                        <span className="text-[12px] font-medium text-center truncate w-16">WaterRefill</span>
                    </div>

                    {/* NGO 4 */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-16 h-16 rounded-full border-2 border-transparent p-0.5">
                            <div
                                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJD2qKA2oNBdKg0gpN-qCqv3kJr5A65JYKnKJ79NEDtpyZaIVfjeYwHKyzR7WunF6vQAMHNyv8gdmzS4l3aW64N1yGEAGY24nIPlLL6bvC8AJQB_O0fxoJl-OC5gRonJAR8a0HB-yDec5KUQFQ62NveFIlVOU9UbaXy0XxNL0snwC25mfA6oi-blBzgKqRaiu8S_UZi_YarU7pbaKkLsRaBK9BsZWM6tDCniFdiGyNuMwgIpHpbLLYve_zdaoGtcw4UKKl2IWE-OM")' }}
                            ></div>
                        </div>
                        <span className="text-[12px] font-medium text-center truncate w-16">AnimalCare</span>
                    </div>

                    {/* Discover Button */}
                    <Link href="/donor/discover" className="flex flex-col items-center gap-2 shrink-0">
                        <button className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                        <span className="text-[12px] font-medium text-center truncate w-16">Discover</span>
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          RECENT ACTIVITY (Timeline Style)
      ═══════════════════════════════════════════════════════════════ */}
            <section>
                <h3 className="text-[18px] font-bold tracking-tight section-header">Recent Activity</h3>

                <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    {/* Activity 1 */}
                    <div className="relative pl-14">
                        <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-white z-10"></div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-[14px]">Donation Confirmed</h4>
                                <span className="text-[10px] font-medium text-gray-400">2h ago</span>
                            </div>
                            <p className="text-[14px] text-gray-600">Your monthly donation of <span className="font-semibold text-[var(--primary)]">₹500</span> was sent to <span className="font-semibold">GreenEarth</span>.</p>
                        </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="relative pl-14">
                        <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white z-10"></div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-[14px]">Project Milestone</h4>
                                <span className="text-[10px] font-medium text-gray-400">Yesterday</span>
                            </div>
                            <p className="text-[14px] text-gray-600"><span className="font-semibold">EduChild</span> reached their goal of building 5 new classrooms!</p>
                            <div
                                className="mt-3 h-24 w-full rounded-xl bg-cover bg-center"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB248QEF-fukHYsSSegpMseHYSLcgx3hqk0ZvRySGuPAu32NNsMhHTgrS2L98XB_mtzax_cDMqb-gtsPfgt4362p06BWO9IhBzFDZ3-qv1ekJS_PZIzb0q9peDpik6dMtYyTbh1ST5453LMjr9VngrhBYZDP7gA6aZiac6-PHfDSzNdsrHeMDZo4DGQag9lvKyUs7-1dwxagYgV8KtTSQXufKpi5YjYuJ72gu1-MyC6VU-ytR_OK_M50dVkfYZrwd7nRQtldDcMiSs")' }}
                            ></div>
                        </div>
                    </div>

                    {/* Activity 3 */}
                    <div className="relative pl-14">
                        <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white z-10"></div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-[14px]">New Update</h4>
                                <span className="text-[10px] font-medium text-gray-400">Oct 24</span>
                            </div>
                            <p className="text-[14px] text-gray-600"><span className="font-semibold">WaterRefill</span> shared a progress video for the Nile project.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

