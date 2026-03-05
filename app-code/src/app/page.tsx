"use client";

import { useState } from "react";
import Link from "next/link";

/* ── colour tokens ── */
const C = {
  primary: "#0f756d",
  primaryDark: "#0a564f",
  bgLight: "#f8fbfb",
  bgDark: "#0e1b1a",
  textMain: "#0e1b1a",
  textSubtle: "#4f6f6d",
  border: "#e8f3f2",
};

/* ── hero SVG pattern (plus signs) as CSS background ── */
const heroPattern = {
  backgroundColor: C.primary,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23138b81' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

const IMG = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyl6-Dhs4U786kwVInmiG0di4JWWy3jDxNbuWrJVc_5PEB5wUO3n0Mdp1u4fEMMC-WgP4ZLkXH2zS_8QXfNpX4Ubm14erE6kMbMPILLYT2Q9X6k5Q0FZMYPX4wSo5wbR3_R_F7-3dNeGQRkZvJl0AEA9VAQGw2UJSasgU5m14YKvVZSXVRlzXoXDfEJUFPN8R2PBDJLyA0-e6h8arSlevGo3zlaLXZqPzpx3Pg61HlPQwXrbGlyfOjiJZSlBTrkwowH9jtood4xlI",
  howItWorks: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_z2HWHkA3xrSbxtR2O7MytIhmMzlZBThFYGTg7zDW5QIgr76kLGS3YKUEtU-Sg7PYG6IZ1hvvPojzwX_S5kXRXBYDRFAOcqdtepzeDtcYN2uZNzpD724mbI2FwrNqUMNz6_hx4TH5pjC5hcuEaLLSBqlrQVya2Q30xPLbgW0M_KLMjVbJ68nI9_0lGz_P9kfFQcCDZPSwUoqJkulgLn2Blt7TfhvX9SmkCFQchr18UXM_UzyxB15z8-UTmfaIrKMlt31peBZw5nk",
  card1: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCQG4xr4rvdK8XpPUZVTsIgvSPeWzW2QDSYz7GuKtY3hCHrJGDiEldGFNCzAJdJx88OgE0n_1Fg0EXiNHDUh6QNXQ1U7Zt9nRKgqMijEmGyuZvOY9ZdosPXw_F_MuiGw7EUnT08-Mk57DWSjJmUQ92YeAY2dQ_F9uJWUnoLvoeZaMaE8aw5dP_Hpleoi5YLMmt4LeZpg6K-t8_XDZ-kOVoSjn7nb1V77-H-tXkoMvC6jME3IUzMfrAvo75bEtjUdCoLybXuPX5_8o",
  card2: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_klk5B-tfwwDtKD6PEHS-xg_yIVyp4XtNqOC_NUEI8RC8nApWRjd4sYeWBFURpolkd4R8fso1NP-_Rs5FFCugmoElAhGPhj58T0sz28eALMbwx4sxk47IEZRsH5E4r8D6hm_Wra__yeoA60U43GU0lfS2N11UxjezJHXCi1HxG2I4RFoxfpDTgT9PkxZzoQ6ks6E-PYYbmYmFB-or9ueb7mC-lnrin3oj3IyWC3drSCr54WUrG0u5laDDzVdMFPWf1mgMjmEhRsk",
  card3: "https://lh3.googleusercontent.com/aida-public/AB6AXuDca-o61Az6fqQMwMfs4cMYhuNzy-dPEU83W54GrAwcNkohc_NNEsL7lT2Hubp6Y6R-OwPfog54-JvfBAOUlu2q3qOrdJxlEDECUX0uIaYrVzenL3JWBU3fFXMWOrTSMIET1T8u_upKfuVjg4ULyIh3aEl0pH8nf9SNIjT22O8aHAAjFesnkQoVpvDQ2NRpC5if7xGBdEvIimSH0TflqJeLnChDs_bcnfjCl3j_NpQkHPUDHCdLHTLNJYDavKs313-P0VhwATv5KWY",
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Public Sans', sans-serif", color: C.textMain, background: C.bgLight, overflowX: "hidden" }}>

      {/* ═══════ NAVBAR ═══════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, width: "100%",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: C.primary }}>diversity_1</span>
              <span style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 900, color: C.primary, letterSpacing: "-0.5px" }}>Helpit</span>
            </Link>
            {/* Nav links — hidden on mobile via CSS */}
            <nav className="landing-nav-links">
              <Link href="/" style={{ fontSize: 14, fontWeight: 500, color: C.textMain, textDecoration: "none" }}>Home</Link>
              <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: C.textMain, textDecoration: "none" }}>Explore NGOs</Link>
              <Link href="/register/volunteer" style={{ fontSize: 14, fontWeight: 500, color: C.textMain, textDecoration: "none" }}>Volunteer</Link>
              <Link href="/donor/donate" style={{ fontSize: 14, fontWeight: 500, color: C.textMain, textDecoration: "none" }}>Donate</Link>
            </nav>
            {/* Auth buttons — hidden on mobile via CSS */}
            <div className="landing-auth-btns">
              <Link href="/login" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 40, padding: "0 20px", borderRadius: 8,
                fontSize: 14, fontWeight: 700, color: C.primary,
                textDecoration: "none", background: "transparent",
              }}>Login</Link>
              <Link href="/register" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 40, padding: "0 20px", borderRadius: 8,
                fontSize: 14, fontWeight: 700, color: "#fff",
                textDecoration: "none", background: C.primary,
                boxShadow: "0 1px 3px rgba(15,117,109,0.2)",
              }}>Sign Up</Link>
            </div>
            {/* Mobile hamburger — shown on mobile via CSS */}
            <button
              className="landing-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ MOBILE MENU DRAWER ═══════ */}
      {mobileMenuOpen && (
        <>
          <div className="landing-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="landing-mobile-drawer">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Merriweather', serif", fontSize: 20, fontWeight: 900, color: C.primary }}>Helpit</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: C.textMain }}>close</span>
              </button>
            </div>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Explore NGOs</Link>
            <Link href="/register/volunteer" onClick={() => setMobileMenuOpen(false)}>Volunteer</Link>
            <Link href="/donor/donate" onClick={() => setMobileMenuOpen(false)}>Donate</Link>
            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 8, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "12px 16px", borderRadius: 8,
                fontWeight: 700, color: C.primary, border: `1px solid ${C.primary}`,
              }}>Login</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "12px 16px", borderRadius: 8,
                fontWeight: 700, color: "#fff", background: C.primary,
              }}>Sign Up</Link>
            </div>
          </div>
        </>
      )}

      {/* ═══════ HERO ═══════ */}
      <section style={{ position: "relative", width: "100%", color: "#fff", ...heroPattern }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,117,109,0.95), rgba(15,117,109,0.80))", pointerEvents: "none" }} />
        <div className="landing-hero-grid" style={{
          position: "relative", maxWidth: 1280, margin: "0 auto", padding: "64px 24px 80px",
        }}>
          {/* Left — content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8,
              padding: "4px 14px", borderRadius: 999, fontSize: 11,
              fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
              Verified &amp; Trusted Platform
            </div>

            <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-1px" }}>
              Connecting India <br />
              <span style={{ color: "#86efac" }}>for Good.</span>
            </h1>

            <p style={{ fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.9)", maxWidth: 480, lineHeight: 1.7 }}>
              The professional platform for verified NGOs, committed volunteers, and transparent donations. Join the movement today.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/requests" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 48, padding: "0 32px", borderRadius: 8,
                background: "#fff", color: C.primary, fontSize: 15, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>Find an NGO</Link>
              <Link href="/register/volunteer" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 48, padding: "0 32px", borderRadius: 8,
                background: "transparent", color: "#fff", fontSize: 15, fontWeight: 700,
                textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)",
              }}>Register as Volunteer</Link>
            </div>

            {/* Trust stats */}
            <div style={{ display: "flex", gap: 36, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
              {[
                { num: "500+", label: "Verified NGOs" },
                { num: "10k+", label: "Active Volunteers" },
                { num: "₹5Cr+", label: "Funds Raised" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700 }}>{s.num}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image (hidden on mobile via CSS) */}
          <div className="landing-hero-image">
            <div style={{
              position: "absolute", top: 0, right: 0, width: "100%", height: "100%",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "4px solid rgba(255,255,255,0.1)",
              transform: "rotate(2deg)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.hero} alt="Volunteers distributing supplies in India" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24, color: "#fff" }}>
                <p style={{ fontWeight: 700, fontSize: 18 }}>Community Drive</p>
                <p style={{ fontSize: 13, opacity: 0.8, display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> Mumbai, India
                </p>
              </div>
            </div>
            {/* Floating card */}
            <div style={{
              position: "absolute", bottom: -24, left: -24,
              background: "#fff", padding: 16, borderRadius: 14,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxWidth: 260,
              color: C.textMain, zIndex: 2,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#dcfce7", padding: 8, borderRadius: "50%", color: "#16a34a", display: "flex" }}>
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}>Latest Impact</p>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>New library opened in Pune</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EMPOWERING THE ECOSYSTEM ═══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, marginBottom: 12 }}>
              Empowering the Entire Ecosystem
            </h2>
            <p style={{ fontSize: 16, color: C.textSubtle, lineHeight: 1.6 }}>
              Whether you want to give help, receive support, or fund change, Helpit provides the verified infrastructure you need.
            </p>
          </div>

          <div className="landing-cards-grid">
            {[
              {
                icon: "corporate_fare", iconBg: "#dbeafe", iconColor: "#2563eb",
                title: "For NGOs",
                desc: "Gain access to a pool of verified volunteers, raise funds transparently, and manage your projects with professional tools.",
                cta: "Register Organization", ctaColor: "#2563eb", href: "/register/ngo",
              },
              {
                icon: "sentiment_satisfied", iconBg: "#dcfce7", iconColor: "#16a34a",
                title: "For Volunteers",
                desc: "Find meaningful opportunities near you based on your skills. Track your impact hours and receive certificates.",
                cta: "Start Volunteering", ctaColor: "#16a34a", href: "/register/volunteer",
              },
              {
                icon: "favorite", iconBg: "#f3e8ff", iconColor: "#9333ea",
                title: "For Donors",
                desc: "Experience 100% transparency. Track every rupee you donate and see the direct impact through verified updates.",
                cta: "Donate Now", ctaColor: "#9333ea", href: "/register",
              },
            ].map((f) => (
              <div key={f.title} style={{
                background: C.bgLight, borderRadius: 16, padding: 32,
                border: "1px solid #f1f1f1",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: f.iconBg, color: f.iconColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 24,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{f.icon}</span>
                </div>
                <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.textSubtle, lineHeight: 1.65, marginBottom: 24 }}>{f.desc}</p>
                <Link href={f.href} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  color: f.ctaColor, fontWeight: 600, fontSize: 14, textDecoration: "none",
                }}>
                  {f.cta} <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section style={{ padding: "80px 24px", background: C.bgLight, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="landing-how-flex" style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Left */}
          <div>
            <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, marginBottom: 12 }}>
              How Helpit Works
            </h2>
            <p style={{ fontSize: 16, color: C.textSubtle, lineHeight: 1.6, marginBottom: 36 }}>
              Making a difference shouldn&apos;t be complicated. We&apos;ve streamlined the process of connecting help with need.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { n: "1", title: "Discover a Cause", desc: "Browse through verified NGOs and urgent community requests filtered by location and cause type." },
                { n: "2", title: "Connect & Commit", desc: "Sign up as a volunteer or donor. Our platform handles the coordination and scheduling automatically." },
                { n: "3", title: "Track Impact", desc: "Receive real-time updates, photos, and reports on how your contribution made a difference." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 16 }}>
                  <div style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
                    background: C.primary, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 18,
                  }}>{s.n}</div>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{s.title}</h4>
                    <p style={{ fontSize: 14, color: C.textSubtle, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — card preview */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 256, height: 256, background: `${C.primary}1a`, borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "relative", background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #f1f1f1", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.howItWorks} alt="Volunteers working together" style={{ width: "100%", height: 256, objectFit: "cover" }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 8px", background: "#dcfce7", color: "#15803d", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>Education Drive</span>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>2 days ago</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>School Supplies for Rural Areas</h3>
                <div style={{ width: "100%", height: 10, background: "#e5e7eb", borderRadius: 999, marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ width: "70%", height: "100%", background: C.primary, borderRadius: 999 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 16 }}>
                  <span style={{ fontWeight: 500 }}>₹3.5L Raised</span>
                  <span style={{ color: "#9CA3AF" }}>Goal: ₹5L</span>
                </div>
                <Link href="/requests" style={{
                  display: "block", textAlign: "center", padding: "10px 0", borderRadius: 8,
                  background: `${C.primary}1a`, color: C.primary, fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                }}>View Details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ LATEST REQUESTS ═══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="landing-requests-header">
            <div>
              <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 28, fontWeight: 700 }}>Latest Requests</h2>
              <p style={{ color: C.textSubtle, marginTop: 8 }}>Urgent needs from verified communities near you.</p>
            </div>
            <Link href="/requests" style={{ display: "inline-flex", alignItems: "center", color: C.primary, fontWeight: 700, textDecoration: "none" }}>
              View All Requests <span className="material-symbols-outlined" style={{ marginLeft: 4 }}>arrow_forward</span>
            </Link>
          </div>

          <div className="landing-requests-grid">
            {[
              { img: IMG.card1, urgent: true, loc: "Bangalore, KA", title: "Weekend Teaching Volunteers Needed", desc: "Looking for math and science tutors for high school students in underprivileged areas for upcoming exams.", tag: "Education" },
              { img: IMG.card2, urgent: false, loc: "Delhi, NCR", title: "Food Drive Logistics Support", desc: "Need volunteers with vehicles to help transport food packets from central kitchen to distribution centers.", tag: "Logistics" },
              { img: IMG.card3, urgent: true, loc: "Kolkata, WB", title: "Medical Camp Assistance", desc: "Volunteers needed for crowd management and registration at a free health checkup camp this Sunday.", tag: "Healthcare" },
            ].map((card) => (
              <div key={card.title} style={{ display: "flex", flexDirection: "column", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <div style={{ height: 192, overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {card.urgent && (
                    <div style={{ position: "absolute", top: 12, left: 12, background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4 }}>Urgent</div>
                  )}
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> {card.loc}
                  </div>
                  <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
                  <p style={{ fontSize: 13, color: C.textSubtle, lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{card.desc}</p>
                  <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f1f1f1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 8px", background: "#f3f4f6", borderRadius: 4, color: "#6B7280" }}>{card.tag}</span>
                    <Link href="/requests" style={{ color: C.primary, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Help Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section style={{ background: C.primary, color: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, marginBottom: 20 }}>
            Ready to Make an Impact?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", marginBottom: 32, maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Join thousands of changemakers across India. Whether you have time, skills, or funds, your contribution matters.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/register" style={{
              padding: "12px 32px", background: "#fff", color: C.primary,
              fontWeight: 700, borderRadius: 8, textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>Get Started Today</Link>
            <Link href="/about" style={{
              padding: "12px 32px", background: "rgba(10,86,79,0.5)",
              border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
              fontWeight: 700, borderRadius: 8, textDecoration: "none",
            }}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ background: C.bgDark, color: "#fff", padding: "64px 24px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="landing-footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: C.primary }}>diversity_1</span>
                <span style={{ fontFamily: "'Merriweather', serif", fontSize: 20, fontWeight: 900 }}>Helpit</span>
              </div>
              <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.65, maxWidth: 260 }}>
                Connecting verified NGOs, committed volunteers, and generous donors to build a better India together.
              </p>
            </div>
            {/* Link groups */}
            {[
              { title: "Platform", links: [{ label: "About Us", href: "/about" }, { label: "Our Team", href: "#" }, { label: "Careers", href: "#" }, { label: "Blog", href: "#" }] },
              { title: "Community", links: [{ label: "For NGOs", href: "/register/ngo" }, { label: "For Volunteers", href: "/register/volunteer" }, { label: "Corporate Partners", href: "#" }, { label: "Success Stories", href: "#" }] },
              { title: "Support", links: [{ label: "Help Center", href: "#" }, { label: "Safety Center", href: "#" }, { label: "Community Guidelines", href: "#" }, { label: "Contact Us", href: "#" }] },
            ].map((group) => (
              <div key={group.title}>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>{group.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="landing-footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28, fontSize: 13, color: "#6B7280" }}>
            <p>&copy; {new Date().getFullYear()} Helpit Foundation. All rights reserved.</p>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Terms of Service</Link>
              <Link href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
