"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const ALUMNI = {
  venture: "YenWise",
  description:
    "A mobile-first personal finance platform helping foreign residents in Japan manage multi-currency accounts, tax filings, and remittances — removing the language and bureaucracy barrier that locks out millions of expats.",
  category: "FINTECH",
  cohort: "Cohort A — Spring 2027",
  graduatedAt: "2027-01-22",
  coFounders: [],
};

const TRUST_SCORES = [
  { month: "2026-06", score: 62, label: "YELLOW" },
  { month: "2026-07", score: 74, label: "YELLOW" },
  { month: "2026-08", score: 81, label: "GREEN" },
  { month: "2026-09", score: 88, label: "GREEN" },
  { month: "2026-10", score: 85, label: "GREEN" },
  { month: "2026-11", score: 91, label: "GREEN" },
  { month: "2026-12", score: 94, label: "GREEN" },
  { month: "2027-01", score: 96, label: "GREEN" },
];

const BANK = {
  bankName: "Kiraboshi Bank",
  bankIntroDate: "2027-01-22",
  firstMeetingDate: "2027-02-05",
  firstMeetingOutcome: "COMPLETED",
  accountOpenedAt: "2027-02-20",
  loanSecuredAt: "2027-04-10",
  loanAmountYen: 3000000,
  businessManagerVisaAt: null,
};

const DIRECTORY = [
  {
    id: "a1",
    venture: "YenWise",
    category: "Fintech",
    cohort: "Cohort A — Spring 2027",
    description: "Multi-currency finance for foreign residents in Japan.",
    graduatedAt: "2027-01-22",
    milestones: { intro: true, meeting: true, account: true, loan: true, visa: false },
  },
  {
    id: "a2",
    venture: "MedLink AI",
    category: "HealthTech",
    cohort: "Cohort A — Spring 2027",
    description: "AI-assisted patient triage for under-resourced rural clinics.",
    graduatedAt: "2027-02-14",
    milestones: { intro: true, meeting: true, account: true, loan: false, visa: false },
  },
  {
    id: "a3",
    venture: "EduBridge",
    category: "EdTech",
    cohort: "Cohort A — Spring 2027",
    description: "Connecting international students with Japanese tutors via structured lesson plans.",
    graduatedAt: "2027-03-01",
    milestones: { intro: true, meeting: false, account: false, loan: false, visa: false },
  },
];

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
    <div className={`rounded-lg border p-4 ${met ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <svg className={`w-4 h-4 shrink-0 ${met ? "text-green-600" : "text-gray-300"}`} viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
          {met && (
            <path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      {date && <p className="text-xs text-gray-500 font-mono ml-6">{new Date(date).toLocaleDateString()}</p>}
      {detail && <p className={`text-xs ml-6 mt-0.5 ${met ? "text-green-700 font-medium" : "text-gray-400"}`}>{detail}</p>}
      {!met && !date && <p className="text-xs text-gray-300 ml-6">—</p>}
    </div>
  );
}

function MilestoneDot({ met }: { met: boolean }) {
  return (
    <div className={`w-2.5 h-2.5 rounded-full border ${met ? "bg-green-500 border-green-600" : "bg-gray-100 border-gray-200"}`} />
  );
}

type View = "dashboard" | "directory";

export default function DemoAlumniDashboard() {
  const { t } = useTranslation();
  const [view, setView] = React.useState<View>("dashboard");

  return (
    <div className="space-y-6">
      {/* Demo banner */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-gray-500 font-semibold text-xs uppercase tracking-wide">{t("nav.demo")}</span>
        <p className="text-sm text-gray-500">{t("demo.banner")}</p>
      </div>

      {view === "dashboard" && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{ALUMNI.venture}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {ALUMNI.cohort}
                <span className="ml-2 text-xs bg-gray-100 rounded px-1.5 py-0.5">{ALUMNI.category}</span>
              </p>
              <p className="text-xs text-green-700 mt-1 font-medium">
                Graduated {new Date(ALUMNI.graduatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setView("directory")}
              className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              {t("alumni.dashboard.communityDirectory")}
            </button>
          </div>

          {/* Venture */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">{t("alumni.dashboard.venture")}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{ALUMNI.description}</p>
          </div>

          {/* Trust score chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("alumni.dashboard.trustScoreJourney")}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-mono text-gray-500">96 · GREEN</span>
              </div>
            </div>
            <div className="flex items-end gap-1.5">
              {TRUST_SCORES.map((s) => {
                const height = Math.max(16, Math.round((s.score / 100) * 80));
                const color = s.label === "GREEN" ? "bg-green-500" : "bg-amber-400";
                return (
                  <div key={s.month} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-full rounded-sm ${color}`} style={{ height }} title={`${s.month}: ${s.score}`} />
                    <span className="text-[10px] text-gray-400 font-mono">{s.month.slice(5)}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">{t("alumni.dashboard.trustScoreNote")}</p>
          </div>

          {/* Bank journey */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">{t("alumni.dashboard.bankJourney")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Milestone label={t("alumni.dashboard.bankIntroduced")} met={true} date={BANK.bankIntroDate} detail={BANK.bankName} />
              <Milestone label={t("alumni.dashboard.firstMeeting")} met={true} date={BANK.firstMeetingDate} detail="COMPLETED" />
              <Milestone label={t("alumni.dashboard.accountOpened")} met={true} date={BANK.accountOpenedAt} />
              <Milestone label={t("alumni.dashboard.loanSecured")} met={true} date={BANK.loanSecuredAt} detail={`¥${BANK.loanAmountYen.toLocaleString()}`} />
            </div>
          </div>
        </>
      )}

      {view === "directory" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{t("alumni.directory.title")}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {DIRECTORY.length !== 1
                  ? t("alumni.directory.graduates_other", { count: DIRECTORY.length })
                  : t("alumni.directory.graduates_one", { count: DIRECTORY.length })}
              </p>
            </div>
            <button onClick={() => setView("dashboard")} className="text-sm text-gray-500 hover:text-gray-900">
              {t("alumni.directory.back")}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <MilestoneDot met={true} />
              <span>{t("alumni.directory.milestoneMet")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MilestoneDot met={false} />
              <span>{t("alumni.directory.milestoneInProgress")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIRECTORY.map((a) => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{a.venture}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.cohort}</p>
                  </div>
                  <span className="text-[11px] bg-gray-100 text-gray-500 rounded px-2 py-0.5 shrink-0">{a.category}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{a.description}</p>
                <p className="text-xs text-green-700 mb-3">
                  {t("alumni.directory.graduated", { date: new Date(a.graduatedAt).toLocaleDateString() })}
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">{t("alumni.directory.journey")}</span>
                  <div className="flex items-center gap-2">
                    {[
                      { key: "intro", label: t("alumni.directory.milestoneIntro") },
                      { key: "meeting", label: t("alumni.directory.milestoneMeeting") },
                      { key: "account", label: t("alumni.directory.milestoneAccount") },
                      { key: "loan", label: t("alumni.directory.milestoneLoan") },
                      { key: "visa", label: t("alumni.directory.milestoneVisa") },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-1" title={label}>
                        <MilestoneDot met={a.milestones[key as keyof typeof a.milestones]} />
                        <span className="text-[10px] text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="pt-2 border-t border-gray-100">
        <Link href="/dashboard/alumni" className="text-sm text-gray-400 hover:text-gray-700">
          {t("demo.backToLive")}
        </Link>
      </div>
    </div>
  );
}
