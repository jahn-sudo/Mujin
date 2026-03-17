"use client";

import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";
import Link from "next/link";

const TRUST_SCORE = {
  score: 82,
  label: "GREEN",
  month: "2027-03",
  responsiveness: 75,
  transparency: 100,
  mutualism: 75,
  reflection: 100,
};

const GROUP = [
  { initial: "T", score: 91, label: "GREEN", isMe: false },
  { initial: "K", score: 82, label: "GREEN", isMe: true },
  { initial: "L", score: 67, label: "YELLOW", isMe: false },
  { initial: "P", score: 78, label: "GREEN", isMe: false },
  { initial: "E", score: 44, label: "RED", isMe: false },
];

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

export default function DemoStudentDashboard() {
  return (
    <div className="space-y-6">
      {/* [TEST] Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-amber-700 font-semibold text-sm">[TEST]</span>
        <p className="text-sm text-amber-800">
          This is a stakeholder demo view with simulated data. No real student records are shown.
        </p>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">K — YenWise</h2>
        <p className="text-sm text-gray-500 mt-0.5">Cohort A — Spring 2027</p>
      </div>

      {/* Trust Score Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trust Score</h3>
          <span className="text-xs text-gray-400">{TRUST_SCORE.month}</span>
        </div>
        <div className="flex items-center gap-3">
          <TrafficLight label={TRUST_SCORE.label} size="lg" />
          <span className="text-4xl font-bold font-mono text-gray-900">{TRUST_SCORE.score}</span>
        </div>
        <div className="space-y-2 pt-2">
          <ScoreBar label="Responsiveness" value={TRUST_SCORE.responsiveness} />
          <ScoreBar label="Transparency" value={TRUST_SCORE.transparency} />
          <ScoreBar label="Mutualism" value={TRUST_SCORE.mutualism} />
          <ScoreBar label="Reflection" value={TRUST_SCORE.reflection} />
        </div>
      </div>

      {/* Graduation Progress + Upcoming */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            Graduation Progress
          </h3>
          <ul className="space-y-2 text-sm">
            <CheckItem checked={true} label="Company incorporated + product live" />
            <CheckItem checked={true} label="3+ months non-negative cash flow (streak: 5)" />
            <CheckItem checked={false} label="Green trust score for 6 consecutive months (streak: 4)" />
            <CheckItem checked={false} label="Exit interview passed" />
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            Upcoming
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span>📋</span>
              <div>
                <span className="font-medium text-gray-900">P&L Report Due</span>
                <span className="text-gray-500 ml-1">Apr 5</span>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <span>📅</span>
              <div>
                <span className="font-medium text-gray-900">Monthly Town Hall</span>
                <span className="text-gray-500 ml-1">Apr 8</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Group View */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">My Group</h3>
        <div className="flex flex-wrap gap-4">
          {GROUP.map((member) => (
            <div
              key={member.initial}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border ${
                member.isMe ? "border-gray-900 bg-gray-50" : "border-gray-100"
              }`}
            >
              <span className="text-xs font-medium text-gray-700">[{member.initial}]</span>
              <TrafficLight label={member.label} score={member.score} size="sm" />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Scores visible within your group only.</p>
      </div>

      {/* Back to live dashboard */}
      <div className="pt-2 border-t border-gray-100">
        <Link href="/dashboard/student" className="text-sm text-gray-400 hover:text-gray-700">
          ← Back to live dashboard
        </Link>
      </div>
    </div>
  );
}
