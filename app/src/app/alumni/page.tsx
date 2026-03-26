"use client";

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
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";


const NETWORK_NODES = [
  {
    icon: "hub",
    abbr: "IFI",
    name: "International Fellowship of Interchange",
    role: "Primary Deployment Node",
    node: "Tokyo",
  },
  {
    icon: "school",
    abbr: "KGK",
    name: "Kirisutosha Gakusei Kai",
    role: "University Campus Network",
    node: "Nationwide",
  },
  {
    icon: "groups",
    abbr: "CCC",
    name: "Campus Crusade for Christ",
    role: "Student Ministry Relay",
    node: "Multi-campus",
  },
  {
    icon: "diversity_3",
    abbr: "JCMN",
    name: "Japan Christian Missionary Network",
    role: "Parachurch Alliance",
    node: "Tokyo",
  },
];

const FRAMEWORK_CARDS = [
  {
    tag:    "Legal Entity",
    title:  "Religious Corp (Shukyo Hojin)",
    detail: "Non-binding pledge model",
    desc:   "Grants are issued under a religious corporation structure — enabling community accountability without triggering FSA lending classification.",
  },
  {
    tag:    "Financial Model",
    title:  "Non-binding Pledge",
    detail: "No debt collection, no FSA classification",
    desc:   "The Pledge of Honor is voluntary. Mujin never pursues repayment through legal channels. The model relies on relational trust, not legal obligation.",
  },
  {
    tag:    "Access Model",
    title:  "ISM Referral Required",
    detail: "Ministry endorsement required",
    desc:   "Every applicant enters through a partnered ministry leader. The referral is the first signal — students are known by name before any grant is issued.",
  },
  {
    tag:    "Bank Partner",
    title:  "Japan Finance Corp.",
    detail: "JFC + regional bank MOU in progress",
    desc:   "Mujin is pursuing a formal MOU with Japan Finance Corporation and regional private banks including Kiraboshi Bank and Tokyo Star Bank.",
  },
];

const ALLIANCE_PARTNERS = [
  { abbr: "IFI",   name: "Int'l Fellowship of Interchange" },
  { abbr: "KGK",   name: "Kirisutosha Gakusei Kai" },
  { abbr: "CCC",   name: "Campus Crusade for Christ" },
  { abbr: "JCMN",  name: "Japan Christian Missionary Network" },
  { abbr: "TSB",   name: "Tokyo Star Bank" },
  { abbr: "JFC",   name: "Japan Finance Corporation" },
];

