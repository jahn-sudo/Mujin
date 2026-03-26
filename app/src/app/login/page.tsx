"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession } from "@/lib/auth/client";
import Link from "next/link";

const C = {
  background:             "#f9f9f9",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow:    "#f2f4f4",
  surfaceContainer:       "#ebeeef",
  surfaceContainerHigh:   "#e4e9ea",
  onBackground:           "#2d3435",
  onSurface:              "#2d3435",
  onSurfaceVariant:       "#5a6061",
  outline:                "#757c7d",
  outlineVariant:         "#adb3b4",
  primary:                "#465f88",
  primaryDim:             "#3a537c",
  primaryContainer:       "#d6e3ff",
  onPrimary:              "#f6f7ff",
  onPrimaryContainer:     "#39527b",
  secondary:              "#486558",
  secondaryContainer:     "#c9ead9",
  onSecondaryContainer:   "#3a584b",
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const activated    = searchParams.get("activated") === "1";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const authHeader = res.headers.get("Authorization");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      const body  = await res.json();

      if (!res.ok) { setError(body.error ?? "Login failed"); return; }
      if (!token)  { setError("No token received — contact support"); return; }

      saveSession({ userId: body.userId, orgId: "", role: body.role, token });

      if (["STAFF", "ORG_ADMIN", "SUPER_ADMIN"].includes(body.role)) {
        router.push("/dashboard/admin");
      } else if (body.role === "MENTOR") {
        router.push("/dashboard/mentor");
      } else if (body.role === "ALUMNI") {
        router.push("/dashboard/alumni");
      } else {
        router.push("/dashboard/student");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
    >
      {/* ── Nav strip ─────────────────────────────────────────────────────────── */}
      <nav
        className="w-full flex justify-between items-center px-12 py-6"
        style={{ borderBottom: `1px solid ${C.outlineVariant}30` }}
      >
        <Link
          href="/"
          className="text-2xl font-bold tracking-widest uppercase"
          style={{ fontFamily: NS, color: "#1B365D" }}
        >
          MUJIN
        </Link>
        <Link
          href="/"
          className="text-sm transition-colors"
          style={{ color: C.onSurfaceVariant, fontFamily: SG }}
        >
          ← Back to home
        </Link>
      </nav>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">

          {/* ── Left: Editorial branding ──────────────────────────────────────── */}
          <div className="w-full md:w-1/2 text-left">
            <span
              className="text-xs uppercase tracking-[0.2em] mb-6 block"
              style={{ color: C.outline, fontFamily: IBM }}
            >
              Member Access
            </span>
            <h1
              className="text-5xl lg:text-7xl leading-tight mb-8 tracking-tight"
              style={{ fontFamily: NS, color: C.onSurface }}
            >
              The{" "}
              <em className="font-normal italic" style={{ color: C.primary }}>
                Trust
              </em>
              <br />
              Platform.
            </h1>
            <p
              className="text-lg max-w-md leading-relaxed mb-12"
              style={{ color: C.onSurfaceVariant }}
            >
              MUJIN provides a structured grant program for international
              students in Japan — built on relational trust, not financial
              history. Sign in to access your dashboard.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-px" style={{ backgroundColor: C.outlineVariant }} />
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: C.outline, fontFamily: IBM }}
              >
                無尽講 · Rooted in Japan
              </span>
            </div>

          </div>

          {/* ── Right: Login card ─────────────────────────────────────────────── */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <div
              className="p-10 md:p-14 rounded-xl"
              style={{
                backgroundColor: C.surfaceContainerLowest,
                boxShadow:       "0 32px 64px rgba(45,52,53,0.06)",
                border:          `1px solid ${C.outlineVariant}20`,
              }}
            >
              {/* Card header */}
              <div className="mb-10">
                <h2
                  className="text-3xl mb-2"
                  style={{ fontFamily: NS, color: C.primary }}
                >
                  Member Login
                </h2>
                <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  Sign in to your account to continue.
                </p>
              </div>

              {/* Activated banner */}
              {activated && (
                <div
                  className="mb-6 px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: C.secondaryContainer,
                    border:          `1px solid ${C.onSecondaryContainer}30`,
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: C.onSecondaryContainer }}>
                    Account activated.
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: C.secondary }}>
                    Sign in with your new password to get started.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Email */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-[10px] uppercase tracking-[0.12em] mb-3 transition-colors group-focus-within:text-[#465f88]"
                    style={{ color: C.outline, fontFamily: IBM }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent focus:outline-none focus:ring-0 py-3 text-sm transition-colors"
                    style={{
                      borderBottom: `1px solid ${C.outlineVariant}60`,
                      color:         C.onSurface,
                      fontFamily:    SG,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = C.primary)}
                    onBlur={(e)  => (e.currentTarget.style.borderBottomColor = `${C.outlineVariant}60`)}
                  />
                </div>

                {/* Password */}
                <div className="group">
                  <div className="flex justify-between items-end mb-3">
                    <label
                      htmlFor="password"
                      className="block text-[10px] uppercase tracking-[0.12em] transition-colors group-focus-within:text-[#465f88]"
                      style={{ color: C.outline, fontFamily: IBM }}
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs transition-colors hover:underline"
                      style={{ color: C.primary, fontFamily: SG }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent focus:outline-none focus:ring-0 py-3 text-sm transition-colors"
                    style={{
                      borderBottom: `1px solid ${C.outlineVariant}60`,
                      color:         C.onSurface,
                      fontFamily:    SG,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = C.primary)}
                    onBlur={(e)  => (e.currentTarget.style.borderBottomColor = `${C.outlineVariant}60`)}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="px-4 py-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: "#fef2f2",
                      border:          "1px solid #fecaca",
                      color:           "#991b1b",
                      fontFamily:      SG,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-between px-6 py-4 font-medium tracking-widest uppercase text-sm transition-all duration-300 disabled:opacity-50"
                    style={{
                      backgroundColor: C.primary,
                      color:           C.onPrimary,
                      borderRadius:    "0.125rem",
                      fontFamily:      SG,
                    }}
                    onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLButtonElement).style.backgroundColor = C.primaryDim)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = C.primary)}
                  >
                    <span>{loading ? "Signing in…" : "Authenticate Access"}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      arrow_forward
                    </span>
                  </button>
                </div>


              </form>

              {/* Card footer */}
              <div
                className="mt-8 pt-6 text-center"
                style={{ borderTop: `1px solid ${C.outlineVariant}20` }}
              >
                <p className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: SG }}>
                  Issue with your credentials?{" "}
                  <a
                    href="mailto:hello@mujin.jp"
                    className="font-medium hover:underline"
                    style={{ color: C.primary }}
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer
        className="w-full flex flex-col md:flex-row justify-between items-center px-12 py-8 gap-4"
        style={{ borderTop: `1px solid ${C.outlineVariant}30`, backgroundColor: C.surfaceContainerLow }}
      >
        <p className="text-xs uppercase tracking-widest" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>
          © 2026 Mujin · A Frontier Commons Prototype
        </p>
        <div className="flex gap-8">
          {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs uppercase tracking-widest transition-colors hover:text-[#465f88]"
              style={{ color: C.onSurfaceVariant, fontFamily: IBM }}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: C.background }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: C.onSurfaceVariant }}>
            <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: C.surfaceContainerHigh }} />
            Loading…
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
