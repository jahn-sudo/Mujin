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

/* ── Footer site links ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Program",    href: "/program"  },
  { label: "Leadership", href: "/team"     },
  { label: "Network",    href: "/alumni"   },
  { label: "Mission",    href: "/about"    },
  { label: "FAQ",        href: "/faq"      },
  { label: "Partners",   href: "/partners" },
];

/* ── Path to Program ─────────────────────────────────────────────────────── */
const PATH_STEPS = [
  {
    n: "01", icon: "diversity_3",
    title: "Ministry Referral",
    desc:  "Every applicant enters through a partnered ISM ministry leader who provides a personal endorsement. You are known by name before any application is submitted.",
  },
  {
    n: "02", icon: "edit_document",
    title: "Application Review",
    desc:  "Staff review the mission alignment statement, Japan pain point narrative, and ministry endorsement. Character and clarity matter more than credentials.",
  },
  {
    n: "03", icon: "savings",
    title: "Grant Agreement",
    desc:  "¥500K grant issued in 2 tranches: ¥300K on signing, ¥200K at Month 3 if no Red Trust Score. A Pledge of Honor is signed — voluntarily, not legally binding.",
  },
  {
    n: "04", icon: "monitoring",
    title: "Trust Building",
    desc:  "A 4-signal Trust Score is tracked monthly for 6–18 months until graduation criteria are met. Six consecutive Green months triggers the bank introduction pathway.",
  },
];

/* ── Core Principles bento ───────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    icon: "autorenew",
    bg:   C.surfaceContainer,
    fg:   C.onSurface,
    iconColor: C.primary,
    title: "Recyclable Capital",
    desc:  "Each cohort's returned principal funds the next generation of students. ¥500K → pays forward. Capital that compounds through generosity, not debt.",
  },
  {
    icon: "hub",
    bg:   C.surfaceContainerHigh,
    fg:   C.onSurface,
    iconColor: C.secondary,
    title: "Social Collateral",
    desc:  "Behavior is a better predictor of creditworthiness than financial history. The Trust Score is the proof — built month by month in relationship.",
  },
];

/* ── Timeline phases ─────────────────────────────────────────────────────── */
const PHASES = [
  {
    label:  "Foundation",
    period: "Months 1–3",
    desc:   "Ministry referral → application → Pledge signed → Tranche 1 (¥300K) released. Company incorporation begins. Mentor matched.",
  },
  {
    label:  "Trust Building",
    period: "Months 3–12",
    desc:   "Monthly P&L, bi-weekly check-ins, Town Hall attendance. Trust Score tracked monthly. Tranche 2 (¥200K) released at Month 3 if no Red score.",
  },
  {
    label:  "Graduation Track",
    period: "Months 12–18",
    desc:   "6 consecutive Green months required. Exit interview scheduled. Bank introduction facilitated. Pledge of Honor repayment cycle begins.",
  },
];

/* ── Eligibility ─────────────────────────────────────────────────────────── */
const STUDENT_CRITERIA = [
  { icon: "school",         label: "Enrolled Student",       desc: "International student at a Japanese university" },
  { icon: "rocket_launch",  label: "Entrepreneurial Venture", desc: "Active or planned business in Japan" },
  { icon: "diversity_3",    label: "Ministry Endorsement",    desc: "A ministry leader must provide a personal referral" },
  { icon: "edit_note",      label: "Narrative Statements",    desc: "Japan pain point + faith motivation (300 words each)" },
];

const PARTNER_CRITERIA = [
  { icon: "account_balance", label: "Established ISM Org",   desc: "IFI, KGK, CCC, JCMN or recognized equivalent" },
  { icon: "person_check",    label: "Personal Knowledge",    desc: "Endorsing leader must know the student personally" },
  { icon: "handshake",       label: "Ongoing Accountability", desc: "Organization commits to continued relational support" },
];

