"use client";

import { useEffect, useState } from "react";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

// ── Types matching /api/student/me ────────────────────────────────────────────

interface TrustScore {
  score: number; label: string; month: string;
  responsivenessRaw: number; transparencyRaw: number; mutualismRaw: number; reflectionRaw: number;
}
interface GraduationChecklist {
  ventureExists: boolean; cashFlowStreak: number; greenStreak: number; exitInterviewStatus: string;
}
interface GroupMember {
  initial: string; score: number | null; label: string | null; isMe: boolean;
}
interface StudentData {
  user: { id: string; email: string };
  venture: { name: string; description: string | null } | null;
  cohort: { id: string; name: string } | null;
  trustScore: TrustScore | null;
  graduationChecklist: GraduationChecklist;
  upcoming: {
    plDue: string | null;
    nextTownHall: { id: string; date: string } | null;
    nextCheckIn: { id: string; date: string } | null;
  };
  group: GroupMember[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DemoBanner() {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Demo</span>
      <p className="text-sm text-gray-500">{t("demo.banner")}</p>
    </div>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2.5 text-gray-700">
      <span className="mt-0.5 shrink-0">
        {checked ? (
          <svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
            <path d="M4.5 8.5L6.5 10.5L11.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-300" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
      </span>
      <span className={checked ? "text-gray-900" : "text-gray-500"}>{label}</span>
    </li>
  );
}

function TownHallForm({ group, onBack }: { group: GroupMember[]; onBack: () => void }) {
  const { t } = useTranslation();
  const myIndex = group.findIndex((m) => m.isMe);
  const peers   = group.filter((m) => !m.isMe);

  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const wordCount = reflectionText.trim().split(/\s+/).filter(Boolean).length;

  function toggleAttendee(id: string) {
    setAttendeeIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <DemoBanner />
        <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center space-y-2">
          <p className="text-green-700 font-medium">{t("demo.student.submissionReceived")}</p>
          <p className="text-sm text-green-600">{t("demo.student.aiNote")}</p>
        </div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">
          {t("demo.student.backToDashboard")}
        </button>
        <p className="text-xs text-gray-400">{t("demo.notSaved")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DemoBanner />
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("student.townhall.title")}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{t("student.townhall.anonymous")} — {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">{t("common.back")}</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (wordCount >= 50) setSubmitted(true); }} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">{t("student.townhall.part1Title")}</h3>
          <p className="text-xs text-gray-500">{t("student.townhall.part1Help")}</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-default">
              <span className="w-4 h-4 rounded border-2 border-gray-900 bg-gray-900 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-medium">{t("student.townhall.youLabel")} — {myIndex >= 0 ? "ABCDE"[myIndex] : "You"}</span>
            </label>
            {peers.map((member, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendeeIds.includes(member.initial)}
                  onChange={() => toggleAttendee(member.initial)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span>[{member.initial}]</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-400">{attendeeIds.length + 1} of {group.length} members marked present.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">{t("student.townhall.part2Title")}</h3>
          <p className="text-xs text-gray-500">{t("student.townhall.part2Help")}</p>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder={t("student.townhall.placeholder")}
          />
          <div className="flex items-center justify-between text-xs">
            <span className={wordCount >= 50 ? "text-green-600" : "text-gray-400"}>
              {t("student.townhall.wordCount", { count: wordCount })}
            </span>
            {wordCount >= 50 && <span className="text-green-600">{t("student.townhall.wordCountMet")}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={wordCount < 50}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("common.submit")}
          </button>
          <p className="text-xs text-gray-400 text-center">{t("demo.notSaved")}</p>
        </div>
      </form>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

type View = "dashboard" | "townhall";

export default function DemoStudentDashboard() {
  const { t } = useTranslation();
  const session = loadSession();

  const [data, setData]       = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState<View>("dashboard");

  useEffect(() => {
    if (!session) return;
    apiFetch("/api/student/demo/snapshot", {}, session)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (view === "townhall" && data) {
    return <TownHallForm group={data.group} onBack={() => setView("dashboard")} />;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <DemoBanner />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
          Loading…
        </div>
      </div>
    );
  }

  // Empty state for accounts with no data
  if (!data || !data.trustScore) {
    return (
      <div className="space-y-6">
        <DemoBanner />
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center space-y-2">
          <p className="text-sm font-medium text-gray-900">Demo data unavailable</p>
          <p className="text-xs text-gray-400">Demo seed data has not been loaded yet.</p>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Link href="/dashboard/student" className="text-sm text-gray-400 hover:text-gray-700">{t("demo.backToLive")}</Link>
        </div>
      </div>
    );
  }

  const { trustScore, graduationChecklist, upcoming, group, venture, cohort } = data;

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {data.user.email.split("@")[0]}{venture ? ` — ${venture.name}` : ""}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{cohort?.name ?? "—"}</p>
        </div>
        <button
          onClick={() => setView("townhall")}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t("demo.student.townhallBtn")}
        </button>
      </div>

      {/* Trust score */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("student.dashboard.trustScore")}</h3>
          <span className="text-xs text-gray-400">{trustScore.month}</span>
        </div>
        <div className="flex items-center gap-3">
          <TrafficLight label={trustScore.label} size="lg" />
          <span className="text-4xl font-bold font-mono text-gray-900">{trustScore.score}</span>
        </div>
        <div className="space-y-2 pt-2">
          <ScoreBar label={t("student.dashboard.responsiveness")} value={trustScore.responsivenessRaw} />
          <ScoreBar label={t("student.dashboard.transparency")}  value={trustScore.transparencyRaw} />
          <ScoreBar label={t("student.dashboard.mutualism")}     value={trustScore.mutualismRaw} />
          <ScoreBar label={t("student.dashboard.reflection")}    value={trustScore.reflectionRaw} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Graduation checklist */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("student.dashboard.graduationProgress")}
          </h3>
          <ul className="space-y-2 text-sm">
            <CheckItem checked={graduationChecklist.ventureExists}          label={t("student.dashboard.gate1")} />
            <CheckItem checked={graduationChecklist.cashFlowStreak >= 3}    label={t("student.dashboard.gate2", { streak: graduationChecklist.cashFlowStreak })} />
            <CheckItem checked={graduationChecklist.greenStreak >= 6}       label={t("student.dashboard.gate3", { streak: graduationChecklist.greenStreak })} />
            <CheckItem checked={graduationChecklist.exitInterviewStatus === "INTERVIEW_PASSED" || graduationChecklist.exitInterviewStatus === "GRADUATED"}
              label={t("student.dashboard.gate4")} />
          </ul>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            {t("student.dashboard.upcoming")}
          </h3>
          <ul className="space-y-3 text-sm divide-y divide-gray-50">
            {upcoming.plDue && (
              <li className="pt-2 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{t("demo.student.plDue")}</span>
                  <span className="text-xs text-gray-400">{upcoming.plDue}</span>
                </div>
              </li>
            )}
            {upcoming.nextTownHall && (
              <li className="pt-2 first:pt-0">
                <div className="flex items-center justify-between">
                  <button onClick={() => setView("townhall")} className="font-medium text-gray-900 hover:underline text-left">
                    {t("student.dashboard.townHall")}
                  </button>
                  <span className="text-xs text-gray-400">
                    {new Date(upcoming.nextTownHall.date).toLocaleDateString()}
                  </span>
                </div>
              </li>
            )}
            {!upcoming.plDue && !upcoming.nextTownHall && (
              <li className="pt-2 text-gray-400 text-sm">Nothing upcoming.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Group view */}
      {group.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">{t("student.dashboard.myGroup")}</h3>
          <div className="flex flex-wrap gap-4">
            {group.map((member, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border ${
                  member.isMe ? "border-gray-900 bg-gray-50" : "border-gray-100"
                }`}
              >
                <span className="text-xs font-medium text-gray-700">
                  {member.isMe ? "You" : `[${member.initial}]`}
                </span>
                {member.label ? (
                  <TrafficLight label={member.label} score={member.score ?? 0} size="sm" />
                ) : (
                  <span className="text-xs text-gray-300">—</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">{t("demo.student.groupNote")}</p>
        </div>
      )}

      <div className="pt-2 border-t border-gray-100">
        <Link href="/dashboard/student" className="text-sm text-gray-400 hover:text-gray-700">
          {t("demo.backToLive")}
        </Link>
      </div>
    </div>
  );
}
