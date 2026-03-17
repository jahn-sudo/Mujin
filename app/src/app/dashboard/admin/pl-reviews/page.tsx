"use client";

import { useEffect, useState } from "react";
import { apiFetch, loadSession } from "@/lib/auth/client";

interface PLRecord {
  id: string;
  month: string;
  studentId: string;
  email: string;
  venture: string | null;
  revenue: number | null;
  expenses: number | null;
  net: number | null;
  autoScore: number | null;
  staffScore: number | null;
  finalScore: number | null;
  status: string;
  spotAudit: boolean;
  submittedAt: string | null;
}

type ReviewAction = "APPROVED" | "FLAGGED" | "MORE_INFO";

export default function PLReviewsPage() {
  const [submissions, setSubmissions] = useState<PLRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<PLRecord | null>(null);
  const [annotation, setAnnotation] = useState("");
  const [overrideScore, setOverrideScore] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function loadSubmissions() {
    const session = loadSession();
    if (!session) return;

    apiFetch("/api/admin/pl-submissions?status=SUBMITTED", {}, session)
      .then((r) => r.json())
      .then(setSubmissions)
      .catch(() => setError("Failed to load submissions"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function handleAction(action: ReviewAction) {
    if (!active) return;
    setActionError(null);
    setSubmitting(true);

    const session = loadSession();
    if (!session) return;

    const res = await apiFetch(
      `/api/admin/pl-submissions/${active.id}/review`,
      {
        method: "POST",
        body: JSON.stringify({
          action,
          annotation: annotation || undefined,
        }),
      },
      session
    );

    if (!res.ok) {
      const body = await res.json();
      setActionError(body.error ?? "Action failed");
      setSubmitting(false);
      return;
    }

    setActive(null);
    setAnnotation("");
    setSubmitting(false);
    loadSubmissions();
  }

  async function handleScoreOverride() {
    if (!active || !overrideScore || !overrideReason) return;
    setActionError(null);
    setSubmitting(true);

    const session = loadSession();
    if (!session) return;

    const res = await apiFetch(
      `/api/admin/pl-submissions/${active.id}/override-score`,
      {
        method: "POST",
        body: JSON.stringify({
          staffScore: Number(overrideScore),
          reason: overrideReason,
        }),
      },
      session
    );

    if (!res.ok) {
      const body = await res.json();
      setActionError(body.error ?? "Override failed");
      setSubmitting(false);
      return;
    }

    setActive(null);
    setOverrideScore("");
    setOverrideReason("");
    setSubmitting(false);
    loadSubmissions();
  }

  if (loading) return <div className="text-sm text-gray-400">Loading…</div>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        P&amp;L Reviews{" "}
        <span className="text-sm font-normal text-gray-500">
          ({submissions.length} pending)
        </span>
      </h2>

      {submissions.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">All caught up — no pending reviews.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Submission list */}
        <div className="space-y-2">
          {submissions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActive(s);
                setAnnotation("");
                setActionError(null);
              }}
              className={`w-full text-left bg-white border rounded-xl p-4 hover:border-gray-400 transition-colors ${
                active?.id === s.id ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {s.email.split("@")[0]}
                  </span>
                  {s.venture && (
                    <span className="text-xs text-gray-400 ml-1">· {s.venture}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {s.spotAudit && (
                    <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded px-1.5 py-0.5">
                      Audit
                    </span>
                  )}
                  <span className="text-xs font-mono text-gray-500">{s.month}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Rev: ¥{(s.revenue ?? 0).toLocaleString()}</span>
                <span>Exp: ¥{(s.expenses ?? 0).toLocaleString()}</span>
                <span className={`font-medium ${(s.net ?? 0) >= 0 ? "text-green-700" : "text-red-600"}`}>
                  Net: ¥{(s.net ?? 0).toLocaleString()}
                </span>
                <span>Score: {s.finalScore ?? s.autoScore ?? "—"}/100</span>
              </div>
            </button>
          ))}
        </div>

        {/* Review panel */}
        {active && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 self-start">
            <h3 className="text-sm font-medium text-gray-900">
              P&amp;L Review · {active.email.split("@")[0]} · {active.month}
            </h3>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <Stat label="Revenue" value={`¥${(active.revenue ?? 0).toLocaleString()}`} />
              <Stat label="Expenses" value={`¥${(active.expenses ?? 0).toLocaleString()}`} />
              <Stat
                label="Net"
                value={`¥${(active.net ?? 0).toLocaleString()}`}
                positive={(active.net ?? 0) >= 0}
              />
            </div>

            <div className="text-xs text-gray-500">
              Auto-score: {active.autoScore ?? "—"}/100
              {active.staffScore !== null && ` · Staff override: ${active.staffScore}/100`}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff Note (internal)
              </label>
              <textarea
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                placeholder="Internal note — not visible to student"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAction("APPROVED")}
                disabled={submitting}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => handleAction("FLAGGED")}
                disabled={submitting}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                🚩 Flag
              </button>
              <button
                onClick={() => handleAction("MORE_INFO")}
                disabled={submitting}
                className="flex-1 bg-gray-200 text-gray-900 rounded-lg py-2 text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                ℹ️ More Info
              </button>
            </div>

            {/* Score override */}
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-3 py-2 text-sm text-gray-500 cursor-pointer hover:text-gray-900">
                Override Score — requires reason
              </summary>
              <div className="px-3 pb-3 space-y-2 pt-2 border-t border-gray-100">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="New score (0–100)"
                />
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Written reason (required)"
                />
                <button
                  onClick={handleScoreOverride}
                  disabled={submitting || !overrideScore || !overrideReason}
                  className="w-full bg-amber-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  Apply Override
                </button>
              </div>
            </details>

            {actionError && (
              <p className="text-sm text-red-600">{actionError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 text-center">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p
        className={`text-sm font-medium font-mono ${
          positive !== undefined
            ? positive
              ? "text-green-700"
              : "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
