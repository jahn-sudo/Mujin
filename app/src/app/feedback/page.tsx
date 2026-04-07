import Navbar from "@/components/Navbar";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  background:              "#f9f9f9",
  surfaceContainerLowest:  "#ffffff",
  surfaceContainerLow:     "#f2f4f4",
  onBackground:            "#2d3435",
  onSurface:               "#2d3435",
  onSurfaceVariant:        "#5a6061",
  outline:                 "#757c7d",
  outlineVariant:          "#adb3b4",
  primary:                 "#465f88",
  primaryContainer:        "#d6e3ff",
  onPrimary:               "#f6f7ff",
  onPrimaryContainer:      "#39527b",
  secondary:               "#486558",
  secondaryContainer:      "#c9ead9",
  onSecondaryContainer:    "#3a584b",
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";

export default function FeedbackPage() {
  return (
    <div
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="scroll-smooth selection:bg-[#d6e3ff] selection:text-[#39527b]"
    >
      <Navbar />

      <main className="pt-24">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section
          className="relative flex items-center px-12 py-28 overflow-hidden"
          style={{ backgroundColor: C.onSurface, minHeight: "480px" }}
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${C.background} 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="max-w-screen-2xl mx-auto w-full relative z-10">
            <span
              className="inline-block px-4 py-1 mb-8 text-xs font-bold tracking-[0.2em] uppercase"
              style={{
                backgroundColor: `${C.background}12`,
                color:           `${C.background}70`,
                borderRadius:    "0.75rem",
                fontFamily:      IBM,
                border:          `1px solid ${C.background}18`,
              }}
            >
              Community Feedback · April 2026
            </span>

            <h1
              className="text-6xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tight max-w-4xl"
              style={{ fontFamily: NS, color: C.background }}
            >
              Did the{" "}
              <em className="font-normal italic" style={{ color: C.secondaryContainer }}>
                manifesto
              </em>{" "}
              resonate?
            </h1>

            <p
              className="text-xl max-w-2xl leading-relaxed"
              style={{ color: `${C.background}70` }}
            >
              If Andrew shared the Mujin document with you, this is the place to respond.
              Two things we most want to hear: does anything feel off, and who else in
              your network should see this?
            </p>
          </div>
        </section>

        {/* ── Context strip ─────────────────────────────────────────────────── */}
        <section
          className="px-12 py-16"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon:  "visibility",
                title: "Honest reaction only",
                desc:  "No agenda. No pitch. We want your real response — including what feels wrong.",
              },
              {
                icon:  "forward_to_inbox",
                title: "Goes directly to the team",
                desc:  "Jonathan reads every submission personally. You will hear back.",
              },
              {
                icon:  "group_add",
                title: "Who else should see this?",
                desc:  "If a name comes to mind while you read, include them. That referral matters more than you think.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-5 p-8"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderRadius:    "0.5rem",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: C.secondaryContainer }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: C.secondary, fontSize: "18px" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ fontFamily: NS, color: C.onSurface }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Embedded Form ─────────────────────────────────────────────────── */}
        <section
          className="px-12 py-24"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              style={{
                borderRadius: "0.5rem",
                overflow:     "hidden",
                border:       `1px solid ${C.outlineVariant}30`,
                boxShadow:    "0 4px 24px -4px rgba(45,52,53,0.08)",
              }}
            >
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSe5IhyFZ2aTfDCYr2oZc3kZ9fgWo8m9rz0Jheuox6nJiA4hDw/viewform?embedded=true"
                width="100%"
                height="2455"
                style={{ border: "none", display: "block" }}
                title="Mujin Feedback Form"
              >
                Loading...
              </iframe>
            </div>
            <p className="mt-6 text-sm text-center" style={{ color: C.outline }}>
              Form not loading?{" "}
              <a
                href="https://forms.gle/a9iYQLqxeBTyvp2Y7"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.primary, textDecoration: "underline" }}
              >
                Open it directly
              </a>
            </p>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-16 border-t px-12"
        style={{
          backgroundColor: C.surfaceContainerLow,
          borderColor:     `${C.outlineVariant}30`,
        }}
      >
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div
            className="text-xl font-bold tracking-widest uppercase"
            style={{ fontFamily: NS, color: "#1B365D" }}
          >
            MUJIN
          </div>
          <p className="text-sm" style={{ color: C.outline }}>
            Rooted in Japan. Built for the world.
          </p>
        </div>
      </footer>
    </div>
  );
}
