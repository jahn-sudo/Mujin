"use client";

import Link from "next/link";
import { useState } from "react";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

const SIDE_LINKS = [
  { icon: "dashboard",               label: "Home",    href: "/" },
  { icon: "info",                    label: "Mission",    href: "/about" },
  { icon: "settings_input_component",label: "The Program",href: "/program" },
  { icon: "groups",                  label: "Leadership", href: "/team" },
  { icon: "hub",                     label: "Network",    href: "/alumni" },
  { icon: "quiz",                    label: "FAQ",  href: "/faq",    active: true },
  { icon: "play_circle",             label: "Demo",       href: "/demo" },
];

const FAQS = [
  {
    id: "eligibility",
    label: "01 Eligibility",
    title: "Eligibility",
    section: "01",
    questions: [
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
    id: "grant",
    label: "02 The Grant",
    title: "The Grant",
    section: "02",
    questions: [
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
    id: "trust",
    label: "03 Trust Engine",
    title: "The Trust Engine",
    section: "03",
    questions: [
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
    id: "graduation",
    label: "04 Graduation & Banking",
    title: "Graduation & Banking",
    section: "04",
    questions: [
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
    id: "commons",
    label: "05 The Commons",
    title: "The Commons",
    section: "05",
    questions: [
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
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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

      {/* ── Side Nav ────────────────────────────────────────────────────────── */}
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
            const activeStyle = {
              color: "#C4ECCE",
              borderLeft: "4px solid #C4ECCE",
              backgroundColor: "rgba(196,236,206,0.1)",
            };
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

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="lg:ml-64 pt-24 min-h-screen seigaiha-pattern">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section
          className="px-8 py-12"
          style={{ borderBottom: "1px solid rgba(66,72,66,0.15)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 max-w-7xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 animate-pulse" style={{ backgroundColor: "#C4ECCE", display: "inline-block" }} />
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "#C4ECCE", fontFamily: SG }}
                >
                  System Documentation // Knowledge Retrieval
                </span>
              </div>
              <h1
                className="text-5xl md:text-6xl font-bold tracking-tighter"
                style={{ fontFamily: NS }}
              >
                Frequently Asked Questions
              </h1>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#b4cad6", opacity: 0.8 }}>
                Everything you need to know about the grant, the Trust Engine, and what to expect from the program.
              </p>
            </div>
            <div className="flex flex-col items-end text-right space-y-2">
              <div className="text-[10px] uppercase tracking-widest" style={{ color: "#A9D0B3", fontFamily: SG }}>
                Status: Open for Applications
              </div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>
                Pilot Cohort: Q2 2027
              </div>
            </div>
          </div>
        </section>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <section className="p-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Category Sidebar ────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <div
                  className="text-[10px] uppercase tracking-[0.2em] pl-3"
                  style={{ color: "#C4ECCE", fontFamily: SG, borderLeft: "2px solid #C4ECCE" }}
                >
                  Directory
                </div>
                <ul className="space-y-1">
                  {FAQS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block py-2 text-xs font-medium transition-transform hover:translate-x-1"
                        style={{ color: "#b4cad6", fontFamily: SG }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#C4ECCE")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#b4cad6")}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-6 space-y-4"
                style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid rgba(180,202,214,0.3)" }}
              >
                <h4 className="text-sm" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                  Still have questions?
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: "#b4cad6" }}>
                  Apply and we will follow up directly before the cohort opens.
                </p>
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group hover:opacity-80 transition-opacity"
                  style={{ color: "#C4ECCE", fontFamily: SG }}
                >
                  Apply Now
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* ── FAQ Accordion Body ───────────────────────────────────────── */}
            <div className="lg:col-span-9 space-y-16">
              {FAQS.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-2xl font-bold" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                      {section.title}
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: "rgba(66,72,66,0.2)" }} />
                    <span
                      className="text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
                    >
                      {section.section}
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="space-y-0">
                    {section.questions.map((item, i) => {
                      const key = `${section.id}-${i}`;
                      const isOpen = !!openItems[key];
                      const qNum = `Q${String(i + 1).padStart(2, "0")}`;

                      return (
                        <div
                          key={key}
                          className="group"
                          style={{ borderBottom: "1px solid rgba(66,72,66,0.1)" }}
                        >
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex justify-between items-center py-6 px-4 text-left transition-colors hover:bg-[#1c1b1b]/30"
                          >
                            <div className="flex gap-4 items-start">
                              <span
                                className="text-[10px] mt-1 shrink-0"
                                style={{ color: "#C4ECCE", fontFamily: SG }}
                              >
                                {qNum}
                              </span>
                              <span
                                className="text-lg transition-colors"
                                style={{
                                  fontFamily: NS,
                                  color: isOpen ? "#C4ECCE" : "#e5e2e1",
                                }}
                              >
                                {item.q}
                              </span>
                            </div>
                            <span
                              className="material-symbols-outlined shrink-0 ml-4 transition-transform"
                              style={{
                                color: isOpen ? "#C4ECCE" : "rgba(180,202,214,0.4)",
                                transform: isOpen ? "rotate(45deg)" : "none",
                              }}
                            >
                              add
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-14 pb-8">
                              <p className="text-sm leading-relaxed" style={{ color: "#b4cad6" }}>
                                {item.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer
          className="lg:ml-0 w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center mt-24"
          style={{ borderTop: "1px solid rgba(196,236,206,0.05)", backgroundColor: "#0E0E0E" }}
        >
          <div className="mb-8 md:mb-0">
            <span className="text-lg italic" style={{ fontFamily: NS, color: "#C4ECCE" }}>
              MUJIN
            </span>
            <p
              className="text-[10px] tracking-widest uppercase mt-2"
              style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
            >
              © 2026 · A Frontier Commons Prototype
            </p>
          </div>
          <div className="flex gap-8">
            {[
              { label: "The Program", href: "/program" },
              { label: "Team",        href: "/team" },
              { label: "Alumni",      href: "/alumni" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[10px] tracking-widest uppercase hover:text-[#ffddb4] transition-colors"
                style={{ color: "#b4cad6", fontFamily: SG }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href="#"
            className="mt-8 md:mt-0 text-[10px] hover:text-[#ffddb4] transition-all flex items-center gap-2 group"
            style={{ color: "#C4ECCE", fontFamily: SG }}
          >
            Back to Top
            <span className="material-symbols-outlined group-hover:-translate-y-1 transition-transform">
              arrow_upward
            </span>
          </a>
        </footer>
      </main>

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 flex items-center justify-center shadow-2xl hover:opacity-90 active:scale-95 transition-all group"
          style={{ backgroundColor: "#C4ECCE" }}
        >
          <span
            className="material-symbols-outlined group-hover:rotate-90 transition-transform"
            style={{ color: "#143723" }}
          >
            help
          </span>
        </a>
      </div>
    </div>
  );
}
