export default function VerifyEmailPage() {
    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8 items-center justify-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[var(--primary)] text-5xl">mark_email_unread</span>
            </div>
            <h1 className="text-2xl font-bold text-center">Check Your Email</h1>
            <p className="text-[var(--foreground-muted)] text-sm pt-2 text-center max-w-xs">
                We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
            </p>

            <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
                <button className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl">
                    Open Email App
                </button>
                <button className="w-full border border-[var(--border)] text-[var(--foreground)] font-semibold py-3 rounded-xl">
                    Resend Verification Email
                </button>
            </div>

            <p className="text-xs text-[var(--foreground-muted)] mt-8 text-center">
                Didn&apos;t receive the email? Check your spam folder.
            </p>
        </div>
    );
}
