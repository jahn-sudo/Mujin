"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Student {
  id: string; userId: string; email: string; venture: string | null;
  score: number | null; label: string | null; month: string | null;
}
interface Cohort { id: string; name: string; students: Student[]; }
interface DashboardData {
  cohorts: Cohort[];
  needsAttention: (Student & { cohortName: string })[];
  pendingPLReviews: number;
  nextCheckIn: { id: string; date: string; cohortName: string } | null;
}
interface ScoreEntry {
  month: string; score: number; label: string;
  responsivenessRaw: number; transparencyRaw: number; mutualismRaw: number; reflectionRaw: number;
}
interface PLEntry {
  month: string; revenue: number | null; expenses: number | null; net: number | null; status: string;
}
interface StudentDetail {
  profile: {
    id: string; email: string; cohortName: string | null;
    venture: { name: string; description: string | null } | null;
    ventureCategory: string | null;
  };
  scoreHistory: ScoreEntry[];
  plHistory: PLEntry[];
  attendanceSummary: { attended: number; total: number; pct: number | null };
  graduationRecord: { status: string };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function DemoBanner() {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Demo</span>
      <p className="text-sm text-gray-500">{t("demo.banner")}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
      Loading…
    </div>
  );
}

function gradBadgeClass(status: string) {
  if (status === "GRADUATED")           return "bg-green-100 border-green-300 text-green-800";
  if (status === "INTERVIEW_SCHEDULED") return "bg-blue-100 border-blue-300 text-blue-800";
  if (status === "INTERVIEW_PASSED")    return "bg-indigo-100 border-indigo-300 text-indigo-800";
  if (status === "ELIGIBLE")            return "bg-yellow-100 border-yellow-300 text-yellow-800";
  return "bg-gray-100 border-gray-200 text-gray-600";
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoAdminDashboard() {
  const { t } = useTranslation();
  const session = loadSession();

  const [data, setData]                 = useState<DashboardData | null>(null);
  const [loading, setLoading]           = useState(true);
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    if (!session) return;
    apiFetch("/api/admin/demo/dashboard", {}, session)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function selectStudent(studentId: string) {
    if (!session) return;
    setStudentDetail(null);
    setSelectedMonth(null);
    setDetailLoading(true);
    try {
      const r      = await apiFetch(`/api/admin/students/${studentId}`, {}, session);
      const detail: StudentDetail = await r.json();
      setStudentDetail(detail);
      setSelectedMonth(detail.scoreHistory[detail.scoreHistory.length - 1] ?? null);
    } finally {
      setDetailLoading(false);
    }
  }

  function clearDetail() {
    setStudentDetail(null);
    setSelectedMonth(null);
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        <DemoBanner />
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <DemoBanner />
        <p className="text-sm text-red-600">Failed to load demo data.</p>
      </div>
    );
  }

  // ── Derived stats ────────────────────────────────────────────────────────

  const allStudents = data.cohorts.flatMap((c) => c.students);
  const green  = allStudents.filter((s) => s.label === "GREEN").length;
  const yellow = allStudents.filter((s) => s.label === "YELLOW").length;
  const red    = allStudents.filter((s) => s.label === "RED").length;

  // ── Student detail view ───────────────────────────────────────────────────

  if (studentDetail || detailLoading) {
    return (
      <div className="space-y-6">
        <DemoBanner />

        <div className="flex items-start justify-between">
          <div>
            {detailLoading ? (
              <Spinner />
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900">
                  {studentDetail!.profile.email.split("@")[0]}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {studentDetail!.profile.cohortName} ·{" "}
                  {studentDetail!.profile.venture?.name ?? "—"}{" "}
                  {studentDetail!.profile.ventureCategory && (
                    <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 ml-1">
                      {studentDetail!.profile.ventureCategory}
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
          <button onClick={clearDetail} className="text-sm text-gray-500 hover:text-gray-900">
            {t("common.back")}
          </button>
        </div>

        {!detailLoading && studentDetail && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Score history */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  {t("admin.studentDetail.scoreHistory")}
                </h3>
                {studentDetail.scoreHistory.length === 0 ? (
                  <p className="text-sm text-gray-400">No scores yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {[...studentDetail.scoreHistory].reverse().map((s) => (
                      <li
                        key={s.month}
                        onClick={() => setSelectedMonth(s)}
                        className={`flex items-center justify-between text-sm cursor-pointer px-2 py-1.5 rounded-lg transition-colors ${
                          selectedMonth?.month === s.month ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-gray-600 font-mono">{s.month}</span>
                        <TrafficLight label={s.label} score={s.score} size="sm" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Score breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                {selectedMonth ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                      {t("admin.studentDetail.breakdownMonth", { month: selectedMonth.month })}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 mb-4">
                        <TrafficLight label={selectedMonth.label} size="lg" />
                        <span className="text-3xl font-bold font-mono text-gray-900">{selectedMonth.score}</span>
                      </div>
                      <ScoreBar label={t("student.dashboard.responsiveness")} value={selectedMonth.responsivenessRaw} />
                      <ScoreBar label={t("student.dashboard.transparency")}  value={selectedMonth.transparencyRaw} />
                      <ScoreBar label={t("student.dashboard.mutualism")}     value={selectedMonth.mutualismRaw} />
                      <ScoreBar label={t("student.dashboard.reflection")}    value={selectedMonth.reflectionRaw} />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Select a month to see breakdown.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Attendance */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  {t("admin.studentDetail.attendance")}
                </h3>
                {studentDetail.attendanceSummary.total === 0 ? (
                  <p className="text-sm text-gray-400">No sessions yet.</p>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold font-mono text-gray-900">
                      {studentDetail.attendanceSummary.pct ?? 0}%
                    </span>
                    <span className="text-sm text-gray-500">
                      {t("admin.studentDetail.sessions", {
                        attended: studentDetail.attendanceSummary.attended,
                        total:    studentDetail.attendanceSummary.total,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* P&L history */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  {t("admin.studentDetail.plHistory")}
                </h3>
                {studentDetail.plHistory.length === 0 ? (
                  <p className="text-sm text-gray-400">No P&L submitted yet.</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {studentDetail.plHistory.map((pl) => (
                      <li key={pl.month} className="flex items-center justify-between">
                        <span className="font-mono text-gray-600">{pl.month}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={(pl.net ?? 0) >= 0 ? "text-green-700" : "text-red-600"}>
                            ¥{(pl.net ?? 0).toLocaleString()}
                          </span>
                          <span className="bg-green-50 border border-green-200 text-green-700 rounded px-1.5 py-0.5">
                            {pl.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Graduation */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {t("admin.studentDetail.graduation.title")}
                </h3>
                <span className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${gradBadgeClass(studentDetail.graduationRecord.status)}`}>
                  {studentDetail.graduationRecord.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">{t("demo.buttonsDisabled")}</p>
            </div>
          </>
        )}

        <div className="pt-2 border-t border-gray-100">
          <Link href="/dashboard/admin" className="text-sm text-gray-400 hover:text-gray-700">
            {t("demo.backToLive")}
          </Link>
        </div>
      </div>
    );
  }

  // ── Overview ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <DemoBanner />

      <h2 className="text-lg font-semibold text-gray-900">{t("admin.dashboard.title")}</h2>

      {/* Top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Needs attention */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.dashboard.needsAttention")}
          </h3>
          {data.needsAttention.length === 0 ? (
            <p className="text-sm text-gray-400">{t("admin.dashboard.noRedStudents")}</p>
          ) : (
            <ul className="space-y-2">
              {data.needsAttention.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <button
                      onClick={() => selectStudent(s.id)}
                      className="font-medium text-gray-900 hover:underline text-left"
                    >
                      {s.email.split("@")[0]}
                    </button>
                    <span className="text-gray-400 ml-1">· {s.cohortName}</span>
                  </div>
                  <TrafficLight label={s.label ?? "RED"} score={s.score ?? 0} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions due */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.dashboard.actionsDue")}
          </h3>
          <ul className="space-y-3 text-sm divide-y divide-gray-50">
            <li className="pt-2 first:pt-0 flex items-center justify-between">
              <span className="text-gray-900 font-medium">{t("admin.dashboard.plReviewsPending")}</span>
              <span className="font-mono font-medium text-gray-900 bg-gray-100 rounded px-2 py-0.5 text-xs">
                {data.pendingPLReviews}
              </span>
            </li>
            {data.nextCheckIn ? (
              <li className="pt-2 text-gray-600">
                Next check-in: {data.nextCheckIn.cohortName} —{" "}
                {new Date(data.nextCheckIn.date).toLocaleDateString()}
              </li>
            ) : (
              <li className="pt-2 text-gray-400">No upcoming check-ins.</li>
            )}
            {data.needsAttention.length > 0 && (
              <li className="pt-2 text-gray-600">
                {data.needsAttention.length} student{data.needsAttention.length !== 1 ? "s" : ""} in RED — review required
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* All students by cohort */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {t("demo.admin.allStudentsByCohort")}
        </h3>
        {data.cohorts.filter((c) => c.students.length > 0).map((cohort) => (
          <div key={cohort.id}>
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">{cohort.name}</p>
            <div className="flex flex-wrap gap-3">
              {cohort.students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectStudent(s.id)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
                >
                  <span className="text-xs text-gray-600 font-medium">
                    {s.email.split("@")[0].slice(0, 10)}
                  </span>
                  {s.label ? (
                    <TrafficLight label={s.label} score={s.score ?? 0} size="sm" />
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t("demo.admin.totalStudents"), value: String(allStudents.length) },
          { label: "Green",  value: String(green),  color: "text-green-700" },
          { label: "Yellow", value: String(yellow), color: "text-yellow-600" },
          { label: "Red",    value: String(red),    color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold font-mono ${stat.color ?? "text-gray-900"}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-100">
        <Link href="/dashboard/admin" className="text-sm text-gray-400 hover:text-gray-700">
          {t("demo.backToLive")}
        </Link>
      </div>
    </div>
  );
}
