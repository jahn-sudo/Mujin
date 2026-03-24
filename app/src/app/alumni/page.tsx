import Link from "next/link";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

const SIDE_LINKS = [
  { icon: "dashboard",   label: "Home",    href: "/" },
  { icon: "info",        label: "Mission",    href: "/about" },
  { icon: "settings_input_component", label: "The Program", href: "/program" },
  { icon: "groups",      label: "Leadership", href: "/team" },
  { icon: "hub",         label: "Network",    href: "/alumni", active: true },
  { icon: "quiz",        label: "FAQ",        href: "/faq" },
  { icon: "play_circle", label: "Demo",       href: "/demo" },
];

// Illustrative placeholder alumni — will be replaced with real graduates after Q2 2027
const ILLUSTRATIVE_ALUMNI = [
  {
    id: "#OP_0001",
    name: "Int'l Student, Tokyo",
    initials: "IS",
    category: "Edtech",
    status: "Graduated",
    statusColor: "#C4ECCE",
    contributions: "—",
    activity: "Venture: Online Tutoring Platform",
  },
  {
    id: "#OP_0002",
    name: "Japanese Founder, 24",
    initials: "JF",
    category: "Social Enterprise",
    status: "In Program",
    statusColor: "#ffddb4",
    contributions: "—",
    activity: "Trust Score: Green · Month 4",
  },
  {
    id: "#OP_0003",
    name: "Refugee Entrepreneur",
    initials: "RE",
    category: "Food & Beverage",
    status: "Applicant",
    statusColor: "#b4cad6",
    contributions: "—",
    activity: "Status: Pending · Cohort 2",
  },
];

const MILESTONE_LOG = [
  { ts: "Q2 2027", operative: "Cohort 1",     type: "Grant Disbursed",      id: "Grant Tranche 1",   impact: "¥15M",   impactColor: "#C4ECCE" },
  { ts: "Q4 2027", operative: "Student Avg.", type: "Trust Score Review",   id: "Trust Review Q4",   impact: "+84%",   impactColor: "#C4ECCE" },
  { ts: "Q2 2028", operative: "Graduate 01",  type: "Bank Intro Triggered", id: "Bank Intro 001",    impact: "Gate 4", impactColor: "#ffddb4" },
  { ts: "Q4 2028", operative: "Graduate 01",  type: "Pledge Returned",      id: "Pledge Return 001", impact: "¥525K",  impactColor: "#C4ECCE" },
];

function InitialsBox({ initials }: { initials: string }) {
  return (
    <div
      className="w-12 h-12 flex items-center justify-center"
      style={{ backgroundColor: "#131313", border: "1px solid rgba(196,236,206,0.2)" }}
    >
      <span className="text-sm font-bold" style={{ fontFamily: NS, color: "rgba(196,236,206,0.3)" }}>
        {initials}
      </span>
    </div>
  );
}

