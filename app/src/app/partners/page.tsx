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


export default function PartnersPage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="scroll-smooth selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >

      <Navbar />

      <main className="pt-24">

        {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[780px] flex items-center px-12 py-32 overflow-hidden"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          {/* Subtle background gradient */}
          <div
            className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          />

          <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">

            {/* Left: Text */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span
                className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color:           C.onSecondaryContainer,
                  borderRadius:    "0.75rem",
                  fontFamily:      IBM,
                }}
              >
                Partnership Program · Tokyo
              </span>
              <h1
                className="text-6xl md:text-7xl font-bold mb-8 leading-[1.05] tracking-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Built with the communities that already{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>
                  know their students.
                </em>
              </h1>
              <p
                className="text-xl max-w-2xl mb-12 leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Mujin doesn&apos;t recruit students from a database. Every student enters through a
                ministry leader who knows them personally. Partnership is not a nice-to-have —
                it is the prerequisite for the program to function at all.
              </p>
              <div className="flex flex-wrap gap-6">
                <a
                  href="mailto:hello@mujin.jp?subject=Ministry%20Partnership"
                  className="px-10 py-5 font-semibold transition-all"
                  style={{
                    backgroundColor: C.primary,
                    color:           C.onPrimary,
                    borderRadius:    "0.125rem",
                  }}
                >
                  Partner as a Ministry
                </a>
                <a
                  href="mailto:hello@mujin.jp?subject=Fund%20a%20Cohort"
                  className="flex items-center gap-3 font-bold group px-10 py-5 transition-all"
                  style={{
                    backgroundColor: C.surfaceContainerHigh,
                    color:           C.onSurface,
                    borderRadius:    "0.125rem",
                  }}
                >
                  Fund a Cohort
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Right: Bento partnership type cards */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full flex flex-col gap-4">
                {/* Ministry Partner card */}
                <div
                  className="p-8 flex items-start gap-6"
                  style={{
                    backgroundColor: C.secondaryContainer,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: C.secondary }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: C.onSecondary, fontSize: "22px" }}
                    >
                      church
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: NS, color: C.onSecondaryContainer }}
                    >
                      Ministry Partner
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.onSecondaryContainer, opacity: 0.8 }}
                    >
                      Church leaders and ISM ministry staff who refer and walk alongside
                      students through the program. You provide the trust foundation.
                    </p>
                    <span
                      className="inline-block mt-3 text-xs font-bold uppercase tracking-widest"
                      style={{ fontFamily: IBM, color: C.secondary }}
                    >
                      Referral + Accountability + Space
                    </span>
                  </div>
                </div>

                {/* Donor / Investor card */}
                <div
                  className="p-8 flex items-start gap-6"
                  style={{
                    backgroundColor: C.primaryContainer,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: C.primary }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: C.onPrimary, fontSize: "22px" }}
                    >
                      savings
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: NS, color: C.onPrimaryContainer }}
                    >
                      Donor / Impact Investor
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.onPrimaryContainer, opacity: 0.8 }}
                    >
                      Individuals and organizations who fund the grant pool. Your capital
                      recycles — every disbursement returns upon graduation.
                    </p>
                    <span
                      className="inline-block mt-3 text-xs font-bold uppercase tracking-widest"
                      style={{ fontFamily: IBM, color: C.primary }}
                    >
                      ¥500K Per Student · Recyclable
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 2. For Ministry Leaders ───────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.onSurface }}
        >
          <div className="max-w-screen-2xl mx-auto">

            <div className="mb-20 max-w-3xl">
              <span
                className="inline-block mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{ fontFamily: IBM, color: `${C.secondaryContainer}99` }}
              >
                For Ministry Leaders
              </span>
              <h2
                className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
                style={{ fontFamily: NS, color: C.background }}
              >
                You already did the trust work.{" "}
                <em className="font-normal italic" style={{ color: C.secondaryContainer }}>
                  We built the rails.
                </em>
              </h2>
              <p
                className="text-xl leading-relaxed"
                style={{ color: `${C.background}80` }}
              >
                Ministry leaders in Japan&apos;s ISM network have already done what Mujin needs most —
                they know their students by name, history, and character over years, not months.
                The referral is not a formality. It&apos;s the first trust signal.
              </p>
            </div>

            {/* 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
              {[
                {
                  icon:    "handshake",
                  iconBg:  C.secondaryContainer,
                  iconFg:  C.secondary,
                  title:   "What You Provide",
                  items:   [
                    "A personal referral for one student per cohort cycle",
                    "Ongoing accountability and pastoral presence",
                    "A physical or hybrid Mujin Commons space within your ministry",
                    "Bi-weekly Town Hall hosting for your cohort group",
                  ],
                },
                {
                  icon:    "rocket_launch",
                  iconBg:  C.primaryContainer,
                  iconFg:  C.primary,
                  title:   "What Mujin Provides",
                  items:   [
                    "¥500,000 grant issued upon enrollment",
                    "The Trust Engine platform — check-ins, P&L, scoring",
                    "Mentor coordination and matching",
                    "Bank introduction pathway upon graduation",
                  ],
                },
                {
                  icon:    "calendar_month",
                  iconBg:  `${C.tertiaryContainer}`,
                  iconFg:  C.tertiary,
                  title:   "The Commitment",
                  items:   [
                    "One cohort student referred per program cycle",
                    "Bi-weekly Town Hall co-hosting (in-person or hybrid)",
                    "Dedicated Commons space — formal office not required",
                    "Pastoral accountability for the duration of the program",
                  ],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-10 flex flex-col gap-6"
                  style={{
                    backgroundColor: `${C.background}08`,
                    borderRadius:    "0.5rem",
                    border:          `1px solid ${C.background}12`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: card.iconFg, fontSize: "22px" }}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ fontFamily: NS, color: C.background }}
                  >
                    {card.title}
                  </h3>
                  <ul className="space-y-3">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed"
                        style={{ color: `${C.background}70` }}
                      >
                        <span
                          className="material-symbols-outlined shrink-0 mt-0.5"
                          style={{ fontSize: "16px", color: `${C.background}40` }}
                        >
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Highlight quote */}
            <div
              className="p-12 flex items-start gap-8"
              style={{
                backgroundColor: `${C.background}06`,
                borderRadius:    "0.5rem",
                borderLeft:      `4px solid ${C.secondaryContainer}`,
              }}
            >
              <span
                className="material-symbols-outlined shrink-0 mt-1"
                style={{ fontSize: "28px", color: C.secondaryContainer }}
              >
                format_quote
              </span>
              <div>
                <p
                  className="text-2xl leading-relaxed font-light italic"
                  style={{ fontFamily: NS, color: C.background }}
                >
                  Your endorsement is not a reference letter. It is the first chapter of a
                  student&apos;s trust record.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. The Mujin Commons ──────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

              {/* Left: text + features */}
              <div className="lg:col-span-7">
                <span
                  className="inline-block mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: IBM, color: C.secondary }}
                >
                  The Mujin Commons
                </span>
                <h2
                  className="text-5xl font-bold mb-8 leading-tight"
                  style={{ fontFamily: NS, color: C.onSurface }}
                >
                  A space for the work{" "}
                  <em className="font-normal italic" style={{ color: C.secondary }}>
                    to happen.
                  </em>
                </h2>
                <p
                  className="text-xl leading-relaxed mb-16"
                  style={{ color: C.onSurfaceVariant }}
                >
                  The Mujin Commons is a co-working environment hosted inside partnering
                  ISM churches and ministries. It&apos;s where check-ins happen, where Town Halls
                  are held, where cohort members work alongside each other. It doesn&apos;t need to
                  be a formal office — any dedicated space where Mujin students can gather
                  and work is enough.
                </p>

                <div className="flex flex-col gap-6">
                  {[
                    {
                      icon:  "location_city",
                      title: "Physical anchor for the program",
                      desc:  "The Commons provides a verified address for Business Manager Visa applications — a structural requirement Mujin students couldn't otherwise satisfy.",
                    },
                    {
                      icon:  "groups",
                      title: "Town Hall venue",
                      desc:  "Every cohort Town Hall happens here. The rhythm of gathering — bi-weekly, consistent, in person — is what turns a group of students into a cohort.",
                    },
                    {
                      icon:  "trending_up",
                      title: "Where trust compounds in community",
                      desc:  "Working alongside peers who share the same stakes, the same pressures, and the same accountability creates a social context that individual check-ins alone cannot replicate.",
                    },
                  ].map((feat) => (
                    <div
                      key={feat.title}
                      className="flex items-start gap-6 p-8"
                      style={{
                        backgroundColor: C.surfaceContainerLowest,
                        borderRadius:    "0.5rem",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: C.secondaryContainer }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ color: C.secondary, fontSize: "18px" }}
                        >
                          {feat.icon}
                        </span>
                      </div>
                      <div>
                        <h4
                          className="font-bold mb-2"
                          style={{ fontFamily: NS, color: C.onSurface }}
                        >
                          {feat.title}
                        </h4>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: C.onSurfaceVariant }}
                        >
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Commons week card */}
              <div className="lg:col-span-5">
                <div
                  className="p-10 sticky top-32"
                  style={{
                    backgroundColor: C.onSurface,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <span
                    className="inline-block mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: IBM, color: `${C.background}50` }}
                  >
                    A Commons Week
                  </span>
                  <h3
                    className="text-2xl font-bold mb-10"
                    style={{ fontFamily: NS, color: C.background }}
                  >
                    What the rhythm looks like.
                  </h3>
                  <div className="space-y-0">
                    {[
                      {
                        day:    "Monday",
                        label:  "Co-work Hours",
                        desc:   "Open co-working. Students work on their ventures side by side. No agenda — just presence and momentum.",
                        icon:   "laptop_mac",
                        accent: C.secondaryContainer,
                      },
                      {
                        day:    "Wednesday",
                        label:  "Mentor Check-ins",
                        desc:   "Bi-weekly mentor sessions held at the Commons. Structured around the Trust Engine metrics — progress, blockers, next steps.",
                        icon:   "person_check",
                        accent: C.primaryContainer,
                      },
                      {
                        day:    "Friday",
                        label:  "Town Hall",
                        desc:   "The full cohort gathers. P&L updates shared. Trust Scores visible to the group. Ministry leader present. No autopilot.",
                        icon:   "groups",
                        accent: C.tertiaryContainer,
                      },
                    ].map((row, i, arr) => (
                      <div
                        key={row.day}
                        className="py-8 flex items-start gap-6"
                        style={{
                          borderBottom: i < arr.length - 1
                            ? `1px solid ${C.background}12`
                            : "none",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: row.accent }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ color: C.onSurface, fontSize: "18px" }}
                          >
                            {row.icon}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-baseline gap-3 mb-2">
                            <span
                              className="text-xs uppercase tracking-widest font-bold"
                              style={{ fontFamily: IBM, color: `${C.background}40` }}
                            >
                              {row.day}
                            </span>
                            <span
                              className="font-bold"
                              style={{ fontFamily: NS, color: C.background }}
                            >
                              {row.label}
                            </span>
                          </div>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: `${C.background}60` }}
                          >
                            {row.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. For Donors & Impact Investors ─────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">

            <div className="mb-20 text-center max-w-3xl mx-auto">
              <span
                className="inline-block mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{ fontFamily: IBM, color: C.primary }}
              >
                For Donors & Impact Investors
              </span>
              <h2
                className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Capital that never{" "}
                <em className="font-normal italic" style={{ color: C.primary }}>
                  stops working.
                </em>
              </h2>
              <p
                className="text-xl leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                The Mujin fund is not a grant pool that depletes. Every ¥500K disbursed creates a
                Pledge of Honor that returns to the fund upon graduation. The target is ¥50M for
                the first 50-student cohort — enough to run the full pilot and prove the model.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

              {/* Left: Cycle diagram */}
              <div className="lg:col-span-7">
                <h3
                  className="text-2xl font-bold mb-10"
                  style={{ fontFamily: NS, color: C.onSurface }}
                >
                  How the fund recycles.
                </h3>
                <div className="space-y-0">
                  {[
                    {
                      step:   "01",
                      icon:   "account_balance_wallet",
                      title:  "Initial Fund Raised",
                      desc:   "Donors and impact investors contribute to the ¥50M pilot fund. Capital is held and disbursed by Mujin. No investment structure — pure grant capital.",
                      arrow:  true,
                    },
                    {
                      step:   "02",
                      icon:   "payments",
                      title:  "Grants Issued",
                      desc:   "¥500K granted per enrolled student across two tranches — ¥300K at enrollment, ¥200K at the three-month gate. 50 students in the pilot cohort.",
                      arrow:  true,
                    },
                    {
                      step:   "03",
                      icon:   "monitoring",
                      title:  "Students Build & Graduate",
                      desc:   "Six-plus months of Trust Engine tracking. P&L accountability. Mentor check-ins. Town Halls. Four graduation gates — incorporation, cash flow, Trust Score, exit interview.",
                      arrow:  true,
                    },
                    {
                      step:   "04",
                      icon:   "autorenew",
                      title:  "Pledge of Honor Returns",
                      desc:   "Graduates who succeed voluntarily return the ¥500K principal plus a 5% success tithe. No legal obligation — only the covenant. Returned capital flows directly into the next cohort.",
                      arrow:  false,
                    },
                  ].map((row) => (
                    <div key={row.step} className="relative">
                      <div
                        className="flex items-start gap-8 p-8"
                        style={{
                          backgroundColor: C.surfaceContainerLow,
                          borderRadius:    "0.5rem",
                          marginBottom:    row.arrow ? "0" : "0",
                        }}
                      >
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: C.primaryContainer }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ color: C.primary, fontSize: "20px" }}
                            >
                              {row.icon}
                            </span>
                          </div>
                          {row.arrow && (
                            <div
                              className="w-px h-8"
                              style={{ backgroundColor: `${C.outlineVariant}60` }}
                            />
                          )}
                        </div>
                        <div className="pt-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="text-xs font-bold tracking-widest"
                              style={{ fontFamily: IBM, color: C.outline }}
                            >
                              {row.step}
                            </span>
                            <h4
                              className="font-bold text-lg"
                              style={{ fontFamily: NS, color: C.onSurface }}
                            >
                              {row.title}
                            </h4>
                          </div>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: C.onSurfaceVariant }}
                          >
                            {row.desc}
                          </p>
                        </div>
                      </div>
                      {row.arrow && <div className="h-1" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Impact metrics */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: NS, color: C.onSurface }}
                >
                  Pilot targets.
                </h3>
                {[
                  {
                    value: "¥500K",
                    label: "Per Student",
                    desc:  "The full grant amount. Disbursed in two tranches across six months.",
                    bg:    C.primaryContainer,
                    fg:    C.onPrimaryContainer,
                    num:   C.primary,
                  },
                  {
                    value: "50",
                    label: "Pilot Students",
                    desc:  "The first cohort. International students across Tokyo, referred through ISM network partners.",
                    bg:    C.secondaryContainer,
                    fg:    C.onSecondaryContainer,
                    num:   C.secondary,
                  },
                  {
                    value: "¥50M",
                    label: "Fund Target",
                    desc:  "The capital needed to run the full pilot, prove the model, and generate the first wave of Pledge returns.",
                    bg:    C.tertiaryContainer,
                    fg:    C.tertiary,
                    num:   C.tertiary,
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="p-8"
                    style={{
                      backgroundColor: metric.bg,
                      borderRadius:    "0.5rem",
                    }}
                  >
                    <span
                      className="block text-5xl font-bold mb-1"
                      style={{ fontFamily: NS, color: metric.num }}
                    >
                      {metric.value}
                    </span>
                    <span
                      className="block text-xs uppercase tracking-widest font-bold mb-3"
                      style={{ fontFamily: IBM, color: metric.fg }}
                    >
                      {metric.label}
                    </span>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: metric.fg, opacity: 0.8 }}
                    >
                      {metric.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* Giving tracks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-10 flex flex-col justify-between"
                style={{
                  backgroundColor: C.primary,
                  borderRadius:    "0.5rem",
                }}
              >
                <div>
                  <span
                    className="material-symbols-outlined mb-6 block"
                    style={{ fontSize: "36px", color: `${C.onPrimary}80` }}
                  >
                    person_pin
                  </span>
                  <h4
                    className="text-2xl font-bold mb-3"
                    style={{ fontFamily: NS, color: C.onPrimary }}
                  >
                    Fund a Full Cohort
                  </h4>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: `${C.onPrimary}cc` }}
                  >
                    ¥500K — one student&apos;s full journey. From enrollment through graduation
                    to bank introduction. The most direct way to put capital to work.
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <span
                    className="text-4xl font-bold"
                    style={{ fontFamily: NS, color: C.onPrimary }}
                  >
                    ¥500K
                  </span>
                  <a
                    href="mailto:hello@mujin.jp?subject=Fund%20a%20Cohort"
                    className="px-6 py-3 text-sm font-bold transition-all"
                    style={{
                      backgroundColor: C.onPrimary,
                      color:           C.primary,
                      borderRadius:    "0.125rem",
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </div>

              <div
                className="p-10 flex flex-col justify-between"
                style={{
                  backgroundColor: C.onSurface,
                  borderRadius:    "0.5rem",
                }}
              >
                <div>
                  <span
                    className="material-symbols-outlined mb-6 block"
                    style={{ fontSize: "36px", color: `${C.background}30` }}
                  >
                    star
                  </span>
                  <h4
                    className="text-2xl font-bold mb-3"
                    style={{ fontFamily: NS, color: C.background }}
                  >
                    Cornerstone Partner
                  </h4>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: `${C.background}70` }}
                  >
                    ¥5M and above. Naming rights for a Mujin Commons location. Your
                    organization&apos;s name on the space where the next generation of
                    international entrepreneurs does their first real work.
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <span
                    className="text-4xl font-bold"
                    style={{ fontFamily: NS, color: C.background }}
                  >
                    ¥5M+
                  </span>
                  <a
                    href="mailto:hello@mujin.jp?subject=Cornerstone%20Partner"
                    className="px-6 py-3 text-sm font-bold transition-all"
                    style={{
                      backgroundColor: C.background,
                      color:           C.onSurface,
                      borderRadius:    "0.125rem",
                    }}
                  >
                    Inquire
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. Why Partner with Mujin — Bento ────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerHigh }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-20 max-w-2xl">
              <span
                className="inline-block mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{ fontFamily: IBM, color: C.secondary }}
              >
                Why Partner with Mujin
              </span>
              <h2
                className="text-5xl font-bold leading-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Not charity.{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>
                  Infrastructure.
                </em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon:    "autorenew",
                  iconBg:  C.primaryContainer,
                  iconFg:  C.primary,
                  bg:      C.surfaceContainerLowest,
                  title:   "Recyclable Capital",
                  desc:    "Every yen you give recycles into the next generation. The Pledge of Honor mechanism means your initial contribution doesn't end — it compounds. Ten years from now, that ¥500K may have funded four or five student journeys.",
                  wide:    false,
                },
                {
                  icon:    "hub",
                  iconBg:  C.secondaryContainer,
                  iconFg:  C.secondary,
                  bg:      C.secondary,
                  textFg:  C.onSecondary,
                  title:   "Proven Network",
                  desc:    "Operating inside IFI, KGK, CCC, and JCFN — networks with 50+ years of student ministry presence in Japan. The referral pipeline is not theoretical. It is active, trusted, and already producing students who are ready.",
                  wide:    false,
                },
                {
                  icon:    "analytics",
                  iconBg:  C.primaryContainer,
                  iconFg:  C.primary,
                  bg:      C.primary,
                  textFg:  C.onPrimary,
                  title:   "Behavioral Data",
                  desc:    "Mujin is building the first platform to quantify relational trust as a financial signal. The Trust Score is not a proxy metric — it is a longitudinal behavioral record that no other institution in Japan is generating for this population. Graduates arrive at the bank with a dossier that speaks.",
                  wide:    false,
                },
                {
                  icon:    "account_balance",
                  iconBg:  C.tertiaryContainer,
                  iconFg:  C.tertiary,
                  bg:      C.surfaceContainerLowest,
                  title:   "Bank Bridge",
                  desc:    "Graduates don&apos;t just get money — they get introduced to a real banking relationship. The exit is warm, structured, and backed by six months of verified behavioral data. This is the infrastructure Japan&apos;s banking system doesn&apos;t have for international students. Mujin builds it.",
                  wide:    false,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-10 flex flex-col gap-6"
                  style={{
                    backgroundColor: card.bg,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: card.iconFg, fontSize: "22px" }}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: NS,
                      color:      card.textFg ?? C.onSurface,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: card.textFg
                        ? `${card.textFg}cc`
                        : C.onSurfaceVariant,
                    }}
                  >
                    {card.title === "Bank Bridge"
                      ? "Graduates don't just get money — they get introduced to a real banking relationship. The exit is warm, structured, and backed by six months of verified behavioral data. This is the infrastructure Japan's banking system doesn't have for international students. Mujin builds it."
                      : card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. Contact / Get Started ──────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <h2
                className="text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Ready to build something{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>
                  together?
                </em>
              </h2>
              <p
                className="text-xl leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                We respond to every inquiry personally. No automated pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {/* Ministry leaders path */}
              <div
                className="p-10 flex flex-col gap-6"
                style={{
                  backgroundColor: `${C.secondaryContainer}60`,
                  borderRadius:    "0.5rem",
                  border:          `1px solid ${C.secondaryContainer}`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: C.secondary }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: C.onSecondary, fontSize: "26px" }}
                  >
                    church
                  </span>
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    Ministry Leaders
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    If you lead an ISM ministry in Japan and want to explore bringing the
                    Mujin Commons to your community, reach out directly. We want to hear
                    about your students.
                  </p>
                </div>
                <a
                  href="mailto:hello@mujin.jp?subject=Ministry%20Partnership"
                  className="flex items-center gap-3 font-bold text-sm group"
                  style={{ color: C.secondary }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    mail
                  </span>
                  hello@mujin.jp
                  <span
                    className="inline-block text-xs uppercase tracking-widest"
                    style={{ fontFamily: IBM, color: C.outline }}
                  >
                    Subject: Ministry Partnership
                  </span>
                </a>
              </div>

              {/* Donors / Investors path */}
              <div
                className="p-10 flex flex-col gap-6"
                style={{
                  backgroundColor: `${C.primaryContainer}60`,
                  borderRadius:    "0.5rem",
                  border:          `1px solid ${C.primaryContainer}`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: C.primary }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: C.onPrimary, fontSize: "26px" }}
                  >
                    savings
                  </span>
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    Donors & Investors
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    Whether you want to fund a single student or become a Cornerstone
                    Partner with naming rights for a Commons location, the conversation
                    starts the same way — with a direct email.
                  </p>
                </div>
                <a
                  href="mailto:hello@mujin.jp?subject=Fund%20a%20Cohort"
                  className="flex items-center gap-3 font-bold text-sm group"
                  style={{ color: C.primary }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    mail
                  </span>
                  hello@mujin.jp
                  <span
                    className="inline-block text-xs uppercase tracking-widest"
                    style={{ fontFamily: IBM, color: C.outline }}
                  >
                    Subject: Fund a Cohort
                  </span>
                </a>
              </div>

            </div>

            <p
              className="text-center mt-12 text-sm italic"
              style={{ color: C.outline }}
            >
              We respond to every inquiry personally. No automated pipeline.
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
              style={{ color: C.onSurface }}
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
              style={{ color: C.onSurface }}
            >
              Organization
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Leadership", href: "/team"     },
                { label: "Mission",    href: "/about"    },
                { label: "Partners",   href: "/partners" },
                { label: "FAQ",        href: "/faq"      },
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
              style={{ color: C.onSurface }}
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
