import PublicNav from "@/components/PublicNav";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const FAQS = [
  {
    category: "Eligibility",
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
    category: "The Grant",
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
    category: "The Trust Engine",
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
    category: "Graduation & Banking",
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
    category: "The Commons",
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
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <PublicNav />

      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">FAQ</p>
        <h1 className="text-4xl font-bold tracking-tight leading-snug max-w-2xl mb-6">
          Frequently asked questions.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Everything you need to know about the grant, the program, and what to expect.
        </p>
      </section>

      {/* Questions */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="space-y-16">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
                {section.category}
              </h2>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {section.questions.map((item) => (
                  <div key={item.q} className="px-6 py-5 bg-white">
                    <p className="font-semibold text-gray-900 mb-2 text-sm">{item.q}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
            <p className="text-gray-400 text-sm">Apply and we will follow up directly.</p>
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