export default function AlumniPage() {
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
      <main className="lg:ml-64 pt-24 pb-12 px-8 min-h-screen relative">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-end">
          <div className="lg:col-span-7">
            <span
              className="text-[10px] tracking-[0.3em] uppercase block mb-4"
              style={{ color: "#C4ECCE", fontFamily: SG }}
            >
              Archive · Registry
            </span>
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6"
              style={{ fontFamily: NS }}
            >
              Alumni Registry
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#b4cad6", opacity: 0.8 }}>
              The Mujin alumni network will be built by the students who prove the model.
              As each cohort graduates and receives their bank introduction, their story
              joins this registry. The first cohort launches Q2 2027.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end">
            <div
              className="p-6 mb-4 w-full"
              style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid #C4ECCE" }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-[10px] uppercase"
                  style={{ color: "rgba(196,236,206,0.6)", fontFamily: SG }}
                >
                  Cohort Slots
                </span>
                <span className="text-[10px]" style={{ color: "#ffddb4", fontFamily: SG }}>
                  Filling — Q2 2027
                </span>
              </div>
              <div className="text-3xl font-bold tracking-tighter" style={{ color: "#C4ECCE" }}>
                0 / 50
              </div>
              <div className="w-full h-1 mt-4" style={{ backgroundColor: "#131313" }}>
                <div className="h-full" style={{ width: "0%", backgroundColor: "#C4ECCE" }} />
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[10px]" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>Est. 2026</span>
              <span style={{ color: "rgba(180,202,214,0.4)" }}>|</span>
              <span className="text-[10px]" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>Tokyo, Japan</span>
            </div>
          </div>
        </section>

        {/* ── Network Visualization ─────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(66,72,66,0.3)" }} />
            <h2
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: "#C4ECCE", fontFamily: SG }}
            >
              Heritage Visualization
            </h2>
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(66,72,66,0.3)" }} />
          </div>

          <div
            className="relative w-full overflow-hidden"
            style={{ height: "500px", backgroundColor: "#0E0E0E" }}
          >
            {/* SVG grid */}
            <div className="absolute inset-0" style={{ opacity: 0.2 }}>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c4ecce" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-4xl h-full">
                {/* Node 1 */}
                <div className="absolute group" style={{ top: "20%", left: "30%" }}>
                  <div className="w-3 h-3 animate-pulse" style={{ backgroundColor: "#C4ECCE" }} />
                  <div
                    className="glass-panel absolute top-4 left-4 p-3 hidden group-hover:block z-10"
                    style={{ width: "192px", borderLeft: "2px solid #C4ECCE" }}
                  >
                    <p className="text-[10px] font-bold mb-1" style={{ color: "#C4ECCE" }}>
                      Node 001: Cohort 1
                    </p>
                    <p className="text-[8px] uppercase tracking-widest" style={{ color: "#b4cad6" }}>
                      Launching Q2 2027
                    </p>
                  </div>
                </div>
                {/* Node 2 */}
                <div className="absolute group" style={{ top: "60%", left: "70%" }}>
                  <div className="w-3 h-3" style={{ backgroundColor: "#ffddb4" }} />
                  <div
                    className="glass-panel absolute top-4 left-4 p-3 hidden group-hover:block z-10"
                    style={{ width: "192px", borderLeft: "2px solid #ffddb4" }}
                  >
                    <p className="text-[10px] font-bold mb-1" style={{ color: "#ffddb4" }}>
                      Bank Node: JFC Partner
                    </p>
                    <p className="text-[8px] uppercase tracking-widest" style={{ color: "#b4cad6" }}>
                      MOU Pending Q1 2027
                    </p>
                  </div>
                </div>
                {/* Connection lines */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "400px",
                    height: "2px",
                    background: "linear-gradient(to right, rgba(196,236,206,0), rgba(196,236,206,0.4), rgba(196,236,206,0))",
                    transform: "rotate(35deg) translateX(-50%)",
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "300px",
                    height: "2px",
                    background: "linear-gradient(to right, rgba(255,221,180,0), rgba(255,221,180,0.4), rgba(255,221,180,0))",
                    transform: "rotate(-15deg) translateX(-50%)",
                  }}
                />
                {/* Center placeholder text */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="text-center">
                    <div
                      className="text-6xl italic mb-2"
                      style={{ fontFamily: NS, color: "rgba(196,236,206,0.04)" }}
                    >
                      無尽
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-[0.4em]"
                      style={{ color: "rgba(196,236,206,0.2)", fontFamily: SG }}
                    >
                      Registry Populates Q2 2027
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-2">
              {[
                { color: "#C4ECCE", label: "Graduates" },
                { color: "#ffddb4", label: "Bank Partners" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ backgroundColor: l.color }} />
                  <span
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: l.color, fontFamily: SG }}
                  >
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Registry Access ───────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: NS }}>Registry</h3>
              <p className="text-sm italic" style={{ color: "rgba(180,202,214,0.6)" }}>
                Illustrative profiles. Real graduate stories replace these when the first cohort graduates.
              </p>
            </div>
            <div className="flex gap-2">
              {["All", "Graduated", "In Program"].map((tab, i) => (
                <button
                  key={tab}
                  className="px-6 py-2 text-[10px] font-bold tracking-widest uppercase transition-all"
                  style={{
                    backgroundColor: i === 0 ? "#2a2a2a" : "#1c1b1b",
                    borderBottom: i === 0 ? "2px solid #C4ECCE" : "none",
                    color: i === 0 ? "#C4ECCE" : "#b4cad6",
                    fontFamily: SG,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]" style={{ backgroundColor: "rgba(66,72,66,0.15)" }}>
            {ILLUSTRATIVE_ALUMNI.map((m) => (
              <div
                key={m.id}
                className="p-8 relative overflow-hidden group transition-all duration-500"
                style={{ backgroundColor: "#1c1b1b" }}
              >
                {/* Calligraphy accent line */}
                <div className="calligraphy-accent absolute left-0 top-8 bottom-8" />

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] mb-1" style={{ color: "#C4ECCE", fontFamily: SG }}>
                      {m.id}
                    </p>
                    <h4 className="text-xl" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                      {m.name}
                    </h4>
                  </div>
                  <InitialsBox initials={m.initials} />
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: "Category",     value: m.category,    valueColor: "#C4ECCE" },
                    { label: "Status",       value: m.status,      valueColor: m.statusColor },
                    { label: "Contributions", value: m.contributions, valueColor: "#e5e2e1" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between pb-1"
                      style={{ borderBottom: "1px solid rgba(66,72,66,0.2)" }}
                    >
                      <span
                        className="text-[10px] uppercase"
                        style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}
                      >
                        {row.label}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: row.valueColor, fontFamily: SG }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="p-4"
                  style={{ backgroundColor: "rgba(19,19,19,0.5)", border: "1px solid rgba(66,72,66,0.1)" }}
                >
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] mb-2"
                    style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}
                  >
                    Activity
                  </p>
                  <p
                    className="text-[10px] leading-tight"
                    style={{ color: "#C4ECCE", fontFamily: "monospace" }}
                  >
                    {m.activity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-xs mt-4"
            style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}
          >
            * Profiles above are illustrative. Real alumni will be added as cohorts graduate.
          </p>
        </section>

        {/* ── Milestone Log (table) ─────────────────────────────────────────── */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold mb-8" style={{ fontFamily: NS }}>Milestone Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#0E0E0E", textAlign: "left" }}>
                  {["Timestamp", "Event", "Type", "Protocol ID", "Impact"].map((h, i) => (
                    <th
                      key={h}
                      className="py-4 px-6 text-[10px] uppercase tracking-[0.2em]"
                      style={{
                        color: "#C4ECCE",
                        fontFamily: SG,
                        textAlign: i === 4 ? "right" : "left",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs" style={{ fontFamily: "monospace" }}>
                {MILESTONE_LOG.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(66,72,66,0.1)" }}
                  >
                    <td className="py-4 px-6" style={{ color: "rgba(180,202,214,0.6)" }}>{row.ts}</td>
                    <td className="py-4 px-6" style={{ color: "#e5e2e1" }}>{row.operative}</td>
                    <td className="py-4 px-6 uppercase" style={{ color: "#b4cad6" }}>{row.type}</td>
                    <td className="py-4 px-6" style={{ color: "#b4cad6" }}>{row.id}</td>
                    <td className="py-4 px-6 text-right font-bold" style={{ color: row.impactColor }}>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-4 uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.3)", fontFamily: SG }}>
            * Projected milestones. Actual log populates as program runs.
          </p>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section
          className="p-12 text-center relative overflow-hidden"
          style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(196,236,206,0.1)" }}
        >
          <div className="absolute inset-0 seigaiha-pattern pointer-events-none" style={{ opacity: 0.05 }} />
          <div className="relative z-10">
            <span className="material-symbols-outlined text-4xl mb-6 block" style={{ color: "#C4ECCE" }}>
              history_edu
            </span>
            <h2 className="text-3xl italic mb-4" style={{ fontFamily: NS }}>
              Write the first story.
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: "#c1c8c0" }}>
              Be part of the founding cohort. 50 students. Q2 2027.
              Applications are open now.
            </p>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
              style={{ backgroundColor: "#C4ECCE", color: "#143723", fontFamily: SG }}
            >
              Apply Now
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="lg:ml-64 w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center"
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
            { label: "FAQ",         href: "/faq" },
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
    </div>
  );
}
