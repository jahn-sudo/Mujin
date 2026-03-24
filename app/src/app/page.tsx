import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import FadeUp from "@/components/FadeUp";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

// ── Design tokens ─────────────────────────────────────────────────────────────
// bg:        #131313
// surface:   #1c1b1b
// primary:   #a9d0b3  (soft green)
// secondary: #ddc1b7  (warm beige)
// muted:     #c3c8c1
// outline:   #434843

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: "var(--font-manrope), sans-serif" }}>
      <PublicNav />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ backgroundColor: "#131313" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(169,208,179,0.05), transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
          <p style={{ fontFamily: "var(--font-manrope)", color: "#a9d0b3", letterSpacing: "0.2em" }} className="text-xs uppercase mb-8">
            Redemptive Fintech · Tokyo · Est. 2026
          </p>

          <h1
            style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 300, lineHeight: 1.05, color: "#e5e2e1" }}
            className="text-[clamp(3rem,8vw,6.5rem)] mb-8 max-w-4xl"
          >
            Capital for those the system was never built to{" "}
            <span style={{ color: "#a9d0b3", fontStyle: "italic" }}>see.</span>
          </h1>

          <p style={{ color: "#c3c8c1" }} className="text-base leading-relaxed max-w-xl mb-12">
            Mujin gives credit-invisible entrepreneurs a ¥500,000 recyclable grant,
            a behavioral track record, and a warm introduction to a partner bank —
            no credit history required.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#a9d0b3", color: "#131313", fontFamily: "var(--font-manrope)", letterSpacing: "0.15em" }}
              className="text-xs uppercase px-8 py-4 font-medium hover:opacity-90 transition-opacity"
            >
              Apply to the pilot cohort
            </a>
            <Link
              href="/program"
              style={{ color: "#c3c8c1", fontFamily: "var(--font-manrope)", letterSpacing: "0.1em" }}
              className="text-xs uppercase hover:text-white transition-colors"
            >
              How it works →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-20">
          <div className="w-px h-12" style={{ backgroundColor: "#a9d0b3" }} />
          <span style={{ fontFamily: "var(--font-manrope)", color: "#a9d0b3", letterSpacing: "0.3em" }} className="text-[10px] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1c1b1b", borderTop: "1px solid #434843" }}>
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-3 gap-8">
          {[
            { value: "¥500,000", label: "Recyclable grant per student" },
            { value: "50", label: "Students in the pilot cohort" },
            { value: "0%", label: "Interest. Ever." },
          ].map((s, i) => (
            <FadeUp key={s.label} delay={i as 0 | 1 | 2}>
              <p style={{ fontFamily: "var(--font-noto-serif)", color: "#a9d0b3", fontWeight: 300 }} className="text-3xl mb-2">{s.value}</p>
              <p style={{ color: "#8d928c", fontFamily: "var(--font-manrope)", letterSpacing: "0.05em" }} className="text-xs uppercase">{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── The Problem ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <FadeUp>
          <p style={{ color: "#a9d0b3", fontFamily: "var(--font-manrope)", letterSpacing: "0.2em" }} className="text-xs uppercase mb-6">
            The problem
          </p>
          <h2 style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 300, color: "#e5e2e1" }} className="text-[clamp(2rem,4vw,3.5rem)] leading-tight max-w-3xl mb-16">
            Three systems that should work together. Three systems that don&apos;t.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "#434843" }}>
          {[
            {
              who: "The Banks",
              problem: "Require 2–3 years of financial history. Entrepreneurs who are just starting are structurally excluded before they can prove themselves.",
            },
            {
              who: "Grant Organizations",
              problem: "Give money and walk away. No mentorship, no accountability, no bridge to what comes next. Capital evaporates instead of compounding.",
            },
            {
              who: "The Students",
              problem: "Work harder than anyone around them. Get turned away from every door — not because they aren't capable, but because no system was designed to see them.",
            },
          ].map((item, i) => (
            <FadeUp key={item.who} delay={i as 0 | 1 | 2}>
              <div className="p-8" style={{ backgroundColor: "#1c1b1b" }}>
                <p style={{ color: "#a9d0b3", fontFamily: "var(--font-manrope)", letterSpacing: "0.2em" }} className="text-[10px] uppercase mb-4">{item.who}</p>
                <p style={{ color: "#c3c8c1", fontFamily: "var(--font-manrope)" }} className="text-sm leading-relaxed">{item.problem}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1c1b1b", borderTop: "1px solid #434843", borderBottom: "1px solid #434843" }}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <FadeUp>
            <p style={{ color: "#a9d0b3", fontFamily: "var(--font-manrope)", letterSpacing: "0.2em" }} className="text-xs uppercase mb-6">
              How it works
            </p>
            <h2 style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 300, color: "#e5e2e1" }} className="text-[clamp(2rem,4vw,3.5rem)] leading-tight mb-16 max-w-2xl">
              The Recyclable Grant — a self-sustaining cycle of capital.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "#434843" }}>
            {[
              {
                step: "01",
                title: "Grant disbursed",
                body: "¥300,000 on day one. ¥200,000 at month three — earned, not automatic. No interest. No legal repayment obligation.",
              },
              {
                step: "02",
                title: "Build with support",
                body: "Bi-weekly mentorship. Monthly Town Halls. A Trust Score that tracks your behavior, not your balance sheet.",
              },
              {
                step: "03",
                title: "Pay it forward",
                body: "Upon graduating to a bank, you voluntarily return the grant plus a 5% success tithe — refilling the fund for the next student behind you.",
              },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i as 0 | 1 | 2}>
                <div className="p-8" style={{ backgroundColor: "#131313" }}>
                  <p style={{ color: "#434843", fontFamily: "var(--font-manrope)", letterSpacing: "0.3em" }} className="text-[10px] mb-6">{item.step}</p>
                  <h3 style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 400, color: "#e5e2e1" }} className="text-lg mb-3">{item.title}</h3>
                  <p style={{ color: "#8d928c", fontFamily: "var(--font-manrope)" }} className="text-sm leading-relaxed">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <FadeUp>
          <p style={{ color: "#a9d0b3", fontFamily: "var(--font-manrope)", letterSpacing: "0.2em" }} className="text-xs uppercase mb-6">
            Who can apply
          </p>
          <h2 style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 300, color: "#e5e2e1" }} className="text-[clamp(2rem,4vw,3.5rem)] leading-tight mb-16 max-w-2xl">
            The pilot is focused. More cohorts are coming.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "#434843" }}>
          {[
            {
              group: "International students",
              tag: "Open now",
              active: true,
              desc: "University students in Japan connected to a Christian student ministry, with a venture idea and the drive to build it.",
            },
            {
              group: "Japanese youth",
              tag: "Coming soon",
              active: false,
              desc: "Young adults locked out of traditional borrowing — no credit history, no co-signer, no path forward. We are building the bridge.",
            },
            {
              group: "Refugees",
              tag: "Second cohort",
              active: false,
              desc: "The steepest credit invisibility of all. After the student pilot, Mujin expands to serve those with the highest barriers.",
            },
          ].map((item, i) => (
            <FadeUp key={item.group} delay={i as 0 | 1 | 2}>
              <div className="p-8 h-full" style={{ backgroundColor: "#1c1b1b", opacity: item.active ? 1 : 0.5 }}>
                <span
                  style={{
                    fontFamily: "var(--font-manrope)",
                    letterSpacing: "0.15em",
                    backgroundColor: item.active ? "#a9d0b3" : "transparent",
                    color: item.active ? "#131313" : "#8d928c",
                    border: item.active ? "none" : "1px solid #434843",
                  }}
                  className="inline-block text-[10px] uppercase px-3 py-1 mb-6"
                >
                  {item.tag}
                </span>
                <h3 style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 400, color: "#e5e2e1" }} className="text-base mb-3">{item.group}</h3>
                <p style={{ color: "#8d928c", fontFamily: "var(--font-manrope)" }} className="text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1c1b1b", borderTop: "1px solid #434843" }}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <FadeUp>
            <div className="max-w-2xl">
              <p style={{ color: "#a9d0b3", fontFamily: "var(--font-manrope)", letterSpacing: "0.2em" }} className="text-xs uppercase mb-6">
                Join the first cohort
              </p>
              <h2 style={{ fontFamily: "var(--font-noto-serif)", fontWeight: 300, color: "#e5e2e1" }} className="text-[clamp(2.5rem,5vw,4.5rem)] leading-tight mb-6">
                Be part of the first cohort.
              </h2>
              <p style={{ color: "#8d928c", fontFamily: "var(--font-manrope)" }} className="text-sm leading-relaxed mb-10 max-w-md">
                50 students. Launching Q2 2027. Applications reviewed by Mujin staff — no credit check, no co-signer.
              </p>
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#a9d0b3", color: "#131313", fontFamily: "var(--font-manrope)", letterSpacing: "0.15em" }}
                className="inline-block text-xs uppercase px-10 py-4 font-medium hover:opacity-90 transition-opacity"
              >
                Apply now
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#131313", borderTop: "1px solid #434843" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span style={{ fontFamily: "var(--font-manrope)", color: "#434843", letterSpacing: "0.2em" }} className="text-xs uppercase">Mujin</span>
          <p style={{ fontFamily: "var(--font-manrope)", color: "#434843" }} className="text-xs">
            A{" "}
            <a href="https://frontiercommons.org" target="_blank" rel="noopener noreferrer" style={{ color: "#8d928c" }} className="underline underline-offset-2 hover:text-white transition-colors">
              Frontier Commons
            </a>{" "}
            prototype · Tokyo, Japan
          </p>
        </div>
      </footer>
    </div>
  );
}