export default function ProgramPage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="scroll-smooth selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >

      <Navbar />

      <main className="pt-24">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[680px] flex items-center px-12 py-28 overflow-hidden"
        >
          <div
            className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          />
          <div className="max-w-screen-2xl mx-auto w-full relative z-10">
            <span
              className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
              style={{
                backgroundColor: C.primaryContainer,
                color:           C.onPrimaryContainer,
                borderRadius:    "0.75rem",
                fontFamily:      IBM,
              }}
            >
              The Mujin Grant Program · V1.0
            </span>
            <h1
              className="text-6xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight max-w-4xl"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              The{" "}
              <em className="font-normal italic" style={{ color: C.secondary }}>
                Grant
              </em>{" "}
              Program.
            </h1>
            <p
              className="text-xl max-w-2xl leading-relaxed mb-12"
              style={{ color: C.onSurfaceVariant }}
            >
              A ¥500K recyclable grant for international students building ventures in Japan.
              No credit history. No collateral. Entry through relationship — the ISM network,
              Tokyo. Capital that pays forward, one cohort at a time.
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
                Apply to the Pilot Cohort
              </a>
              <Link
                href="/about"
                className="flex items-center gap-3 font-bold"
                style={{ color: C.primary }}
              >
                Our Mission
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Path to Program ───────────────────────────────────────────────── */}
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
                Path to the Program
              </h2>
              <p style={{ color: C.onSurfaceVariant, fontSize: "1.1rem", lineHeight: "1.7" }}>
                Our process is relationship-first. Every step is designed around trust, not transaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PATH_STEPS.map((step) => (
                <div
                  key={step.n}
                  className="relative p-10 transition-all"
                  style={{
                    backgroundColor: C.surfaceContainerLowest,
                    borderRadius:    "0.5rem",
                  }}
                >
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

        {/* ── Core Principles ───────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left: headline + text + highlight box */}
              <div className="lg:col-span-4 flex flex-col justify-center gap-8">
                <div>
                  <h2
                    className="text-5xl font-bold mb-6 leading-tight"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    Core{" "}
                    <em className="font-normal italic" style={{ color: C.secondary }}>
                      Principles.
                    </em>
                  </h2>
                  <p
                    className="text-lg leading-relaxed"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    Mujin is built on a belief that relational trust is the most underpriced
                    asset in international student finance. Our model operationalizes that
                    belief — behaviorally, not just philosophically.
                  </p>
                </div>

                {/* Highlight box: The Non-Binding Pledge */}
                <div
                  className="p-8"
                  style={{
                    backgroundColor: C.secondaryContainer,
                    borderRadius:    "0.5rem",
                    borderLeft:      `4px solid ${C.secondary}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: C.secondary }}
                    >
                      history_toggle_off
                    </span>
                    <h3
                      className="font-bold text-lg"
                      style={{ fontFamily: NS, color: C.onSecondaryContainer }}
                    >
                      The Non-Binding Pledge
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: C.onSecondaryContainer }}
                  >
                    Students sign a Pledge of Honor voluntarily. No debt collection.
                    No legal obligation. The model relies on relational trust, not
                    legal coercion. Character is the collateral.
                  </p>
                </div>
              </div>

              {/* Right: 2x2 bento + wide card */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                {PRINCIPLES.map((p) => (
                  <div
                    key={p.title}
                    className="p-12 flex flex-col justify-between"
                    style={{ backgroundColor: p.bg, borderRadius: "0.5rem" }}
                  >
                    <span
                      className="material-symbols-outlined text-4xl mb-10"
                      style={{ color: p.iconColor }}
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

                {/* Wide card: Ministry-Backed Entry */}
                <div
                  className="md:col-span-2 p-12"
                  style={{ backgroundColor: C.primary, borderRadius: "0.5rem" }}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <span
                      className="material-symbols-outlined text-5xl shrink-0"
                      style={{ color: C.primaryContainer }}
                    >
                      verified_user
                    </span>
                    <div>
                      <h3
                        className="text-2xl font-bold mb-4"
                        style={{ fontFamily: NS, color: C.onPrimary }}
                      >
                        Ministry-Backed Entry
                      </h3>
                      <p style={{ color: C.onPrimary, opacity: 0.85, lineHeight: "1.8", maxWidth: "640px" }}>
                        The ISM referral is the first signal. Students are known by name before any
                        grant is issued. The ministry leader is not just a reference — they are an
                        ongoing accountability partner throughout the program. Trust begins in community.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── The Stewardship Horizon (Phase Timeline) ──────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                The Program Timeline
              </h2>
              <p style={{ color: C.onSurfaceVariant, fontSize: "1.1rem" }}>
                Three phases. Six to eighteen months. Relationship first, capital second,
                bank introduction last.
              </p>
            </div>

            {/* Horizontal node line */}
            <div className="relative">
              {/* Connecting line */}
              <div
                className="hidden lg:block absolute top-[28px] left-0 right-0 h-[2px]"
                style={{ backgroundColor: C.outlineVariant }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {PHASES.map((phase, i) => (
                  <div key={phase.label} className="flex flex-col items-start lg:items-center">
                    {/* Node */}
                    <div className="flex lg:flex-col items-center gap-4 mb-6 w-full lg:items-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10"
                        style={{
                          backgroundColor: i === 0 ? C.primary : C.surfaceContainerLowest,
                          border:          `2px solid ${i === 0 ? C.primary : C.outlineVariant}`,
                        }}
                      >
                        <span
                          className="font-bold text-sm"
                          style={{
                            fontFamily: IBM,
                            color:      i === 0 ? C.onPrimary : C.onSurfaceVariant,
                          }}
                        >
                          Y{i + 1}
                        </span>
                      </div>
                      <div className="lg:text-center lg:mt-4">
                        <span
                          className="block text-xs font-bold tracking-[0.15em] uppercase mb-1"
                          style={{ fontFamily: IBM, color: C.primary }}
                        >
                          {phase.period}
                        </span>
                        <span
                          className="block text-xl font-bold"
                          style={{ fontFamily: NS, color: C.onSurface }}
                        >
                          {phase.label}
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed lg:text-center"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      {phase.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How the Trust Score Works ─────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-20 max-w-3xl">
              <span
                className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, borderRadius: "0.75rem", fontFamily: IBM }}
              >
                The Trust Score · 4 Signals · 100 Points
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                What the score{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>actually measures.</em>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                Each signal is worth 25 points. The score tells the story that a credit report cannot —
                built from behavior, relationship, and consistency over months, not a single snapshot.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  signal: "Responsiveness",
                  max: 25,
                  icon: "schedule",
                  color: "#1e40af",
                  bg: "#dbeafe",
                  question: "Are you showing up?",
                  measures: [
                    "Monthly P&L submitted on time",
                    "Bi-weekly mentor check-in attendance",
                    "Town Hall participation record",
                  ],
                  note: "Reliability is the first form of trust. Consistency in small things signals consistency in large ones.",
                },
                {
                  signal: "Transparency",
                  max: 25,
                  icon: "visibility",
                  color: "#7c3aed",
                  bg: "#ede9fe",
                  question: "Are you being honest?",
                  measures: [
                    "Quality and candor of monthly narrative reports",
                    "Disclosure of challenges — not just wins",
                    "Clarity and accuracy of financial reporting",
                  ],
                  note: "We reward hard truths over polished presentations. A disclosed problem scores higher than a hidden one.",
                },
                {
                  signal: "Mutualism",
                  max: 25,
                  icon: "hub",
                  color: "#9a3412",
                  bg: "#ffedd5",
                  question: "Are you giving back?",
                  measures: [
                    "Town Hall engagement and contribution to peers",
                    "Mentorship and support of other cohort members",
                    "Community participation beyond your own program",
                  ],
                  note: "The 無尽講 model only works if you pour in as well as draw out. Mutualism is the signal that proves it.",
                },
                {
                  signal: "Reflection",
                  max: 25,
                  icon: "menu_book",
                  color: "#4a5724",
                  bg: "#ecf1d6",
                  question: "Are you growing?",
                  measures: [
                    "AI-assessed reflection journal quality",
                    "Evidence of learning from setbacks",
                    "Demonstrated entrepreneurial growth arc over time",
                  ],
                  note: "We measure not just what you built, but how you think about what you're building.",
                },
              ].map((s) => (
                <div
                  key={s.signal}
                  className="p-10 flex flex-col gap-6"
                  style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "0.5rem" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: s.bg }}
                    >
                      <span className="material-symbols-outlined" style={{ color: s.color, fontSize: "22px" }}>{s.icon}</span>
                    </div>
                    <span
                      className="text-xs font-bold tracking-widest uppercase px-3 py-1 shrink-0"
                      style={{ backgroundColor: s.bg, color: s.color, borderRadius: "0.25rem", fontFamily: IBM }}
                    >
                      /{s.max} pts
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: NS, color: C.onSurface }}>{s.signal}</h3>
                    <p className="text-sm font-medium" style={{ color: s.color }}>{s.question}</p>
                  </div>
                  <ul className="space-y-2">
                    {s.measures.map((m) => (
                      <li key={m} className="flex items-start gap-3 text-sm" style={{ color: C.onSurfaceVariant }}>
                        <span className="material-symbols-outlined mt-0.5" style={{ color: s.color, fontSize: "16px" }}>check_circle</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                  <p
                    className="text-sm leading-relaxed italic pt-4"
                    style={{ color: C.onSurfaceVariant, borderTop: `1px solid ${C.outlineVariant}30` }}
                  >
                    {s.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Score thresholds */}
            <div
              className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8"
              style={{ backgroundColor: C.surfaceContainer, borderRadius: "0.5rem" }}
            >
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: NS, color: C.onSurface }}>Score Thresholds</h3>
                <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  Six consecutive Green months triggers the graduation pathway. A Red score at Month 3 pauses Tranche 2.
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                {[
                  { label: "GREEN",  range: "75 – 100", color: "#166534", bg: "#dcfce7", note: "On track for graduation" },
                  { label: "YELLOW", range: "50 – 74",  color: "#854d0e", bg: "#fef9c3", note: "Improvement required"    },
                  { label: "RED",    range: "0 – 49",   color: "#991b1b", bg: "#fee2e2", note: "Review triggered"        },
                ].map((t) => (
                  <div key={t.label} className="p-6 text-center" style={{ backgroundColor: t.bg, borderRadius: "0.375rem" }}>
                    <span className="block text-xs font-bold tracking-widest mb-2" style={{ color: t.color, fontFamily: IBM }}>{t.label}</span>
                    <span className="block text-2xl font-bold mb-1" style={{ fontFamily: NS, color: t.color }}>{t.range}</span>
                    <span className="block text-xs" style={{ color: t.color }}>{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Eligibility Checklists ─────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                Eligibility
              </h2>
              <p style={{ color: C.onSurfaceVariant, fontSize: "1.1rem" }}>
                Two kinds of partners. One shared commitment to relational accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Student Criteria */}
              <div
                className="p-10"
                style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "0.5rem" }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: C.primary }}
                  >
                    person
                  </span>
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    Student Criteria
                  </h3>
                </div>
                <div className="space-y-6">
                  {STUDENT_CRITERIA.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: C.primaryContainer }}
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ color: C.primary, fontSize: "18px" }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold mb-1" style={{ color: C.onSurface }}>
                          {item.label}
                        </p>
                        <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Criteria */}
              <div
                className="p-10"
                style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "0.5rem" }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: C.secondary }}
                  >
                    corporate_fare
                  </span>
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    Ministry Partner Criteria
                  </h3>
                </div>
                <div className="space-y-6">
                  {PARTNER_CRITERIA.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: C.secondaryContainer }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ color: C.secondary, fontSize: "18px" }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold mb-1" style={{ color: C.onSurface }}>
                          {item.label}
                        </p>
                        <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ISM org list */}
                <div
                  className="mt-8 p-5"
                  style={{
                    backgroundColor: C.surfaceContainer,
                    borderRadius:    "0.375rem",
                    borderLeft:      `3px solid ${C.secondary}`,
                  }}
                >
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-2"
                    style={{ fontFamily: IBM, color: C.onSurfaceVariant }}
                  >
                    Recognized ISM Organizations
                  </p>
                  <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                    IFI · KGK · CCC · JCMN · or recognized equivalent
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── The Mujin Commons ─────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <div>
              <span
                className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
                style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, borderRadius: "0.75rem", fontFamily: IBM }}
              >
                Physical Infrastructure
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                style={{ fontFamily: NS, color: C.onSurface }}
              >
                The Mujin{" "}
                <em className="font-normal italic" style={{ color: C.secondary }}>Commons.</em>
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: C.onSurfaceVariant }}>
                The Commons is a co-working environment hosted inside partnering ISM churches and ministries. It's where check-ins happen, where Town Halls are held, where cohort members work alongside each other. Not a formal office — a dedicated space where Mujin students gather, work, and build trust in community.
              </p>
              <ul className="space-y-6">
                {[
                  { icon: "location_on", title: "Anchored in Community", desc: "Each Commons is physically located inside a partnering church or ministry — embedding the program in the relational network that vouches for it." },
                  { icon: "groups",      title: "Town Hall Venue",        desc: "Monthly Town Halls are held at the Commons. Cohort members see each other's work, give feedback, and build the peer accountability that the Mutualism score measures." },
                  { icon: "trending_up", title: "Where Trust Compounds",  desc: "Day-to-day proximity generates the behavioral data that the Trust Score runs on. You can't fake consistency when your community sees you every week." },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: C.secondaryContainer }}
                    >
                      <span className="material-symbols-outlined" style={{ color: C.secondary, fontSize: "18px" }}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1" style={{ color: C.onSurface }}>{item.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: C.onSurfaceVariant }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commons week rhythm card */}
            <div
              className="p-12 flex flex-col gap-6"
              style={{ backgroundColor: C.onSurface, borderRadius: "0.5rem" }}
            >
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] mb-3" style={{ color: `${C.outlineVariant}80`, fontFamily: IBM }}>A Week at the Commons</span>
                <h3 className="text-2xl font-bold" style={{ fontFamily: NS, color: C.background }}>Structure creates trust.</h3>
              </div>
              {[
                { day: "MON",  label: "Open Co-Work Hours",     desc: "Cohort members work side by side. Informal peer support, shared focus." },
                { day: "WED",  label: "Mentor Check-Ins",       desc: "Scheduled 1:1 sessions. Progress reviewed. Blockers surfaced early."    },
                { day: "FRI",  label: "Reflection Submissions",  desc: "Weekly journal entries submitted. Feeds directly into the Trust Score." },
                { day: "MON+", label: "Monthly Town Hall",       desc: "Full cohort. P&L presentations. Mutual accountability in public."       },
              ].map((row) => (
                <div
                  key={row.day}
                  className="flex items-start gap-5 p-5"
                  style={{ backgroundColor: `${C.background}08`, borderRadius: "0.375rem" }}
                >
                  <span
                    className="text-xs font-bold tracking-widest pt-0.5 shrink-0 w-10"
                    style={{ color: C.secondary, fontFamily: IBM }}
                  >
                    {row.day}
                  </span>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: C.background }}>{row.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: `${C.background}70` }}>{row.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4" style={{ borderTop: `1px solid ${C.background}15` }}>
                <p className="text-sm" style={{ color: `${C.background}60`, fontFamily: IBM }}>
                  Commons hosted inside partnering ISM churches · Tokyo
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section
          className="py-32 px-12 text-center"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-2xl mx-auto">
            <span
              className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
              style={{
                backgroundColor: C.secondaryContainer,
                color:           C.onSecondaryContainer,
                borderRadius:    "0.75rem",
                fontFamily:      IBM,
              }}
            >
              Pilot Cohort · Q2 2027
            </span>
            <h2
              className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              Apply to the{" "}
              <em className="font-normal italic" style={{ color: C.secondary }}>
                Pilot Cohort.
              </em>
            </h2>
            <p
              className="text-xl mb-12 leading-relaxed"
              style={{ color: C.onSurfaceVariant }}
            >
              50 seats. International students building ventures in Japan.
              Ministry-endorsed, trust-tracked, bank-ready. Applications open now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 font-semibold text-lg transition-all"
                style={{
                  backgroundColor: C.primary,
                  color:           C.onPrimary,
                  borderRadius:    "0.125rem",
                }}
              >
                Apply Now
              </a>
              <Link
                href="/faq"
                className="px-12 py-5 font-semibold text-lg transition-all"
                style={{
                  backgroundColor: C.surfaceContainerHigh,
                  color:           C.onSurface,
                  borderRadius:    "0.125rem",
                }}
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-16 px-12"
        style={{ backgroundColor: C.surfaceContainerHigh, borderTop: `1px solid ${C.surfaceContainerHighest}` }}
      >
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-widest uppercase mb-4 block"
              style={{ fontFamily: NS, color: "#1B365D" }}
            >
              MUJIN
            </Link>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: C.onSurfaceVariant }}
            >
              A recyclable grant model for international students in Japan.
              Built on relational trust. Powered by the ISM network.
            </p>
          </div>
          <div className="flex flex-wrap gap-16">
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: IBM, color: C.onSurfaceVariant }}
              >
                Program
              </p>
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: IBM, color: C.onSurfaceVariant }}
              >
                Apply
              </p>
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold transition-colors"
                style={{ color: C.primary }}
              >
                Pilot Cohort Application →
              </a>
            </div>
          </div>
        </div>
        <div
          className="max-w-screen-2xl mx-auto mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{ borderTop: `1px solid ${C.outlineVariant}40`, color: C.onSurfaceVariant, fontFamily: IBM }}
        >
          <span>© 2026 Mujin · A Frontier Commons Prototype</span>
          <span>無尽 · Tokyo, Japan</span>
        </div>
      </footer>

    </div>
  );
}
