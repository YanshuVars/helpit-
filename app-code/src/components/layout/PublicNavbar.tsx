"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PublicNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="glass-panel mx-4 mt-4 rounded-2xl md:mx-auto md:max-w-7xl">
                <div className="px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--primary)]/20 transition-transform group-hover:scale-105">
                            H
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-[var(--foreground)]">Helpit</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--foreground-muted)]">
                        <Link href="/requests" className="hover:text-[var(--primary)] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all hover:after:w-full">Requests</Link>
                        <Link href="/ngos" className="hover:text-[var(--primary)] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all hover:after:w-full">NGOs</Link>
                        <Link href="/about" className="hover:text-[var(--primary)] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all hover:after:w-full">About</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="hidden md:inline-flex">Log in</Button>
                        </Link>
                        <Link href="/start">
                            <Button variant="primary" size="sm" className="shadow-glow">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
