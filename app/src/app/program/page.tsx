import Link from "next/link";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

const IMG_FIBER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJUMxeGC00JrPLhAhC4zOBLi2GYcX5JYrKI54o2YID8B6ZzFCEBqZyUFdgXB6Zn864anWHlGvXLBDj1BbkJZ25YOIHV_OPr7gLKZYc4I2OblPsEe8mso-FKBVCRnTjrYCihEH7utXpx-LVCglYNdsvv5SVsNsyXkMMAfg5lLKUgPBwlYfDNqqLo9x5U89j8AQ7i-5fAahc9ugF94KSgPVQqUHCIPoiJ28UwpbUjwdXG8Yqm0PWjWs0f0KkLpk-RufVCoUhGXFk5bY";
const IMG_MAP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAZNcNAxdd3X2fzrqYShSNipgZu51_QEKWOa7QKuhTf6uI38V2HnUMRPUb0R3n0_tccM-Tr786U4_XbxcOfLg1nwnlrnztd8HMLmsEYGOZcsrJchY_pE9pE8Nne0rSI4EOSczUtN99zEKpWRR3wSzehrU16k8Arnc6eyYLKQm9AWoONw4e-rBa5NinCIxSqJ7-wzLKYjm6WFGhRTwZL2kRtFD_SxekMO0vifkA8DcaiaZGyVvsf2lAkpCwKKQk9JoUrCKMZaR837b0";


const SIDE_LINKS = [
  { icon: "dashboard",                label: "Home",     href: "/" },
  { icon: "info",                     label: "Mission",     href: "/about" },
  { icon: "settings_input_component", label: "The Program", href: "/program", active: true },
  { icon: "groups",                   label: "Leadership",  href: "/team" },
  { icon: "hub",                      label: "Network",     href: "/alumni" },
  { icon: "quiz",                     label: "FAQ",   href: "/faq" },
  { icon: "play_circle",              label: "Demo",        href: "/demo" },
];

