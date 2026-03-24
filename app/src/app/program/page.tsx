import PublicNav from "@/components/PublicNav";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <PublicNav />

      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">
          The program
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-snug max-w-2xl mb-6">
          Everything you need to know before you apply.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
          Mujin is a 12–24 month program. You receive capital, mentorship, and a behavioral
          track record — then graduate to a partner bank. Here&apos;s exactly how it works.
        </p>
      </section>

      {/* The grant */}
      <section className="border-y border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight mb-2">The Recyclable Grant</h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            A grant — not a loan. No interest. No repayment obligation. A voluntary pledge to
            pay it forward when you succeed.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-xs font-mono text-gray-400 mb-2">Tranche 1 · Day 1</p>
              <p className="text-3xl font-bold mb-2">¥300,000</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Released on signing the Pledge of Honor. Use it for early venture
                operations — incorporation fees, tools, hosting, travel, marketing.
                Personal living expenses are not covered.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-xs font-mono text-gray-400 mb-2">Tranche 2 · Month 3</p>
              <p className="text-3xl font-bold mb-2">¥200,000</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Released when your company is incorporated and your Trust Score was not Red
                at months 2 or 3. This is earned — not automatic.
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold mb-2">The Pledge of Honor</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              Upon receiving the grant, every student signs a non-binding Pledge of Honor
              (誓約書 · Seiyaku-sho). It is not a loan agreement. There is no debt collector.
              The pledge is a moral commitment: if your venture succeeds and you graduate to
              a bank, you voluntarily return the ¥500,000 plus a 5% success tithe — refilling
              the fund for the student behind you. We designed this so that every graduation
              makes the next one possible.
            </p>
          </div>
        </div>
      </section>

      {/* The Trust Engine */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight mb-2">The Trust Engine</h2>
        <p className="text-gray-500 mb-10 max-w-xl">
          Your Trust Score is computed monthly from four behavioral signals — each weighted
          equally. This is the record you will bring to the bank.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            {
              signal: "Responsiveness · 25%",
              detail: "Bi-weekly in-person check-ins with your mentor. Show up consistently — consistency is character.",
            },
            {
              signal: "Transparency · 25%",
              detail: "Monthly P&L submitted on time, with revenue, expenses, and notes. Be honest about where your venture is.",
            },
            {
              signal: "Mutualism · 25%",
              detail: "Monthly peer Town Halls with your cohort. You grow together — your attendance signals your investment in each other.",
            },
            {
              signal: "Reflection · 25%",
              detail: "A private monthly reflection on your journey. It is anonymous — staff cannot read it. It is simply a space to think out loud.",
            },
          ].map((item) => (
            <div key={item.signal} className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-sm mb-2">{item.signal}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="border border-gray-100 rounded-xl p-6 bg-zinc-50">
          <h3 className="font-semibold mb-3">Traffic light system</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { color: "bg-green-500", label: "Green · 75–100", desc: "On track" },
              { color: "bg-yellow-400", label: "Yellow · 50–74", desc: "Staff review triggered" },
              { color: "bg-red-500", label: "Red · 0–49", desc: "Intervention required" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shrink-0 ${t.color}`} />
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graduation */}
      <section className="border-y border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Graduation</h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            Four hard gates. No exceptions. When all four are met, the system triggers your
            exit interview and — if passed — your bank introduction.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { gate: "01", title: "Company incorporated", detail: "Your venture must be a registered legal entity in Japan." },
              { gate: "02", title: "3 months non-negative cash flow", detail: "Or a clear, documented path to breakeven — assessed in your exit interview." },
              { gate: "03", title: "Green Trust Score · 6 consecutive months", detail: "75+ for six months straight. The system tracks this automatically." },
              { gate: "04", title: "Exit interview passed", detail: "Staff-conducted, triggered automatically when gates 1–3 are met. A complete dossier is prepared by the system." },
            ].map((item) => (
              <div key={item.gate} className="bg-white border border-gray-100 rounded-xl p-6 flex gap-4">
                <p className="text-xs font-mono text-gray-400 shrink-0 pt-0.5">{item.gate}</p>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Commons */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight mb-2">The Mujin Commons</h2>
        <p className="text-gray-500 leading-relaxed max-w-2xl mb-8">
          Church-owned co-working spaces located within 15 minutes of major Tokyo universities.
          Monday–Friday, the space operates as a secular co-working environment. Weekends, it
          returns to the church community.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold mb-2">For your venture</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              A Usage Agreement (~¥10,000/month) provides a verified physical office address —
              satisfying the Immigration Bureau&apos;s office requirement for Business Manager
              Visa applications. Available to all cohorts, including refugees.
            </p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold mb-2">For the church</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Lease income flows to church funds, making the Commons financially sustainable
              for the church partner — and ensuring the space remains available for future cohorts.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight mb-10">Program roadmap</h2>
          <div className="space-y-6">
            {[
              { quarter: "Q2 2026", milestone: "Legal finalization + informal bank outreach" },
              { quarter: "Q3 2026", milestone: "Fundraising · Secure church partner" },
              { quarter: "Q1 2027", milestone: "Sign bank MOU · Final build" },
              { quarter: "Q2 2027", milestone: "Pilot cohort launches — 50 students", highlight: true },
            ].map((item) => (
              <div key={item.quarter} className={`flex gap-6 items-start border rounded-xl px-6 py-4 ${item.highlight ? "border-gray-900 bg-white" : "border-gray-100 bg-white"}`}>
                <p className={`text-sm font-mono shrink-0 w-20 pt-0.5 ${item.highlight ? "text-gray-900 font-semibold" : "text-gray-400"}`}>{item.quarter}</p>
                <p className={`text-sm leading-relaxed ${item.highlight ? "font-semibold text-gray-900" : "text-gray-500"}`}>{item.milestone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Applications are open.</h2>
            <p className="text-gray-400 text-sm">Pilot cohort · 50 students · Q2 2027 launch</p>
          </div>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Apply now
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Mujin</span>
          <p className="text-xs text-gray-400">
            A{" "}
            <a href="https://frontiercommons.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gray-600 transition-colors">
              Frontier Commons
            </a>{" "}
            prototype · Tokyo, Japan
          </p>
        </div>
      </footer>
    </div>
  );
}
