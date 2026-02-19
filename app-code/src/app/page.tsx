import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--foreground)] overflow-x-hidden">

      {/* Navbar */}
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
              <Link href="/requests" className="hover:text-[var(--primary)] transition-colors">Volunteers</Link>
              <Link href="/ngos" className="hover:text-[var(--primary)] transition-colors">NGOs</Link>
              <Link href="/about" className="hover:text-[var(--primary)] transition-colors">About</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="shadow-glow">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">

        {/* Abstract Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000 opacity-20"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-4000 opacity-20"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-6 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
            </span>
            Connecting Communities
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight animate-slideUp stagger-1">
            Reimagining <br />
            <span className="text-gradient drop-shadow-sm">Social Impact</span>
          </h1>

          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 animate-slideUp stagger-2 leading-relaxed">
            Helpit connects volunteers, donors, and NGOs to create tangible change.
            Experience a new era of giving with transparency and ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp stagger-3">
            <Link href="/requests">
              <Button size="lg" className="w-full sm:w-auto shadow-glow group">
                Find Opportunities
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Button>
            </Link>
            <Link href="/ngos">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Browse NGOs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="glass-elevated" className="p-8 group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">For Volunteers</h3>
              <p className="text-[var(--foreground-muted)]">
                Discover local opportunities that match your skills. Track your hours and impact in real-time.
              </p>
            </Card>

            <Card variant="glass-elevated" className="p-8 group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl">diversity_1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">For NGOs</h3>
              <p className="text-[var(--foreground-muted)]">
                Streamline your operations. Manage volunteers, donations, and events from a single powerful dashboard.
              </p>
            </Card>

            <Card variant="glass-elevated" className="p-8 group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl">favorite</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">For Donors</h3>
              <p className="text-[var(--foreground-muted)]">
                Give with confidence. Track every rupee and receive instant tax-deductible receipts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-white/50 backdrop-blur-sm py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-[var(--foreground-muted)] text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg">H</div>
            <span className="font-display font-bold text-lg text-[var(--foreground)]">Helpit</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Helpit. Empowering Humanity.</p>
        </div>
      </footer>
    </div>
  );
}
