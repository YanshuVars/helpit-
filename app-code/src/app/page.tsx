export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="material-symbols-outlined text-white text-4xl">volunteer_activism</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Helpit</h1>
        <p className="text-[var(--foreground-muted)] mb-8">NGO Coordination Platform</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a href="/login" className="bg-[var(--primary)] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[var(--primary-hover)] transition-colors">
            Login
          </a>
          <a href="/register" className="border border-[var(--border)] text-[var(--foreground)] font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
