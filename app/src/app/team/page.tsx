import Link from "next/link";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

const SIDE_LINKS = [
  { icon: "dashboard",                label: "Home",     href: "/" },
  { icon: "info",                     label: "Mission",     href: "/about" },
  { icon: "settings_input_component", label: "The Program", href: "/program" },
  { icon: "groups",                   label: "Leadership",  href: "/team", active: true },
  { icon: "hub",                      label: "Network",     href: "/alumni" },
  { icon: "quiz",                     label: "FAQ",   href: "/faq" },
  { icon: "play_circle",              label: "Demo",        href: "/demo" },
];

const TEAM = [
  {
    name: "Jonathan Ahn",
    initials: "JA",
    role: "Founder / System Architect",
    secLevel: "FOUNDER",
    secColor: "#C4ECCE",
    id: "MJN-01-ALPHA",
    specialization: "Financial Inclusion",
    status: "ACTIVE",
    statusColor: "#C4ECCE",
    quote:
      "I started Mujin because I watched people who worked harder than anyone I knew get turned away from every door — not because they weren't capable, but because no one had ever given them a chance to prove it.",
    icon: "qr_code_2",
  },
  {
    name: "Andrew Feng",
    initials: "AF",
    role: "Director / Programs",
    secLevel: "DIRECTOR",
    secColor: "#b4cad6",
    id: "MJN-02-SIGMA",
    specialization: "Community Operations",
    status: "ACTIVE",
    statusColor: "#C4ECCE",
    quote:
      "The church already had the trust. The community already existed. We just needed to build the rails.",
    icon: "hub",
  },
];

function InitialsAvatar({ initials }: { initials: string }) {
  return (
    <div
      className="w-32 h-40 flex items-center justify-center relative"
      style={{ backgroundColor: "#0E0E0E", border: "1px solid rgba(196,236,206,0.1)" }}
    >
      <span
        className="text-3xl font-bold"
        style={{ fontFamily: NS, color: "rgba(196,236,206,0.2)" }}
      >
        {initials}
      </span>
      {/* Corner bracket */}
      <div
        className="absolute -top-2 -left-2 w-6 h-6"
        style={{ borderTop: "1px solid #C4ECCE", borderLeft: "1px solid #C4ECCE" }}
      />
    </div>
  );
}

