import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import FadeUp from "@/components/FadeUp";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center grain overflow-hidden bg-[#0f0f0f]">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
          <p className="font-data text-xs text-white/40 uppercase tracking-[0.2em] mb-8">
            Redemptive Fintech · Tokyo · Est. 2026
          </p>

          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[1.05] text-white mb-8 max-w-4xl">
            Capital for those the system was never built to see.
          </h1>

          <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-12">
            Mujin gives credit-invisible entrepreneurs a ¥500,000 recyclable grant,
            a behavioral track record, and a warm introduction to a partner bank —
            no credit history required.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Apply to the pilot cohort
            </a>
            <Link
              href="/program"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              How it works →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-white/40" />
          <span className="font-data text-[10px] text-white/50 uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-3 gap-8">
          {[
            { value: "¥500,000", label: "Recyclable grant per student" },
            { value: "50", label: "Students in the pilot cohort" },
            { value: "0%", label: "Interest. Ever." },
          ].map((s, i) => (
            <FadeUp key={s.label} delay={i as 0 | 1 | 2}>
              <div className="flex items-center gap-3 mb-1">
                {i === 0 && (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 pulse-live shrink-0" />
                )}
                <p className="font-data text-3xl font-medium text-white">{s.value}</p>
              </div>
              <p className="text-sm text-white/40">{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── The problem ──────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <FadeUp>
          <p className="font-data text-xs text-gray-400 uppercase tracking-[0.15em] mb-6">The problem</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight text-gray-900 max-w-3xl mb-16">
            Three systems that should work together. Three systems that don&apos;t.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
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
              <div className="border border-gray-100 rounded-xl p-6">
                <p className="font-data text-xs text-gray-400 uppercase tracking-widest mb-3">{item.who}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.problem}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] grain relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <FadeUp>
            <p className="font-data text-xs text-white/40 uppercase tracking-[0.15em] mb-6">How it works</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-16 max-w-2xl">
              The Recyclable Grant — a self-sustaining cycle of capital.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
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
                <div className="border border-white/10 rounded-xl p-6">
                  <p className="font-data text-xs text-white/30 mb-4">{item.step}</p>
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <FadeUp>
          <p className="font-data text-xs text-gray-400 uppercase tracking-[0.15em] mb-6">Who can apply</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-gray-900 mb-16 max-w-2xl">
            The pilot is focused. More cohorts are coming.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
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
              <div
                className={`rounded-xl p-6 border h-full ${
                  item.active ? "border-gray-900" : "border-gray-100 opacity-60"
                }`}
              >
                <span
                  className={`inline-block font-data text-xs px-2 py-1 rounded mb-4 uppercase tracking-wide ${
                    item.active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {item.tag}
                </span>
                <h3 className="font-medium mb-2">{item.group}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative grain overflow-hidden bg-[#0f0f0f]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(255,255,255,0.04),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <FadeUp>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-light text-white mb-6">
              Be part of the first cohort.
            </h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto">
              50 students. Launching Q2 2027. Applications reviewed by Mujin staff — no credit check, no co-signer.
            </p>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Apply now
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0f0f0f] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="font-data text-sm text-white/40">Mujin</span>
          <p className="font-data text-xs text-white/20">
            A{" "}
            <a href="https://frontiercommons.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white/40 transition-colors">
              Frontier Commons
            </a>{" "}
            prototype · Tokyo, Japan
          </p>
        </div>
      </footer>
    </div>
  );
}
