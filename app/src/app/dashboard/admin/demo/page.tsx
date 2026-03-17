"use client";

import { useState } from "react";
import Link from "next/link";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";

// ─── Static demo data ────────────────────────────────────────────────────────

const COHORTS = [
  {
    id: "c1",
    name: "Cohort A — Spring 2027",
    students: [
      { id: "s1", name: "tanaka.r", venture: "MedLink AI", score: 91, label: "GREEN", category: "HEALTHTECH" },
      { id: "s2", name: "kim.j", venture: "YenWise", score: 82, label: "GREEN", category: "FINTECH" },
      { id: "s3", name: "liu.m", venture: "EduBridge", score: 67, label: "YELLOW", category: "EDTECH" },
      { id: "s4", name: "patel.a", venture: "ShokuNow", score: 78, label: "GREEN", category: "FOOD_BEVERAGE" },
      { id: "s5", name: "santos.e", venture: "CraftHub", score: 44, label: "RED", category: "CREATIVE_MEDIA" },
    ],
  },
  {
    id: "c2",
    name: "Cohort B — Spring 2027",
    students: [
      { id: "s6", name: "nakamura.y", venture: "GreenCart", score: 88, label: "GREEN", category: "ECOMMERCE" },
      { id: "s7", name: "ali.f", venture: "TrustPay", score: 55, label: "YELLOW", category: "FINTECH" },
      { id: "s8", name: "chen.w", venture: "KidsMath", score: 95, label: "GREEN", category: "EDTECH" },
      { id: "s9", name: "smith.l", venture: "CareNow", score: 71, label: "YELLOW", category: "HEALTHTECH" },
      { id: "s10", name: "okonkwo.b", venture: "SolarMicro", score: 38, label: "RED", category: "SOCIAL_ENTERPRISE" },
    ],
  },
];

const SCORE_HISTORY = [
  { month: "2026-10", score: 58, label: "YELLOW", responsiveness: 75, transparency: 50, mutualism: 50, reflection: 0 },
  { month: "2026-11", score: 69, label: "YELLOW", responsiveness: 75, transparency: 75, mutualism: 75, reflection: 0 },
  { month: "2026-12", score: 81, label: "GREEN", responsiveness: 100, transparency: 75, mutualism: 75, reflection: 100 },
  { month: "2027-01", score: 88, label: "GREEN", responsiveness: 100, transparency: 100, mutualism: 75, reflection: 100 },
  { month: "2027-02", score: 82, label: "GREEN", responsiveness: 75, transparency: 100, mutualism: 75, reflection: 100 },
  { month: "2027-03", score: 91, label: "GREEN", responsiveness: 100, transparency: 100, mutualism: 75, reflection: 100 },
];

const PL_HISTORY = [
  { month: "2026-10", revenue: 0, expenses: 45000, net: -45000, status: "APPROVED" },
  { month: "2026-11", revenue: 120000, expenses: 80000, net: 40000, status: "APPROVED" },
  { month: "2026-12", revenue: 180000, expenses: 95000, net: 85000, status: "APPROVED" },
  { month: "2027-01", revenue: 210000, expenses: 100000, net: 110000, status: "APPROVED" },
  { month: "2027-02", revenue: 195000, expenses: 98000, net: 97000, status: "APPROVED" },
  { month: "2027-03", revenue: 250000, expenses: 110000, net: 140000, status: "APPROVED" },
];

