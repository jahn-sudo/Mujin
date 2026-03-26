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
  onSecondaryContainer:    "#3a584b",
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";


const FAQ_SECTIONS = [
  {
    id:    "eligibility",
    label: "Eligibility",
    pill:  "General",
    items: [
      {
        q: "Who can apply to the pilot cohort?",
        a: "The pilot is open to international students enrolled at a Japanese university who are connected to a Christian student ministry and have a venture idea they are actively building or ready to begin. Japanese students and refugees will be invited in subsequent cohorts.",
      },
      {
        q: "Do I need an existing business to apply?",
        a: "No. You need a clear venture idea and the commitment to build it. Company incorporation is a graduation requirement — not an application requirement.",
      },
      {
        q: "Do I need to be a Christian to apply?",
        a: "The pilot is recruited through Christian student ministries, and a ministry leader endorsement is part of the application. The program is rooted in a faith community, but the grant and Trust Engine are secular in operation.",
      },
      {
        q: "Can Japanese nationals apply?",
        a: "Not in the pilot cohort. The first cohort is focused on international students. Japanese youth are the second priority group and will be invited in a subsequent cohort.",
      },
    ],
  },
  {
    id:    "grant",
    label: "The Grant",
    pill:  "The Grant",
    items: [
      {
        q: "Is this a loan?",
        a: "No. The ¥500,000 is a grant — there is no legal obligation to repay. You sign a non-binding Pledge of Honor: a voluntary commitment to return the principal plus a 5% success tithe if your venture succeeds and you graduate to a bank. If you do not succeed, nothing is owed.",
      },
      {
        q: "What can I use the grant for?",
        a: "Early venture operations only: company incorporation fees, tools, software, hosting, co-working, travel, and marketing. Personal living expenses are not covered.",
      },
      {
        q: "How is the grant disbursed?",
        a: "In two tranches. ¥300,000 is released on day one when you sign the Pledge. ¥200,000 is released at month three if your company is incorporated and your Trust Score was not Red at months 2 or 3.",
      },
      {
        q: "What happens if my venture fails?",
        a: "Nothing is owed. The pledge is non-binding. Mujin does not pursue repayment and does not use debt collection. The fund absorbs the loss and continues.",
      },
    ],
  },
  {
    id:    "trust",
    label: "The Trust Engine",
    pill:  "Trust Engine",
    items: [
      {
        q: "What is the Trust Score?",
        a: "A monthly behavioral score computed from four signals: responsiveness (check-in attendance), transparency (P&L submission), mutualism (Town Hall attendance), and reflection (monthly written reflection). Each signal is weighted 25%.",
      },
      {
        q: "Who can see my Trust Score?",
        a: "Your score is visible within your cohort group of five. Mujin staff can see it for graduation assessment. Your mentor can see it for their group. It is not visible to other cohorts or the public.",
      },
      {
        q: "Can staff read my reflection?",
        a: "No. Reflections are anonymous and assessed by an AI system for meaningfulness only. Staff see a binary result — meaningful or not — but never the text itself.",
      },
      {
        q: "What if I miss a check-in or Town Hall?",
        a: "Absences reduce your score for that month using a rolling 3-month average. One absence will not derail your progress, but consistent non-participation will drop your score into Yellow or Red territory.",
      },
      {
        q: "Can my Trust Score be overridden?",
        a: "Staff can adjust scores in exceptional circumstances, but all overrides require a written reason and create a permanent audit trail.",
      },
    ],
  },
  {
    id:    "graduation",
    label: "Graduation & Banking",
    pill:  "Graduation",
    items: [
      {
        q: "What does it mean to graduate?",
        a: "Graduation means you have met all four hard gates: company incorporated, 3 months of non-negative cash flow, a Green Trust Score for 6 consecutive months, and a passed exit interview. Graduation triggers a warm introduction to a partner bank.",
      },
      {
        q: "Is revenue required to graduate?",
        a: "There is no hard revenue floor. Revenue trend and growth trajectory are soft signals reviewed in the exit interview — not a binary gate. A clear path to breakeven is sufficient.",
      },
      {
        q: "What bank will I be introduced to?",
        a: "Mujin is pursuing MOUs with Japan Finance Corporation (JFC) and Tokyo regional private banks including Kiraboshi Bank and Tokyo Star Bank. The bank introduction is a warm referral — not a guaranteed loan approval.",
      },
      {
        q: "What is in the exit interview package?",
        a: "The system generates a complete dossier: 6-month Trust Score history, P&L summary, revenue trend, cash flow streak, attendance record, and aggregated staff notes. This is your introduction to the bank.",
      },
    ],
  },
  {
    id:    "commons",
    label: "The Commons",
    pill:  "The Commons",
    items: [
      {
        q: "What is the Mujin Commons?",
        a: "A church-owned co-working space within 15 minutes of major Tokyo universities. Monday–Friday it operates as a secular co-working environment. A Usage Agreement (~¥10,000/month) provides a verified physical office address.",
      },
      {
        q: "Why does the office address matter?",
        a: "The Immigration Bureau requires a verifiable physical office for Business Manager Visa applications. The Commons Usage Agreement satisfies this requirement for all Mujin cohort members — students and refugees alike.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="scroll-smooth selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >

      <Navbar />

      <main className="pt-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="py-32 px-12"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-screen-2xl mx-auto">
            <span
              className="inline-block mb-6 text-xs font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: IBM, color: C.secondary }}
            >
              KNOWLEDGE BASE
            </span>
            <h1
              className="text-6xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              Principles and{" "}
              <em className="font-normal italic">Protocols.</em>
            </h1>
            <p
              className="text-xl max-w-2xl leading-relaxed"
              style={{ color: C.onSurfaceVariant }}
            >
              Everything you need to understand the Mujin platform — how the grant works,
              what the Trust Engine measures, and how graduation leads to a bank introduction.
            </p>
          </div>
        </section>

        {/* ── Category Quick-Nav Pills ─────────────────────────────────────── */}
        <section
          className="sticky top-[88px] z-40 py-5 px-12 overflow-x-auto"
          style={{
            backgroundColor: `${C.background}f0`,
            backdropFilter:  "blur(16px)",
            borderBottom:    `1px solid ${C.outlineVariant}20`,
          }}
        >
          <div className="flex gap-3 max-w-screen-2xl mx-auto">
            {FAQ_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 px-5 py-2 text-sm font-medium tracking-wide transition-all duration-200"
                style={{
                  backgroundColor: C.surfaceContainerHighest,
                  color:           C.onSurfaceVariant,
                  borderRadius:    "0.75rem",
                  fontFamily:      SG,
                }}
              >
                {section.pill}
              </a>
            ))}
          </div>
        </section>

        {/* ── Main FAQ Content ──────────────────────────────────────────────── */}
        <section className="py-24 px-12">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* ── Sticky Sidebar ── */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-48">
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-6"
                  style={{ color: C.outline, fontFamily: IBM }}
                >
                  Sections
                </p>
                <nav className="flex flex-col gap-1">
                  {FAQ_SECTIONS.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="py-3 px-4 text-sm font-medium transition-all duration-200"
                      style={{
                        color:        C.onSurfaceVariant,
                        fontFamily:   SG,
                        borderRadius: "0 0.25rem 0.25rem 0",
                      }}
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
                <div
                  className="mt-12 p-6"
                  style={{
                    backgroundColor: C.primaryContainer,
                    borderRadius:    "0.5rem",
                  }}
                >
                  <p
                    className="text-sm font-medium mb-4"
                    style={{ color: C.onPrimaryContainer }}
                  >
                    Still have questions? Reach out directly.
                  </p>
                  <a
                    href="mailto:hello@mujin.jp"
                    className="text-sm font-bold"
                    style={{ color: C.primary }}
                  >
                    hello@mujin.jp →
                  </a>
                </div>
              </div>
            </aside>

            {/* ── FAQ Sections ── */}
            <div className="lg:col-span-9 space-y-24">
              {FAQ_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-40"
                >
                  <h2
                    className="text-4xl font-bold mb-12"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    {section.label}
                  </h2>
                  <div>
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="py-10"
                        style={{
                          borderBottom: `1px solid ${C.outlineVariant}33`,
                        }}
                      >
                        <h3
                          className="text-2xl font-bold mb-4"
                          style={{ fontFamily: NS, color: C.onSurface }}
                        >
                          {item.q}
                        </h3>
                        <p
                          className="text-lg leading-relaxed"
                          style={{ color: C.onSurfaceVariant }}
                        >
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── CTA Section ───────────────────────────────────────────────────── */}
        <section
          className="py-24 px-12 text-center"
          style={{ backgroundColor: C.primary, color: C.onPrimary }}
        >
          <h2
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: NS, color: C.onPrimary }}
          >
            Still have questions?
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto mb-12 font-light"
            style={{ color: `${C.onPrimary}cc` }}
          >
            Our team is happy to walk through any part of the program — whether you are a
            prospective student, ministry partner, or potential investor.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="mailto:hello@mujin.jp"
              className="inline-block px-10 py-5 font-bold transition-all"
              style={{
                backgroundColor: C.surfaceContainerLowest,
                color:           C.primary,
                borderRadius:    "0.125rem",
              }}
            >
              Contact Us
            </a>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 font-bold transition-all"
              style={{
                backgroundColor: "transparent",
                color:           C.onPrimary,
                borderRadius:    "0.125rem",
                border:          `2px solid ${C.onPrimary}60`,
              }}
            >
              Apply to Pilot
            </a>
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
