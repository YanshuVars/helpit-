import Link from "next/link";

export default function VolunteerDashboardPage() {
    return (
        <div className="flex flex-col">
            {/* ═══════════════════════════════════════════════════════════════
          HERO ZONE: Profile Greeting (Isolated, Breathing Room)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <div className="flex gap-4 items-center">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-white shadow-md"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEvg6Mp2Sw4uCyGL7P4Y1dxsxhP_A2kOO-6Ux_J80ZDXvB8A9ZKYi2i8lVmYckXZEN3Pm05TC2RIBCnNOgQxjRGggZFlsq5iEgAuFf4gZ1TnmhaYlUP2NVfpS60nUMvj2UF6n1kgnkz4CNyLLEsrJ1hzXTnKQBFMhWpNG2hEOEeISAytgEZmcXnfF5P4LsT5zV2yhfbv0qNY-3Xxmyek9TRV1t75esr5hAtKZmCp_dH3hoZgSqcDvKCA3ce4uGjwn-xNxUncO1Ef4")' }}
                    ></div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[22px] font-bold leading-tight tracking-[-0.02em]">Hello, Alex</p>
                        <p className="text-[#616e89] text-[15px] font-normal mt-1">Ready to make an impact today?</p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          STATS CARDS: Horizontal Row with Proper Padding
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <div className="flex gap-3">
                    <div className="flex-1 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 min-h-[120px] bg-white shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[var(--primary)] w-6 h-6 shrink-0 text-[22px]">schedule</span>
                        <div>
                            <p className="text-[#616e89] text-[11px] font-semibold uppercase tracking-wider mb-1">Hours</p>
                            <p className="text-[26px] font-bold tracking-tight leading-none">124</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 min-h-[120px] bg-white shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[var(--primary)] w-6 h-6 shrink-0 text-[22px]">task_alt</span>
                        <div>
                            <p className="text-[#616e89] text-[11px] font-semibold uppercase tracking-wider mb-1">Tasks</p>
                            <p className="text-[26px] font-bold tracking-tight leading-none">18</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-between gap-3 rounded-2xl p-5 min-h-[120px] bg-white shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[var(--primary)] w-6 h-6 shrink-0 text-[22px]">volunteer_activism</span>
                        <div>
                            <p className="text-[#616e89] text-[11px] font-semibold uppercase tracking-wider mb-1">NGOs</p>
                            <p className="text-[26px] font-bold tracking-tight leading-none">5</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          AVAILABILITY TOGGLE: Feature Card with Breathing Room
      ═══════════════════════════════════════════════════════════════ */}
            <section className="section-spacing">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-[16px]">Available to help now?</p>
                        <p className="text-[13px] text-[#616e89]">Coordinators can ping you for urgent tasks</p>
                    </div>
                    <div className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[var(--primary)] transition-colors duration-200 ease-in-out">
                        <span className="translate-x-5 pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          SECTION HEADER: Nearby Urgent Requests (32px top margin)
      ═══════════════════════════════════════════════════════════════ */}
            <section className="full-bleed">
                <div className="flex items-center justify-between section-header">
                    <h2 className="text-[18px] font-bold leading-tight tracking-[-0.015em]">Nearby Urgent Requests</h2>
                    <Link href="/volunteer/opportunities" className="text-[var(--primary)] text-[14px] font-semibold">See All</Link>
                </div>

                {/* HORIZONTAL SCROLL CARDS with Edge Peeking */}
                <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory -mr-5 pr-5">
                    <div className="flex items-stretch gap-4">
                        {/* Card 1 */}
                        <div className="snap-start flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 w-[85vw] max-w-[320px] overflow-hidden">
                            <div className="relative w-full h-[170px] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span> URGENT
                                </div>
                                <div
                                    className="w-full h-full bg-center bg-no-repeat bg-cover"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWxjYW67TbKyCxr96C4zhF3MSinMzu5x2E9WL_IEpBeFPzjiylNAbgekA1dPSiMPzdSqhQ6yfc1MjgYa81B5pSshQFQnQkAqqx0GAno2oIPxA_tOZOsCAG-hSA4WceqBtLiuBtOsXdi2wb_wW22e6CYQDcU6Qz9h6Z1BBov0eq46tNjjoIRCgaP0LqnVezWXbGjPQJFQ7blM1LfmvEwuLpmrp3X6_bfzrlgZEPna3EIIvHmNTX8WNvbTRrPpoXC-vF1H0msoZxBjs")' }}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3 p-4">
                                <div>
                                    <p className="text-[16px] font-bold leading-tight">Emergency Food Relief</p>
                                    <div className="flex items-center gap-1.5 mt-2 text-[#616e89]">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        <span className="text-[13px]">0.4 miles • Community Pantry</span>
                                    </div>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-[var(--primary)] text-white text-[14px] font-bold hover:bg-[var(--primary-hover)] transition-colors">
                                    Join Now
                                </button>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="snap-start flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 w-[85vw] max-w-[320px] overflow-hidden">
                            <div className="relative w-full h-[170px] overflow-hidden">
                                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span> URGENT
                                </div>
                                <div
                                    className="w-full h-full bg-center bg-no-repeat bg-cover"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8pulci3cgmeVleamCPxItRKE19EYTh3q5E7IDxaglrTwY7BDVU6MqDqv8rjLS6OP1u8iXWcPJwMQ-HY0Y0YsBhHjuSUJV11Q1yF0pav6Nkg1mIfvAZEg-xph55i0JYGRJJZ4o2ZuVaqzNql-Mp0mXJVFXq81mrrVnNs9Chn1PrbTWVpDa2C4BXiVeobO2Vpp9h7MLwO0a3qHhLMWphsectBA0DGiWIEpm_IdZ8UxJ8bSAJKFDapQot2eatj31D3lBCZrBOBSD6h4")' }}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3 p-4">
                                <div>
                                    <p className="text-[16px] font-bold leading-tight">Overnight Shelter Support</p>
                                    <div className="flex items-center gap-1.5 mt-2 text-[#616e89]">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        <span className="text-[13px]">1.2 miles • Haven House</span>
                                    </div>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-[var(--primary)] text-white text-[14px] font-bold hover:bg-[var(--primary-hover)] transition-colors">
                                    Join Now
                                </button>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="snap-start flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 w-[85vw] max-w-[320px] overflow-hidden">
                            <div className="relative w-full h-[170px] overflow-hidden">
                                <div
                                    className="w-full h-full bg-center bg-no-repeat bg-cover"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaufv-feZ3zrlpmCK3nup1y5_OveWy6usdwUiEtQqUHwSFnmY7lONL7P__i9zLpTxNKd-a024sY6AHD-ED8O5Jvuxjzw15LFNvpWSNE-qVrdA1Qp3UY91wj0Cy7V0_DkSFxhwpuM3LO72Uto-Xixe0rLspBH-I1mzOMAm5vZpwyRxiSUoi6Zx8n6qOgDob8lC_nle-sAa8X30WEHOzj9kJyVkEPmj7N9TqaWdff2pGLOsqIG7YdUqsurYHJT7Jr78Q64NHYVtV2us")' }}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3 p-4">
                                <div>
                                    <p className="text-[16px] font-bold leading-tight">Park Restoration</p>
                                    <div className="flex items-center gap-1.5 mt-2 text-[#616e89]">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        <span className="text-[13px]">2.5 miles • Green Earth</span>
                                    </div>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-gray-100 text-[#111318] text-[14px] font-bold hover:bg-gray-200 transition-colors">
                                    View Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

