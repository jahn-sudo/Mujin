"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";

interface GroupData {
  cohortId: string;
  cohortName: string;
  totalStudents: number;
  submittedCount: number;
  attendedCount: number;
  majorityAttended: boolean;
  sentiment: null;
  members: Array<{ initial: string; submitted: boolean; attended: boolean | null }>;
}

export default function TownHallMonitoringPage() {
  const { id: townHallId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    apiFetch(`/api/admin/townhalls/${townHallId}/monitoring`, {}, session)
      .then((r) => r.json())
      .then(setGroups)
      .catch(() => setError(t("admin.townhall.error")));
  }, [townHallId]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!groups) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  const totalSubmissions = groups.reduce((sum, g) => sum + g.submittedCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("admin.townhall.title")}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalSubmissions === 1
              ? t("admin.townhall.submissions", { count: totalSubmissions })
              : t("admin.townhall.submissionsPlural", { count: totalSubmissions })}
          </p>
        </div>
        <Link href="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-900">
          {t("common.back")}
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {t("admin.townhall.attendanceSummary")}
        </h3>

        {groups.map((group) => {
          const pct = group.totalStudents > 0
            ? Math.round((group.attendedCount / group.totalStudents) * 100)
            : 0;

          return (
            <div key={group.cohortId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{group.cohortName}</span>
                <span className={`font-medium ${group.majorityAttended ? "text-green-700" : "text-red-600"}`}>
                  {group.attendedCount}/{group.totalStudents}{" "}
                  {group.majorityAttended ? "✅" : "❌"}
                </span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    group.majorityAttended ? "bg-green-500" : "bg-red-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex gap-2">
                {group.members.map((member) => (
                  <div
                    key={member.initial}
                    className="flex flex-col items-center gap-0.5"
                    title={`${member.initial}: ${
                      !member.submitted ? "not submitted" : member.attended ? "present" : "absent"
                    }`}
                  >
                    <span className="text-xs text-gray-400">[{member.initial}]</span>
                    <span className="text-xs">
                      {!member.submitted ? "⚪" : member.attended ? "🟢" : "🔴"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          {t("admin.townhall.groupSentiment")}
        </h3>
        <p className="text-sm text-gray-400">{t("admin.townhall.sentimentNote")}</p>
      </div>
    </div>
  );
}