const NEEDS_ATTENTION = [
  { id: "s5", name: "santos.e", cohort: "Cohort A", score: 44, label: "RED" },
  { id: "s10", name: "okonkwo.b", cohort: "Cohort B", score: 38, label: "RED" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoAdminDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<typeof COHORTS[0]["students"][0] | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(SCORE_HISTORY[SCORE_HISTORY.length - 1]);

  const selectedScore = selectedMonth;

  return (
    <div className="space-y-6">
      {/* [TEST] Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-amber-700 font-semibold text-sm">[TEST]</span>
        <p className="text-sm text-amber-800">
          This is a stakeholder demo view with simulated data. No real student records are shown.
        </p>
      </div>

      {/* ── Main dashboard ── */}
      {!selectedStudent && (
        <>
          <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>

          {/* Top row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Needs Attention */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Needs Attention
              </h3>
              <ul className="space-y-2">
                {NEEDS_ATTENTION.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <div>
                      <button
                        onClick={() => setSelectedStudent(
                          COHORTS.flatMap((c) => c.students).find((x) => x.id === s.id) ?? null
                        )}
                        className="font-medium text-gray-900 hover:underline text-left"
                      >
                        {s.name}
                      </button>
                      <span className="text-gray-400 ml-1">· {s.cohort}</span>
                    </div>
                    <TrafficLight label={s.label} score={s.score} size="sm" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Due */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Actions Due
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span className="text-gray-900">P&L reviews pending</span>
                  </div>
                  <span className="font-mono font-medium text-gray-900">3</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span>📅</span>
                  <span>Next check-in: Cohort A · Apr 2</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span>🎓</span>
                  <span>1 student eligible for exit interview</span>
                </li>
              </ul>
            </div>
          </div>

          {/* All Students by Cohort */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              All Students by Cohort
            </h3>
            {COHORTS.map((cohort) => (
              <div key={cohort.id}>
                <p className="text-xs font-medium text-gray-400 uppercase mb-2">{cohort.name}</p>
                <div className="flex flex-wrap gap-3">
                  {cohort.students.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
                    >
                      <span className="text-xs text-gray-600 font-medium">{s.name.slice(0, 8)}</span>
                      <TrafficLight label={s.label} score={s.score} size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Students", value: "10" },
              { label: "Green", value: "6", color: "text-green-700" },
              { label: "Yellow", value: "2", color: "text-yellow-600" },
              { label: "Red", value: "2", color: "text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold font-mono ${stat.color ?? "text-gray-900"}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Student Detail ── */}
      {selectedStudent && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedStudent.name}@mujin.jp</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {COHORTS.find((c) => c.students.some((s) => s.id === selectedStudent.id))?.name} ·{" "}
                {selectedStudent.venture}{" "}
                <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 ml-1">
                  {selectedStudent.category}
                </span>
              </p>
            </div>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          {/* Score History + Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Score History
              </h3>
              <ul className="space-y-1.5">
                {[...SCORE_HISTORY].reverse().map((s) => (
                  <li
                    key={s.month}
                    onClick={() => setSelectedMonth(s)}
                    className={`flex items-center justify-between text-sm cursor-pointer px-2 py-1.5 rounded-lg transition-colors ${
                      selectedMonth.month === s.month ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-gray-600 font-mono">{s.month}</span>
                    <TrafficLight label={s.label} score={s.score} size="sm" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Breakdown — {selectedScore.month}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <TrafficLight label={selectedScore.label} size="lg" />
                  <span className="text-3xl font-bold font-mono text-gray-900">
                    {selectedScore.score}
                  </span>
                </div>
                <ScoreBar label="Responsiveness" value={selectedScore.responsiveness} />
                <ScoreBar label="Transparency" value={selectedScore.transparency} />
                <ScoreBar label="Mutualism" value={selectedScore.mutualism} />
                <ScoreBar label="Reflection" value={selectedScore.reflection} />
              </div>
            </div>
          </div>

          {/* Attendance + P&L */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Attendance
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold font-mono text-gray-900">83%</span>
                <span className="text-sm text-gray-500">10 of 12 sessions</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                P&L History
              </h3>
              <ul className="space-y-1.5 text-sm">
                {PL_HISTORY.map((pl) => (
                  <li key={pl.month} className="flex items-center justify-between">
                    <span className="font-mono text-gray-600">{pl.month}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={pl.net >= 0 ? "text-green-700" : "text-red-600"}>
                        ¥{pl.net.toLocaleString()}
                      </span>
                      <span className="bg-green-50 border border-green-200 text-green-700 rounded px-1.5 py-0.5">
                        {pl.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Graduation Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Graduation Tracking
              </h3>
              <span className="text-xs font-semibold rounded-full px-2.5 py-1 border bg-yellow-100 border-yellow-300 text-yellow-800">
                ELIGIBLE
              </span>
            </div>
            <p className="text-sm text-yellow-800 mb-3">
              All 3 gates met. Schedule exit interview to proceed.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="datetime-local"
                disabled
                defaultValue="2027-04-10T14:00"
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white opacity-60"
              />
              <button
                disabled
                className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white opacity-60 cursor-not-allowed"
              >
                Schedule Interview
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">[TEST] — buttons disabled in demo view</p>
          </div>
        </div>
      )}

      {/* Back to live dashboard */}
      <div className="pt-2 border-t border-gray-100">
        <Link href="/dashboard/admin" className="text-sm text-gray-400 hover:text-gray-700">
          ← Back to live dashboard
        </Link>
      </div>
    </div>
  );
}
