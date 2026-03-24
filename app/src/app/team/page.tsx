import PublicNav from "@/components/PublicNav";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const TEAM = [
  {
    name: "Jonathan Ahn",
    title: "Founder",
    bio: [
      "Jonathan founded Mujin after watching people who worked harder than anyone around them get turned away from the financial system — not because they lacked capability, but because no system had been designed to see them. His background spans international development, venture operations, and community organizing across Japan and Southeast Asia. Mujin is his wager that social trust, measured carefully and transparently, is more predictive of success than credit history.",
    ],
  },
  {
    name: "Andrew Feng",
    title: "Director of Programs",
    bio: [
      "Andrew brings corporate discipline and mission-driven execution to Mujin. He built his early career at Yahoo and KPMG before founding the U.S. chapter of Indigitous and serving as Chief Program Officer at International Friendships, Inc. He spent five years living and working in East Asia — an experience that sharpened his understanding of the structural barriers facing international students. At Mujin, he leads program operations, mentor network development, and church partnership strategy.",
    ],
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <PublicNav />

      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">
          The team
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-snug max-w-2xl mb-6">
          Built by people who have seen the problem firsthand.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
          Mujin is a small, deliberate team. We work at the intersection of faith, technology,
          and financial inclusion — because we believe the solution to exclusion has to be
          deeply relational, not just transactional.
        </p>
      </section>

      {/* Team members */}
      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        {TEAM.map((member) => (
          <div key={member.name} className="grid md:grid-cols-4 gap-8 border-t border-gray-100 pt-12">
            {/* Identity */}
            <div className="md:col-span-1">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-xl font-semibold text-gray-400">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900">{member.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{member.title}</p>
            </div>

            {/* Bio */}
            <div className="md:col-span-3 space-y-4">
              {member.bio.map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Join section */}
      <section className="border-y border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Join the team</h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mb-8">
            We are looking for mentors, advisors, and operational partners who believe in
            what we are building. If you have experience working with international students,
            Japan&apos;s startup ecosystem, or financial inclusion — we want to talk.
          </p>
          <a
            href="mailto:hello@mujin.jp"
            className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Believe in what we&apos;re building?</h2>
            <p className="text-gray-400 text-sm">Applications for the pilot cohort are open now.</p>
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
