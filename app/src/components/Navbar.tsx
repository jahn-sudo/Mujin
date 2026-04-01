"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const C = {
  background:       "#f9f9f9",
  onSurfaceVariant: "#5a6061",
  outlineVariant:   "#adb3b4",
  primary:          "#465f88",
  onPrimary:        "#f6f7ff",
} as const;

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

const NAV_LINKS = [
  { label: "Program",    href: "/program"  },
  { label: "Leadership", href: "/team"     },
  { label: "Network",    href: "/alumni"   },
  { label: "Mission",    href: "/about"    },
  { label: "FAQ",        href: "/faq"      },
  { label: "Partners",   href: "/partners" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Dev banner ── */}
      <div
        style={{
          backgroundColor: "#1a2a1a",
          color: "#a3c9a8",
          fontFamily: "var(--font-ibm-mono), monospace",
          fontSize: "11px",
          letterSpacing: "0.12em",
          textAlign: "center",
          padding: "6px 16px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 51,
        }}
      >
        PRE-RELEASE BETA — This site is under active development. Content and features are subject to change.
      </div>

    <nav
      className="fixed w-full z-50"
      style={{
        top:             "29px",
        backgroundColor: `${C.background}e8`,
        backdropFilter:  "blur(20px)",
        boxShadow:       "0 32px 64px -15px rgba(45,52,53,0.06)",
        borderBottom:    `1px solid ${C.outlineVariant}30`,
      }}
    >
      <div className="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-bold tracking-widest uppercase"
          style={{ fontFamily: NS, color: "#1B365D" }}
        >
          MUJIN
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                className="font-medium text-lg tracking-tight transition-colors duration-300"
                style={{
                  fontFamily:    NS,
                  color:         active ? "#1B365D" : C.onSurfaceVariant,
                  borderBottom:  active ? "2px solid #1B365D" : "none",
                  paddingBottom: active ? "4px" : "0",
                  fontWeight:    active ? 600 : 400,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="px-8 py-3 font-medium text-sm tracking-wide active:scale-95 transition-all duration-200"
            style={{ backgroundColor: C.primary, color: C.onPrimary, borderRadius: "0.25rem", fontFamily: SG }}
          >
            Demo
          </Link>
          <Link
            href="/login"
            className="font-medium text-sm transition-colors duration-200"
            style={{ color: C.onSurfaceVariant, fontFamily: SG }}
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
    </>
  );
}
