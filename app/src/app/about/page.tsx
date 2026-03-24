import Link from "next/link";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

// Placeholder images — replace with real photos
const IMG_HQ =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVzp4nxUkisIdutJ6-wAvm2OrZv8jYyWVa0OLAG9-tlVNot_h2zA_1GWh_wZnzkNXV1WzRWv9Sp1YzzXJ79-qVLNTPJkyS39RbaOdu3O6VaNu9JjroJWwmh1xAXSqYdnKo8-kg0A-16AGB3wTbOPCM_ztE8M4LlRjmhXgctLhMQXC7stWLDODG-Tro1IBN4W4JklqLDzGFjdpvAWCichaHIEC0yO29OLZZ-xoSRVS1yp40AJ8wba0F0WyZnGlJRnN9Rmu43Ys_aKg";
const IMG_TIMELINE_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBzxDTE1cj2vnjp5WpikpuPC_nGqR_xDAQVv04jHtzkVsS46TCEhZHAIcWMwCehb1gzO1nWRHV1SFr-GQ12HLIRWJ-M5QvBsENr_TkAbYNe5vsMoE8F8GX47ZjixbMN0YdDcjm5c05xnnEshcj-SkU_Loj4WkXwJLcGG14rbDnVw62oROtA_ZPbFmzg48nAkZU8ICDRB3KlZjl7KY6PllTKQ32g-BCJAmvuA-wsOX6DIm7Uub5WLnt9__jYcUbm59-2D7OHzuJfDQw";
const IMG_TIMELINE_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcYpNpG1xdp9G6nsbH9H98TSjbQaZXFpxijWGekdXlDjIx8nZIdeWqtEHv2Y8CSIpatgLR5Pht-2YCqZIXbnTlJlj4Skn5F2qhDLrnSgLM5IRwn4bj2GgnPgLuPpNLLRYoiwaAEpeyZ7MAyMq86DSvN6_zMW3NHQS4K274F5tXLwMvfThkgleJIP7BUEqmO_r0ECxmxPyD89JgVk9orvOxFLMwYw5F1PQh8RDtZNeb1knDERyW2joNLJlKtoDOOmEulWBqp3Vredw";

