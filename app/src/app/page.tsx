import Link from "next/link";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

// Placeholder — replace with real photo when available
const IMG_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB5DMFu2wnQisLO-4fRt1P6fAmtG2Wv6V7CNx2WJS6DfAqZbluC0f1pmu4mPA5AO0LZf060bKErc3NJmFqLYcAspxBFwS8Uy0XNoY6yEJWIZV1wcWOmzB5zXTqnBTpRAhONrmSKhqPVwlcvGIYzr7lFKbFJMTds-Y2Z-LjbQ-86sxl_S5BFYoCUDDv6Tz8qrAnWk3tIAtdkjirSzxlCju_gCdMyQOLsPmMbCkzJqj61_UD5sApBx6Qf5zIMhncsXmhExI_PARBZtlQ";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

const SIDE_LINKS = [
  { icon: "dashboard",                label: "Home",     href: "/",        active: true },
  { icon: "info",                     label: "Mission",     href: "/about" },
  { icon: "settings_input_component", label: "The Program", href: "/program" },
  { icon: "groups",                   label: "Leadership",  href: "/team" },
  { icon: "hub",                      label: "Network",     href: "/alumni" },
  { icon: "quiz",                     label: "FAQ",   href: "/faq" },
  { icon: "play_circle",              label: "Demo",        href: "/demo" },
];

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: SG }}>

      {/* ── Top App Bar ─────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4"
        style={{
          backgroundColor: "rgba(14,14,14,0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(196,236,206,0.15)",
        }}
      >
        <div className="flex items-center gap-8">
          <span
            className="text-2xl font-bold tracking-widest uppercase"
            style={{ fontFamily: NS, color: "#C4ECCE" }}
          >
            MUJIN
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[10px] uppercase tracking-widest transition-colors hover:text-[#C4ECCE]" style={{ color: "#b4cad6", fontFamily: SG, background: "none", border: "none", cursor: "pointer" }}>EN</button>
          <Link href="/login" className="text-[10px] uppercase tracking-widest transition-colors hover:text-[#C4ECCE]" style={{ color: "#b4cad6", fontFamily: SG }}>Log in</Link>
        </div>
      </header>

      {/* ── Side Nav (Desktop) ──────────────────────────────────────────────── */}
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
      <main className="lg:ml-64 pt-16 min-h-screen relative overflow-hidden">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="relative flex flex-col justify-center px-8 md:px-16"
          style={{ minHeight: "870px", borderBottom: "1px solid rgba(66,72,66,0.1)" }}
        >
          <div className="absolute inset-0 seigaiha-pattern pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left column */}
            <div className="lg:col-span-7">
              <div
                className="inline-flex items-center gap-3 px-3 py-1 mb-8"
                style={{
                  backgroundColor: "rgba(196,236,206,0.1)",
                  borderLeft: "2px solid #C4ECCE",
                }}
              >
                <span
                  className="text-[10px] font-bold tracking-[0.3em] uppercase"
                  style={{ color: "#C4ECCE" }}
                >
                  Pilot: Q2 2027
                </span>
              </div>

              <h1
                className="text-7xl md:text-9xl font-bold tracking-tighter leading-none mb-4"
                style={{ fontFamily: NS, color: "#e5e2e1" }}
              >
                MUJIN
              </h1>

              <p
                className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase mb-12"
                style={{ fontFamily: SG, color: "#A9D0B3" }}
              >
                無尽 // RECYCLABLE GRANT
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 text-xs font-bold tracking-widest uppercase transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #C4ECCE, #A9D0B3)",
                    color: "#143723",
                    fontFamily: SG,
                  }}
                >
                  Apply to the Pilot
                </a>
                <Link
                  href="/program"
                  className="px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#C4ECCE]/5 transition-all"
                  style={{
                    border: "1px solid rgba(66,72,66,0.4)",
                    color: "#C4ECCE",
                    fontFamily: SG,
                  }}
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right column — visual + floating stats */}
            <div className="lg:col-span-5 relative aspect-square hidden lg:block">
              <div
                className="absolute inset-0 rounded-full blur-[100px] animate-pulse"
                style={{ backgroundColor: "rgba(169,208,179,0.05)" }}
              />
              <div
                className="relative w-full h-full p-8 group"
                style={{ border: "1px solid rgba(196,236,206,0.2)" }}
              >
                <div
                  className="absolute top-0 left-0 w-8 h-8"
                  style={{ borderTop: "1px solid #C4ECCE", borderLeft: "1px solid #C4ECCE" }}
                />
                <div
                  className="absolute bottom-0 right-0 w-8 h-8"
                  style={{ borderBottom: "1px solid #C4ECCE", borderRight: "1px solid #C4ECCE" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMG_HERO}
                  alt="Neural schematic placeholder"
                  className="w-full h-full object-cover grayscale opacity-60 mix-blend-screen"
                />

                {/* Floating stat: Trust Score */}
                <div
                  className="glass-obsidian absolute -right-8 top-1/4 p-4"
                  style={{ borderLeft: "2px solid #b4cad6" }}
                >
                  <div
                    className="text-[9px] tracking-widest uppercase mb-1"
                    style={{ color: "#b4cad6" }}
                  >
                    TRUST_SCORE
                  </div>
                  <div className="text-lg font-bold" style={{ fontFamily: SG, color: "#e5e2e1" }}>
                    GRN 84%
                  </div>
                </div>

                {/* Floating stat: Fund Pool */}
                <div
                  className="glass-obsidian absolute -left-4 bottom-1/4 p-4"
                  style={{ borderLeft: "2px solid #ffddb4" }}
                >
                  <div
                    className="text-[9px] tracking-widest uppercase mb-1"
                    style={{ color: "#ffddb4" }}
                  >
                    FUND_POOL
                  </div>
                  <div className="text-lg font-bold" style={{ fontFamily: SG, color: "#e5e2e1" }}>
                    ¥50,000,000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Dossier ───────────────────────────────────────────────────────── */}
        <section
          className="py-24 px-8 md:px-16 relative"
          style={{ backgroundColor: "#0E0E0E" }}
        >
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2
                className="text-4xl mb-2"
                style={{ fontFamily: NS, color: "#e5e2e1" }}
              >
                Dossier
              </h2>
              <div className="h-1 w-24" style={{ backgroundColor: "#C4ECCE" }} />
            </div>
            <div className="text-right hidden md:block">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "#525252" }}
              >
                Pilot Program — 2027
              </span>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: "1px", backgroundColor: "rgba(66,72,66,0.1)" }}
          >
            {[
              {
                n: "01",
                icon: "savings",
                title: "The Grant",
                body: "¥300,000 on signing. ¥200,000 at month three. No interest. No legal repayment obligation. Upon graduating to a bank, students voluntarily return the principal plus a covenant gift.",
                status: "ACTIVE",
                statusColor: "#C4ECCE",
                href: "/program",
              },
              {
                n: "02",
                icon: "analytics",
                title: "Trust Score",
                body: "Four behavioral signals — Responsiveness, Transparency, Mutualism, Reflection. Zero financial data. Green for six consecutive months triggers a bank introduction.",
                status: "TRACKING",
                statusColor: "#C4ECCE",
                href: "/program",
              },
              {
                n: "03",
                icon: "groups",
                title: "The Community",
                body: "Ministry network, bi-weekly mentorship, monthly Town Halls. Social collateral is the new credit score. Mujin proves it through a measurable track record.",
                status: "GROWING",
                statusColor: "#ffddb4",
                href: "/about",
              },
            ].map((card) => (
              <Link
                key={card.n}
                href={card.href}
                className="group relative p-8 cursor-pointer transition-colors"
                style={{ backgroundColor: "#1c1b1b" }}
              >
                <div
                  className="absolute top-4 right-4 text-4xl font-bold"
                  style={{ fontFamily: SG, color: "rgba(196,236,206,0.1)" }}
                >
                  {card.n}
                </div>
                <span
                  className="material-symbols-outlined text-4xl mb-8 block"
                  style={{ color: "#C4ECCE" }}
                >
                  {card.icon}
                </span>
                <h3
                  className="text-lg font-bold tracking-widest uppercase mb-4"
                  style={{ fontFamily: SG, color: "#e5e2e1" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs font-light leading-relaxed mb-8"
                  style={{ color: "#737373" }}
                >
                  {card.body}
                </p>
                <div
                  className="pt-6 flex justify-between items-center"
                  style={{ borderTop: "1px solid rgba(66,72,66,0.2)" }}
                >
                  <span
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: card.statusColor }}
                  >
                    {card.status}
                  </span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-2" style={{ color: "#737373" }}>
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Technical Readout ─────────────────────────────────────────────── */}
        <section
          className="py-12 px-8 md:px-16"
          style={{ borderTop: "1px solid rgba(66,72,66,0.1)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Grant / Student",  value: "¥500,000",     color: "#C4ECCE" },
              { label: "Pilot Cohort",     value: "50 Students",  color: "#e5e2e1" },
              { label: "Launch",           value: "Q2 2027",      color: "#e5e2e1" },
              { label: "Interest Rate",    value: "Zero // 0%",   color: "#ffddb4" },
            ].map((item) => (
              <div
                key={item.label}
                className="pl-4"
                style={{ borderLeft: "1px solid rgba(169,208,179,0.2)" }}
              >
                <div
                  className="text-[9px] uppercase tracking-[0.2em] mb-1"
                  style={{ color: "#525252" }}
                >
                  {item.label}
                </div>
                <div
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ fontFamily: SG, color: item.color }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer
          className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase"
          style={{
            backgroundColor: "#0E0E0E",
            borderTop: "1px solid rgba(38,38,38,0.3)",
            fontFamily: SG,
          }}
        >
          <div className="mb-4 md:mb-0" style={{ color: "#404040" }}>
            © 2026 MUJIN · A FRONTIER COMMONS PROTOTYPE
          </div>
          <div className="flex gap-8">
            <Link href="/program" className="transition-colors hover:text-[#A9D0B3]" style={{ color: "#525252" }}>
              The Program
            </Link>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "#C4ECCE" }}
            >
              Apply
            </a>
            <Link href="/about" className="transition-colors hover:text-[#A9D0B3]" style={{ color: "#525252" }}>
              About
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
