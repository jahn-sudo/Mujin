"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { TrafficLight } from "@/components/ui/TrafficLight";

interface TrustScoreEntry {
  month: string;
  score: number;
  label: string;
}

interface BankTracking {
  bankName: string | null;
  firstMeetingDate: string | null;
  firstMeetingOutcome: "COMPLETED" | "NO_SHOW" | "DECLINED" | null;
  accountOpenedAt: string | null;
  loanSecuredAt: string | null;
  loanAmountYen: number | null;
  businessManagerVisaAt: string | null;
}

interface GraduationRecord {
  status: string;
  bankIntroDate: string | null;
  bankIntroTracking: BankTracking | null;
}

interface StudentProfile {
  ventureCategory: string | null;
  cohort: { name: string } | null;
  ventureProfile: { name: string } | null;
  graduationRecord: GraduationRecord | null;
  trustScores: TrustScoreEntry[];
}

interface AlumniData {
  email: string;
  studentProfile: StudentProfile | null;
}

function Milestone({
  label,
  met,
  date,
  detail,
}: {
  label: string;
  met: boolean;
  date?: string | null;
  detail?: string | null;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        met ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <svg
          className={`w-4 h-4 shrink-0 ${met ? "text-green-600" : "text-gray-300"}`}
          viewBox="0 0 14 14"
          fill="none"
        >
          <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
          {met && (
            <path
              d="M4 7L6 9L10 5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      {date && (
        <p className="text-xs text-gray-500 font-mono ml-6">
          {new Date(date).toLocaleDateString()}
        </p>
      )}
      {detail && (
        <p className={`text-xs ml-6 mt-0.5 ${met ? "text-green-700 font-medium" : "text-gray-400"}`}>
          {detail}
        </p>
      )}
      {!met && !date && <p className="text-xs text-gray-300 ml-6">—</p>}
    </div>
  );
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

  const profile = data.studentProfile;
  const grad = profile?.graduationRecord;
  const tracking = grad?.bankIntroTracking;
  const scores = profile?.trustScores ?? [];
  const latestScore = scores[scores.length - 1] ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {profile?.ventureProfile?.name ?? data.email}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {profile?.cohort?.name ?? "Alumni"}
            {profile?.ventureCategory && (
              <span className="ml-2 text-xs bg-gray-100 rounded px-1.5 py-0.5">
                {profile.ventureCategory}
              </span>
            )}
          </p>
          {grad?.bankIntroDate && (
            <p className="text-xs text-green-700 mt-1 font-medium">
              Graduated {new Date(grad.bankIntroDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/alumni/directory"
          className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          Community Directory
        </Link>
      </div>

      {/* Trust score history */}
      {scores.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Trust Score Journey
            </h3>
            {latestScore && (
              <div className="flex items-center gap-2">
                <TrafficLight label={latestScore.label} score={latestScore.score} size="sm" />
                <span className="text-sm font-mono text-gray-500">{latestScore.month}</span>
              </div>
            )}
          </div>
          <div className="flex items-end gap-1.5">
            {scores.map((s) => {
              const height = Math.max(16, Math.round((s.score / 100) * 80));
              const color =
                s.label === "GREEN"
                  ? "bg-green-500"
                  : s.label === "YELLOW"
                  ? "bg-amber-400"
                  : "bg-red-400";
              return (
                <div key={s.month} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-full rounded-sm ${color}`}
                    style={{ height }}
                    title={`${s.month}: ${s.score}`}
                  />
                  <span className="text-[10px] text-gray-400 font-mono">
                    {s.month.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bank introduction milestones */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          Bank Introduction Journey
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Milestone
            label="Bank Introduced"
            met={!!grad?.bankIntroDate}
            date={grad?.bankIntroDate}
            detail={tracking?.bankName ?? null}
          />
          <Milestone
            label="First Meeting"
            met={tracking?.firstMeetingOutcome === "COMPLETED"}
            date={tracking?.firstMeetingDate}
            detail={tracking?.firstMeetingOutcome ?? null}
          />
          <Milestone
            label="Account Opened"
            met={!!tracking?.accountOpenedAt}
            date={tracking?.accountOpenedAt}
          />
          <Milestone
            label="Loan Secured"
            met={!!tracking?.loanSecuredAt}
            date={tracking?.loanSecuredAt}
            detail={
              tracking?.loanAmountYen
                ? `¥${tracking.loanAmountYen.toLocaleString()}`
                : null
            }
          />
        </div>
        {tracking?.businessManagerVisaAt && (
          <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">Business Manager Visa Obtained</p>
              <p className="text-xs text-green-600 mt-0.5">
                {new Date(tracking.businessManagerVisaAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
