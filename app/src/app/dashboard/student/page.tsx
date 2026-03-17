"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { useTranslation } from "react-i18next";

interface DashboardData {
  user: { id: string; email: string };
  venture: { name: string; description: string } | null;
  cohort: { id: string; name: string } | null;
  trustScore: {
    score: number;
    label: string;
    month: string;
    responsivenessRaw: number;
    transparencyRaw: number;
    mutualismRaw: number;
    reflectionRaw: number;
  } | null;
  graduationChecklist: {
    ventureExists: boolean;
    cashFlowStreak: number;
    greenStreak: number;
    exitInterviewStatus: string;
  };
  upcoming: {
    plDue: string | null;
    nextTownHall: { id: string; date: string } | null;
    nextCheckIn: { id: string; date: string } | null;
  };
  group: Array<{ initial: string; score: number | null; label: string | null; isMe: boolean }>;
  openReflectionFlags: Array<{ townHallId: string; windowExpiresAt: string }>;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    apiFetch("/api/student/me", {}, session)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(t("student.dashboard.error")));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  const emailInitial = data.user.email[0]?.toUpperCase() ?? "?";
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("student.dashboard.title", {
            initial: emailInitial,
            venture: data.venture?.name ?? t("student.dashboard.noVenture"),
          })}
        </h2>
        {data.cohort && (
          <p className="text-sm text-gray-500 mt-0.5">{data.cohort.name}</p>
        )}
      </div>

      {/* Reflection flag alert */}
      {data.openReflectionFlags.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
          <p className="text-sm font-medium text-red-700">🔴 {t("student.dashboard.reflectionAlert")}</p>
          <p className="text-sm text-red-600 mt-1">
            {t("student.dashboard.reflectionAlertBody")}{" "}
            <Link href="/dashboard/student/inbox" className="underline font-medium">
              {t("student.dashboard.reflectionAlertLink")}
            </Link>
          </p>
        </div>
      )}

      {/* Trust Score Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {t("student.dashboard.trustScore")}
          </h3>
          {data.trustScore && (
            <span className="text-xs text-gray-400">{data.trustScore.month}</span>
          )}
        </div>

        {data.trustScore ? (
          <>
            <div className="flex items-center gap-3">
              <TrafficLight label={data.trustScore.label} size="lg" />
              <span className="text-4xl font-bold font-mono text-gray-900">
                {Math.round(data.trustScore.score)}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <ScoreBar label={t("student.dashboard.responsiveness")} value={data.trustScore.responsivenessRaw} />
              <ScoreBar label={t("student.dashboard.transparency")} value={data.trustScore.transparencyRaw} />
              <ScoreBar label={t("student.dashboard.mutualism")} value={data.trustScore.mutualismRaw} />
              <ScoreBar label={t("student.dashboard.reflection")} value={data.trustScore.reflectionRaw} />
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">{t("student.dashboard.noScoreYet")}</p>
        )}
      </div>

      {/* Graduation Progress + Upcoming side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Graduation Checklist */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("student.dashboard.graduationProgress")}
          </h3>
          <ul className="space-y-2 text-sm">
            <CheckItem
              checked={data.graduationChecklist.ventureExists}
              label={t("student.dashboard.gate1")}
            />
            <CheckItem
              checked={data.graduationChecklist.cashFlowStreak >= 3}
              label={t("student.dashboard.gate2", { streak: data.graduationChecklist.cashFlowStreak })}
            />
            <CheckItem
              checked={data.graduationChecklist.greenStreak >= 6}
              label={t("student.dashboard.gate3", { streak: data.graduationChecklist.greenStreak })}
            />
            <CheckItem
              checked={data.graduationChecklist.exitInterviewStatus === "GRADUATED"}
              label={t("student.dashboard.gate4")}
            />
          </ul>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("student.dashboard.upcoming")}
          </h3>
          <ul className="space-y-3 text-sm">
            {data.upcoming.plDue ? (
              <li className="flex items-center gap-2">
                <span>📋</span>
                <div>
                  <Link
                    href={`/dashboard/student/pl/${currentMonth}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {t("student.dashboard.plDue")}
                  </Link>
                  <span className="text-gray-500 ml-1">
                    {new Date(data.upcoming.plDue + "T00:00:00").toLocaleDateString(
                      i18n.language === "ja" ? "ja-JP" : "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
              </li>
            ) : (
              <li className="text-gray-400">{t("student.dashboard.noPLDue")}</li>
            )}
            {data.upcoming.nextTownHall ? (
              <li className="flex items-center gap-2">
                <span>📅</span>
                <div>
                  <Link
                    href={`/dashboard/student/townhall/${data.upcoming.nextTownHall.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {t("student.dashboard.townHall")}
                  </Link>
                  <span className="text-gray-500 ml-1">
                    {new Date(data.upcoming.nextTownHall.date).toLocaleDateString(
                      i18n.language === "ja" ? "ja-JP" : "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
              </li>
            ) : (
              <li className="text-gray-400">{t("student.dashboard.noTownHall")}</li>
            )}
            {data.upcoming.nextCheckIn && (
              <li className="flex items-center gap-2">
                <span>🤝</span>
                <div>
                  <Link
                    href={`/dashboard/student/checkin/${data.upcoming.nextCheckIn.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Submit check-in notes
                  </Link>
                  <span className="text-gray-500 ml-1">
                    {new Date(data.upcoming.nextCheckIn.date).toLocaleDateString(
                      i18n.language === "ja" ? "ja-JP" : "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Group View */}
      {data.group.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("student.dashboard.myGroup")}
          </h3>
          <div className="flex flex-wrap gap-4">
            {data.group.map((member) => (
              <div
                key={member.initial}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border ${
                  member.isMe ? "border-gray-900 bg-gray-50" : "border-gray-100"
                }`}
              >
                <span className="text-xs font-medium text-gray-700">
                  [{member.initial}]
                </span>
                {member.score !== null && member.label ? (
                  <TrafficLight label={member.label} score={member.score} size="sm" />
                ) : (
                  <span className="text-xs text-gray-400">{t("common.noData")}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Import i18n instance for locale-aware date formatting
import i18n from "@/lib/i18n/config";

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2 text-gray-700">
      <span className={`mt-0.5 shrink-0 ${checked ? "text-green-600" : "text-gray-300"}`}>
        {checked ? "☑" : "☐"}
      </span>
      <span className={checked ? "text-gray-900" : "text-gray-500"}>{label}</span>
    </li>
  );
}
