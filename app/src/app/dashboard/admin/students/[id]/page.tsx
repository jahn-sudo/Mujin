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

interface CheckInMetrics {
  totalSessions: number;
  notesSubmitted: number;
  avgMentorRating: number | null;
}

interface BankTracking {
  id: string;
  bankName: string | null;
  bankContactName: string | null;
  firstMeetingDate: string | null;
  firstMeetingOutcome: "COMPLETED" | "NO_SHOW" | "DECLINED" | null;
  accountOpenedAt: string | null;
  loanSecuredAt: string | null;
  loanAmountYen: number | null;
  businessManagerVisaAt: string | null;
  staffNotes: string | null;
}

interface GrantData {
  tranche1: { amountYen: number; released: boolean; releasedAt: string | null; note: string };
  tranche2: { amountYen: number; released: boolean; releasedAt: string | null; releasedBy: string | null; note: string | null };
  eligibility: {
    pledgeSigned: boolean;
    m2: string | null;
    m3: string | null;
    m2Label: string | null;
    m3Label: string | null;
    scoresEligible: boolean;
  };
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
  checkInMetrics: CheckInMetrics;
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
  const [grant, setGrant] = useState<GrantData | null>(null);
  const [incorporatedConfirmed, setIncorporatedConfirmed] = useState(false);
  const [tranche2Note, setTranche2Note] = useState("");
  const [releasingTranche2, setReleasingTranche2] = useState(false);
  const [tranche2Error, setTranche2Error] = useState<string | null>(null);
  const [bankTracking, setBankTracking] = useState<BankTracking | null>(null);
  const [bankForm, setBankForm] = useState({
    bankName: "",
    bankContactName: "",
    firstMeetingDate: "",
    firstMeetingOutcome: "" as "" | "COMPLETED" | "NO_SHOW" | "DECLINED",
    accountOpenedAt: "",
    loanSecuredAt: "",
    loanAmountYen: "",
    businessManagerVisaAt: "",
    staffNotes: "",
  });
  const [bankSaving, setBankSaving] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [bankSaved, setBankSaved] = useState(false);

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

    apiFetch(`/api/admin/students/${studentId}/grant`, {}, session!)
      .then((r) => r.json())
      .then(setGrant)
      .catch(() => null);

    apiFetch(`/api/admin/students/${studentId}/graduation/bank-tracking`, {}, session!)
      .then((r) => r.json())
      .then((d) => {
        if (d.tracking) {
          setBankTracking(d.tracking);
          setBankForm({
            bankName: d.tracking.bankName ?? "",
            bankContactName: d.tracking.bankContactName ?? "",
            firstMeetingDate: d.tracking.firstMeetingDate
              ? d.tracking.firstMeetingDate.slice(0, 10)
              : "",
            firstMeetingOutcome: d.tracking.firstMeetingOutcome ?? "",
            accountOpenedAt: d.tracking.accountOpenedAt
              ? d.tracking.accountOpenedAt.slice(0, 10)
              : "",
            loanSecuredAt: d.tracking.loanSecuredAt
              ? d.tracking.loanSecuredAt.slice(0, 10)
              : "",
            loanAmountYen: d.tracking.loanAmountYen?.toString() ?? "",
            businessManagerVisaAt: d.tracking.businessManagerVisaAt
              ? d.tracking.businessManagerVisaAt.slice(0, 10)
              : "",
            staffNotes: d.tracking.staffNotes ?? "",
          });
        }
      })
      .catch(() => null);
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

  async function handleReleaseTranche2() {
    const session = loadSession();
    if (!session) return;
    setReleasingTranche2(true);
    setTranche2Error(null);
    try {
      const res = await apiFetch(
        `/api/admin/students/${studentId}/grant/release-tranche2`,
        {
          method: "POST",
          body: JSON.stringify({ companyIncorporatedConfirmed: incorporatedConfirmed, note: tranche2Note }),
        },
        session
      );
      if (!res.ok) {
        const d = await res.json();
        setTranche2Error(d.error ?? "Failed to release tranche 2.");
      } else {
        reload(session);
      }
    } catch {
      setTranche2Error("Network error.");
    } finally {
      setReleasingTranche2(false);
    }
  }

