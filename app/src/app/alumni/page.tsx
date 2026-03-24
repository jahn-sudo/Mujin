import PublicNav from "@/components/PublicNav";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <PublicNav />

      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">
          Alumni
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-snug max-w-2xl mb-6">
          The first cohort launches Q2 2027.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
          Alumni stories will be shared here as our students build their ventures, graduate,
          and receive their bank introductions. The journey is real — and it starts with the
          50 students who apply today.
        </p>
      </section>

      {/* Placeholder cards */}
      <section className="border-y border-gray-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-xl font-semibold tracking-tight mb-8 text-gray-400">
            Coming in 2027
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "International student, Tokyo",
                category: "Edtech",
                quote: "I came to Japan to study. I stayed to build. Mujin gave me the capital and the community to do both.",
              },
              {
                name: "Japanese founder, 24",
                category: "Social Enterprise",
                quote: "No co-signer. No credit history. No problem. Six months of Green scores and the bank called me.",
              },
              {
                name: "Refugee entrepreneur, Osaka",
                category: "Food & Beverage",
                quote: "I didn't think the system had room for someone like me. Mujin proved me wrong.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-white border border-gray-100 rounded-xl p-6 opacity-50 select-none"
              >
                <span className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded mb-4 font-medium">
                  {item.category}
                </span>
                <p className="text-sm text-gray-600 italic leading-relaxed mb-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="text-xs text-gray-400 font-medium">{item.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Stories above are illustrative. Real alumni stories will replace these when the first cohort graduates.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Write the first story.</h2>
            <p className="text-gray-400 text-sm">Be part of the founding cohort. Applications open now.</p>
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
