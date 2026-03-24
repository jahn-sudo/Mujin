"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ActivateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    fetch(`/api/auth/invite/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setEmail(data.email);
        setRole(data.role);
        setTokenValid(true);
      })
      .catch(() => setTokenValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, tosVersion: "1.0" }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/login?activated=1");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Loading token validation
  if (tokenValid === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
        Verifying your invitation…
      </div>
    );
  }

  // Invalid / expired token
  if (!tokenValid) {
    return (
      <div className="max-w-md">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">This link has expired or is invalid.</h1>
        <p className="text-sm text-gray-500 mb-6">
          Activation links are valid for 7 days. If your link has expired, contact the Mujin team to request a new one.
        </p>
        <Link href="/" className="text-sm text-gray-900 underline underline-offset-2">
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
          {role === "MENTOR" ? "Mentor activation" : "Student activation"}
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Set up your account</h1>
        <p className="text-sm text-gray-500">
          You have been invited to join Mujin as <strong>{email}</strong>. Create a password to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email (read-only) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* ToS */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-500 leading-relaxed">
            I agree to the Mujin Terms of Service and acknowledge that my participation in the program is governed by the Pledge of Honor I will sign upon acceptance.
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal nav */}
      <nav className="border-b border-gray-100 px-6 h-14 flex items-center">
        <Link href="/" className="text-base font-semibold tracking-tight text-gray-900">
          Mujin
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
              Loading…
            </div>
          }
        >
          <ActivateForm />
        </Suspense>
      </div>
    </div>
  );
}
