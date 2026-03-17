"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, loadSession } from "@/lib/auth/client";

interface GroupMember {
  userId: string;
  email: string;
}

export default function TownHallPage() {
  const { id: townHallId } = useParams<{ id: string }>();
  const router = useRouter();

  const [cohortMembers, setCohortMembers] = useState<GroupMember[]>([]);
  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    // Load cohort members via the student/me endpoint
    apiFetch("/api/student/me", {}, session)
      .then((r) => r.json())
      .then((data) => {
        // group contains current cohort members
        const members = data.group ?? [];
        // Fetch full cohort member userIds — we need them for the submission
        // The group contains initials only; we need actual userIds
        // We'll derive from the user's own ID for self-inclusion
        setCohortMembers([]);
        // Set self as checked by default
        setAttendeeIds([session.userId]);
      })
      .catch(() => setError("Failed to load group"))
      .finally(() => setLoading(false));
  }, [townHallId]);

  const wordCount = reflectionText.trim().split(/\s+/).filter(Boolean).length;

  function toggleAttendee(userId: string) {
    setAttendeeIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (wordCount < 50) {
      setError("Reflection must be at least 50 words");
      return;
    }
    setError(null);
    setSubmitting(true);

    const session = loadSession();
    if (!session) return;

    const res = await apiFetch(
      `/api/student/townhalls/${townHallId}/submit`,
      {
        method: "POST",
        body: JSON.stringify({ attendeeIds, reflectionText }),
      },
      session
    );

    const body = await res.json();
    if (!res.ok) {
      if (res.status === 409) {
        setAlreadySubmitted(true);
      } else {
        setError(body.error ?? "Submission failed");
      }
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/student?submitted=townhall");
  }

  if (loading) return <div className="text-sm text-gray-400">Loading…</div>;

  if (alreadySubmitted) {
    return (
      <div className="max-w-lg">
        <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
          <p className="text-green-700 font-medium">✅ Already submitted</p>
          <p className="text-sm text-green-600 mt-1">
            You have already submitted your Town Hall form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Town Hall</h2>
        <p className="text-sm text-gray-500 mt-0.5">Anonymous Submission</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">
            Part 1 — Who was present today?
          </h3>
          <p className="text-xs text-gray-500">
            Check all members who attended. Your own attendance is included by default.
          </p>

          <div className="space-y-2">
            {/* Self always checked */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-default">
              <span className="w-4 h-4 rounded border-2 border-gray-900 bg-gray-900 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </span>
              <span className="font-medium">[You]</span>
            </label>

            {cohortMembers.map((member) => (
              <label key={member.userId} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendeeIds.includes(member.userId)}
                  onChange={() => toggleAttendee(member.userId)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                {member.email}
              </label>
            ))}

            {cohortMembers.length === 0 && (
              <p className="text-xs text-gray-400">
                Loading group members… You can still submit your own attendance.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">
            Part 2 — Monthly Reflection
          </h3>
          <p className="text-xs text-gray-500">
            Share your honest thoughts. This is anonymous — staff cannot read this.
            An automated system checks that your response is meaningful (not staff).
          </p>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={6}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Share your reflections on this month — your venture progress, struggles, learnings, and what you observed in your peers…"
          />

          <div className="flex items-center justify-between text-xs">
            <span className={wordCount >= 50 ? "text-green-600" : "text-gray-400"}>
              {wordCount} / 50 minimum words
            </span>
            {wordCount >= 50 && <span className="text-green-600">✓ Minimum met</span>}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || wordCount < 50}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
