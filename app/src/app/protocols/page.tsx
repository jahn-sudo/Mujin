import Link from "next/link";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

export default function ProtocolsPage() {
  return (
    <div style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: SG, minHeight: "100vh" }}>

      {/* Header */}
      <header
        className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4"
        style={{
          backgroundColor: "rgba(14,14,14,0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(196,236,206,0.15)",
        }}
      >
        <Link href="/" className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: NS, color: "#C4ECCE" }}>
          MUJIN
        </Link>
        <Link href="/login" className="text-[10px] uppercase tracking-widest hover:text-[#C4ECCE] transition-colors" style={{ color: "#b4cad6" }}>
          Log in
        </Link>
      </header>

      <main className="pt-32 pb-24 px-8 md:px-16 max-w-3xl">
        <div
          className="inline-flex items-center gap-3 px-3 py-1 mb-8"
          style={{ backgroundColor: "rgba(196,236,206,0.1)", borderLeft: "2px solid #C4ECCE" }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "#C4ECCE" }}>
            Coming Soon
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" style={{ fontFamily: NS }}>
          PROTOCOLS
        </h1>

        <p className="text-lg leading-relaxed mb-8" style={{ color: "#737373" }}>
          The operating rules of Mujin — how the grant is structured, how trust is measured, what the covenant means, and how funds cycle back into the commons.
        </p>

        <p className="text-sm leading-relaxed mb-12" style={{ color: "#525252" }}>
          Full protocol documentation will be published ahead of the pilot launch in Q2 2027.
        </p>

        <div className="flex gap-4">
          <Link
            href="/program"
            className="px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#C4ECCE]/5 transition-all"
            style={{ border: "1px solid rgba(66,72,66,0.4)", color: "#C4ECCE" }}
          >
            The Program
          </Link>
          <Link
            href="/"
            className="px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#C4ECCE]/5 transition-all"
            style={{ color: "#737373" }}
          >
            ← Home
          </Link>
        </div>
      </main>
    </div>
  );
}
