"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession } from "@/lib/auth/client";

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
        orgId: "", // populated from token payload via middleware
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Mujin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {activated && (
          <div className="mb-5 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5">
            <p className="text-sm text-green-700 font-medium">Account created.</p>
            <p className="text-xs text-green-600 mt-0.5">Sign in with your new password to get started.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
          Loading…
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
