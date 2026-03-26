import Link from "next/link";
import Navbar from "@/components/Navbar";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

/* ── Design tokens (from reference color scheme) ───────────────────────────── */
const C = {
  background:              "#f9f9f9",
  surface:                 "#f9f9f9",
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
  primaryContainer:        "#d6e3ff",
  onPrimary:               "#f6f7ff",
  onPrimaryContainer:      "#39527b",
  secondary:               "#486558",
  secondaryContainer:      "#c9ead9",
  onSecondaryContainer:    "#3a584b",
  tertiary:                "#5d5c78",
  tertiaryContainer:       "#d9d7f8",
  onTertiaryContainer:     "#4b4a65",
} as const;

/* ── Font stacks ───────────────────────────────────────────────────────────── */
const SG  = "var(--font-space-grotesk), sans-serif";   /* body / labels */
const NS  = "var(--font-noto-serif), serif";            /* display headings */
const IBM = "var(--font-ibm-mono), monospace";          /* meta / data */

/* ── Nav ───────────────────────────────────────────────────────────────────── */

/* ── Team data ─────────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name:        "Jonathan Ahn",
    nameJP:      "アン・ジョナサン",
    initials:    "JA",
    role:        "Founder & System Architect",
    secLevel:    "FOUNDER",
    accentColor: C.primary,
    badgeBg:     C.primaryContainer,
    badgeFg:     C.onPrimaryContainer,
    id:          "MJN-01-ALPHA",
    focus:       "Architecture · Strategy",
    quote:
      "I started Mujin because I watched people who worked harder than anyone I knew get turned away from every door — not because they weren't capable, but because no one had ever given them a chance to prove it.",
    icon:  "qr_code_2",
    tags:  ["Grant Architecture", "System Design", "Bank Outreach"],
  },
  {
    name:        "Andrew Feng",
    nameJP:      "フェン・アンドリュー",
    initials:    "AF",
    role:        "Director of Programs",
    secLevel:    "DIRECTOR",
    accentColor: C.secondary,
    badgeBg:     C.secondaryContainer,
    badgeFg:     C.onSecondaryContainer,
    id:          "MJN-02-SIGMA",
    focus:       "ISM Network · Cohort",
    quote:
      "The church already had the trust. The community already existed. We just needed to build the rails.",
    icon:  "hub",
    tags:  ["ISM Network", "Cohort Operations", "Mentor Relations"],
  },
];

/* ── Reusable card ─────────────────────────────────────────────────────────── */
function MemberCard({ member }: { member: typeof TEAM[number] }) {
  return (
    <div
      className="group flex flex-col h-full transition-shadow duration-300 hover:shadow-xl"
      style={{
        backgroundColor: C.surfaceContainerLowest,
        border:          `1px solid ${C.outlineVariant}33`,
        borderRadius:    "0.5rem",
        overflow:        "hidden",
      }}
    >
      {/* ── Avatar strip ─────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: C.surfaceContainer,
          aspectRatio:     "3 / 2",
        }}
      >
        {/* Ghost initials */}
        <span
          aria-hidden
          className="select-none pointer-events-none"
          style={{
            fontFamily: NS,
            fontSize:   "clamp(80px, 12vw, 140px)",
            lineHeight: 1,
            color:      `${member.accentColor}18`,
            fontStyle:  "italic",
            fontWeight: 700,
          }}
        >
          {member.initials}
        </span>

        {/* Security badge */}
        <div
          className="absolute top-4 right-4 text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 uppercase"
          style={{
            backgroundColor: member.badgeBg,
            color:           member.badgeFg,
            borderRadius:    "0.125rem",
            fontFamily:      IBM,
          }}
        >
          {member.secLevel}
        </div>

        {/* Active indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
          />
          <span
            className="text-[9px] uppercase tracking-[0.2em]"
            style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
          >
            Active
          </span>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.surfaceContainer})` }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-8">

        {/* Name + role */}
        <div className="mb-6">
          <h3
            className="text-2xl mb-3 leading-tight"
            style={{ fontFamily: NS, color: C.onSurface }}
          >
            {member.name}
          </h3>
          <div
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1"
            style={{
              backgroundColor: `${member.accentColor}12`,
              color:           member.accentColor,
              borderLeft:      `3px solid ${member.accentColor}`,
              fontFamily:      SG,
            }}
          >
            {member.role}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="flex-1 mb-6">
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: C.onSurfaceVariant }}
          >
            &ldquo;{member.quote}&rdquo;
          </p>
        </blockquote>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] uppercase tracking-[0.12em] px-2 py-1"
              style={{
                backgroundColor: C.surfaceContainerHigh,
                color:           C.onSurfaceVariant,
                borderRadius:    "0.125rem",
                fontFamily:      IBM,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div
          className="flex justify-between items-center pt-4"
          style={{ borderTop: `1px solid ${C.outlineVariant}40` }}
        >
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-sm"
              style={{ color: member.accentColor }}
            >
              {member.icon}
            </span>
            <span
              className="text-[9px] uppercase tracking-widest"
              style={{ color: C.outline, fontFamily: IBM }}
            >
              {member.focus}
            </span>
          </div>
          <span
            className="material-symbols-outlined transition-colors"
            style={{ color: C.outlineVariant, cursor: "pointer", fontSize: "20px" }}
          >
            arrow_forward
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function TeamPage() {
  return (
    <div style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="selection:bg-[#d6e3ff] selection:text-[#39527b]">

      <Navbar />

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="pt-24 pb-20 min-h-screen">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="px-8 md:px-12 py-20"
          style={{ borderBottom: `1px solid ${C.outlineVariant}40` }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

            {/* Left: Text */}
            <div className="lg:col-span-7">
              <span
                className="block text-[10px] uppercase tracking-[0.3em] mb-5"
                style={{ color: C.primary, fontFamily: SG }}
              >
                The Stewardship
              </span>
              <h1
                className="text-5xl md:text-7xl leading-[1.05] mb-6 tracking-tight"
                style={{ fontFamily: NS }}
              >
                The{" "}
                <em className="font-normal" style={{ color: C.secondary }}>
                  People
                </em>{" "}
                Behind the Trust.
              </h1>
              <p
                className="max-w-xl text-base leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Built at the intersection of faith, technology, and financial inclusion —
                because the solution to exclusion has to be relational, not just transactional.
              </p>
            </div>

            {/* Right: Stats */}
            <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: "Team Members",      value: "02",         accent: C.primary    },
                { label: "Pilot Capacity",    value: "50",         accent: C.secondary  },
                { label: "Grant Per Student", value: "¥500K",      accent: C.tertiary   },
                { label: "Pilot Launch",      value: "Q2 2027",    accent: C.primary    },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-6"
                  style={{
                    backgroundColor: C.surfaceContainerLow,
                    borderRadius:    "0.5rem",
                    borderLeft:      `3px solid ${s.accent}`,
                  }}
                >
                  <span
                    className="block text-3xl font-bold mb-1"
                    style={{ fontFamily: NS, color: s.accent }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="block text-[10px] uppercase tracking-widest"
                    style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team Grid ─────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-12 py-20">
          <div className="max-w-7xl mx-auto">

            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <h2
                className="text-3xl md:text-4xl"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                The Core Team
              </h2>
              <p
                className="text-[10px] uppercase tracking-[0.25em] max-w-xs text-right"
                style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
              >
                Founders of the Mujin Protocol
              </p>
            </div>

            {/* Cards — asymmetric 7/5 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MemberCard member={TEAM[0]} />
              </div>
              <div className="lg:col-span-5">
                <MemberCard member={TEAM[1]} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission Interlude ─────────────────────────────────────────────── */}
        <section
          className="px-8 md:px-12 py-16"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-center">

            {/* 無尽 kanji accent */}
            <div
              className="text-6xl md:text-7xl leading-none shrink-0 select-none"
              style={{ fontFamily: NS, fontStyle: "italic", color: `${C.secondary}30` }}
            >
              無尽
            </div>
            <div
              className="hidden md:block self-stretch w-px"
              style={{ backgroundColor: C.outlineVariant + "50" }}
            />
            <div>
              <p
                className="text-base md:text-lg leading-relaxed mb-3"
                style={{ color: C.onSurface }}
              >
                Every student in our pilot has a mentor, a mandate, and a structured
                path to financial standing. This team exists to make that path real.
              </p>
              <p
                className="text-xs"
                style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
              >
                Rooted in 無尽講 (mujin-ko) — Japan&#39;s original rotating mutual aid tradition.
              </p>
            </div>
          </div>
        </section>

        {/* ── Join / Recruit ────────────────────────────────────────────────── */}
        <section className="px-8 md:px-12 py-20">
          <div className="max-w-7xl mx-auto">
            <div
              className="relative overflow-hidden p-12 md:p-16"
              style={{
                backgroundColor: C.surfaceContainerHighest,
                borderRadius:    "0.75rem",
              }}
            >
              {/* Decorative accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(to right, ${C.primary}, ${C.secondary})` }}
              />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ color: C.secondary }}
                    >
                      add_moderator
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.25em]"
                      style={{ color: C.secondary, fontFamily: SG }}
                    >
                      Now Forming
                    </span>
                  </div>
                  <h2
                    className="text-3xl md:text-4xl leading-tight mb-3"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    The Network Is Growing.
                  </h2>
                  <p
                    className="text-sm max-w-md leading-relaxed"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    We are seeking mentors, advisors, and church partners who believe in what
                    we are building — people who already carry the trust, and want to lend it.
                  </p>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <a
                    href="mailto:hello@mujin.jp"
                    className="px-8 py-3 text-sm font-semibold tracking-wide text-center transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: C.primary,
                      color:           C.onPrimary,
                      borderRadius:    "0.25rem",
                      fontFamily:      SG,
                    }}
                  >
                    hello@mujin.jp
                  </a>
                  <span
                    className="text-center text-[9px] tracking-widest uppercase"
                    style={{ color: C.outline, fontFamily: IBM }}
                  >
                    Mentors · Advisors · Partners
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Technical Metadata ────────────────────────────────────────────── */}
        <section
          className="px-8 md:px-12 pt-6 pb-12"
          style={{ borderTop: `1px solid ${C.outlineVariant}40` }}
        >
          <div
            className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ opacity: 0.55 }}
          >
            {[
              { label: "Protocol",     value: "Non-binding Pledge"       },
              { label: "Entity",       value: "Religious Corp., Japan"   },
              { label: "Pilot Launch", value: "Q2 2027"                  },
              { label: "Location",     value: "35.6895°N  139.6917°E"    },
            ].map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <span
                  className="text-[9px] uppercase tracking-widest"
                  style={{ fontFamily: IBM, color: C.outline }}
                >
                  {m.label}
                </span>
                <span
                  className="text-[11px] font-bold"
                  style={{ fontFamily: IBM, color: C.onSurface }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="w-full py-12 px-8"
        style={{
          backgroundColor: C.surfaceContainerLow,
          borderTop:       `1px solid ${C.outlineVariant}40`,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <span
              className="text-xl font-bold tracking-widest"
              style={{ fontFamily: NS, color: C.primary }}
            >
              MUJIN
            </span>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: C.onSurfaceVariant, fontFamily: SG }}
            >
              © 2026 · A Frontier Commons Prototype
            </p>
          </div>
          <nav className="flex gap-8">
            {[
              { label: "The Program", href: "/program" },
              { label: "About",       href: "/about"   },
              { label: "FAQ",         href: "/faq"     },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs tracking-widest uppercase transition-colors"
                style={{ color: C.onSurfaceVariant, fontFamily: SG }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#22c55e", boxShadow: "0 0 8px #22c55e60" }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: C.secondary, fontFamily: SG }}
            >
              All Systems Nominal
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
