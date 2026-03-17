"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { useTranslation } from "react-i18next";

interface ScoreRecord {
  id: string;
  month: string;
  score: number;
  label: string;
  responsivenessRaw: number;
  transparencyRaw: number;
  mutualismRaw: number;
  reflectionRaw: number;
  isOverridden: boolean;
}

interface PLRecord {
  id: string;
  month: string;
  revenue: number | null;
  expenses: number | null;
  net: number | null;
  autoScore: number | null;
  finalScore: number | null;
  status: string;
}

interface StaffNote {
  month: string;
  action: string;
  annotation: string | null;
  overrideReason: string | null;
  createdAt: string;
}

type GraduationStatus =
  | "INELIGIBLE"
  | "ELIGIBLE"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_PASSED"
  | "INTERVIEW_FAILED"
  | "GRADUATED";

interface GraduationRecord {
  status: GraduationStatus;
  interviewDate?: string | null;
  interviewScheduledAt?: string | null;
  interviewConductedAt?: string | null;
  interviewResult?: string | null;
  bankIntroDate?: string | null;
  lastInterviewFailedAt?: string | null;
}

interface StudentDetail {
  profile: {
    id: string;
    email: string;
    cohortName: string | null;
    venture: { name: string; description: string; coFounders: string[] } | null;
    ventureCategory: string | null;
  };
  scoreHistory: ScoreRecord[];
  plHistory: PLRecord[];
  attendanceSummary: { attended: number; total: number; pct: number | null };
  staffNotes: StaffNote[];
  graduationRecord: GraduationRecord;
}