const SIDE_LINKS = [
  { icon: "dashboard",                label: "Home",     href: "/" },
  { icon: "info",                     label: "Mission",     href: "/about", active: true },
  { icon: "settings_input_component", label: "The Program", href: "/program" },
  { icon: "groups",                   label: "Leadership",  href: "/team" },
  { icon: "hub",                      label: "Network",     href: "/alumni" },
  { icon: "quiz",                     label: "FAQ",   href: "/faq" },
  { icon: "play_circle",              label: "Demo",        href: "/demo" },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: SG }}>

      {/* ── Top App Bar ─────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4"
        style={{
          backgroundColor: "rgba(19,19,19,0.6)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(196,236,206,0.1)",
        }}
      >
        <Link href="/" className="text-2xl font-bold tracking-tighter" style={{ fontFamily: NS, color: "#C4ECCE" }}>
          MUJIN
        </Link>
        <div className="flex items-center gap-6">
          <button className="text-[10px] uppercase tracking-widest transition-colors hover:text-[#C4ECCE]" style={{ color: "#b4cad6", fontFamily: SG, background: "none", border: "none", cursor: "pointer" }}>EN</button>
          <Link href="/login" className="text-[10px] uppercase tracking-widest transition-colors hover:text-[#C4ECCE]" style={{ color: "#b4cad6", fontFamily: SG }}>Log in</Link>
        </div>
      </header>

      {/* ── Side Nav (Desktop) ──────────────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 h-full hidden lg:flex flex-col pt-20 pb-8 z-40"
        style={{ width: "256px", backgroundColor: "#0E0E0E", borderRight: "1px solid rgba(196,236,206,0.1)" }}
      >
        <nav className="flex-1">
          {SIDE_LINKS.map((l) => {
            const inner = (
              <>
                <span className="material-symbols-outlined">{l.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: SG }}>{l.label}</span>
              </>
            );
            const activeStyle = { color: "#C4ECCE", borderLeft: "4px solid #C4ECCE", backgroundColor: "rgba(196,236,206,0.1)" };
            const idleStyle = { color: "#b4cad6", opacity: 0.7 };

            return "external" in l && l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 py-4 px-8 hover:bg-[#131313] hover:opacity-100 transition-all"
                style={idleStyle}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center gap-4 py-4 px-8 hover:bg-[#131313] hover:opacity-100 transition-all"
                style={"active" in l && l.active ? activeStyle : idleStyle}
              >
                {inner}
              </Link>
            );
          })}
        </nav>
        <div className="px-8 mt-auto">
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 text-center text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#C4ECCE]/5 transition-all"
            style={{ border: "1px solid rgba(196,236,206,0.2)", color: "#C4ECCE", fontFamily: SG }}
          >
            Apply to Pilot
          </a>
        </div>
      </aside>

      <main className="lg:ml-64 pt-24 min-h-screen">

        {/* ── Hero Narrative ──────────────────────────────────────────────────── */}
        <section
          className="relative px-8 md:px-16 py-20 overflow-hidden"
          style={{ borderBottom: "1px solid rgba(66,72,66,0.1)" }}
        >
          <div className="absolute inset-0 seigaiha-pattern pointer-events-none" />
          <div className="max-w-6xl relative z-10 flex flex-col md:flex-row gap-16 items-start">

            {/* Text */}
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px" style={{ backgroundColor: "#C4ECCE" }} />
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: SG, color: "#A9D0B3" }}
                >
                  Origin_Protocol
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl mb-8 leading-[1.1] tracking-tight"
                style={{ fontFamily: NS, color: "#ffffff" }}
              >
                Where <span className="italic font-light" style={{ color: "#C4ECCE" }}>relational</span>{" "}
                trust meets financial <span className="text-glow">rails.</span>
              </h1>
              <p
                className="text-lg max-w-xl leading-relaxed font-light mb-12"
                style={{ color: "#c1c8c0" }}
              >
                Mujin was built inside a faith community that already had the trust — international
                students known by name, mentored for years, connected to a network that vouched for
                them. We built the rails to turn that relational capital into financial capital.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { label: "Founded",         value: "2026 · Tokyo" },
                  { label: "Pilot Launch",     value: "Q2 2027" },
                  { label: "Fund Target",      value: "¥50,000,000" },
                ].map((s) => (
                  <div key={s.label} className="pl-4 py-2" style={{ borderLeft: "1px solid rgba(196,236,206,0.2)" }}>
                    <span
                      className="block text-[10px] uppercase tracking-widest mb-2"
                      style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}
                    >
                      {s.label}
                    </span>
                    <span className="block text-xl" style={{ color: "#C4ECCE" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div
              className="w-full md:w-1/3 relative group"
              style={{ aspectRatio: "3/4", backgroundColor: "#1c1b1b", border: "1px solid rgba(66,72,66,0.2)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_HQ}
                alt="Tokyo architecture at night"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, #131313 0%, transparent 60%)", opacity: 0.6 }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <span
                  className="text-[10px] uppercase tracking-widest px-3 py-1"
                  style={{ fontFamily: SG, color: "#C4ECCE", backgroundColor: "rgba(19,19,19,0.8)" }}
                >
                  Tokyo · Japan
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Philosophy of 無尽 ───────────────────────────────────────────── */}
        <section
          className="px-8 md:px-16 py-32 relative overflow-hidden"
          style={{ backgroundColor: "#0E0E0E" }}
        >
          <div className="max-w-4xl mx-auto relative z-10">
            <h2
              className="text-3xl mb-12 pb-4 inline-block italic"
              style={{ fontFamily: NS, color: "#A9D0B3", borderBottom: "1px solid rgba(196,236,206,0.1)" }}
            >
              The Philosophy of 無尽
            </h2>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <p className="text-2xl leading-relaxed" style={{ fontFamily: NS, color: "rgba(229,226,225,0.9)" }}>
                &ldquo;I watched people who worked harder than anyone I knew get turned away from
                every door — not because they weren&apos;t capable, but because no one had ever
                given them a chance to prove it.&rdquo;
              </p>
              <div className="space-y-8">
                <p className="text-sm leading-loose" style={{ color: "#c1c8c0" }}>
                  無尽講 (Mujin-ko) is Japan&apos;s original rotating mutual aid association —
                  centuries old, built on trust, not collateral. Members pooled resources and
                  took turns receiving the full sum. It worked because everyone knew everyone.
                  We are not a foreign import. We are a revival.
                </p>
                <Link
                  href="/program"
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center transition-all group-hover:text-[#143723]"
                    style={{ border: "1px solid rgba(196,236,206,0.3)", color: "#C4ECCE" }}
                  >
                    <span className="material-symbols-outlined">auto_stories</span>
                  </div>
                  <div>
                    <span
                      className="block text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: "#C4ECCE", fontFamily: SG }}
                    >
                      Read_The_Program
                    </span>
                    <span className="block text-xs" style={{ color: "rgba(180,202,214,0.6)" }}>
                      How the Recyclable Grant works
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative kanji */}
          <div
            className="absolute top-1/2 right-12 -translate-y-1/2 pointer-events-none select-none"
            style={{ opacity: 0.03 }}
          >
            <span className="text-[20rem] leading-none italic" style={{ fontFamily: NS }}>無尽</span>
          </div>
        </section>

        {/* ── Timeline ────────────────────────────────────────────────────────── */}
        <section
          className="px-8 md:px-16 py-32"
          style={{ borderTop: "1px solid rgba(66,72,66,0.1)" }}
        >
          <div className="flex justify-between items-end mb-24">
            <div>
              <span
                className="text-[10px] tracking-[0.3em] uppercase block mb-4"
                style={{ color: "#C4ECCE", fontFamily: SG }}
              >
                Chronological_Ledger
              </span>
              <h2 className="text-4xl" style={{ fontFamily: NS, color: "#ffffff" }}>
                System History
              </h2>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                Roadmap
              </span>
            </div>
          </div>

          <div className="relative space-y-32">
            {/* Vertical line */}
            <div
              className="absolute left-0 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2"
              style={{ width: "1px", background: "linear-gradient(to bottom, #C4ECCE, #424842, transparent)" }}
            />

            {/* Oct 2025 — Visa Crisis */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:w-[45%] md:text-right">
                <span className="text-xs tracking-widest block mb-2" style={{ color: "#C4ECCE", fontFamily: SG }}>
                  OCT_2025
                </span>
                <h3 className="text-2xl mb-4" style={{ fontFamily: NS, color: "#ffffff" }}>
                  The Visa Crisis
                </h3>
                <p className="text-sm leading-relaxed md:ml-auto max-w-sm" style={{ color: "#c1c8c0" }}>
                  Japan&apos;s Business Manager Visa capital requirement surged from ¥5M to ¥30M overnight.
                  350,000 international students suddenly had no viable path to launch a business legally.
                  The need for a physical office solution became urgent.
                </p>
              </div>
              <div
                className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2"
                style={{ backgroundColor: "#C4ECCE", outline: "8px solid rgba(196,236,206,0.1)" }}
              />
              <div className="w-full md:w-[45%]">
                <div
                  className="aspect-video border overflow-hidden grayscale opacity-40 hover:opacity-100 transition-all duration-500"
                  style={{ backgroundColor: "#1c1b1b", borderColor: "rgba(66,72,66,0.2)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_TIMELINE_1} alt="Tokyo architecture" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* 2026 — Mujin Founded */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between gap-8">
              <div className="w-full md:w-[45%] text-left">
                <span className="text-xs tracking-widest block mb-2" style={{ color: "#C4ECCE", fontFamily: SG }}>
                  2026
                </span>
                <h3 className="text-2xl mb-4" style={{ fontFamily: NS, color: "#ffffff" }}>
                  Mujin Founded
                </h3>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#c1c8c0" }}>
                  Jonathan Ahn and Andrew Feng begin building the Recyclable Grant model inside the
                  ISM (International Student Ministry) network in Tokyo. Legal architecture established
                  under a Religious Corporation framework.
                </p>
              </div>
              <div
                className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2"
                style={{ backgroundColor: "#C4ECCE", outline: "8px solid rgba(196,236,206,0.1)" }}
              />
              <div className="w-full md:w-[45%]">
                <div
                  className="aspect-video border overflow-hidden grayscale opacity-40 hover:opacity-100 transition-all duration-500"
                  style={{ backgroundColor: "#1c1b1b", borderColor: "rgba(66,72,66,0.2)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG_TIMELINE_2} alt="Network nodes" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Q2 2027 — Pilot Launch */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
              <div className="w-full md:w-[45%] md:text-right">
                <span className="text-xs tracking-widest block mb-2" style={{ color: "#ffddb4", fontFamily: SG }}>
                  CURRENT_STATUS
                </span>
                <h3 className="text-2xl mb-4" style={{ fontFamily: NS, color: "#ffffff" }}>
                  Project: Pilot Cohort
                </h3>
                <p className="text-sm leading-relaxed md:ml-auto max-w-sm" style={{ color: "#c1c8c0" }}>
                  50 students. Q2 2027 launch. Fundraising, bank MOU signing, and church partnership
                  all in progress. The full pipeline — grant → trust score → bank introduction — goes
                  live for the first time.
                </p>
              </div>
              <div
                className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2"
                style={{ backgroundColor: "#ffddb4", outline: "8px solid rgba(255,221,180,0.1)" }}
              />
              <div className="w-full md:w-[45%]">
                <div className="p-6" style={{ backgroundColor: "#1c1b1b", border: "1px solid rgba(255,221,180,0.2)" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined" style={{ color: "#ffddb4" }}>settings_input_component</span>
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: "#ffddb4", fontFamily: SG }}>
                      Live_Diagnostic_Feed
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Legal Architecture", pct: "100%" },
                      { label: "Fundraising",         pct: "40%" },
                      { label: "Bank MOU",            pct: "20%" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,221,180,0.6)", fontFamily: SG }}>{bar.label}</span>
                          <span className="text-[9px]" style={{ color: "#ffddb4", fontFamily: SG }}>{bar.pct}</span>
                        </div>
                        <div className="h-1 w-full" style={{ backgroundColor: "rgba(255,221,180,0.1)" }}>
                          <div className="h-full" style={{ width: bar.pct, backgroundColor: "#ffddb4" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission Bento ───────────────────────────────────────────────────── */}
        <section
          className="px-8 md:px-16 py-32"
          style={{ backgroundColor: "#1c1b1b", borderTop: "1px solid rgba(66,72,66,0.1)" }}
        >
          <div className="mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase block mb-4" style={{ color: "#C4ECCE", fontFamily: SG }}>
              Operation_Directive
            </span>
            <h2 className="text-4xl" style={{ fontFamily: NS, color: "#ffffff" }}>The Four Pillars</h2>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            style={{ gridTemplateRows: "auto auto" }}
          >
            {/* Pillar 1: full height left */}
            <div
              className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between group"
              style={{ backgroundColor: "#131313", border: "1px solid rgba(66,72,66,0.2)" }}
            >
              <div>
                <span className="text-[10px] uppercase block mb-8" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                  Pillar_001
                </span>
                <h3
                  className="text-3xl mb-4 transition-colors group-hover:text-[#C4ECCE]"
                  style={{ fontFamily: NS, color: "#ffffff" }}
                >
                  The Recyclable Grant
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#c1c8c0" }}>
                  ¥500,000 per student. No interest. No legal repayment obligation. Upon graduating
                  to a bank, students voluntarily return the principal plus a covenant gift —
                  refilling the fund for the next generation. Capital that compounds through
                  generosity, not debt.
                </p>
              </div>
              <div className="flex justify-between items-end">
                <span
                  className="text-6xl italic"
                  style={{ fontFamily: NS, opacity: 0.05, color: "#e5e2e1" }}
                >
                  無尽
                </span>
                <span className="material-symbols-outlined text-4xl" style={{ color: "#C4ECCE" }}>savings</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div
              className="p-8 flex flex-col justify-between group"
              style={{ backgroundColor: "#2a2a2a", border: "1px solid rgba(66,72,66,0.1)" }}
            >
              <h3 className="text-xs uppercase tracking-widest" style={{ color: "#C4ECCE", fontFamily: SG }}>
                The Trust Score
              </h3>
              <div className="space-y-4">
                <p className="text-xs" style={{ color: "#b4cad6" }}>
                  Four behavioral signals. Zero financial data. Six green months triggers a
                  bank introduction.
                </p>
                <span className="material-symbols-outlined transition-all group-hover:text-[#b4cad6]" style={{ color: "rgba(180,202,214,0.3)" }}>analytics</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div
              className="p-8 flex flex-col justify-between group"
              style={{ backgroundColor: "#2a2a2a", border: "1px solid rgba(66,72,66,0.1)" }}
            >
              <h3 className="text-xs uppercase tracking-widest" style={{ color: "#C4ECCE", fontFamily: SG }}>
                The Commons
              </h3>
              <div className="space-y-4">
                <p className="text-xs" style={{ color: "#b4cad6" }}>
                  Church co-working within 15 min of major Tokyo universities. Satisfies the
                  Immigration Bureau&apos;s physical office requirement.
                </p>
                <span className="material-symbols-outlined transition-all group-hover:text-[#b4cad6]" style={{ color: "rgba(180,202,214,0.3)" }}>location_city</span>
              </div>
            </div>

            {/* Pillar 4: wide bottom right */}
            <div
              className="md:col-span-2 p-8 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, rgba(196,236,206,0.1), transparent)", border: "1px solid rgba(196,236,206,0.2)" }}
            >
              <div className="max-w-[60%]">
                <h3 className="text-xl mb-2" style={{ fontFamily: NS, color: "#C4ECCE" }}>
                  The Bank Bridge
                </h3>
                <p className="text-xs" style={{ color: "#c1c8c0" }}>
                  Graduates receive a warm introduction to a partner bank — not as a credit risk,
                  but as a vetted entrepreneur with a documented behavioral track record.
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ border: "2px solid rgba(196,236,206,0.2)" }}
              >
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-16 py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 seigaiha-pattern pointer-events-none" style={{ opacity: 0.05 }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-5xl mb-8 block" style={{ color: "#C4ECCE" }}>
              token
            </span>
            <h2 className="text-4xl mb-6 italic" style={{ fontFamily: NS, color: "#ffffff" }}>
              Join the First Cohort.
            </h2>
            <p className="mb-12" style={{ color: "#c1c8c0" }}>
              50 students. Launching Q2 2027. No credit history required — just the drive to build.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
                style={{ backgroundColor: "#C4ECCE", color: "#143723", fontFamily: SG }}
              >
                Apply Now
              </a>
              <Link
                href="/program"
                className="px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:border-[#C4ECCE] transition-all"
                style={{ border: "1px solid rgba(66,72,66,1)", color: "#ffffff", fontFamily: SG }}
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer
          className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-8"
          style={{ backgroundColor: "#0E0E0E", borderTop: "1px solid rgba(196,236,206,0.05)" }}
        >
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="italic" style={{ fontFamily: NS, color: "#C4ECCE" }}>MUJIN</span>
            <span
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}
            >
              © 2026 · A Frontier Commons Prototype
            </span>
          </div>
          <div className="flex gap-8">
            {[
              { label: "The Program", href: "/program" },
              { label: "Team",        href: "/team" },
              { label: "FAQ",         href: "/faq" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs tracking-widest uppercase hover:text-[#C4ECCE] transition-colors"
                style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4">
            {["terminal", "language", "hub"].map((icon) => (
              <span
                key={icon}
                className="material-symbols-outlined cursor-pointer hover:text-[#C4ECCE] transition-colors"
                style={{ color: "rgba(180,202,214,0.3)" }}
              >
                {icon}
              </span>
            ))}
          </div>
        </footer>
      </main>

      {/* ── Bottom Nav (Mobile) ─────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 w-full industrial-glass flex justify-around items-center py-4 px-2 z-50"
        style={{ borderTop: "1px solid rgba(196,236,206,0.1)" }}
      >
        {[
          { icon: "dashboard",    label: "Home",    href: "/" },
          { icon: "info",         label: "About",   href: "/about",   active: true },
          { icon: "auto_stories", label: "Program", href: "/program" },
          { icon: "groups",       label: "Team",    href: "/team" },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="flex flex-col items-center gap-1"
            style={{ color: "active" in l && l.active ? "#C4ECCE" : "rgba(180,202,214,0.6)" }}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={ "active" in l && l.active ? { fontVariationSettings: "'FILL' 1" } : {} }
            >
              {l.icon}
            </span>
            <span className="text-[8px] uppercase tracking-tighter" style={{ fontFamily: SG }}>{l.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
