import PublicNav from "@/components/PublicNav";
import Link from "next/link";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <PublicNav />

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">
          Our mission
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-snug max-w-2xl mb-6">
          We believe behavior is a better measure of creditworthiness than financial history.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
          Mujin is a Redemptive Fintech platform built on Japan&apos;s ancient tradition of
          mutual aid — <em>mujin</em> (無尽). We modernize that tradition into a technology-powered
          grant program that gives excluded people a real shot at financial belonging.
        </p>
      </section>

      {/* Our answer */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Our answer</h2>
        <p className="text-gray-500 leading-relaxed max-w-2xl mb-12">
          Mujin sits in the gap between grant organizations and traditional banks. We give
          credit-invisible entrepreneurs the capital, mentorship, and behavioral track record
          they need to graduate into the formal financial system.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Recyclable Grant",
              body: "A ¥500,000 grant — not a loan — disbursed to students who demonstrate mission alignment. Upon success, they voluntarily return the principal plus a 5% success tithe, refilling the fund for the next person.",
            },
            {
              title: "The Trust Engine",
              body: "A behavioral scoring system that measures responsiveness, transparency, mutualism, and reflection. Four signals. Equal weight. A Green score for 6 months unlocks a warm bank introduction.",
            },
            {
              title: "The Commons",
              body: "Church-owned co-working spaces within 15 minutes of major Tokyo universities. Physical presence satisfies the Immigration Bureau's office requirement for Business Manager Visa applications.",
            },
            {
              title: "The Bank Bridge",
              body: "Graduates receive a warm introduction to a partner bank — not as a credit risk, but as a vetted, relationship-backed entrepreneur with a documented behavioral track record.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic context */}
      <section className="border-y border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Why now. Why Japan.</h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mb-10">
            Three converging forces make this the right moment.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Visa crisis",
                body: "In October 2025, Japan's Business Manager Visa capital requirement jumped from ¥5M to ¥30M overnight. International founders need a new path — and a physical office address to qualify.",
              },
              {
                label: "The 2030 problem",
                body: "50% of Protestant churches in Japan face closure by 2030. Mujin gives church assets a second life as community infrastructure — sustainable income for the church, real resources for entrepreneurs.",
              },
              {
                label: "Competitive whitespace",
                body: "No one is running the full pipeline: grant → mentorship → behavioral track record → bank introduction. We do all of it, inside a trust-based community that can&apos;t be faked.",
              },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-6">
                <h3 className="font-semibold mb-2">{item.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight mb-6">A note from the founder</h2>
        <div className="max-w-2xl border-l-4 border-gray-200 pl-6">
          <p className="text-gray-600 leading-relaxed mb-4">
            &ldquo;I started Mujin because I watched people who worked harder than anyone I knew
            get turned away from every door — not because they weren&apos;t capable, but because
            no one had ever given them a chance to prove it.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The church already had the trust. The community already existed. We just needed to
            build the rails — a way to turn relational capital into financial capital, and to
            make the invisible visible to the banks.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            This is not charity. It&apos;s a wager on the future — and we intend to win it.&rdquo;
          </p>
          <p className="text-sm font-medium text-gray-900">Jonathan Ahn</p>
          <p className="text-sm text-gray-500">Founder, Mujin</p>
        </div>
      </section>

      {/* Andrew note */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="max-w-2xl border-l-4 border-gray-200 pl-6">
          <p className="text-gray-600 leading-relaxed mb-4">
            &ldquo;I spent years watching faith communities pour enormous relational energy into
            international students — and then lose them the moment they hit the practical wall
            of building a life here. No office address. No financial record. No way in.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            What drew me to Mujin is that it doesn&apos;t treat these as separate problems.
            The church is the pipeline. The trust score is the track record. The bank introduction
            is the outcome. It&apos;s one system, designed to work end to end — and it&apos;s
            the most coherent answer to this problem I&apos;ve seen.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            My job is to make sure the program actually delivers on that promise — for every
            student, in every cohort.&rdquo;
          </p>
          <p className="text-sm font-medium text-gray-900">Andrew Feng</p>
          <p className="text-sm text-gray-500">Director of Programs, Mujin</p>
        </div>
      </section>

      {/* Frontier Commons */}
      <section className="border-y border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">Built under</p>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            <a href="https://frontiercommons.org" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
              Frontier Commons
            </a>
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            Mujin is a prototype of{" "}
            <a href="https://frontiercommons.org" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline underline-offset-2">
              Frontier Commons
            </a>
            {" "}— a nonprofit ministry that builds free, field-tested tools for international student communities on college campuses worldwide. Frontier Commons develops shared infrastructure so that ministry leaders can focus on students, not systems. Mujin is one expression of that mission: turning the relational trust already present in these communities into a pathway to financial belonging.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Be part of the first cohort.</h2>
            <p className="text-gray-400 text-sm">50 students. Launching Q2 2027. Applications open now.</p>
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

      {/* Footer */}
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
