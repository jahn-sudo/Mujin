"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AlumniDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-6 w-40 bg-gray-100 rounded" />
          <div className="h-4 w-56 bg-gray-100 rounded mt-2" />
          <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
        </div>
        <Link
          href="/dashboard/alumni/directory"
          className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          {t("alumni.dashboard.communityDirectory")}
        </Link>
      </div>

      {/* Venture description */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          {t("alumni.dashboard.venture")}
        </h3>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
          <div className="h-3 w-4/6 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Trust score chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          {t("alumni.dashboard.trustScoreJourney")}
        </h3>
        <div className="flex items-end gap-1.5 h-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-gray-100 rounded-sm" style={{ height: 40 }} />
              <div className="h-2 w-4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-300 mt-3">{t("alumni.dashboard.trustScoreNote")}</p>
      </div>

      {/* Bank introduction journey */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          {t("alumni.dashboard.bankJourney")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            t("alumni.dashboard.bankIntroduced"),
            t("alumni.dashboard.firstMeeting"),
            t("alumni.dashboard.accountOpened"),
            t("alumni.dashboard.loanSecured"),
          ].map((label) => (
            <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 shrink-0 text-gray-300" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
              <p className="text-xs text-gray-300 ml-6">—</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
