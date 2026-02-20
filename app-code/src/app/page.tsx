"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const rotatingWords = ["Social Impact", "Volunteer Work", "NGO Coordination"];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#0F0F10", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "14px 24px",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          background: "rgba(255,255,255,0.82)", backdropFilter: "blur(18px) saturate(1.6)",
          borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)",
          padding: "0 24px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#6B3FA0",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 18,
            }}>H</div>
            <span style={{ fontWeight: 700, fontSize: 19, color: "#6B3FA0", letterSpacing: "-0.5px" }}>Helpit</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, fontWeight: 500, color: "#6B7280" }}>
            <Link href="/requests" style={{ textDecoration: "none", color: "inherit" }}>Volunteers</Link>
            <Link href="/ngos" style={{ textDecoration: "none", color: "inherit" }}>NGOs</Link>
            <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/login" style={{
              textDecoration: "none", padding: "8px 18px", borderRadius: 10,
              fontSize: 14, fontWeight: 500, color: "#6B7280",
            }}>Log in</Link>
            <Link href="/register" style={{
              textDecoration: "none", padding: "8px 20px", borderRadius: 10,
              fontSize: 14, fontWeight: 600, color: "#fff", background: "#6B3FA0",
            }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        position: "relative", paddingTop: 140, paddingBottom: 72,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: -80, left: -100, width: 560, height: 560,
          borderRadius: "50%", background: "rgba(107,63,160,0.25)", filter: "blur(90px)",
          zIndex: -1,
        }} />
        <div style={{
          position: "absolute", top: -40, right: -120, width: 520, height: 520,
          borderRadius: "50%", background: "rgba(236,72,153,0.15)", filter: "blur(100px)",
          zIndex: -1,
        }} />
        <div style={{
          position: "absolute", bottom: -100, left: "35%", width: 600, height: 600,
          borderRadius: "50%", background: "rgba(59,130,246,0.15)", filter: "blur(90px)",
          zIndex: -1,
        }} />

        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
          {/* Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 999,
            background: "rgba(107,63,160,0.08)", color: "#6B3FA0",
            fontSize: 13, fontWeight: 600, marginBottom: 28,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#6B3FA0",
              boxShadow: "0 0 0 3px rgba(107,63,160,0.2)",
            }} />
            Connecting Communities
          </div>

          {/* Headline — always two lines */}
          <h1 style={{
            fontSize: "clamp(42px, 6.5vw, 68px)", fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 20,
          }}>
            Reimagining
            <br />
            <span style={{
              background: "linear-gradient(135deg, #6B3FA0, #EC4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              transition: "opacity 0.4s ease",
              opacity: fade ? 1 : 0,
              display: "inline-block",
            }}>
              {rotatingWords[wordIndex]}
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: "#6B7280",
            maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7,
          }}>
            Helpit connects volunteers, donors, and NGOs to create tangible change.
            Experience a new era of giving with transparency and ease.
          </p>

          {/* CTA buttons — equal height pill shape */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/register" style={{
              textDecoration: "none", height: 48,
              padding: "0 32px", borderRadius: 999,
              background: "#6B3FA0", color: "#fff",
              fontSize: 15, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              boxShadow: "0 6px 24px rgba(107,63,160,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              Get Started Free
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </Link>
            <Link href="/ngos" style={{
              textDecoration: "none", height: 48,
              padding: "0 32px", borderRadius: 999,
              background: "transparent", color: "#6B3FA0",
              fontSize: 15, fontWeight: 600, border: "2px solid #6B3FA0",
              display: "inline-flex", alignItems: "center",
              transition: "background 0.2s",
            }}>
              Browse NGOs
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BUILT FOR EVERYONE ─── */}
      <section style={{ padding: "64px 24px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>
              Built for{" "}
              <span style={{
                background: "linear-gradient(135deg, #6B3FA0, #EC4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Everyone</span>
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 440, margin: "0 auto" }}>
              Whether you want to volunteer, donate, or manage an NGO — Helpit has you covered.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                icon: "volunteer_activism",
                iconColor: "#6B3FA0", iconBg: "#F3E8FF",
                title: "For Volunteers",
                desc: "Discover local opportunities that match your skills. Track your hours and impact in real-time.",
              },
              {
                icon: "diversity_1",
                iconColor: "#2563EB", iconBg: "#DBEAFE",
                title: "For NGOs",
                desc: "Streamline your operations. Manage volunteers, donations, and events from a single powerful dashboard.",
              },
              {
                icon: "favorite",
                iconColor: "#16A34A", iconBg: "#DCFCE7",
                title: "For Donors",
                desc: "Give with confidence. Track every rupee and receive instant tax-deductible receipts.",
              },
            ].map((f) => (
              <div key={f.title} style={{
                padding: 28, borderRadius: 16,
                background: "#fff", border: "1px solid #F0F0F4",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 9999,
                  background: f.iconBg, color: f.iconColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 18,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{f.icon}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{
        padding: "32px 24px", background: "#fff",
        borderTop: "1px solid #F0F0F4", borderBottom: "1px solid #F0F0F4",
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {[
            { num: "500+", label: "NGOs Verified" },
            { num: "5,000+", label: "Volunteers" },
            { num: "₹50L+", label: "Donated" },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, textAlign: "center",
              borderRight: i < 2 ? "1px solid #F0F0F4" : "none",
              padding: "0 24px",
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0F0F10", lineHeight: 1.2 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: "#8A8A96", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "64px 24px", background: "#F7F7F8" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>
              How It Works
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 400, margin: "0 auto" }}>
              Get started in minutes with three simple steps
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, textAlign: "center" }}>
            {[
              { step: "01", icon: "person_add", title: "Create Account", desc: "Sign up as a volunteer, donor, or NGO — it's completely free." },
              { step: "02", icon: "explore", title: "Discover & Connect", desc: "Find NGOs, volunteer opportunities, or causes that resonate with you." },
              { step: "03", icon: "handshake", title: "Make Impact", desc: "Donate funds, volunteer your time, or manage your organization." },
            ].map((item) => (
              <div key={item.step}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(107,63,160,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#6B3FA0" }}>{item.icon}</span>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "#6B3FA0",
                  textTransform: "uppercase" as const, letterSpacing: 2, marginBottom: 8,
                }}>Step {item.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section style={{
        padding: "72px 24px",
        background: "#1E1442",
        position: "relative", overflow: "hidden",
      }}>
        {/* Radial gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(107,63,160,0.20) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Decorative shapes */}
        <div style={{
          position: "absolute", top: -50, right: -50, width: 220, height: 220,
          borderRadius: "50%", background: "rgba(255,255,255,0.04)",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -40, width: 180, height: 180,
          borderRadius: "50%", background: "rgba(255,255,255,0.03)",
        }} />

        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ fontSize: 16, fontWeight: 400, color: "#C4B5FD", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 32px" }}>
            Join 500+ NGOs and 5,000 volunteers already making a difference across India.
          </p>
          <Link href="/register" style={{
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0 32px", height: 48, borderRadius: 999,
            background: "#fff", color: "#1E1442",
            fontWeight: 700, fontSize: 15,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transition: "background 0.2s",
          }}>
            Get Started Free
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: "#0F0F18",
        padding: "48px 24px 32px",
        marginTop: "auto",
      }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40,
            marginBottom: 36,
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#6B3FA0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 16,
                }}>H</div>
                <span style={{ fontWeight: 700, fontSize: 17, color: "#fff", letterSpacing: "-0.3px" }}>Helpit</span>
              </div>
              <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.65, maxWidth: 240 }}>
                Empowering communities through technology. Connecting people who care with causes that matter.
              </p>
            </div>

            {[
              { title: "Platform", links: [{ label: "For Volunteers", href: "/requests" }, { label: "For NGOs", href: "/ngos" }, { label: "For Donors", href: "/register" }] },
              { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Contact", href: "#" }, { label: "Careers", href: "#" }] },
              { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Cookies", href: "#" }] },
            ].map((s) => (
              <div key={s.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1.5, color: "#6B7280", marginBottom: 16 }}>{s.title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {s.links.map((l) => (
                    <Link key={l.label} href={l.href} style={{ textDecoration: "none", fontSize: 13, color: "#9CA3AF", transition: "color 0.15s" }}>{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 12, color: "#6B7280",
          }}>
            <span>&copy; {new Date().getFullYear()} Helpit. All rights reserved.</span>
            <span>Made with ❤️ for humanity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
