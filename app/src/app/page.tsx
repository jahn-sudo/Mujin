import Link from "next/link";
import Navbar from "@/components/Navbar";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  background:              "#f9f9f9",
  surfaceContainerLowest:  "#ffffff",
  surfaceContainerLow:     "#f2f4f4",
  surfaceContainer:        "#ebeeef",
  surfaceContainerHigh:    "#e4e9ea",
  surfaceContainerHighest: "#dde4e5",
  onBackground:            "#2d3435",
  onSurface:               "#2d3435",
  onSurfaceVariant:        "#5a6061",
  outline:                 "#757c7d",
  outlineVariant:          "#adb3b4",
  primary:                 "#465f88",
  primaryDim:              "#3a537c",
  primaryContainer:        "#d6e3ff",
  onPrimary:               "#f6f7ff",
  onPrimaryContainer:      "#39527b",
  secondary:               "#486558",
  secondaryContainer:      "#c9ead9",
  onSecondaryContainer:    "#3a584b",
  tertiary:                "#5d5c78",
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";


export default function HomePage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >

      <Navbar />

      <main className="pt-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[820px] flex items-center px-12 max-w-screen-2xl mx-auto overflow-hidden"
        >
          <div className="z-10 w-full md:w-2/3 lg:w-1/2">
            <span
              className="uppercase tracking-[0.2em] mb-6 block text-sm"
              style={{ color: C.outline, fontFamily: IBM }}
            >
              The Recyclable Grant
            </span>
            <h1
              className="text-6xl md:text-8xl leading-tight mb-8"
              style={{ fontFamily: NS, letterSpacing: "-0.02em", color: C.onSurface }}
            >
              A grant built on{" "}
              <em className="font-normal" style={{ color: C.secondary }}>
                relational
              </em>{" "}
              trust.
            </h1>
            <p
              className="text-xl md:text-2xl font-light max-w-xl leading-relaxed mb-12"
              style={{ color: C.onSurfaceVariant }}
            >
              Mujin provides ¥500,000 venture scholarships to international students
              in Japan — backed by community, not collateral.
            </p>
            <div className="flex flex-wrap gap-6">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 font-medium text-lg transition-all"
                style={{
                  backgroundColor: C.primary,
                  color:           C.onPrimary,
                  borderRadius:    "0.25rem",
                }}
              >
                Apply to Pilot
              </a>
              <Link
                href="/about"
                className="flex items-center gap-2 font-medium"
                style={{ color: C.primary }}
              >
                How it works
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Right visual panel */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-4/5 hidden lg:block">
            <div
              className="w-full h-full flex items-center justify-center p-12"
              style={{
                backgroundColor: C.surfaceContainerLow,
                borderRadius:    "10rem 0 0 10rem",
              }}
            >
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-6"
                style={{
                  backgroundColor: C.surfaceContainer,
                  borderRadius:    "0.5rem",
                }}
              >
                <span
                  className="text-8xl"
                  style={{ fontFamily: NS, fontStyle: "italic", color: `${C.secondary}25` }}
                >
                  無尽
                </span>
                <p
                  className="text-center text-sm px-8 leading-relaxed"
                  style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
                >
                  無尽講 (mujin-ko)<br />
                  Japan&rsquo;s original rotating<br />mutual aid tradition
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Model ─────────────────────────────────────────────────────── */}
        <section
          className="py-32"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl mb-8"
                style={{ fontFamily: NS, letterSpacing: "-0.02em", color: C.onSurface }}
              >
                The Institutional Model
              </h2>
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: C.onSurfaceVariant }}
              >
                Mujin operates as a Religious Corporation in Japan, providing
                ¥500,000 venture scholarships to international students — not
                loans. Recipients sign a non-binding Pledge of Honor to recycle
                the principal upon success, funding the next generation.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                By anchoring grants in behavioral trust — not financial history —
                Mujin unlocks capital access for the 350,000 international students
                currently excluded from Japan&rsquo;s mainstream financial system.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[
                {
                  icon:  "volunteer_activism",
                  color: C.secondary,
                  title: "Recyclable Grant",
                  desc:  "Capital that comes back. Every repayment funds the next student's scholarship.",
                  offset: false,
                },
                {
                  icon:  "monitoring",
                  color: C.primary,
                  title: "Behavioral Trust",
                  desc:  "A 4-signal Trust Score measures what banks can't see: reliability and character.",
                  offset: true,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={card.offset ? "mt-12" : ""}
                  style={{
                    backgroundColor: C.surfaceContainerLowest,
                    padding:         "2rem",
                    borderRadius:    "0.5rem",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-4xl mb-4 block"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </span>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Key Metrics (Bento) ───────────────────────────────────────────── */}
        <section className="py-32 max-w-screen-2xl mx-auto px-12">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ minHeight: "380px" }}
          >
            {/* Large primary card */}
            <div
              className="md:col-span-2 p-12 flex flex-col justify-between relative overflow-hidden"
              style={{
                backgroundColor: C.primary,
                borderRadius:    "0.5rem",
              }}
            >
              <div className="z-10">
                <span
                  className="text-sm uppercase tracking-widest mb-4 block"
                  style={{ color: `${C.onPrimary}99`, fontFamily: IBM }}
                >
                  Grant Program
                </span>
                <h3
                  className="text-5xl"
                  style={{ fontFamily: NS, color: C.onPrimary }}
                >
                  50 Students
                </h3>
              </div>
              <p
                className="z-10 max-w-sm"
                style={{ color: `${C.onPrimary}cc` }}
              >
                Pilot cohort launching Q2 2027 — international students inside
                Japan&rsquo;s ISM network, mentored toward financial standing.
              </p>
              <div
                className="absolute -right-20 -bottom-20 opacity-10 select-none"
                aria-hidden
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20rem", color: C.onPrimary }}
                >
                  groups
                </span>
              </div>
            </div>

            {/* Secondary card */}
            <div
              className="p-12 flex flex-col justify-between"
              style={{
                backgroundColor: C.secondary,
                borderRadius:    "0.5rem",
              }}
            >
              <div>
                <span
                  className="text-sm uppercase tracking-widest mb-4 block"
                  style={{ color: "rgba(229,255,241,0.6)", fontFamily: IBM }}
                >
                  Per Student
                </span>
                <h3
                  className="text-5xl"
                  style={{ fontFamily: NS, color: "#e5fff1" }}
                >
                  ¥500K
                </h3>
              </div>
              <p style={{ color: "rgba(229,255,241,0.8)" }}>
                Two tranches: ¥300K on signing, ¥200K at Month 3 — zero interest, zero collateral.
              </p>
            </div>

            {/* Stats bar */}
            <div
              className="md:col-span-3 p-8 flex flex-wrap items-center justify-between gap-8"
              style={{
                backgroundColor: C.surfaceContainer,
                borderRadius:    "0.5rem",
              }}
            >
              <div className="flex flex-wrap gap-12">
                {[
                  { label: "Pilot Launch",   value: "Q2 2027"      },
                  { label: "Fund Target",    value: "¥50M"         },
                  { label: "Entity Type",    value: "Religious Corp." },
                  { label: "Pilot Location", value: "Tokyo, Japan" },
                ].map((s) => (
                  <div key={s.label}>
                    <span
                      className="block text-xs uppercase tracking-tighter mb-1"
                      style={{ color: C.outline, fontFamily: IBM }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: NS, color: C.onSurface }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: C.primary }}
              >
                monitoring
              </span>
            </div>
          </div>
        </section>

        {/* ── Founder's Vision ──────────────────────────────────────────────── */}
        <section
          className="py-32"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-5xl mx-auto px-12 text-center">
            <span
              className="text-2xl italic mb-8 block"
              style={{ fontFamily: NS, color: C.secondary }}
            >
              A letter from the Founder
            </span>
            <h2
              className="text-5xl md:text-6xl leading-tight mb-12"
              style={{
                fontFamily:    NS,
                letterSpacing: "-0.02em",
                color:         C.onSurface,
              }}
            >
              &ldquo;We did not build Mujin for the transaction, but for the{" "}
              <em className="font-normal" style={{ color: C.secondary }}>
                relationship.
              </em>&rdquo;
            </h2>
            <div
              className="w-24 h-px mx-auto mb-12"
              style={{ backgroundColor: C.outlineVariant }}
            />
            <p
              className="text-xl leading-relaxed font-light mb-12 text-left"
              style={{ color: C.onSurfaceVariant, columns: "2", gap: "3rem" }}
            >
              I started Mujin because I watched people who worked harder than
              anyone I knew get turned away from every door — not because they
              weren&rsquo;t capable, but because no one had ever given them a chance
              to prove it. The Japanese financial system wasn&rsquo;t built to see
              them. Mujin is. We built a system that sees character before capital.
              Consistency before credit. And we anchored it inside the communities
              that already knew these students by name — churches, ministries,
              mentors. The trust was already there. We just built the rails.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: C.primaryContainer }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: NS, color: C.onPrimaryContainer }}
                >
                  JA
                </span>
              </div>
              <div className="text-left">
                <p
                  className="font-bold text-sm uppercase tracking-wider"
                  style={{ color: C.onSurface }}
                >
                  Jonathan Ahn
                </p>
                <p
                  className="text-xs"
                  style={{ color: C.outline, fontFamily: IBM }}
                >
                  Founder &amp; System Architect
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Pillars ──────────────────────────────────────────────── */}
        <section
          className="py-32"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto px-12">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2
                  className="text-4xl mb-4"
                  style={{ fontFamily: NS, letterSpacing: "-0.02em", color: C.onSurface }}
                >
                  The Pillars
                </h2>
                <p style={{ color: C.onSurfaceVariant }}>
                  Core mechanisms powering the Mujin Trust Engine.
                </p>
              </div>
              <Link
                href="/program"
                className="font-medium hover:underline"
                style={{ color: C.primary }}
              >
                View Full Program
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  badge:     "Pillar 01",
                  badgeBg:   C.secondary,
                  badgeFg:   "#e5fff1",
                  title:     "The Recyclable Grant",
                  desc:      "A ¥500,000 venture scholarship with a non-binding Pledge of Honor. Upon success, recipients return the principal to fund the next generation — perpetually.",
                  icon:      "volunteer_activism",
                  iconColor: C.secondary,
                },
                {
                  badge:     "Pillar 02",
                  badgeBg:   C.primary,
                  badgeFg:   C.onPrimary,
                  title:     "The Trust Score",
                  desc:      "A 4-signal behavioral score — Responsiveness, Transparency, Mutualism, Reflection — that tells the story banks can&apos;t read from a credit report.",
                  icon:      "monitoring",
                  iconColor: C.primary,
                },
              ].map((pillar) => (
                <div key={pillar.title} className="group cursor-pointer">
                  <div
                    className="relative overflow-hidden mb-6 flex items-end p-10"
                    style={{
                      height:          "360px",
                      backgroundColor: C.surfaceContainer,
                      borderRadius:    "0.5rem",
                    }}
                  >
                    {/* Large background icon */}
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                      aria-hidden
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "280px",
                          color:    `${pillar.iconColor}10`,
                        }}
                      >
                        {pillar.icon}
                      </span>
                    </div>
                    <div className="relative z-10">
                      <span
                        className="px-3 py-1 text-xs uppercase tracking-widest mb-4 inline-block"
                        style={{
                          backgroundColor: pillar.badgeBg,
                          color:           pillar.badgeFg,
                          borderRadius:    "0.125rem",
                          fontFamily:      IBM,
                        }}
                      >
                        {pillar.badge}
                      </span>
                      <h3
                        className="text-3xl"
                        style={{ fontFamily: NS, color: C.onSurface }}
                      >
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ color: C.onSurfaceVariant, lineHeight: "1.75" }}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Network ───────────────────────────────────────────────────── */}
        <section
          className="py-32"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Visual */}
            <div
              className="relative h-[440px] flex items-center justify-center"
              style={{
                backgroundColor: C.surfaceContainerLow,
                borderRadius:    "1rem",
              }}
            >
              <div className="relative z-10 text-center">
                <div className="flex flex-wrap justify-center gap-10 mb-10">
                  {[
                    { code: "TKY", label: "Tokyo Hub"   },
                    { code: "IFI", label: "ISM Network" },
                    { code: "KGK", label: "KGK Japan"   },
                    { code: "CCC", label: "CCC Japan"   },
                  ].map((n) => (
                    <div key={n.code} className="text-center">
                      <span
                        className="block text-3xl"
                        style={{ fontFamily: NS, color: C.primary }}
                      >
                        {n.code}
                      </span>
                      <span
                        className="text-xs uppercase tracking-widest"
                        style={{ color: C.outline, fontFamily: IBM }}
                      >
                        {n.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: C.outlineVariant, fontFamily: IBM }}
                >
                  Distribution Network · Tokyo, Japan
                </p>
              </div>
            </div>

            {/* Text */}
            <div>
              <h2
                className="text-4xl md:text-5xl mb-8"
                style={{ fontFamily: NS, letterSpacing: "-0.02em", color: C.onSurface }}
              >
                The Trust Network
              </h2>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: C.onSurfaceVariant }}
              >
                Mujin operates through Japan&rsquo;s International Student Ministry
                network — IFI, KGK, CCC, and JCFN — where students are already
                known by name, mentored for years. The church is the distribution
                channel and the trust pipeline.
              </p>
              <ul className="space-y-4">
                {[
                  "Students known by name before the grant is issued",
                  "Bi-weekly mentor check-ins as part of the protocol",
                  "Monthly Town Halls build peer accountability",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 font-medium"
                    style={{ color: C.onSurface }}
                  >
                    <span
                      className="material-symbols-outlined mt-0.5"
                      style={{ color: C.secondary, fontSize: "20px" }}
                    >
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section
          className="py-40"
          style={{ backgroundColor: C.onSurface, color: C.background }}
        >
          <div className="max-w-screen-xl mx-auto px-12 text-center">
            <h2
              className="text-5xl md:text-7xl mb-12"
              style={{ fontFamily: NS, color: C.background }}
            >
              Securing the future of trust.
            </h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 text-xl font-medium transition-all w-full md:w-auto text-center"
                style={{
                  backgroundColor: C.primary,
                  color:           C.onPrimary,
                  borderRadius:    "0.25rem",
                }}
              >
                Apply to Pilot
              </a>
              <Link
                href="/demo"
                className="px-12 py-5 text-xl font-medium transition-all w-full md:w-auto text-center"
                style={{
                  border:       `1px solid ${C.background}40`,
                  color:        C.background,
                  borderRadius: "0.25rem",
                }}
              >
                Demo
              </Link>
            </div>
            <p
              className="mt-12 text-sm"
              style={{ color: `${C.outlineVariant}80`, fontFamily: IBM }}
            >
              Pilot open to international students in Japan&rsquo;s ISM network · Q2 2027 launch
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-20 border-t"
        style={{
          backgroundColor: C.surfaceContainerLow,
          borderColor:     `${C.outlineVariant}30`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
          <div>
            <div
              className="text-xl font-bold mb-6 tracking-widest"
              style={{ fontFamily: NS, color: "#1B365D" }}
            >
              MUJIN
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: C.onSurfaceVariant }}
            >
              A recyclable grant platform for international students in Japan.
              Backed by community, not collateral.
            </p>
            <div className="flex gap-4">
              {["public", "shield", "description"].map((icon) => (
                <span
                  key={icon}
                  className="material-symbols-outlined cursor-pointer transition-colors"
                  style={{ color: C.outlineVariant, fontSize: "22px" }}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest mb-6"
              style={{ color: C.onSurface, fontFamily: SG }}
            >
              Foundation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "The Program", href: "/program" },
                { label: "The Network", href: "/alumni"  },
                { label: "Apply",       href: APPLY_URL  },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest mb-6"
              style={{ color: C.onSurface, fontFamily: SG }}
            >
              Organization
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Leadership",  href: "/team"    },
                { label: "Mission",     href: "/about"   },
                { label: "FAQ",         href: "/faq"     },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4
              className="font-bold text-xs uppercase tracking-widest"
              style={{ color: C.onSurface, fontFamily: SG }}
            >
              Get In Touch
            </h4>
            <a
              href="mailto:hello@mujin.jp"
              className="text-sm font-medium transition-colors"
              style={{ color: C.primary }}
            >
              hello@mujin.jp
            </a>
            <p
              className="text-xs italic"
              style={{ color: C.outline }}
            >
              Mentors, advisors, and church partners welcome.
            </p>
          </div>
        </div>

        <div
          className="max-w-screen-2xl mx-auto px-12 mt-20 pt-8 text-center"
          style={{ borderTop: `1px solid ${C.outlineVariant}30` }}
        >
          <p
            className="text-xs tracking-wide"
            style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
          >
            © 2026 MUJIN · A Frontier Commons Prototype · Tokyo, Japan
          </p>
        </div>
      </footer>

    </div>
  );
}
