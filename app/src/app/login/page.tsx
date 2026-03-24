"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession } from "@/lib/auth/client";
import Link from "next/link";

const NS = "var(--font-noto-serif), serif";
const SG = "var(--font-space-grotesk), sans-serif";

const SEIGAIHA = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 40a40 40 0 0 1 40-40 40 40 0 0 1 40 40h-2a38 38 0 0 0-38-38A38 38 0 0 0 2 40H0zm4 0a36 36 0 0 1 36-36 36 36 0 0 1 36 36h-2a34 34 0 0 0-34-34A34 34 0 0 0 6 40H4zm4 0a32 32 0 0 1 32-32 32 32 0 0 1 32 32h-2a30 30 0 0 0-30-30A30 30 0 0 0 10 40H8zm4 0a28 28 0 0 1 28-28 28 28 0 0 1 28 28h-2a26 26 0 0 0-26-26A26 26 0 0 0 14 40h-2zm4 0a24 24 0 0 1 24-24 24 24 0 0 1 24 24h-2a22 22 0 0 0-22-22A22 22 0 0 0 18 40h-2zm4 0a20 20 0 0 1 20-20 20 20 0 0 1 20 20h-2a18 18 0 0 0-18-18A18 18 0 0 0 22 40h-2zm4 0a16 16 0 0 1 16-16 16 16 0 0 1 16 16h-2a14 14 0 0 0-14-14A14 14 0 0 0 26 40h-2zm4 0a12 12 0 0 1 12-12 12 12 0 0 1 12 12h-2a10 10 0 0 0-10-10A10 10 0 0 0 30 40h-2zm4 0a8 8 0 0 1 8-8 8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6A6 6 0 0 0 34 40h-2zm4 0a4 4 0 0 1 4-4 4 4 0 0 1 4 4h-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2h-2z' fill='%23C4ECCE' fill-opacity='0.02'/%3E%3C/svg%3E")`;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activated = searchParams.get("activated") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const authHeader = res.headers.get("Authorization");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Login failed");
        return;
      }

      if (!token) {
        setError("No token received — contact support");
        return;
      }

      saveSession({
        userId: body.userId,
        orgId: "",
        role: body.role,
        token,
      });

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
    <main
      className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden"
      style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: SG, backgroundImage: SEIGAIHA }}
    >
      {/* Side decoration */}
      <div
        className="fixed top-1/2 left-10 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8 pointer-events-none"
        style={{ opacity: 0.1 }}
      >
        <span className="text-3xl font-bold" style={{ fontFamily: NS, color: "#c4ecce" }}>無</span>
        <span className="text-3xl font-bold" style={{ fontFamily: NS, color: "#c4ecce" }}>人</span>
        <div className="w-px h-24 mt-2" style={{ backgroundColor: "#c4ecce" }} />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ color: "#c4ecce", fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
              <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: NS }}>
                Mujin
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="h-px w-6" style={{ backgroundColor: "#4a4a4a" }} />
              <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#8c938b" }}>
                Sign in to your account
              </p>
              <span className="h-px w-6" style={{ backgroundColor: "#4a4a4a" }} />
            </div>
          </div>
        </div>

        {/* Card */}
        <div
          className="p-10 shadow-2xl"
          style={{ backgroundColor: "#161616", border: "1px solid rgba(44,44,44,0.3)" }}
        >
          {activated && (
            <div
              className="mb-6 px-3 py-2.5"
              style={{
                backgroundColor: "rgba(196,236,206,0.05)",
                border: "1px solid rgba(196,236,206,0.2)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "#c4ecce" }}>Account created.</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(196,236,206,0.7)" }}>
                Sign in with your new password to get started.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Email */}
            <div>
              <label
                className="block text-[10px] tracking-widest uppercase mb-2"
                style={{ color: "#8c938b" }}
              >
                Email
              </label>
              <div
                className="flex items-end gap-3 pb-2"
                style={{ borderBottom: "1px solid #2c2c2c" }}
              >
                <span
                  className="material-symbols-outlined text-lg mb-1"
                  style={{ color: "#4a4a4a" }}
                >
                  person
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm tracking-widest"
                  style={{ color: "#e5e2e1", outline: "none" }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[10px] tracking-widest uppercase mb-2"
                style={{ color: "#8c938b" }}
              >
                Password
              </label>
              <div
                className="flex items-end gap-3 pb-2"
                style={{ borderBottom: "1px solid #2c2c2c" }}
              >
                <span
                  className="material-symbols-outlined text-lg mb-1"
                  style={{ color: "#4a4a4a" }}
                >
                  lock_open
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm tracking-widest"
                  style={{ color: "#e5e2e1", outline: "none" }}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2"
                style={{
                  color: "#ffb4ab",
                  backgroundColor: "rgba(147,0,10,0.2)",
                  border: "1px solid rgba(147,0,10,0.3)",
                }}
              >
                {error}
              </p>
            )}

            <div className="space-y-6 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between p-4 transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: "#c4ecce" }}
              >
                <span
                  className="font-bold tracking-[0.2em] text-xs uppercase"
                  style={{ color: "#143723" }}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </span>
                <span className="material-symbols-outlined" style={{ color: "#143723" }}>
                  arrow_forward
                </span>
              </button>

              <div
                className="grid grid-cols-2"
                style={{ gap: "1px", backgroundColor: "rgba(44,44,44,0.2)" }}
              >
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 py-3 transition-colors"
                  style={{ backgroundColor: "#161616" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#4a4a4a", fontSize: "14px" }}
                  >
                    sync_problem
                  </span>
                  <span
                    className="text-[9px] tracking-wider uppercase"
                    style={{ color: "#8c938b" }}
                  >
                    Forgot password
                  </span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 py-3 transition-colors"
                  style={{ backgroundColor: "#161616" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#4a4a4a", fontSize: "14px" }}
                  >
                    add_moderator
                  </span>
                  <span
                    className="text-[9px] tracking-wider uppercase"
                    style={{ color: "#8c938b" }}
                  >
                    Register
                  </span>
                </a>
              </div>
            </div>
          </form>

          {/* Card footer */}
          <div
            className="mt-8 pt-6 flex justify-between"
            style={{ borderTop: "1px solid rgba(44,44,44,0.1)" }}
          >
            <Link
              href="/"
              className="text-[8px] tracking-widest uppercase transition-colors hover:text-[#c4ecce]"
              style={{ color: "#4a4a4a" }}
            >
              ← Back to home
            </Link>
            <span className="text-[8px] tracking-widest uppercase" style={{ color: "#4a4a4a" }}>
              © Mujin
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#131313" }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
            <span
              className="inline-block w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: "#282828" }}
            />
            Loading…
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