export default function TeamPage() {
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
      <main className="lg:ml-64 pt-24 pb-12 px-8 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 seigaiha-pattern pointer-events-none" />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto mb-16 relative z-10">
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12"
            style={{ borderBottom: "1px solid rgba(66,72,66,0.2)" }}
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-px" style={{ backgroundColor: "#C4ECCE" }} />
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "#C4ECCE", fontFamily: SG }}
                >
                  Operative Directory
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none"
                style={{ fontFamily: NS }}
              >
                Command Structure.
              </h1>
              <p className="max-w-md leading-relaxed" style={{ color: "#b4cad6", opacity: 0.8 }}>
                Built by people who have seen the problem firsthand. Mujin runs at the
                intersection of faith, technology, and financial inclusion — because the
                solution to exclusion has to be relational, not just transactional.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div
                className="text-[48px] italic leading-none"
                style={{ fontFamily: NS, color: "#2a2a2a" }}
              >
                02 // 50
              </div>
              <div
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "#8c938b", fontFamily: SG }}
              >
                Team // Pilot_Capacity
              </div>
            </div>
          </div>
        </section>

        {/* ── Personnel Grid ──────────────────────────────────────────────────── */}
        <section
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10"
          style={{ gap: "2px", backgroundColor: "rgba(66,72,66,0.1)", border: "1px solid rgba(66,72,66,0.1)" }}
        >
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="group p-8 flex flex-col h-full transition-all duration-500"
              style={{ backgroundColor: "#1c1b1b" }}
            >
              {/* Header row */}
              <div className="flex justify-between items-start mb-8">
                <InitialsAvatar initials={member.initials} />
                <div className="text-right">
                  <div
                    className="text-[9px] font-bold tracking-[0.2em] px-2 py-1 mb-2 inline-block"
                    style={{
                      backgroundColor: `${member.secColor}18`,
                      color: member.secColor,
                      fontFamily: SG,
                    }}
                  >
                    {member.secLevel}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-widest block"
                    style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
                  >
                    ID: {member.id}
                  </div>
                </div>
              </div>

              {/* Name + role */}
              <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                {member.name}
              </h3>
              <div
                className="text-[11px] uppercase tracking-widest mb-6 pl-3"
                style={{
                  color: "#C4ECCE",
                  borderLeft: "2px solid #C4ECCE",
                  fontFamily: SG,
                }}
              >
                {member.role}
              </div>

              {/* Spec grid */}
              <div
                className="grid grid-cols-2 gap-4 pt-4 mb-4 flex-grow"
                style={{ borderTop: "1px solid rgba(66,72,66,0.2)" }}
              >
                <div>
                  <span
                    className="block text-[9px] uppercase tracking-widest mb-1"
                    style={{ color: "#8c938b", fontFamily: SG }}
                  >
                    Specialization
                  </span>
                  <span className="block text-xs" style={{ color: "#e5e2e1", fontFamily: SG }}>
                    {member.specialization}
                  </span>
                </div>
                <div>
                  <span
                    className="block text-[9px] uppercase tracking-widest mb-1"
                    style={{ color: "#8c938b", fontFamily: SG }}
                  >
                    Status
                  </span>
                  <span
                    className="block text-xs font-bold"
                    style={{ color: member.statusColor, fontFamily: SG }}
                  >
                    {member.status}
                  </span>
                </div>
              </div>

              {/* Quote / bio */}
              <p
                className="text-[13px] leading-relaxed italic mb-8"
                style={{ color: "rgba(229,226,225,0.7)" }}
              >
                &ldquo;{member.quote}&rdquo;
              </p>

              {/* Footer row */}
              <div className="flex justify-between items-center mt-auto">
                <span className="material-symbols-outlined text-sm" style={{ color: "#C4ECCE" }}>
                  {member.icon}
                </span>
                <button
                  className="transition-colors hover:text-[#C4ECCE]"
                  style={{ color: "rgba(229,226,225,0.4)" }}
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}

          {/* Recruitment card */}
          <div
            className="p-8 flex flex-col justify-center items-center text-center"
            style={{
              backgroundColor: "#0E0E0E",
              border: "2px dashed rgba(66,72,66,0.3)",
            }}
          >
            <span
              className="material-symbols-outlined text-4xl mb-6"
              style={{ color: "rgba(196,236,206,0.3)" }}
            >
              add_moderator
            </span>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: NS, color: "#e5e2e1" }}>
              Join the Network
            </h3>
            <p
              className="text-xs mb-8 max-w-xs uppercase tracking-widest leading-loose"
              style={{ color: "#b4cad6" }}
            >
              We are seeking mentors, advisors, and church partners who believe
              in what we are building.
            </p>
            <a
              href="mailto:hello@mujin.jp"
              className="px-8 py-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-[#143723] transition-all"
              style={{ border: "1px solid #C4ECCE", color: "#C4ECCE", fontFamily: SG }}
            >
              Get In Touch
            </a>
          </div>
        </section>

        {/* ── Technical Metadata ────────────────────────────────────────────── */}
        <section
          className="max-w-7xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10"
          style={{ opacity: 0.4 }}
        >
          {[
            { label: "Protocol",      value: "PLEDGE_NON_BINDING" },
            { label: "Entity",        value: "RELIGIOUS_CORP_JP" },
            { label: "Pilot_Launch",  value: "Q2_2027" },
            { label: "Node_Location", value: "35.6895°N 139.6917°E" },
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: SG }}>
                {m.label}
              </span>
              <span className="text-[11px] font-bold" style={{ fontFamily: SG }}>
                {m.value}
              </span>
            </div>
          ))}
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="w-full py-12 px-8 relative z-50"
        style={{ backgroundColor: "#0E0E0E", borderTop: "1px solid rgba(196,236,206,0.05)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-xl italic" style={{ fontFamily: NS, color: "#C4ECCE" }}>
              MUJIN
            </span>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
            >
              © 2026 · A Frontier Commons Prototype
            </p>
          </div>
          <nav className="flex gap-8">
            {[
              { label: "The Program", href: "/program" },
              { label: "About",       href: "/about" },
              { label: "FAQ",         href: "/faq" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs tracking-widest uppercase hover:text-[#ffddb4] transition-colors"
                style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C4ECCE", boxShadow: "0 0 8px #c4ecce" }} />
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#C4ECCE", fontFamily: SG }}>
              All Systems Nominal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
