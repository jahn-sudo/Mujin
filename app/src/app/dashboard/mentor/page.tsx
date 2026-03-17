"use client";

import { useEffect, useState } from "react";
import { apiFetch, loadSession } from "@/lib/auth/client";
import Link from "next/link";

interface Session {
  id: string;
  date: string;
  note: string | null;
  attendanceSubmittedAt: string | null;
}

export default function MentorDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    apiFetch("/api/mentor/checkin-sessions", {}, session)
      .then((r) => r.json())
      .then(setSessions)
      .catch(() => setError("Failed to load sessions"))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (loading) return <div className="text-sm text-gray-400">Loading…</div>;

  const upcoming = sessions.filter((s) => new Date(s.date) >= new Date());
  const past = sessions.filter((s) => new Date(s.date) < new Date());

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Mentor Dashboard</h2>

      {sessions.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-400">
          No check-in sessions scheduled yet.
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Upcoming</h3>
          {upcoming.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Past Sessions</h3>
          {past.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionRow({ session: s }: { session: { id: string; date: string; note: string | null; attendanceSubmittedAt: string | null } }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </p>
        {s.note && <p className="text-xs text-gray-400">{s.note}</p>}
      </div>
      <div className="flex items-center gap-3">
        {s.attendanceSubmittedAt ? (
          <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
            Attendance logged
          </span>
        ) : (
          <Link
            href={`/dashboard/mentor/checkin/${s.id}/attendance`}
            className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-100"
          >
            Log attendance
          </Link>
        )}
        <Link
          href={`/dashboard/mentor/checkin/${s.id}`}
          className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5 hover:bg-indigo-100"
        >
          View notes
        </Link>
      </div>
    </div>
  );
}