export default function ProgramPage() {
  return (
    <div style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: SG }}>

      {/* ── Top App Bar ─────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 z-50 w-full flex justify-between items-center px-6 py-4"
        style={{ backgroundColor: "rgba(9,9,11,0.6)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(196,236,206,0.15)" }}
      >
        <Link href="/" className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: NS, color: "#C4ECCE" }}>
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
            const activeStyle = { color: "#C4ECCE", borderLeft: "4px solid #C4ECCE", backgroundColor: "rgba(196,236,206,0.1)" };
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
      <main className="lg:ml-64 pt-24 pb-20 min-h-screen scanline relative">
        <div className="px-8 md:px-12 lg:px-20 max-w-7xl mx-auto">

          {/* ── Hero Header ─────────────────────────────────────────────────── */}
          <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <div
                className="text-xs tracking-[0.4em] uppercase mb-4"
                style={{ color: "#C4ECCE", fontFamily: SG }}
              >
                The Program // V1.0
              </div>
              <h1
                className="text-7xl md:text-8xl font-bold tracking-tighter"
                style={{ fontFamily: NS, color: "#e5e2e1" }}
              >
                The Program
              </h1>
            </div>
            <div
              className="text-sm leading-relaxed pl-6 mb-2 max-w-md"
              style={{ color: "#525252", borderLeft: "1px solid rgba(66,72,66,1)" }}
            >
              A 12–24 month program. Capital, mentorship, and a behavioral track record —
              then a warm introduction to a partner bank. No credit history required.
            </div>
          </section>

          {/* ── Bento Grid ──────────────────────────────────────────────────── */}
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-[1px]"
            style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(66,72,66,0.1)" }}
          >

            {/* ── The Recyclable Grant (large) ────────────────────────────── */}
            <div
              className="md:col-span-8 p-8 relative overflow-hidden group"
              style={{ backgroundColor: "#131313", borderRight: "1px solid rgba(66,72,66,0.1)" }}
            >
              {/* Ghost icon */}
              <div className="absolute top-0 right-0 p-4" style={{ opacity: 0.08 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "9rem" }}>savings</span>
              </div>

              <div className="flex justify-between items-start mb-12">
                <div>
                  <span
                    className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest mb-4"
                    style={{
                      backgroundColor: "rgba(196,236,206,0.1)",
                      borderLeft: "2px solid #C4ECCE",
                      color: "#C4ECCE",
                      fontFamily: SG,
                    }}
                  >
                    Active
                  </span>
                  <h2 className="text-4xl font-bold" style={{ fontFamily: NS }}>
                    The Recyclable Grant
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase mb-1" style={{ color: "#404040", fontFamily: SG }}>Grant Total</div>
                  <div className="text-2xl tracking-tighter" style={{ color: "#C4ECCE", fontFamily: "monospace" }}>
                    ¥500,000
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Circular diagram */}
                <div className="w-48 h-48 flex items-center justify-center relative shrink-0" style={{ border: "1px solid rgba(196,236,206,0.2)" }}>
                  <div className="absolute inset-2 rounded-full" style={{ border: "1px solid rgba(196,236,206,0.1)" }} />
                  <div
                    className="absolute inset-6 rounded-full rotate-45"
                    style={{ border: "2px dashed rgba(196,236,206,0.3)" }}
                  />
                  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: "rgba(196,236,206,0.2)" }}>
                    <span className="material-symbols-outlined" style={{ color: "#C4ECCE" }}>currency_yen</span>
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 px-2 py-1 text-[9px]"
                    style={{
                      backgroundColor: "#131313",
                      border: "1px solid rgba(196,236,206,0.2)",
                      color: "rgba(196,236,206,0.4)",
                    }}
                  >
                    Non-binding
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#737373" }}>
                    A grant — not a loan. Released in two tranches. Upon graduating to a partner bank,
                    you voluntarily return the principal plus a 5% covenant gift, refilling the fund
                    for the next student.
                  </p>
                  <div
                    className="grid grid-cols-2 gap-4 pt-4"
                    style={{ borderTop: "1px solid rgba(66,72,66,0.2)" }}
                  >
                    <div>
                      <div className="text-[9px] uppercase mb-1" style={{ color: "#404040", fontFamily: SG }}>
                        Tranche 1 · Day 1
                      </div>
                      <div className="text-xs" style={{ color: "#e5e2e1", fontFamily: SG }}>
                        ¥300,000 on signing
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase mb-1" style={{ color: "#404040", fontFamily: SG }}>
                        Tranche 2 · Month 3
                      </div>
                      <div className="text-xs" style={{ color: "#C4ECCE", fontFamily: SG }}>
                        ¥200,000 · earned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Status Panel ────────────────────────────────────────────── */}
            <div
              className="md:col-span-4 p-8 flex flex-col justify-between"
              style={{ backgroundColor: "#0E0E0E" }}
            >
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.3em] mb-6"
                  style={{ color: "#525252", fontFamily: SG }}
                >
                  Status
                </div>
                <div className="space-y-6">
                  {[
                    { label: "Applications",  value: "OPEN",        color: "#C4ECCE" },
                    { label: "Tranche 2",      value: "CONDITIONAL", color: "#ffddb4" },
                    { label: "Interest Rate",  value: "ZERO",        color: "#C4ECCE" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#737373", fontFamily: SG }}>{row.label}</span>
                      <span className="text-xs font-bold" style={{ color: row.color, fontFamily: SG }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMG_FIBER}
                  alt="Circuit detail"
                  className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ height: "128px", opacity: 0.5 }}
                />
              </div>
            </div>

            {/* ── The Trust Engine ────────────────────────────────────────── */}
            <div
              className="md:col-span-6 p-8 group"
              style={{ backgroundColor: "#131313", borderTop: "1px solid rgba(66,72,66,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-2xl" style={{ color: "#C4ECCE" }}>analytics</span>
                <h2 className="text-2xl font-bold" style={{ fontFamily: NS }}>The Trust Engine</h2>
              </div>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "#737373" }}>
                Four behavioral signals, weighted equally. Computed monthly. Six consecutive Green
                months triggers your bank introduction.
              </p>

              {/* Signal bars */}
              <div className="space-y-4 mb-8">
                {[
                  { label: "Responsiveness",  detail: "Bi-weekly mentor check-ins", pct: "25%" },
                  { label: "Transparency",    detail: "Monthly P&L submitted",       pct: "25%" },
                  { label: "Mutualism",       detail: "Town Hall attendance",         pct: "25%" },
                  { label: "Reflection",      detail: "Monthly written reflection",   pct: "25%" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: "#e5e2e1", fontFamily: SG }}>
                        {s.label}
                      </span>
                      <span className="text-[10px]" style={{ color: "#525252", fontFamily: SG }}>{s.detail}</span>
                    </div>
                    <div className="h-1 w-full" style={{ backgroundColor: "#2a2a2a" }}>
                      <div className="h-full" style={{ width: s.pct, backgroundColor: "#C4ECCE" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Traffic light */}
              <div
                className="p-4 flex flex-wrap gap-6"
                style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(66,72,66,0.2)" }}
              >
                {[
                  { label: "Green  75–100", color: "#4ade80", desc: "On track" },
                  { label: "Yellow 50–74",  color: "#facc15", desc: "Review triggered" },
                  { label: "Red    0–49",   color: "#f87171", desc: "Intervention" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest" style={{ fontFamily: SG, color: "#e5e2e1" }}>
                        {t.label}
                      </p>
                      <p className="text-[9px]" style={{ color: "#525252" }}>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Graduation Gates ────────────────────────────────────────── */}
            <div
              className="md:col-span-6 p-8 group"
              style={{
                backgroundColor: "#131313",
                borderTop: "1px solid rgba(66,72,66,0.1)",
                borderLeft: "1px solid rgba(66,72,66,0.1)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-2xl" style={{ color: "#ffddb4" }}>school</span>
                <h2 className="text-2xl font-bold" style={{ fontFamily: NS }}>Graduation Gates</h2>
              </div>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "#737373" }}>
                Four hard gates. All four must pass before your exit interview is triggered and
                your bank introduction is issued.
              </p>
              <div className="space-y-3">
                {[
                  { gate: "01", title: "Company incorporated",            status: "Required",    color: "#C4ECCE" },
                  { gate: "02", title: "3 months non-negative cash flow", status: "Required",    color: "#C4ECCE" },
                  { gate: "03", title: "Green Trust Score · 6 months",   status: "Auto-tracked", color: "#ffddb4" },
                  { gate: "04", title: "Exit interview passed",           status: "Final gate",  color: "#ffddb4" },
                ].map((item) => (
                  <div
                    key={item.gate}
                    className="flex items-center gap-4 p-4"
                    style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(66,72,66,0.1)" }}
                  >
                    <span
                      className="text-[10px] shrink-0 pt-0.5"
                      style={{ color: "#404040", fontFamily: "monospace" }}
                    >
                      {item.gate}
                    </span>
                    <span className="text-sm flex-1" style={{ color: "#e5e2e1" }}>{item.title}</span>
                    <span
                      className="text-[9px] uppercase tracking-widest shrink-0"
                      style={{ color: item.color, fontFamily: SG }}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full py-4 block text-center text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                style={{
                  background: "linear-gradient(135deg, #C4ECCE, #A9D0B3)",
                  color: "#143723",
                  fontFamily: SG,
                  fontWeight: 700,
                }}
              >
                Apply to the Pilot
              </a>
            </div>
          </div>

          {/* ── Footer Meta ─────────────────────────────────────────────────── */}
          <div
            className="mt-12 flex flex-wrap gap-12 pt-12"
            style={{ borderTop: "1px solid rgba(66,72,66,0.2)" }}
          >
            <div className="flex-1">
              <div
                className="text-[10px] uppercase tracking-widest mb-4"
                style={{ color: "#404040", fontFamily: SG }}
              >
                Program Roadmap
              </div>
              <div className="text-[11px] space-y-1" style={{ color: "#525252", fontFamily: "monospace" }}>
                <div>[Q2 2026] Legal Ops: Finalized</div>
                <div>[Q3 2026] Fundraising: In Progress ←</div>
                <div>[Q1 2027] Bank MOU: Pending</div>
                <div>[Q2 2027] Pilot Launch: Scheduled</div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_MAP}
                alt="Network map"
                className="object-cover grayscale"
                style={{ width: "192px", height: "96px", border: "1px solid rgba(66,72,66,1)", opacity: 0.4 }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase z-50"
        style={{ backgroundColor: "#0E0E0E", borderTop: "1px solid rgba(38,38,38,0.3)", fontFamily: SG }}
      >
        <div className="mb-4 md:mb-0" style={{ color: "#404040" }}>
          © 2026 MUJIN · A Frontier Commons Prototype
        </div>
        <div className="flex gap-8">
          <Link href="/about" className="transition-colors hover:text-[#A9D0B3]" style={{ color: "#525252" }}>About</Link>
          <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#C4ECCE" }}>Apply</a>
          <Link href="/faq" className="transition-colors hover:text-[#A9D0B3]" style={{ color: "#525252" }}>FAQ</Link>
        </div>
      </footer>

      {/* ── Mobile Bottom Nav ───────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-3 px-6 z-50"
        style={{ backgroundColor: "#0E0E0E", borderTop: "1px solid rgba(66,72,66,0.2)" }}
      >
        {[
          { icon: "memory",   label: "Core",    href: "/" },
          { icon: "security", label: "Program", href: "/program", active: true },
        ].map((l) => {
          const content = (
            <>
              <span
                className="material-symbols-outlined"
                style={"active" in l && l.active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {l.icon}
              </span>
              <span className="text-[8px] uppercase tracking-tighter" style={{ fontFamily: SG }}>{l.label}</span>
            </>
          );
          return "external" in l && l.external ? (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1" style={{ color: "#525252" }}>
              {content}
            </a>
          ) : (
            <Link key={l.label} href={l.href}
              className="flex flex-col items-center gap-1"
              style={{ color: "active" in l && l.active ? "#C4ECCE" : "#525252" }}>
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