  async function handleSaveBankTracking() {
    const session = loadSession();
    if (!session) return;
    setBankSaving(true);
    setBankError(null);
    setBankSaved(false);
    try {
      const res = await apiFetch(
        `/api/admin/students/${studentId}/graduation/bank-tracking`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...bankForm,
            firstMeetingOutcome: bankForm.firstMeetingOutcome || null,
            loanAmountYen: bankForm.loanAmountYen ? parseInt(bankForm.loanAmountYen) : null,
            firstMeetingDate: bankForm.firstMeetingDate || null,
            accountOpenedAt: bankForm.accountOpenedAt || null,
            loanSecuredAt: bankForm.loanSecuredAt || null,
            businessManagerVisaAt: bankForm.businessManagerVisaAt || null,
            bankName: bankForm.bankName || null,
            bankContactName: bankForm.bankContactName || null,
            staffNotes: bankForm.staffNotes || null,
          }),
        },
        session
      );
      if (!res.ok) {
        const d = await res.json();
        setBankError(d.error ?? "Failed to save");
      } else {
        const d = await res.json();
        setBankTracking(d.tracking);
        setBankSaved(true);
        setTimeout(() => setBankSaved(false), 3000);
      }
    } catch {
      setBankError("Network error");
    } finally {
      setBankSaving(false);
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

      {/* Check-In Metrics (staff sees metrics only, not note content) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          {t("admin.studentDetail.checkInMetrics") ?? "Check-In Notes"}
        </h3>
        <div className="flex items-center gap-8 text-sm">
          <div>
            <p className="text-2xl font-bold font-mono text-gray-900">
              {data.checkInMetrics.notesSubmitted}/{data.checkInMetrics.totalSessions}
            </p>
            <p className="text-xs text-gray-500 mt-1">Notes submitted</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-gray-900">
              {data.checkInMetrics.avgMentorRating !== null
                ? `${data.checkInMetrics.avgMentorRating}/5`
                : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg mentor rating</p>
          </div>
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

      {/* Grant Disbursement */}
      {grant && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">Grant Disbursement</h3>

          <div className="space-y-4">
            {/* Tranche 1 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Tranche 1 — ¥300,000</p>
                <p className="text-xs text-gray-400 mt-0.5">Released on pledge signing</p>
              </div>
              {grant.tranche1.released ? (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Released
                  </span>
                  {grant.tranche1.releasedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(grant.tranche1.releasedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                  Pending pledge
                </span>
              )}
            </div>

            {/* Tranche 2 */}
            <div className="py-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tranche 2 — ¥200,000</p>
                  <p className="text-xs text-gray-400 mt-0.5">Released at Month 3 — company incorporated + no RED at M2 or M3</p>
                </div>
                {grant.tranche2.released ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Released
                    </span>
                    {grant.tranche2.releasedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(grant.tranche2.releasedAt).toLocaleDateString()}
                        {grant.tranche2.releasedBy && ` by ${grant.tranche2.releasedBy}`}
                      </p>
                    )}
                    {grant.tranche2.note && (
                      <p className="text-xs text-gray-500 mt-1 max-w-xs text-right">{grant.tranche2.note}</p>
                    )}
                  </div>
                ) : (
                  <span className={`text-xs rounded-full px-2.5 py-1 border ${
                    grant.eligibility.scoresEligible && grant.eligibility.pledgeSigned
                      ? "text-amber-700 bg-amber-50 border-amber-100"
                      : "text-gray-400 bg-gray-50 border-gray-100"
                  }`}>
                    {grant.eligibility.scoresEligible && grant.eligibility.pledgeSigned ? "Eligible" : "Pending"}
                  </span>
                )}
              </div>

              {/* Eligibility breakdown */}
              {!grant.tranche2.released && (
                <div className="bg-zinc-50 rounded-lg p-4 space-y-2 text-xs mb-4">
                  {[
                    { label: "Pledge signed", met: grant.eligibility.pledgeSigned },
                    {
                      label: grant.eligibility.m2 ? `Trust Score ${grant.eligibility.m2} (M2)` : "M2 score",
                      met: grant.eligibility.m2Label !== null && grant.eligibility.m2Label !== "RED",
                      detail: grant.eligibility.m2Label ?? "Not yet recorded",
                    },
                    {
                      label: grant.eligibility.m3 ? `Trust Score ${grant.eligibility.m3} (M3)` : "M3 score",
                      met: grant.eligibility.m3Label !== null && grant.eligibility.m3Label !== "RED",
                      detail: grant.eligibility.m3Label ?? "Not yet recorded",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className={`w-3.5 h-3.5 shrink-0 ${item.met ? "text-green-500" : "text-gray-300"}`} viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1"/>
                          {item.met && <path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
                        </svg>
                        <span className="text-gray-600">{item.label}</span>
                      </div>
                      {"detail" in item && item.detail && (
                        <span className={`font-medium ${
                          item.detail === "RED" ? "text-red-600" :
                          item.detail === "GREEN" ? "text-green-600" :
                          item.detail === "YELLOW" ? "text-amber-600" : "text-gray-400"
                        }`}>{item.detail}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Release form — only shown when scores are eligible and tranche 1 released */}
              {!grant.tranche2.released && grant.eligibility.scoresEligible && grant.eligibility.pledgeSigned && (
                <div className="border border-amber-100 bg-amber-50 rounded-lg p-4 space-y-3">
                  <p className="text-xs font-medium text-amber-800">Release Tranche 2</p>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={incorporatedConfirmed}
                      onChange={(e) => setIncorporatedConfirmed(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300"
                    />
                    <span className="text-xs text-amber-900 leading-relaxed">
                      I confirm that this student&apos;s company is incorporated in Japan.
                    </span>
                  </label>

                  <input
                    type="text"
                    value={tranche2Note}
                    onChange={(e) => setTranche2Note(e.target.value)}
                    placeholder="Optional note (e.g. company reg no.)"
                    className="w-full border border-amber-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />

                  {tranche2Error && <p className="text-xs text-red-600">{tranche2Error}</p>}

                  <button
                    onClick={handleReleaseTranche2}
                    disabled={!incorporatedConfirmed || releasingTranche2}
                    className="bg-gray-900 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {releasingTranche2 ? "Releasing…" : "Release ¥200,000"}
                  </button>
                </div>
              )}
            </div>
          </div>
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

      {/* Bank Introduction Tracking — only for GRADUATED students */}
      {gradStatus === "GRADUATED" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-5">
            Bank Introduction Tracking
          </h3>

          {/* Milestone summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "First Meeting",
                met: bankTracking?.firstMeetingOutcome === "COMPLETED",
                date: bankTracking?.firstMeetingDate,
                detail: bankTracking?.firstMeetingOutcome ?? null,
              },
              {
                label: "Account Opened",
                met: !!bankTracking?.accountOpenedAt,
                date: bankTracking?.accountOpenedAt,
                detail: null,
              },
              {
                label: "Loan Secured",
                met: !!bankTracking?.loanSecuredAt,
                date: bankTracking?.loanSecuredAt,
                detail: bankTracking?.loanAmountYen
                  ? `¥${bankTracking.loanAmountYen.toLocaleString()}`
                  : null,
              },
              {
                label: "BM Visa",
                met: !!bankTracking?.businessManagerVisaAt,
                date: bankTracking?.businessManagerVisaAt,
                detail: null,
              },
            ].map((m) => (
              <div
                key={m.label}
                className={`rounded-lg border p-3 ${
                  m.met
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <svg
                    className={`w-3.5 h-3.5 shrink-0 ${m.met ? "text-green-600" : "text-gray-300"}`}
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
                    {m.met && (
                      <path
                        d="M4 7L6 9L10 5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                  <span className="text-xs font-medium text-gray-700">{m.label}</span>
                </div>
                {m.date && (
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(m.date).toLocaleDateString()}
                  </p>
                )}
                {m.detail && (
                  <p className={`text-xs mt-0.5 ${m.met ? "text-green-700 font-medium" : "text-gray-400"}`}>
                    {m.detail}
                  </p>
                )}
                {!m.met && !m.date && (
                  <p className="text-xs text-gray-300">—</p>
                )}
              </div>
            ))}
          </div>

          {/* Edit form */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm((f) => ({ ...f, bankName: e.target.value }))}
                  placeholder="e.g. Kiraboshi Bank"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bank Contact Name</label>
                <input
                  type="text"
                  value={bankForm.bankContactName}
                  onChange={(e) => setBankForm((f) => ({ ...f, bankContactName: e.target.value }))}
                  placeholder="e.g. Tanaka-san"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Meeting Date</label>
                <input
                  type="date"
                  value={bankForm.firstMeetingDate}
                  onChange={(e) => setBankForm((f) => ({ ...f, firstMeetingDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Meeting Outcome</label>
                <select
                  value={bankForm.firstMeetingOutcome}
                  onChange={(e) =>
                    setBankForm((f) => ({
                      ...f,
                      firstMeetingOutcome: e.target.value as "" | "COMPLETED" | "NO_SHOW" | "DECLINED",
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                >
                  <option value="">— Select —</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="NO_SHOW">No-show</option>
                  <option value="DECLINED">Declined</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Account Opened</label>
                <input
                  type="date"
                  value={bankForm.accountOpenedAt}
                  onChange={(e) => setBankForm((f) => ({ ...f, accountOpenedAt: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Loan Secured</label>
                <input
                  type="date"
                  value={bankForm.loanSecuredAt}
                  onChange={(e) => setBankForm((f) => ({ ...f, loanSecuredAt: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Loan Amount (¥)</label>
                <input
                  type="number"
                  value={bankForm.loanAmountYen}
                  onChange={(e) => setBankForm((f) => ({ ...f, loanAmountYen: e.target.value }))}
                  placeholder="e.g. 3000000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Business Manager Visa Obtained</label>
              <input
                type="date"
                value={bankForm.businessManagerVisaAt}
                onChange={(e) => setBankForm((f) => ({ ...f, businessManagerVisaAt: e.target.value }))}
                className="w-full sm:w-1/3 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Staff Notes</label>
              <textarea
                value={bankForm.staffNotes}
                onChange={(e) => setBankForm((f) => ({ ...f, staffNotes: e.target.value }))}
                rows={3}
                placeholder="Internal notes on bank relationship progress"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              />
            </div>

            {bankError && <p className="text-xs text-red-600">{bankError}</p>}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveBankTracking}
                disabled={bankSaving}
                className="bg-gray-900 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {bankSaving ? "Saving…" : "Save"}
              </button>
              {bankSaved && (
                <span className="text-xs text-green-600">Saved</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