export default function StudentDetailPage() {
  const { id: studentId } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<ScoreRecord | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const { t } = useTranslation();
  const [gradActionError, setGradActionError] = useState<string | null>(null);
  const [gradActionLoading, setGradActionLoading] = useState(false);

  const reload = (session: ReturnType<typeof loadSession>) => {
    apiFetch(`/api/admin/students/${studentId}`, {}, session!)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.scoreHistory?.length > 0) {
          setSelectedScore(d.scoreHistory[d.scoreHistory.length - 1]);
        }
      })
      .catch(() => setError("Failed to load student"));
  };

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    reload(session);
  }, [studentId]);

  async function handleScheduleInterview() {
    if (!interviewDate) return;
    const session = loadSession();
    if (!session) return;
    setGradActionLoading(true);
    setGradActionError(null);
    try {
      const res = await apiFetch(
        `/api/admin/students/${studentId}/graduation/schedule-interview`,
        { method: "POST", body: JSON.stringify({ interviewDate }) },
        session
      );
      if (!res.ok) {
        const d = await res.json();
        setGradActionError(d.error ?? "Failed to schedule interview");
      } else {
        reload(session);
      }
    } finally {
      setGradActionLoading(false);
    }
  }

  async function handleRecordInterview(result: "PASSED" | "FAILED") {
    const session = loadSession();
    if (!session) return;
    setGradActionLoading(true);
    setGradActionError(null);
    try {
      const res = await apiFetch(
        `/api/admin/students/${studentId}/graduation/record-interview`,
        { method: "POST", body: JSON.stringify({ result }) },
        session
      );
      if (!res.ok) {
        const d = await res.json();
        setGradActionError(d.error ?? "Failed to record interview");
      } else {
        reload(session);
      }
    } finally {
      setGradActionLoading(false);
    }
  }

  async function handleTriggerBankIntro() {
    const session = loadSession();
    if (!session) return;
    setGradActionLoading(true);
    setGradActionError(null);
    try {
      const res = await apiFetch(
        `/api/admin/students/${studentId}/graduation/trigger-bank-intro`,
        { method: "POST" },
        session
      );
      if (!res.ok) {
        const d = await res.json();
        setGradActionError(d.error ?? "Failed to trigger bank introduction");
      } else {
        reload(session);
      }
    } finally {
      setGradActionLoading(false);
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  const { profile, scoreHistory, plHistory, attendanceSummary, staffNotes, graduationRecord } = data;
  const gradStatus = graduationRecord?.status ?? "INELIGIBLE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{profile.email}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {profile.cohortName ?? "No cohort"} ·{" "}
            {profile.venture?.name ?? "No venture"}{" "}
            {profile.ventureCategory && (
              <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 ml-1">
                {profile.ventureCategory}
              </span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          {t("common.back")}
        </Link>
      </div>

      {/* Score History + Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Score History */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.studentDetail.scoreHistory")}
          </h3>
          {scoreHistory.length === 0 ? (
            <p className="text-sm text-gray-400">{t("admin.studentDetail.noScores")}</p>
          ) : (
            <ul className="space-y-1.5">
              {[...scoreHistory].reverse().map((s) => (
                <li
                  key={s.id}
                  onClick={() => setSelectedScore(s)}
                  className={`flex items-center justify-between text-sm cursor-pointer px-2 py-1.5 rounded-lg transition-colors ${
                    selectedScore?.id === s.id ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-gray-600 font-mono">{s.month}</span>
                  <div className="flex items-center gap-2">
                    {s.isOverridden && (
                      <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1">
                        {t("admin.studentDetail.overridden")}
                      </span>
                    )}
                    <TrafficLight label={s.label} score={s.score} size="sm" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected Score Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {selectedScore
              ? t("admin.studentDetail.breakdownMonth", { month: selectedScore.month })
              : t("admin.studentDetail.breakdown")}
          </h3>
          {selectedScore ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-4">
                <TrafficLight label={selectedScore.label} size="lg" />
                <span className="text-3xl font-bold font-mono text-gray-900">
                  {Math.round(selectedScore.score)}
                </span>
              </div>
              <ScoreBar label={t("student.dashboard.responsiveness")} value={selectedScore.responsivenessRaw} />
              <ScoreBar label={t("student.dashboard.transparency")} value={selectedScore.transparencyRaw} />
              <ScoreBar label={t("student.dashboard.mutualism")} value={selectedScore.mutualismRaw} />
              <ScoreBar label={t("student.dashboard.reflection")} value={selectedScore.reflectionRaw} />

              <div className="pt-3 border-t border-gray-100">
                <Link
                  href={`/dashboard/admin/trust-scores/${selectedScore.id}/override`}
                  className="text-xs text-gray-500 hover:text-gray-900 underline"
                >
                  {t("admin.studentDetail.overrideLink")}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">{t("admin.studentDetail.selectMonth")}</p>
          )}
        </div>
      </div>

      {/* Attendance + P&L side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.studentDetail.attendance")}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold font-mono text-gray-900">
              {attendanceSummary.pct !== null ? `${attendanceSummary.pct}%` : t("common.noData")}
            </span>
            <span className="text-sm text-gray-500">
              {t("admin.studentDetail.sessions", {
                attended: attendanceSummary.attended,
                total: attendanceSummary.total,
              })}
            </span>
          </div>
        </div>

        {/* P&L History */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.studentDetail.plHistory")}
          </h3>
          {plHistory.length === 0 ? (
            <p className="text-sm text-gray-400">{t("admin.studentDetail.noPL")}</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {plHistory.map((pl) => (
                <li key={pl.id} className="flex items-center justify-between">
                  <span className="font-mono text-gray-600">{pl.month}</span>
                  <div className="flex items-center gap-3 text-xs">
                    {pl.net !== null && (
                      <span className={pl.net >= 0 ? "text-green-700" : "text-red-600"}>
                        ¥{pl.net.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`rounded px-1.5 py-0.5 border ${
                        pl.status === "APPROVED"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : pl.status === "FLAGGED"
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {pl.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Staff Notes */}
      {staffNotes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.studentDetail.staffNotes")}
          </h3>
          <ul className="space-y-3">
            {staffNotes.map((note, i) => (
              <li key={i} className="text-sm border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <span className="font-mono">{note.month}</span>
                  <span className="bg-gray-100 rounded px-1.5 py-0.5">{note.action}</span>
                </div>
                {note.annotation && <p className="text-gray-700">{note.annotation}</p>}
                {note.overrideReason && (
                  <p className="text-amber-700 mt-0.5">
                    {t("admin.studentDetail.overrideReason", { reason: note.overrideReason })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Graduation Tracking */}
      <div className={`border rounded-xl p-6 ${
        gradStatus === "GRADUATED"
          ? "bg-green-50 border-green-200"
          : gradStatus === "ELIGIBLE" || gradStatus === "INTERVIEW_SCHEDULED" || gradStatus === "INTERVIEW_PASSED"
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {t("admin.studentDetail.graduation.title")}
          </h3>
          <span className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${
            gradStatus === "GRADUATED"
              ? "bg-green-100 border-green-300 text-green-800"
              : gradStatus === "INTERVIEW_PASSED"
              ? "bg-blue-100 border-blue-300 text-blue-800"
              : gradStatus === "INTERVIEW_SCHEDULED"
              ? "bg-indigo-100 border-indigo-300 text-indigo-800"
              : gradStatus === "ELIGIBLE"
              ? "bg-yellow-100 border-yellow-300 text-yellow-800"
              : gradStatus === "INTERVIEW_FAILED"
              ? "bg-red-100 border-red-300 text-red-800"
              : "bg-gray-100 border-gray-200 text-gray-500"
          }`}>
            {gradStatus.replace(/_/g, " ")}
          </span>
        </div>

        {gradStatus === "GRADUATED" && graduationRecord.bankIntroDate && (
          <p className="text-sm text-green-800 font-medium">
            {t("admin.studentDetail.graduation.bankIntroDate", {
              date: new Date(graduationRecord.bankIntroDate).toLocaleDateString(),
            })}
          </p>
        )}

        {gradStatus === "INTERVIEW_SCHEDULED" && graduationRecord.interviewDate && (
          <div className="mb-4">
            <p className="text-sm text-indigo-800">
              {t("admin.studentDetail.graduation.interviewScheduled", {
                date: new Date(graduationRecord.interviewDate).toLocaleString(),
              })}
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleRecordInterview("PASSED")}
                disabled={gradActionLoading}
                className="text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {t("admin.studentDetail.graduation.markPassed")}
              </button>
              <button
                onClick={() => handleRecordInterview("FAILED")}
                disabled={gradActionLoading}
                className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {t("admin.studentDetail.graduation.markFailed")}
              </button>
            </div>
          </div>
        )}

        {gradStatus === "INTERVIEW_PASSED" && (
          <div className="mb-4">
            <p className="text-sm text-blue-800 mb-3">
              {t("admin.studentDetail.graduation.readyForBank")}
            </p>
            <button
              onClick={handleTriggerBankIntro}
              disabled={gradActionLoading}
              className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {t("admin.studentDetail.graduation.triggerBank")}
            </button>
          </div>
        )}

        {gradStatus === "ELIGIBLE" && (
          <div className="mb-4">
            <p className="text-sm text-yellow-800 mb-3">
              {t("admin.studentDetail.graduation.schedulePrompt")}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleScheduleInterview}
                disabled={gradActionLoading || !interviewDate}
                className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {t("admin.studentDetail.graduation.schedule")}
              </button>
            </div>
          </div>
        )}

        {gradActionError && (
          <p className="text-sm text-red-600 mt-2">{gradActionError}</p>
        )}

        {graduationRecord.lastInterviewFailedAt && gradStatus === "INELIGIBLE" && (
          <p className="text-xs text-gray-400 mt-3">
            {t("admin.studentDetail.graduation.failNote", {
              date: new Date(graduationRecord.lastInterviewFailedAt).toLocaleDateString(),
            })}
          </p>
        )}
      </div>
    </div>
  );
}
