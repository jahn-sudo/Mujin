"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n/config";

interface Student {
  id: string;
  userId: string;
  email: string;
  venture: string | null;
  score: number | null;
  label: string | null;
  month: string | null;
  cohortName?: string;
}

interface Cohort {
  id: string;
  name: string;
  students: Student[];
}

interface DashboardData {
  cohorts: Cohort[];
  needsAttention: (Student & { cohortName: string })[];
  pendingPLReviews: number;
  nextCheckIn: { id: string; date: string; cohortName: string } | null;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    apiFetch("/api/admin/dashboard", {}, session)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(t("admin.dashboard.error")));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
      {t("common.loading")}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">{t("admin.dashboard.title")}</h2>

      {/* Top row: Needs Attention + Actions Due */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Needs Attention */}
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
                    <Link
                      href={`/dashboard/admin/students/${s.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {s.email.split("@")[0]}
                    </Link>
                    <span className="text-gray-400 ml-1">· {s.cohortName}</span>
                  </div>
                  <TrafficLight label={s.label} score={s.score} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions Due */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("admin.dashboard.actionsDue")}
          </h3>
          <ul className="space-y-3 text-sm divide-y divide-gray-50">
            <li className="pt-2 first:pt-0 flex items-center justify-between">
              <Link href="/dashboard/admin/pl-reviews" className="text-gray-900 hover:underline font-medium">
                {t("admin.dashboard.plReviewsPending")}
              </Link>
              <span className="font-mono font-medium text-gray-900 bg-gray-100 rounded px-2 py-0.5 text-xs">
                {data.pendingPLReviews}
              </span>
            </li>
            <li className="pt-2">
              <Link href="/dashboard/admin/applications" className="text-gray-900 hover:underline font-medium">
                {t("admin.dashboard.applications")}
              </Link>
            </li>
            {data.nextCheckIn && (
              <li className="pt-2 text-gray-600">
                {t("admin.dashboard.checkIn", {
                  cohort: data.nextCheckIn.cohortName,
                  date: new Date(data.nextCheckIn.date).toLocaleDateString(
                    i18n.language === "ja" ? "ja-JP" : "en-US",
                    { month: "short", day: "numeric" }
                  ),
                })}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* All Students by Cohort */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {t("admin.dashboard.allStudents")}
        </h3>

        {data.cohorts.length === 0 && (
          <p className="text-sm text-gray-400">{t("admin.dashboard.noCohorts")}</p>
        )}

        {data.cohorts.map((cohort) => (
          <div key={cohort.id}>
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">{cohort.name}</p>
            <div className="flex flex-wrap gap-3">
              {cohort.students.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/admin/students/${s.id}`}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
                >
                  <span className="text-xs text-gray-600 font-medium">
                    {s.email.split("@")[0].slice(0, 6)}
                  </span>
                  {s.score !== null && s.label ? (
                    <TrafficLight label={s.label} score={s.score} size="sm" />
                  ) : (
                    <span className="text-xs text-gray-300">{t("common.noData")}</span>
                  )}
                </Link>
              ))}
              {cohort.students.length === 0 && (
                <p className="text-sm text-gray-400">{t("admin.dashboard.noStudents")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