export default function AlumniPage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="scroll-smooth selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >

      <Navbar />

      <main className="pt-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[780px] flex items-center px-12 py-24 overflow-hidden">
          {/* Subtle gradient hint */}
          <div
            className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
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
                Operational Infrastructure
              </span>
              <h1
                className="text-6xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                A Network Built on{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>
                  Relational
                </em>{" "}
                Trust.
              </h1>
              <p
                className="text-xl max-w-2xl mb-12 leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Mujin does not source students from the open market. Every applicant
                enters through a trusted ministry partner — a person who knows the
                student by name, has walked with them, and is willing to stake their
                relational credibility on the referral.
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

            {/* Right: Network visual panel */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div
                className="w-full flex flex-col items-center justify-center gap-8 p-10"
                style={{
                  aspectRatio:     "4 / 5",
                  backgroundColor: C.surfaceContainer,
                  borderRadius:    "1rem",
                  overflow:        "hidden",
                  position:        "relative",
                }}
              >
                {/* Ghost kanji */}
                <span
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                  style={{
                    fontFamily: NS,
                    fontSize:   "200px",
                    fontStyle:  "italic",
                    color:      `${C.secondary}10`,
                    lineHeight: 1,
                  }}
                >
                  無尽
                </span>

                {/* Label */}
                <div
                  className="relative z-10 text-center px-6 py-3 w-full"
                  style={{
                    backgroundColor: C.surfaceContainerHighest,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <span
                    className="text-sm font-semibold tracking-wide"
                    style={{ fontFamily: IBM, color: C.primary }}
                  >
                    ISM Network · Tokyo, Japan
                  </span>
                </div>

                {/* Stats */}
                <div className="relative z-10 w-full grid grid-cols-1 gap-4">
                  {[
                    { value: "4",     label: "Partner Organizations" },
                    { value: "50+",   label: "Mentors in Network"    },
                    { value: "350K",  label: "Students in Japan"     },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between px-6 py-4"
                      style={{
                        backgroundColor: C.surfaceContainerLowest,
                        borderRadius:    "0.375rem",
                        border:          `1px solid ${C.outlineVariant}40`,
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: C.onSurfaceVariant, fontFamily: SG }}
                      >
                        {s.label}
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ fontFamily: NS, color: C.primary }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Network Nodes ─────────────────────────────────────────────── */}
        <section
          className="px-12 py-24"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-16">
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase block mb-4"
                style={{ color: C.primary, fontFamily: IBM }}
              >
                Deployment Infrastructure
              </span>
              <h2
                className="text-5xl md:text-6xl font-bold tracking-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                The Network Nodes
              </h2>
              <p
                className="mt-6 text-lg max-w-2xl leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Four ministry organizations form the backbone of the Mujin
                referral network. Each node has its own geographic reach, student
                profile, and ministry culture — all unified by a shared commitment
                to relational accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {NETWORK_NODES.map((node) => (
                <div
                  key={node.abbr}
                  className="group relative flex flex-col justify-between p-8 overflow-hidden transition-colors duration-500 h-[320px]"
                  style={{
                    backgroundColor: C.surfaceContainerLowest,
                    borderRadius:    "0.5rem",
                    border:          `1px solid ${C.outlineVariant}40`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = C.primary;
                    (e.currentTarget as HTMLDivElement).style.borderColor = C.primary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = C.surfaceContainerLowest;
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${C.outlineVariant}40`;
                  }}
                >
                  {/* Icon */}
                  <div>
                    <span
                      className="material-symbols-outlined text-4xl mb-6 block transition-colors duration-500 group-hover:text-white"
                      style={{ color: C.primary }}
                    >
                      {node.icon}
                    </span>
                    <span
                      className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase mb-4 transition-colors duration-500 group-hover:bg-white/20 group-hover:text-white"
                      style={{
                        backgroundColor: C.primaryContainer,
                        color:           C.onPrimaryContainer,
                        borderRadius:    "0.25rem",
                        fontFamily:      IBM,
                      }}
                    >
                      {node.role}
                    </span>
                    <h3
                      className="text-2xl font-bold transition-colors duration-500 group-hover:text-white"
                      style={{ fontFamily: NS, color: C.onSurface }}
                    >
                      {node.abbr}
                    </h3>
                    <p
                      className="text-sm mt-2 leading-snug transition-colors duration-500 group-hover:text-white/80"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      {node.name}
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center gap-2 pt-4 transition-colors duration-500"
                    style={{ borderTop: `1px solid ${C.outlineVariant}40` }}
                  >
                    <span
                      className="material-symbols-outlined text-base transition-colors duration-500 group-hover:text-white/60"
                      style={{ color: C.outlineVariant }}
                    >
                      location_on
                    </span>
                    <span
                      className="text-xs tracking-widest uppercase transition-colors duration-500 group-hover:text-white/60"
                      style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
                    >
                      {node.node}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Community Health ──────────────────────────────────────────────── */}
        <section className="px-12 py-24">
          <div className="max-w-screen-2xl mx-auto max-w-2xl space-y-6">
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase block mb-4"
              style={{ color: C.secondary, fontFamily: IBM }}
            >
              Program Cadence
            </span>
            <h2
              className="text-5xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              Community Health
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: C.onSurfaceVariant }}
            >
              Accountability is built into the rhythm — not added on top. Two
              mandatory touchpoints per month create a baseline of visibility
              across every cohort member.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { value: "Bi-Weekly Check-ins", meta: "Mandatory",     bg: C.surfaceContainerHigh },
                { value: "Monthly Town Halls",  meta: "Peer Reported", bg: C.surfaceContainerHighest },
              ].map((card) => (
                <div
                  key={card.value}
                  className="flex items-center justify-between px-6 py-5"
                  style={{
                    backgroundColor: card.bg,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <span
                    className="font-semibold text-base"
                    style={{ color: C.onSurface, fontFamily: SG }}
                  >
                    {card.value}
                  </span>
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
                  >
                    {card.meta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Framework ─────────────────────────────────────────────────── */}
        <section
          className="py-24 overflow-hidden"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto px-12 mb-12">
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase block mb-4"
              style={{ color: C.primary, fontFamily: IBM }}
            >
              Legal & Financial Architecture
            </span>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-tight"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              The Framework
            </h2>
            <p
              className="mt-6 text-lg max-w-2xl leading-relaxed"
              style={{ color: C.onSurfaceVariant }}
            >
              Mujin was designed from the ground up to operate legally and
              transparently within Japan&apos;s regulatory environment — without
              triggering financial services classification.
            </p>
          </div>

          {/* Horizontally scrollable cards */}
          <div className="px-12 overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {FRAMEWORK_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="flex-none w-80 flex flex-col justify-between p-8"
                  style={{
                    backgroundColor: C.surfaceContainerLowest,
                    borderRadius:    "0.5rem",
                    border:          `1px solid ${C.outlineVariant}40`,
                    height:          "300px",
                  }}
                >
                  <div>
                    <span
                      className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase mb-5"
                      style={{
                        backgroundColor: C.primaryContainer,
                        color:           C.onPrimaryContainer,
                        borderRadius:    "0.25rem",
                        fontFamily:      IBM,
                      }}
                    >
                      {card.tag}
                    </span>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ fontFamily: NS, color: C.onSurface }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-xs uppercase tracking-widest mb-4"
                      style={{ color: C.primary, fontFamily: IBM }}
                    >
                      {card.detail}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Alliance ──────────────────────────────────────────────────── */}
        <section className="px-12 py-24">
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-16 text-center">
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase block mb-4"
                style={{ color: C.secondary, fontFamily: IBM }}
              >
                Partner Institutions
              </span>
              <h2
                className="text-5xl font-bold tracking-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                The Alliance
              </h2>
              <p
                className="mt-6 text-lg max-w-xl mx-auto leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Ministry networks, banking institutions, and missional
                organizations working together to make the Mujin model possible.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {ALLIANCE_PARTNERS.map((p) => (
                <div
                  key={p.abbr}
                  className="group flex flex-col items-center justify-center gap-3 p-8 transition-all duration-300"
                  style={{
                    backgroundColor: C.surfaceContainerLow,
                    borderRadius:    "0.5rem",
                    border:          `1px solid ${C.outlineVariant}30`,
                    opacity:         0.6,
                    filter:          "grayscale(1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    (e.currentTarget as HTMLDivElement).style.filter = "grayscale(0)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.opacity = "0.6";
                    (e.currentTarget as HTMLDivElement).style.filter = "grayscale(1)";
                  }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{ fontFamily: NS, color: C.primary }}
                  >
                    {p.abbr}
                  </span>
                  <span
                    className="text-[10px] text-center leading-tight"
                    style={{ color: C.onSurfaceVariant, fontFamily: SG }}
                  >
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section className="px-12 py-24">
          <div className="max-w-screen-2xl mx-auto">
            <div
              className="flex flex-col md:flex-row items-center justify-between gap-8 px-16 py-16"
              style={{
                backgroundColor: C.onSurface,
                borderRadius:    "9999px",
              }}
            >
              <div>
                <h2
                  className="text-4xl md:text-5xl font-bold tracking-tight"
                  style={{ fontFamily: NS, color: C.onPrimary }}
                >
                  Become a Network Partner.
                </h2>
                <p
                  className="mt-4 text-base"
                  style={{ color: C.outlineVariant }}
                >
                  Ministry leaders, banks, and organizations — reach out directly.
                </p>
              </div>
              <a
                href="mailto:hello@mujin.jp"
                className="shrink-0 px-10 py-5 font-semibold text-base transition-all duration-200 active:scale-95 hover:brightness-110"
                style={{
                  backgroundColor: C.primary,
                  color:           C.onPrimary,
                  borderRadius:    "9999px",
                  fontFamily:      SG,
                }}
              >
                hello@mujin.jp
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer
        className="w-full py-16 px-12"
        style={{ backgroundColor: C.surfaceContainerLow, borderTop: `1px solid ${C.outlineVariant}30` }}
      >
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-widest uppercase"
              style={{ fontFamily: NS, color: "#1B365D" }}
            >
              MUJIN
            </Link>
            <p
              className="mt-2 text-xs uppercase tracking-widest"
              style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
            >
              © 2026 · A Frontier Commons Prototype
            </p>
          </div>

          <div className="flex flex-wrap gap-10">
            {[
              { label: "Program",    href: "/program" },
              { label: "Leadership", href: "/team"    },
              { label: "Network",    href: "/alumni"  },
              { label: "Mission",    href: "/about"   },
              { label: "FAQ",        href: "/faq"     },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-[#465f88]"
                style={{ color: C.onSurfaceVariant, fontFamily: SG }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 font-semibold text-sm transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: C.primary,
              color:           C.onPrimary,
              borderRadius:    "0.125rem",
              fontFamily:      SG,
            }}
          >
            Apply to Pilot
          </a>
        </div>
      </footer>

    </div>
  );
}
