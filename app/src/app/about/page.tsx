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
  onSecondary:             "#e5fff1",
  onSecondaryContainer:    "#3a584b",
  tertiary:                "#5d5c78",
  tertiaryContainer:       "#d9d7f8",
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";


const STEPS = [
  {
    n: "01", icon: "edit_document",
    title: "Apply",
    desc:  "A narrative application explaining your entrepreneurial vision and how you are connected to the ISM network in Japan.",
  },
  {
    n: "02", icon: "diversity_3",
    title: "Mentor Match",
    desc:  "Paired with a dedicated mentor for bi-weekly check-ins. The relationship begins before the grant is issued.",
  },
  {
    n: "03", icon: "monitoring",
    title: "Trust Building",
    desc:  "Monthly P&L submissions, Town Hall attendance, and reflection journals build your Trust Score over 6+ months.",
  },
  {
    n: "04", icon: "account_balance",
    title: "Bank Introduction",
    desc:  "Four graduation gates cleared. A warm introduction to a partner bank — not as a credit risk, but as a vetted entrepreneur.",
  },
];

const PILLARS_BENTO = [
  {
    icon: "bolt", bg: C.secondary, fg: C.onSecondary,
    title: "The Recyclable Loop",
    desc:  "Funds never sit stagnant. Every repayment recycles directly into the next student's grant — capital that compounds through generosity, not debt.",
  },
  {
    icon: "hub", bg: C.surfaceContainer, fg: C.onSurface,
    title: "The ISM Network",
    desc:  "Distributed through Japan's International Student Ministry — IFI, KGK, CCC. Students are known by name before the grant is ever issued.",
    iconColor: C.primary,
  },
];

const TIMELINE = [
  { icon: "gavel",        label: "Q2 2026",  title: "Legal Opinion",    desc: "Legal architecture finalized. FSA boundary confirmed. Bank outreach begins.",   done: true  },
  { icon: "savings",      label: "Q3 2026",  title: "Fundraising",      desc: "¥50M target. Church partner secured. Pilot infrastructure built.",              done: false },
  { icon: "handshake",    label: "Q1 2027",  title: "Bank MOU",         desc: "Memorandum of understanding signed with Japanese partner bank.",                 done: false },
  { icon: "groups",       label: "Q2 2027",  title: "Pilot Launch",     desc: "50 students enrolled. First cohort begins the Mujin program.",                  done: false },
  { icon: "verified",     label: "Q4 2027",  title: "First Graduates",  desc: "Initial bank introductions. Pledge of Honor repayments begin cycling.",         done: false },
];

