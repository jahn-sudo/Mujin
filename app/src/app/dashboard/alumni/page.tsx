"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, loadSession } from "@/lib/auth/client";

interface AlumniData {
  email: string;
  studentProfile: {
    cohort: { name: string } | null;
  } | null;
}

export default function AlumniDashboard() {
  const [data, setData] = useState<AlumniData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    apiFetch("/api/alumni/me", {}, session)
      .then((r) => r.json())
      .then((d) => setData(d.alumni))
      .catch(() => setError("Failed to load profile"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <div className="text-sm text-gray-400">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {data.studentProfile?.cohort?.name ?? "Alumni"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/alumni/directory"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors block"
        >
          <p className="text-sm font-medium text-gray-900">Community Directory</p>
          <p className="text-xs text-gray-400 mt-1">Browse fellow alumni and their journeys.</p>
        </Link>
        <Link
          href="/dashboard/alumni/demo"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors block"
        >
          <p className="text-sm font-medium text-gray-900">Demo</p>
          <p className="text-xs text-gray-400 mt-1">See a sample alumni journey with full data.</p>
        </Link>
      </div>
    </div>
  );
}