export default function AboutPage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="scroll-smooth selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >

      <Navbar />

      <main className="pt-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[780px] flex items-center px-12 py-24 overflow-hidden"
        >
          {/* Subtle gradient hint */}
          <div
            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          />

          <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

            {/* Left: Text */}
            <div className="lg:col-span-7">
              <span
                className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color:           C.onSecondaryContainer,
                  borderRadius:    "0.75rem",
                  fontFamily:      IBM,
                }}
              >
                FOUNDED 2026 · TOKYO
              </span>
              <h1
                className="text-6xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Where{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>
                  relational
                </em>{" "}
                trust meets financial rails.
              </h1>
              <p
                className="text-xl max-w-2xl mb-12 leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Mujin was built inside a faith community that already had the trust —
                international students known by name, mentored for years, connected to a network
                that vouched for them. We built the rails to turn that relational capital into
                financial capital.
              </p>
              <div className="flex flex-wrap gap-6">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 font-semibold transition-all"
                  style={{
                    backgroundColor: C.primary,
                    color:           C.onPrimary,
                    borderRadius:    "0.125rem",
                  }}
                >
                  Apply to Pilot
                </a>
                <Link
                  href="/program"
                  className="flex items-center gap-3 font-bold group"
                  style={{ color: C.primary }}
                >
                  How It Works
                  <span
                    className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                    style={{ fontSize: "20px" }}
                  >
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Visual panel */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div
                className="w-full flex flex-col items-center justify-center gap-8 p-12"
                style={{
                  aspectRatio:     "4 / 5",
                  backgroundColor: C.surfaceContainer,
                  borderRadius:    "0.5rem",
                  overflow:        "hidden",
                  position:        "relative",
                }}
              >
                <span
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                  style={{
                    fontFamily: NS,
                    fontSize:   "220px",
                    fontStyle:  "italic",
                    color:      `${C.secondary}10`,
                    lineHeight: 1,
                  }}
                >
                  無尽
                </span>
                <div className="relative z-10 text-center space-y-6">
                  {[
                    { value: "¥500K",   label: "Grant Per Student"  },
                    { value: "50",      label: "Pilot Students"     },
                    { value: "Q2 2027", label: "Launch Date"        },
                  ].map((s) => (
                    <div key={s.label}>
                      <span
                        className="block text-4xl font-bold"
                        style={{ fontFamily: NS, color: C.primary }}
                      >
                        {s.value}
                      </span>
                      <span
                        className="block text-xs uppercase tracking-widest mt-1"
                        style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── The Path ──────────────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-24 text-center max-w-3xl mx-auto">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                The Path to the Grant
              </h2>
              <p style={{ color: C.onSurfaceVariant }}>
                Our process is deliberate — focused on relationship and character, not credit history or collateral.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="group relative p-10 transition-all"
                  style={{
                    backgroundColor: C.surfaceContainerLowest,
                    borderRadius:    "0.5rem",
                  }}
                >
                  {/* Hover fill handled via inline onMouseOver would need JS — use group classes */}
                  <span
                    className="text-5xl font-bold absolute top-6 right-8 select-none pointer-events-none"
                    style={{
                      fontFamily: NS,
                      opacity:    0.07,
                      color:      C.onSurface,
                    }}
                  >
                    {step.n}
                  </span>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-8"
                    style={{ backgroundColor: C.secondaryContainer }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: C.secondary }}
                    >
                      {step.icon}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Beyond Conventional Finance (Bento) ───────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left: Text */}
              <div className="lg:col-span-4 flex flex-col justify-center">
                <h2
                  className="text-5xl font-bold mb-8 leading-tight"
                  style={{ fontFamily: NS, color: C.onSurface }}
                >
                  Beyond Conventional{" "}
                  <em className="font-normal italic" style={{ color: C.secondary }}>
                    Finance.
                  </em>
                </h2>
                <p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: C.onSurfaceVariant }}
                >
                  Mujin operates on an ethos of zero-interest growth. We prioritize
                  the flow of trust over the accumulation of debt.
                </p>
              </div>

              {/* Right: Bento cards */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                {PILLARS_BENTO.map((p) => (
                  <div
                    key={p.title}
                    className="p-12 flex flex-col justify-between"
                    style={{ backgroundColor: p.bg, borderRadius: "0.5rem" }}
                  >
                    <span
                      className="material-symbols-outlined text-4xl mb-12"
                      style={{ color: p.iconColor ?? p.fg }}
                    >
                      {p.icon}
                    </span>
                    <div>
                      <h3
                        className="text-2xl font-bold mb-4"
                        style={{ fontFamily: NS, color: p.fg }}
                      >
                        {p.title}
                      </h3>
                      <p style={{ color: p.fg, opacity: 0.8, fontSize: "0.9rem", lineHeight: "1.7" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Wide bottom card: The Pledge of Honor */}
                <div
                  className="md:col-span-2 p-12"
                  style={{ backgroundColor: C.primaryContainer, borderRadius: "0.5rem" }}
                >
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <span
                      className="material-symbols-outlined text-5xl shrink-0"
                      style={{ color: C.primary }}
                    >
                      history_toggle_off
                    </span>
                    <div>
                      <h3
                        className="text-2xl font-bold mb-4"
                        style={{ fontFamily: NS, color: C.onPrimaryContainer }}
                      >
                        The Pledge of Honor
                      </h3>
                      <p
                        className="leading-relaxed"
                        style={{ color: C.onPrimaryContainer, opacity: 0.85, lineHeight: "1.8" }}
                      >
                        Unlike traditional banking, the Mujin program charges zero interest and carries no legal
                        repayment obligation. Upon graduating to a bank, students voluntarily return the principal
                        plus a covenant gift — refilling the fund for the next generation. Capital that compounds
                        through generosity, not debt.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── The Problem ───────────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: `${C.secondaryContainer}40` }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

              {/* Left: Stat visual */}
              <div
                className="p-16 flex flex-col gap-8"
                style={{ backgroundColor: C.onSurface, borderRadius: "0.5rem" }}
              >
                <span
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: `${C.outlineVariant}80`, fontFamily: IBM }}
                >
                  The Gap — Japan 2026
                </span>
                <div>
                  <span
                    className="block text-7xl font-bold leading-none mb-4"
                    style={{ fontFamily: NS, color: C.primaryContainer }}
                  >
                    350,000
                  </span>
                  <span
                    className="block text-lg"
                    style={{ color: `${C.background}99` }}
                  >
                    international students in Japan with no access to startup capital — not because they lack ideas, but because Japan's financial system was never built to see them.
                  </span>
                </div>
                <div
                  className="pt-8"
                  style={{ borderTop: `1px solid ${C.background}20` }}
                >
                  {[
                    { label: "No credit history",    value: "Required by every bank" },
                    { label: "No permanent address", value: "Required for most loans"  },
                    { label: "No local guarantor",   value: "Required without exception" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-baseline py-3" style={{ borderBottom: `1px solid ${C.background}10` }}>
                      <span className="text-sm" style={{ color: `${C.background}70`, fontFamily: IBM }}>{row.label}</span>
                      <span className="text-sm font-bold" style={{ color: `${C.background}50` }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Text */}
              <div>
                <h2
                  className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                  style={{ fontFamily: NS, color: C.onSurface }}
                >
                  The problem isn't character.{" "}
                  <em className="font-normal italic" style={{ color: C.secondary }}>
                    It's infrastructure.
                  </em>
                </h2>
                <p
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: C.onSurfaceVariant }}
                >
                  Japan's banking system demands documentation that international students structurally cannot produce. No credit file. No guarantor. No permanent address. The door is closed — not by prejudice, but by design.
                </p>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: C.onSurfaceVariant }}
                >
                  Mujin doesn't fight that system. We built a parallel track: one grounded in community, behavior, and relationship — where trust is the collateral, because for these students, trust is the only thing they have in abundance.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── Our Conviction ────────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.background }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-20 max-w-3xl">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Why we build{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>
                  this way.
                </em>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                Every structural decision in Mujin is a philosophical one. Here is why we made them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon:  "history_edu",
                  title: "Rooted in 無尽講",
                  body:  "The mujin-ko was Japan's original rotating mutual aid society — neighbors pooling capital, taking turns, trusting each other. We didn't invent the idea. We gave it a digital spine and extended it to the most overlooked population in modern Japan.",
                  color: C.secondary,
                },
                {
                  icon:  "balance",
                  title: "Zero Interest by Design",
                  body:  "Interest compounds debt. We compound trust instead. The program charges nothing and collects nothing legally — only a Pledge of Honor to pay forward. The model only works if people actually want to. That pressure-tests character far better than a credit score.",
                  color: C.primary,
                },
                {
                  icon:  "church",
                  title: "The Church as Infrastructure",
                  body:  "We chose to operate inside existing faith communities not for theological reasons, but because those communities have already done the trust work. Ministry leaders know their students by name, history, and character. That knowledge is the raw material our platform converts into financial standing.",
                  color: C.tertiary ?? C.secondary,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-10 flex flex-col gap-6"
                  style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "0.5rem" }}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </span>
                  <h3
                    className="text-xl font-bold"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Roadmap Timeline ──────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerHigh }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <h2
              className="text-4xl font-bold text-center mb-24"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              Pilot Roadmap
            </h2>

            <div className="relative">
              {/* Progress line (desktop) */}
              <div
                className="hidden lg:block absolute top-6 left-0 w-full h-px"
                style={{ backgroundColor: C.outlineVariant }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
                {TIMELINE.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    {/* Circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                      style={{
                        backgroundColor: item.done ? C.primary : C.surfaceContainerLowest,
                        color:           item.done ? C.onPrimary : C.primary,
                        border:          item.done ? "none" : `1px solid ${C.primary}`,
                        boxShadow:       `0 0 0 8px ${C.surfaceContainerHigh}`,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        {item.icon}
                      </span>
                    </div>
                    <span
                      className="text-xs uppercase tracking-widest mb-1"
                      style={{ color: C.outline, fontFamily: IBM }}
                    >
                      {item.label}
                    </span>
                    <h4
                      className="font-bold text-lg mb-2"
                      style={{ fontFamily: NS, color: C.onSurface }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section
          className="py-24 px-12 text-center"
          style={{ backgroundColor: C.primary, color: C.onPrimary }}
        >
          <h2
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: NS, color: C.onPrimary }}
          >
            Ready to build something that lasts?
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto mb-12 font-light"
            style={{ color: `${C.onPrimary}cc` }}
          >
            Join the first cohort. 50 students. Q2 2027. No credit history required —
            just the drive to build and the community to vouch for you.
          </p>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 font-bold transition-all"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              color:           C.primary,
              borderRadius:    "0.125rem",
            }}
          >
            Begin Application
          </a>
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
              className="text-xl font-bold mb-6 tracking-widest uppercase"
              style={{ fontFamily: NS, color: "#1B365D" }}
            >
              MUJIN
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.onSurfaceVariant }}>
              A recyclable grant platform for international students in Japan.
              Backed by community, not collateral.
            </p>
          </div>
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest mb-6"
              style={{ color: C.onSurface, fontFamily: SG }}
            >
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { label: "The Program", href: "/program" },
                { label: "The Network", href: "/alumni"  },
                { label: "Apply",       href: APPLY_URL  },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm" style={{ color: C.onSurfaceVariant }}>
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
            <ul className="space-y-4">
              {[
                { label: "Leadership", href: "/team"  },
                { label: "Mission",    href: "/about" },
                { label: "FAQ",        href: "/faq"   },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm" style={{ color: C.onSurfaceVariant }}>
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
              Get In Touch
            </h4>
            <a
              href="mailto:hello@mujin.jp"
              className="text-sm font-medium"
              style={{ color: C.primary }}
            >
              hello@mujin.jp
            </a>
            <p className="text-xs mt-4 italic" style={{ color: C.outline }}>
              Mentors, advisors, and church partners welcome.
            </p>
          </div>
        </div>
        <div
          className="max-w-screen-2xl mx-auto px-12 mt-20 pt-8 text-center"
          style={{ borderTop: `1px solid ${C.outlineVariant}30` }}
        >
          <p className="text-xs tracking-wide" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>
            © 2026 MUJIN · A Frontier Commons Prototype · Tokyo, Japan
          </p>
        </div>
      </footer>

    </div>
  );
}
