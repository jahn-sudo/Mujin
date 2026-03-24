"use client";

import { useState } from "react";
import Link from "next/link";

const SG = "var(--font-space-grotesk), sans-serif";
const NS = "var(--font-noto-serif), serif";

// ── Static demo data ───────────────────────────────────────────────────────────

const STUDENT_DATA = {
  name: "kai.watanabe",
  venture: "KaiKitchen",
  cohort: "Cohort A — Spring 2027",
  trustScore: {
    score: 82,
    label: "GREEN",
    month: "2027-03",
    responsivenessRaw: 94,
    transparencyRaw: 78,
    mutualismRaw: 62,
    reflectionRaw: 88,
  },
  graduation: {
    ventureExists: true,
    grantReceived: true,
    cashFlowStreak: 3,
    greenStreak: 4,
    exitInterviewStatus: "INELIGIBLE",
  },
  upcoming: [
    { label: "P&L Due",   date: "2027.04.01 // 23:59", color: "#FFDDB4" },
    { label: "Town Hall", date: "2027.04.02 // 18:30", color: "#C4ECCE" },
  ],
  group: [
    { id: "USER_771", label: "You",    score: 82, color: "#C4ECCE", isMe: true },
    { id: "NODE_[A]", label: "NODE_A", score: 79, color: "#b4cad6", isMe: false },
    { id: "NODE_[B]", label: "NODE_B", score: 88, color: "#b4cad6", isMe: false },
    { id: "NODE_[C]", label: "NODE_C", score: 64, color: "#FFDDB4", isMe: false },
    { id: "NODE_[D]", label: "NODE_D", score: 91, color: "#C4ECCE", isMe: false },
  ],
};

const COHORT_DATA = {
  name: "Cohort A — Spring 2027",
  students: [
    { id: "s1", name: "tanaka.r",  venture: "MedLink AI",  category: "HEALTHTECH",    score: 91, label: "GREEN",  attendance: { attended: 11, total: 12 } },
    { id: "s2", name: "kim.j",     venture: "YenWise",     category: "FINTECH",       score: 82, label: "GREEN",  attendance: { attended: 10, total: 12 } },
    { id: "s3", name: "liu.m",     venture: "EduBridge",   category: "EDTECH",        score: 67, label: "YELLOW", attendance: { attended: 8,  total: 12 } },
    { id: "s4", name: "patel.a",   venture: "ShokuNow",    category: "FOOD_BEVERAGE", score: 78, label: "GREEN",  attendance: { attended: 9,  total: 12 } },
    { id: "s5", name: "santos.e",  venture: "CraftHub",    category: "CREATIVE_MEDIA",score: 44, label: "RED",    attendance: { attended: 6,  total: 12 } },
  ],
};

const MENTOR_DATA = {
  name: "Cohort A — Spring 2027",
  sessions: [
    { id: "cs3", date: "2027.04.02", note: "Q2 kickoff check-in",    submitted: false, upcoming: true },
    { id: "cs1", date: "2027.03.19", note: "March mid-month",         submitted: true,  upcoming: false },
    { id: "cs2", date: "2027.03.05", note: "March early check-in",    submitted: true,  upcoming: false },
  ],
  students: [
    {
      id: "s1", name: "tanaka.r", venture: "MedLink AI", category: "HEALTHTECH", score: 91, label: "GREEN",
      attendance: { attended: 11, total: 12 },
      notes: [
        {
          id: "n1", date: "2027.03.19",
          agenda: "Discussed user onboarding funnel and drop-off at step 3.",
          actions: "A/B test two onboarding variants by Apr 2. Reach out to 5 potential beta users.",
          reflection: "I realised I've been building features users didn't ask for. This week I'm going to interview 3 users before writing any more code.",
          grade: { rating: 5, feedback: "Outstanding self-awareness. Action items are specific and measurable." },
        },
      ],
    },
    {
      id: "s2", name: "kim.j", venture: "YenWise", category: "FINTECH", score: 82, label: "GREEN",
      attendance: { attended: 10, total: 12 },
      notes: [],
    },
    {
      id: "s3", name: "liu.m", venture: "EduBridge", category: "EDTECH", score: 67, label: "YELLOW",
      attendance: { attended: 8, total: 12 },
      notes: [
        {
          id: "n2", date: "2027.03.19",
          agenda: "Platform roadmap for Q2. Discussed teacher acquisition strategy.",
          actions: "Cold email 20 teachers. Set up a simple landing page for teacher sign-ups.",
          reflection: "Feeling overwhelmed. Hard to balance product work and business development at the same time.",
          grade: null,
        },
      ],
    },
    {
      id: "s4", name: "patel.a", venture: "ShokuNow", category: "FOOD_BEVERAGE", score: 78, label: "GREEN",
      attendance: { attended: 9, total: 12 },
      notes: [],
    },
    {
      id: "s5", name: "santos.e", venture: "CraftHub", category: "CREATIVE_MEDIA", score: 44, label: "RED",
      attendance: { attended: 6, total: 12 },
      notes: [
        {
          id: "n3", date: "2027.03.19",
          agenda: "No clear agenda set before session.",
          actions: "Define one goal for April. Write it down and share before next session.",
          reflection: "Did not submit.",
          grade: null,
        },
      ],
    },
  ],
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const CIRC = 2 * Math.PI * 84; // ≈ 527.8

function TrustGauge({ score, color = "#C4ECCE" }: { score: number; color?: string }) {
  const offset = CIRC * (1 - score / 100);
  return (
    <div
      className="relative w-48 h-48 flex items-center justify-center flex-shrink-0"
      style={{ borderRadius: "50%", border: "12px solid #2a2a2a" }}
    >
      <svg className="absolute inset-0 w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="96" cy="96" r="84" fill="none"
          stroke={color}
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeWidth="12"
          strokeLinecap="butt"
        />
      </svg>
      <div className="text-center relative z-10">
        <span className="block text-6xl font-bold" style={{ fontFamily: NS, color: "#e5e2e1" }}>
          {score}
        </span>
        <span className="block text-[10px] tracking-widest uppercase mt-1" style={{ color, fontFamily: SG }}>
          Trust Score
        </span>
      </div>
    </div>
  );
}

function ScoreRow({ label, value, color = "#C4ECCE" }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase tracking-wider" style={{ fontFamily: SG }}>
        <span style={{ color: "#b4cad6" }}>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1" style={{ backgroundColor: "#353534" }}>
        <div className="h-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function CheckRow({
  checked,
  label,
  note,
}: {
  checked: boolean;
  label: string;
  note: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div
        className="w-5 h-5 flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{
          border: checked ? "1px solid #C4ECCE" : "1px solid rgba(180,202,214,0.4)",
          backgroundColor: checked ? "rgba(196,236,206,0.2)" : "transparent",
        }}
      >
        {checked && (
          <span className="material-symbols-outlined text-xs" style={{ color: "#C4ECCE", fontSize: "12px" }}>
            check
          </span>
        )}
      </div>
      <div className={checked ? "" : "opacity-60"}>
        <p className="text-sm" style={{ color: "#e5e2e1", fontFamily: SG }}>
          {label}
        </p>
        <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
          {note}
        </p>
      </div>
    </li>
  );
}

function labelColor(label: string) {
  if (label === "GREEN")  return "#C4ECCE";
  if (label === "YELLOW") return "#FFDDB4";
  return "#ffb4ab";
}

// ── Town Hall Form ─────────────────────────────────────────────────────────────

function TownHallForm({ onBack }: { onBack: () => void }) {
  const peers = STUDENT_DATA.group.filter((m) => !m.isMe);
  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const wordCount = reflectionText.trim().split(/\s+/).filter(Boolean).length;

  if (submitted) {
    return (
      <div className="space-y-8">
        <div
          className="p-8 text-center space-y-4"
          style={{ backgroundColor: "rgba(196,236,206,0.05)", border: "1px solid rgba(196,236,206,0.2)" }}
        >
          <span className="material-symbols-outlined text-4xl block" style={{ color: "#C4ECCE" }}>check_circle</span>
          <p className="font-bold tracking-widest uppercase text-sm" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Submission_Received
          </p>
          <p className="text-sm" style={{ color: "#b4cad6", fontFamily: SG }}>
            Your reflection will be assessed for quality by the Trust Engine. Anonymity preserved.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: "#b4cad6", fontFamily: SG }}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </button>
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.3)", fontFamily: SG }}>
          Demo only — no data was saved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] block mb-2" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Monthly Reporting // Town Hall
          </span>
          <h2 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: NS }}>
            Submit Town Hall
          </h2>
        </div>
        <button
          onClick={onBack}
          className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: "#b4cad6", fontFamily: SG }}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (wordCount >= 50) setSubmitted(true); }}
        className="space-y-6"
      >
        {/* Attendance */}
        <div className="p-6 space-y-4" style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid rgba(196,236,206,0.2)" }}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Part_01 — Attendance
          </h3>
          <p className="text-xs" style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}>
            Mark which group members attended the Town Hall today.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#C4ECCE" }}
              >
                <span className="material-symbols-outlined" style={{ color: "#143723", fontSize: "10px" }}>check</span>
              </div>
              <span className="text-sm font-bold" style={{ color: "#C4ECCE", fontFamily: SG }}>
                You — kai.watanabe
              </span>
            </div>
            {peers.map((member) => (
              <label key={member.id} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    border: "1px solid rgba(180,202,214,0.3)",
                    backgroundColor: attendeeIds.includes(member.id) ? "rgba(196,236,206,0.2)" : "transparent",
                  }}
                >
                  {attendeeIds.includes(member.id) && (
                    <span className="material-symbols-outlined" style={{ color: "#C4ECCE", fontSize: "10px" }}>check</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={attendeeIds.includes(member.id)}
                  onChange={() =>
                    setAttendeeIds((prev) =>
                      prev.includes(member.id) ? prev.filter((x) => x !== member.id) : [...prev, member.id]
                    )
                  }
                  className="sr-only"
                />
                <span className="text-sm" style={{ color: "#b4cad6", fontFamily: SG }}>{member.id}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
            {attendeeIds.length + 1} of {STUDENT_DATA.group.length} members marked present.
          </p>
        </div>

        {/* Reflection */}
        <div className="p-6 space-y-4" style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid rgba(196,236,206,0.2)" }}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Part_02 — Monthly Reflection
          </h3>
          <p className="text-xs" style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}>
            What did you learn, struggle with, or discover this month? Minimum 50 words.
          </p>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 text-sm resize-none focus:outline-none"
            placeholder="Write your reflection here..."
            style={{
              backgroundColor: "#131313",
              border: "1px solid rgba(66,72,66,0.4)",
              color: "#e5e2e1",
              fontFamily: SG,
            }}
          />
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest" style={{ fontFamily: SG }}>
            <span style={{ color: wordCount >= 50 ? "#C4ECCE" : "rgba(180,202,214,0.4)" }}>
              {wordCount} words
            </span>
            {wordCount >= 50 && <span style={{ color: "#C4ECCE" }}>Minimum_Met</span>}
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={wordCount < 50}
            className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: wordCount >= 50 ? "#C4ECCE" : "#353534",
              color: wordCount >= 50 ? "#143723" : "#b4cad6",
              fontFamily: SG,
            }}
          >
            Submit_Report
          </button>
          <p className="text-[10px] text-center uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.3)", fontFamily: SG }}>
            Demo only — no data will be saved.
          </p>
        </div>
      </form>
    </div>
  );
}

// ── Student View ───────────────────────────────────────────────────────────────

function StudentView({ onRoleChange }: { onRoleChange: (r: Role) => void }) {
  const [showTownHall, setShowTownHall] = useState(false);
  const { trustScore, graduation, group, upcoming } = STUDENT_DATA;

  if (showTownHall) {
    return (
      <div className="relative overflow-hidden seigaiha-pattern p-8 lg:p-12 min-h-screen">
        <TownHallForm onBack={() => setShowTownHall(false)} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden seigaiha-pattern p-8 lg:p-12">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl space-y-4">
            <span
              className="text-[10px] tracking-[0.3em] uppercase block"
              style={{ color: "#C4ECCE", fontFamily: SG }}
            >
              System Interface
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight" style={{ fontFamily: NS }}>
              Interactive Demo
            </h1>
            <p className="text-lg font-light leading-relaxed" style={{ color: "#b4cad6" }}>
              Explore the platform from every angle —{" "}
              <em style={{ color: "#C4ECCE" }}>no login required.</em> Access administrative nodes or
              track operational metrics in real-time.
            </p>
          </div>
          {/* Role selector */}
          <div className="flex p-1" style={{ backgroundColor: "#201f1f" }}>
            <button
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all"
              style={{ backgroundColor: "#C4ECCE", color: "#143723", fontFamily: SG }}
            >
              Student
            </button>
            <button
              onClick={() => onRoleChange("mentor")}
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:text-[#C4ECCE]"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Mentor
            </button>
            <button
              onClick={() => onRoleChange("admin")}
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:text-[#C4ECCE]"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Admin
            </button>
          </div>
        </div>
        <div
          className="mt-8 p-4 max-w-lg"
          style={{ backgroundColor: "rgba(196,236,206,0.05)", borderLeft: "2px solid rgba(196,236,206,0.3)" }}
        >
          <p className="text-[11px] tracking-wider uppercase" style={{ color: "#A9D0B3", fontFamily: SG }}>
            Current View: Student. Track your trust score, submit reflections, and monitor graduation progress.
          </p>
        </div>
      </section>

      {/* ── Bento Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Trust Score Module */}
        <div
          className="col-span-12 lg:col-span-8 p-8 relative overflow-hidden"
          style={{ backgroundColor: "#201f1f" }}
        >
          <div
            className="absolute top-0 right-0 p-4 text-[10px]"
            style={{ color: "rgba(180,202,214,0.2)", fontFamily: SG }}
          >
            MODULE_01 // METRIC_DENSITY
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <TrustGauge score={trustScore.score} />
            <div className="flex-1 w-full space-y-6">
              <h3 className="text-xl" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                System Vitality Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <ScoreRow label="Responsiveness" value={trustScore.responsivenessRaw} />
                <ScoreRow label="Transparency"   value={trustScore.transparencyRaw} />
                <ScoreRow label="Mutualism"       value={trustScore.mutualismRaw} />
                <ScoreRow label="Reflection"      value={trustScore.reflectionRaw} />
              </div>
            </div>
          </div>
        </div>

        {/* Graduation Checklist */}
        <div
          className="col-span-12 lg:col-span-4 p-8"
          style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid rgba(196,236,206,0.1)" }}
        >
          <h3
            className="text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-3 mb-8"
            style={{ color: "#C4ECCE", fontFamily: SG }}
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            Technical Milestones
          </h3>
          <ul className="space-y-6">
            <CheckRow
              checked={graduation.ventureExists}
              label="Company incorporated"
              note="Registered // Tokyo-03"
            />
            <CheckRow
              checked={graduation.grantReceived}
              label="Grant tranche received"
              note="Verified // Ledger_Entry"
            />
            <CheckRow
              checked={graduation.cashFlowStreak >= 3}
              label={`3 months non-negative cash flow`}
              note={`Streak: ${graduation.cashFlowStreak} / 3 months`}
            />
            <CheckRow
              checked={graduation.exitInterviewStatus === "INTERVIEW_PASSED" || graduation.exitInterviewStatus === "GRADUATED"}
              label="Exit interview passed"
              note="Phase: Locked"
            />
          </ul>
        </div>

        {/* Calendar Feed */}
        <div
          className="col-span-12 lg:col-span-3 p-6"
          style={{ backgroundColor: "#201f1f" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Calendar_Feed
            </h3>
            <span className="material-symbols-outlined text-sm" style={{ color: "#FFDDB4" }}>schedule</span>
          </div>
          <div className="space-y-4">
            {upcoming.map((item) => (
              <div
                key={item.label}
                className="p-4 transition-colors cursor-pointer"
                style={{ backgroundColor: "#353534" }}
              >
                <span
                  className="block text-[10px] mb-1"
                  style={{ color: item.color, fontFamily: SG }}
                >
                  {item.date}
                </span>
                <p className="text-lg leading-tight" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                  {item.label}
                </p>
              </div>
            ))}
            <button
              onClick={() => setShowTownHall(true)}
              className="w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(196,236,206,0.2)", color: "#C4ECCE", fontFamily: SG }}
            >
              Submit Town Hall
            </button>
          </div>
        </div>

        {/* Lattice Comparison */}
        <div
          className="col-span-12 lg:col-span-9 p-8"
          style={{ backgroundColor: "#1c1b1b" }}
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl italic" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                Lattice Comparison
              </h3>
              <p
                className="text-[10px] uppercase tracking-[0.2em] mt-1"
                style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}
              >
                Peer_Group_Analysis // Operational_Sync
              </p>
            </div>
            <span
              className="text-[10px]"
              style={{ color: "#C4ECCE", fontFamily: SG }}
            >
              SCANNING_NODES... [ONLINE]
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {group.map((member) => (
              <div
                key={member.id}
                className="p-4 transition-all"
                style={{
                  backgroundColor: member.isMe ? "#2a2a2a" : "rgba(53,53,52,0.4)",
                  borderLeft: member.isMe ? `4px solid ${member.color}` : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span
                  className="block text-[9px] mb-3"
                  style={{ color: member.isMe ? member.color : "#b4cad6", fontFamily: SG }}
                >
                  {member.isMe ? `#${member.id} (YOU)` : member.id}
                </span>
                <div
                  className="text-3xl font-bold mb-4"
                  style={{
                    fontFamily: NS,
                    color: "#e5e2e1",
                    opacity: member.isMe ? 1 : 0.5,
                  }}
                >
                  {member.score}
                </div>
                <div className="w-full h-1" style={{ backgroundColor: "#131313" }}>
                  <div
                    className="h-full"
                    style={{ width: `${member.score}%`, backgroundColor: member.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer decoration */}
        <div
          className="col-span-12 flex flex-col md:flex-row gap-6 pt-8 mt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px flex-1" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "#C4ECCE", fontFamily: SG }}
              >
                Legacy Protocol // 00-KYOTO-44
              </span>
              <span className="h-px flex-1" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
            </div>
            <p
              className="text-[11px] text-center uppercase tracking-widest"
              style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}
            >
              All simulation data is ephemeral and cleared upon node disconnect. Version 1.0 Stable Build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin View ─────────────────────────────────────────────────────────────────

function AdminView({ onRoleChange }: { onRoleChange: (r: Role) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const students = COHORT_DATA.students;
  const selected = students.find((s) => s.id === selectedId) ?? null;
  const green  = students.filter((s) => s.label === "GREEN").length;
  const yellow = students.filter((s) => s.label === "YELLOW").length;
  const red    = students.filter((s) => s.label === "RED").length;

  return (
    <div className="relative overflow-hidden seigaiha-pattern p-8 lg:p-12">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl space-y-4">
            <span
              className="text-[10px] tracking-[0.3em] uppercase block"
              style={{ color: "#C4ECCE", fontFamily: SG }}
            >
              System Interface
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight" style={{ fontFamily: NS }}>
              Interactive Demo
            </h1>
            <p className="text-lg font-light leading-relaxed" style={{ color: "#b4cad6" }}>
              Explore the platform from every angle —{" "}
              <em style={{ color: "#C4ECCE" }}>no login required.</em> Access administrative nodes or
              track operational metrics in real-time.
            </p>
          </div>
          {/* Role selector */}
          <div className="flex p-1" style={{ backgroundColor: "#201f1f" }}>
            <button
              onClick={() => onRoleChange("student")}
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:text-[#C4ECCE]"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Student
            </button>
            <button
              onClick={() => onRoleChange("mentor")}
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:text-[#C4ECCE]"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Mentor
            </button>
            <button
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all"
              style={{ backgroundColor: "#C4ECCE", color: "#143723", fontFamily: SG }}
            >
              Admin
            </button>
          </div>
        </div>
        <div
          className="mt-8 p-4 max-w-lg"
          style={{ backgroundColor: "rgba(196,236,206,0.05)", borderLeft: "2px solid rgba(196,236,206,0.3)" }}
        >
          <p className="text-[11px] tracking-wider uppercase" style={{ color: "#A9D0B3", fontFamily: SG }}>
            Current View: Admin. Monitor cohort trust scores, flag at-risk students, and manage actions.
          </p>
        </div>
      </section>

      {/* ── Bento Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Stats row */}
        {[
          { label: "Total Students", value: String(students.length), color: "#e5e2e1" },
          { label: "Green",          value: String(green),           color: "#C4ECCE" },
          { label: "Yellow",         value: String(yellow),          color: "#FFDDB4" },
          { label: "Red",            value: String(red),             color: "#ffb4ab" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="col-span-6 lg:col-span-3 p-6 text-center"
            style={{ backgroundColor: "#1c1b1b" }}
          >
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: NS, color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>
              {stat.label}
            </p>
          </div>
        ))}

        {/* Student roster */}
        <div
          className="col-span-12 lg:col-span-8 p-8"
          style={{ backgroundColor: "#201f1f" }}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl" style={{ fontFamily: NS, color: "#e5e2e1" }}>
              {selected ? selected.name : "Cohort Roster"}
            </h3>
            {selected && (
              <button
                onClick={() => setSelectedId(null)}
                className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ color: "#b4cad6", fontFamily: SG }}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                All Students
              </button>
            )}
          </div>

          {selected ? (
            // Detail view
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6" style={{ backgroundColor: "#1c1b1b" }}>
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>
                    Trust Score
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold" style={{ fontFamily: NS, color: labelColor(selected.label) }}>
                      {selected.score}
                    </span>
                    <span
                      className="px-2 py-1 text-[9px] uppercase tracking-widest"
                      style={{
                        backgroundColor: `${labelColor(selected.label)}20`,
                        color: labelColor(selected.label),
                        fontFamily: SG,
                      }}
                    >
                      {selected.label}
                    </span>
                  </div>
                </div>
                <div className="p-6" style={{ backgroundColor: "#1c1b1b" }}>
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>
                    Attendance
                  </p>
                  <p className="text-4xl font-bold" style={{ fontFamily: NS, color: "#e5e2e1" }}>
                    {selected.attendance.attended}/{selected.attendance.total}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                    Check-ins attended
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-2" style={{ backgroundColor: "#1c1b1b" }}>
                <div className="flex justify-between text-[10px] uppercase tracking-widest" style={{ fontFamily: SG }}>
                  <span style={{ color: "rgba(180,202,214,0.5)" }}>Venture</span>
                  <span style={{ color: "#e5e2e1" }}>{selected.venture}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest" style={{ fontFamily: SG }}>
                  <span style={{ color: "rgba(180,202,214,0.5)" }}>Category</span>
                  <span style={{ color: "#b4cad6" }}>{selected.category}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest" style={{ fontFamily: SG }}>
                  <span style={{ color: "rgba(180,202,214,0.5)" }}>Graduation Status</span>
                  <span style={{ color: "#FFDDB4" }}>INELIGIBLE</span>
                </div>
              </div>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(180,202,214,0.3)", fontFamily: SG }}
              >
                * Actions (schedule interview, release tranche, etc.) are disabled in demo mode.
              </p>
            </div>
          ) : (
            // Roster list
            <div className="divide-y" style={{ borderColor: "rgba(66,72,66,0.1)" }}>
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="w-full flex items-center justify-between py-4 px-2 text-left transition-colors hover:bg-[#1c1b1b]/50"
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#e5e2e1", fontFamily: SG }}>
                      {s.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                      {s.venture} · {s.attendance.attended}/{s.attendance.total} check-ins
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: NS, color: labelColor(s.label) }}
                    >
                      {s.score}
                    </span>
                    <div className="w-16 h-1" style={{ backgroundColor: "#353534" }}>
                      <div className="h-full" style={{ width: `${s.score}%`, backgroundColor: labelColor(s.label) }} />
                    </div>
                    <span className="material-symbols-outlined text-sm" style={{ color: "rgba(180,202,214,0.3)" }}>
                      chevron_right
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions panel */}
        <div
          className="col-span-12 lg:col-span-4 space-y-4"
        >
          {/* Actions due */}
          <div className="p-6 space-y-4" style={{ backgroundColor: "#1c1b1b" }}>
            <h3
              className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2"
              style={{ color: "#C4ECCE", fontFamily: SG }}
            >
              <span className="material-symbols-outlined text-sm">schedule</span>
              Actions_Due
            </h3>
            <div className="space-y-3">
              {[
                { label: "P&L reviews pending", value: "3", color: "#FFDDB4" },
                { label: "Next check-in", value: "Apr 2", color: "#b4cad6" },
                { label: "RED student — review required", value: "1", color: "#ffb4ab" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 px-0"
                  style={{ borderBottom: "1px solid rgba(66,72,66,0.1)" }}
                >
                  <span className="text-xs" style={{ color: "#b4cad6", fontFamily: SG }}>
                    {item.label}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      fontFamily: SG,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RED alert */}
          <div
            className="p-6 space-y-4"
            style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid #ffb4ab" }}
          >
            <h3
              className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2"
              style={{ color: "#ffb4ab", fontFamily: SG }}
            >
              <span className="material-symbols-outlined text-sm">warning</span>
              Needs_Attention
            </h3>
            {students.filter((s) => s.label === "RED").map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: "#e5e2e1", fontFamily: SG }}>{s.name}</p>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                    {s.venture}
                  </p>
                </div>
                <span className="text-2xl font-bold" style={{ fontFamily: NS, color: "#ffb4ab" }}>
                  {s.score}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer decoration */}
        <div
          className="col-span-12 flex flex-col md:flex-row gap-6 pt-8 mt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px flex-1" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "#C4ECCE", fontFamily: SG }}
              >
                Legacy Protocol // 00-KYOTO-44
              </span>
              <span className="h-px flex-1" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
            </div>
            <p
              className="text-[11px] text-center uppercase tracking-widest"
              style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}
            >
              All simulation data is ephemeral and cleared upon node disconnect. Version 1.0 Stable Build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mentor View ───────────────────────────────────────────────────────────────

type MentorStudent = typeof MENTOR_DATA.students[0];
type MentorNote    = MentorStudent["notes"][0];

function GradePanel({ note, onClose }: { note: MentorNote; onClose: () => void }) {
  const [rating, setRating]     = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className="p-8 space-y-4 text-center"
        style={{ backgroundColor: "rgba(196,236,206,0.05)", border: "1px solid rgba(196,236,206,0.2)" }}
      >
        <span className="material-symbols-outlined text-4xl block" style={{ color: "#C4ECCE" }}>check_circle</span>
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#C4ECCE", fontFamily: SG }}>
          Grade_Saved
        </p>
        <button
          onClick={onClose}
          className="text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto hover:opacity-80 transition-opacity"
          style={{ color: "#b4cad6", fontFamily: SG }}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.3)", fontFamily: SG }}>
          Demo only — no data was saved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] block mb-1" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Grade Check-in
          </span>
          <p className="text-lg font-bold" style={{ fontFamily: NS }}>{note.date}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: "#b4cad6", fontFamily: SG }}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
      </div>

      {/* Note recap */}
      <div className="p-6 space-y-4" style={{ backgroundColor: "#1c1b1b" }}>
        {[
          { label: "Agenda",     value: note.agenda },
          { label: "Actions",    value: note.actions },
          { label: "Reflection", value: note.reflection },
        ].map((row) => (
          <div key={row.label}>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
              {row.label}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#e5e2e1", fontFamily: SG }}>{row.value}</p>
          </div>
        ))}
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "#C4ECCE", fontFamily: SG }}>
          Rating (1–5)
        </p>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="w-10 h-10 text-sm font-bold transition-all"
              style={{
                backgroundColor: rating >= n ? "#C4ECCE" : "transparent",
                color: rating >= n ? "#143723" : "#b4cad6",
                border: `1px solid ${rating >= n ? "#C4ECCE" : "rgba(180,202,214,0.3)"}`,
                fontFamily: SG,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "#C4ECCE", fontFamily: SG }}>
          Feedback
        </p>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback for the student..."
          className="w-full px-4 py-3 text-sm resize-none focus:outline-none"
          style={{
            backgroundColor: "#131313",
            border: "1px solid rgba(66,72,66,0.4)",
            color: "#e5e2e1",
            fontFamily: SG,
          }}
        />
      </div>

      <div className="space-y-3">
        <button
          disabled={rating === 0 || feedback.trim().length === 0}
          onClick={() => setSubmitted(true)}
          className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: rating > 0 && feedback.trim().length > 0 ? "#C4ECCE" : "#353534",
            color: rating > 0 && feedback.trim().length > 0 ? "#143723" : "#b4cad6",
            fontFamily: SG,
          }}
        >
          Save_Grade
        </button>
        <p className="text-[10px] text-center uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.3)", fontFamily: SG }}>
          Demo only — no data will be saved.
        </p>
      </div>
    </div>
  );
}

function MentorStudentDetail({ student, onBack }: { student: MentorStudent; onBack: () => void }) {
  const [gradingNote, setGradingNote] = useState<MentorNote | null>(null);
  const ungraded = student.notes.filter((n) => !n.grade);

  if (gradingNote) {
    return <GradePanel note={gradingNote} onClose={() => setGradingNote(null)} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] block mb-1" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Student Profile
          </span>
          <h3 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: NS }}>{student.name}</h3>
          <p className="text-sm mt-1" style={{ color: "#b4cad6", fontFamily: SG }}>
            {student.venture}{" "}
            <span
              className="px-2 py-0.5 text-[9px] uppercase tracking-widest ml-1"
              style={{ backgroundColor: "rgba(180,202,214,0.1)", color: "#b4cad6", fontFamily: SG }}
            >
              {student.category}
            </span>
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: "#b4cad6", fontFamily: SG }}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          All Students
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6" style={{ backgroundColor: "#1c1b1b" }}>
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>
            Trust Score
          </p>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold" style={{ fontFamily: NS, color: labelColor(student.label) }}>
              {student.score}
            </span>
            <span
              className="px-2 py-1 text-[9px] uppercase tracking-widest"
              style={{ backgroundColor: `${labelColor(student.label)}20`, color: labelColor(student.label), fontFamily: SG }}
            >
              {student.label}
            </span>
          </div>
        </div>
        <div className="p-6" style={{ backgroundColor: "#1c1b1b" }}>
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>
            Attendance
          </p>
          <p className="text-4xl font-bold" style={{ fontFamily: NS, color: "#e5e2e1" }}>
            {student.attendance.attended}/{student.attendance.total}
          </p>
        </div>
      </div>

      {/* Check-in notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#C4ECCE", fontFamily: SG }}>
            Check-in Notes
          </p>
          {ungraded.length > 0 && (
            <span
              className="text-[9px] uppercase tracking-widest px-2 py-1"
              style={{ backgroundColor: "rgba(255,221,180,0.1)", color: "#FFDDB4", border: "1px solid rgba(255,221,180,0.3)", fontFamily: SG }}
            >
              {ungraded.length} to grade
            </span>
          )}
        </div>

        {student.notes.length === 0 && (
          <p className="text-sm" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>No notes yet.</p>
        )}

        {student.notes.map((note) => (
          <div key={note.id} className="p-6 space-y-4" style={{ backgroundColor: "#1c1b1b" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold" style={{ color: "#e5e2e1", fontFamily: SG }}>{note.date}</p>
              {note.grade ? (
                <span
                  className="text-[9px] uppercase tracking-widest px-2 py-1"
                  style={{ backgroundColor: "rgba(196,236,206,0.1)", color: "#C4ECCE", border: "1px solid rgba(196,236,206,0.3)", fontFamily: SG }}
                >
                  Graded · {note.grade.rating}/5
                </span>
              ) : (
                <button
                  onClick={() => setGradingNote(note)}
                  className="text-[9px] uppercase tracking-widest px-2 py-1 transition-all hover:opacity-80"
                  style={{ border: "1px solid rgba(255,221,180,0.4)", color: "#FFDDB4", fontFamily: SG }}
                >
                  Grade
                </button>
              )}
            </div>
            {[
              { label: "Agenda",  value: note.agenda },
              { label: "Actions", value: note.actions },
              { label: "Reflection", value: note.reflection },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>{row.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#b4cad6", fontFamily: SG }}>{row.value}</p>
              </div>
            ))}
            {note.grade && (
              <div
                className="p-4"
                style={{ backgroundColor: "rgba(196,236,206,0.05)", borderLeft: "2px solid rgba(196,236,206,0.3)" }}
              >
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#C4ECCE", fontFamily: SG }}>Feedback</p>
                <p className="text-sm" style={{ color: "#e5e2e1", fontFamily: SG }}>{note.grade.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorView({ onRoleChange }: { onRoleChange: (r: Role) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { students, sessions } = MENTOR_DATA;
  const selected = students.find((s) => s.id === selectedId) ?? null;
  const green    = students.filter((s) => s.label === "GREEN").length;
  const yellow   = students.filter((s) => s.label === "YELLOW").length;
  const red      = students.filter((s) => s.label === "RED").length;
  const totalPending = students.reduce((acc, s) => acc + s.notes.filter((n) => !n.grade).length, 0);

  return (
    <div className="relative overflow-hidden seigaiha-pattern p-8 lg:p-12">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase block" style={{ color: "#C4ECCE", fontFamily: SG }}>
              System Interface
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight" style={{ fontFamily: NS }}>
              Interactive Demo
            </h1>
            <p className="text-lg font-light leading-relaxed" style={{ color: "#b4cad6" }}>
              Explore the platform from every angle —{" "}
              <em style={{ color: "#C4ECCE" }}>no login required.</em> Access administrative nodes or
              track operational metrics in real-time.
            </p>
          </div>
          {/* Role selector */}
          <div className="flex p-1" style={{ backgroundColor: "#201f1f" }}>
            <button
              onClick={() => onRoleChange("student")}
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:text-[#C4ECCE]"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Student
            </button>
            <button
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all"
              style={{ backgroundColor: "#C4ECCE", color: "#143723", fontFamily: SG }}
            >
              Mentor
            </button>
            <button
              onClick={() => onRoleChange("admin")}
              className="px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:text-[#C4ECCE]"
              style={{ color: "#b4cad6", fontFamily: SG }}
            >
              Admin
            </button>
          </div>
        </div>
        <div
          className="mt-8 p-4 max-w-lg"
          style={{ backgroundColor: "rgba(196,236,206,0.05)", borderLeft: "2px solid rgba(196,236,206,0.3)" }}
        >
          <p className="text-[11px] tracking-wider uppercase" style={{ color: "#A9D0B3", fontFamily: SG }}>
            Current View: Mentor. Review student check-ins, grade reflections, and track cohort trust health.
          </p>
        </div>
      </section>

      {/* ── Bento Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Stats */}
        {[
          { label: "My Students",  value: String(students.length), color: "#e5e2e1" },
          { label: "Green",        value: String(green),           color: "#C4ECCE" },
          { label: "Yellow",       value: String(yellow),          color: "#FFDDB4" },
          { label: "Red",          value: String(red),             color: "#ffb4ab" },
        ].map((stat) => (
          <div key={stat.label} className="col-span-6 lg:col-span-3 p-6 text-center" style={{ backgroundColor: "#1c1b1b" }}>
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: NS, color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}>{stat.label}</p>
          </div>
        ))}

        {/* Student roster / detail */}
        <div className="col-span-12 lg:col-span-8 p-8" style={{ backgroundColor: "#201f1f" }}>
          {selected ? (
            <MentorStudentDetail student={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl" style={{ fontFamily: NS, color: "#e5e2e1" }}>My Cohort</h3>
                {totalPending > 0 && (
                  <span
                    className="text-[9px] uppercase tracking-widest px-3 py-1"
                    style={{ backgroundColor: "rgba(255,221,180,0.1)", color: "#FFDDB4", border: "1px solid rgba(255,221,180,0.3)", fontFamily: SG }}
                  >
                    {totalPending} to grade
                  </span>
                )}
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(66,72,66,0.1)" }}>
                {students.map((s) => {
                  const pending = s.notes.filter((n) => !n.grade).length;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className="w-full flex items-center justify-between py-4 px-2 text-left transition-colors hover:bg-[#1c1b1b]/50"
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#e5e2e1", fontFamily: SG }}>{s.name}</p>
                        <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                          {s.venture} · {s.attendance.attended}/{s.attendance.total} sessions
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {pending > 0 && (
                          <span
                            className="text-[9px] px-2 py-0.5 uppercase tracking-widest"
                            style={{ backgroundColor: "rgba(255,221,180,0.1)", color: "#FFDDB4", border: "1px solid rgba(255,221,180,0.2)", fontFamily: SG }}
                          >
                            {pending} to grade
                          </span>
                        )}
                        <span className="text-2xl font-bold" style={{ fontFamily: NS, color: labelColor(s.label) }}>{s.score}</span>
                        <div className="w-12 h-1" style={{ backgroundColor: "#353534" }}>
                          <div className="h-full" style={{ width: `${s.score}%`, backgroundColor: labelColor(s.label) }} />
                        </div>
                        <span className="material-symbols-outlined text-sm" style={{ color: "rgba(180,202,214,0.3)" }}>chevron_right</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Sessions panel */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="p-6" style={{ backgroundColor: "#1c1b1b" }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2" style={{ color: "#C4ECCE", fontFamily: SG }}>
                <span className="material-symbols-outlined text-sm">event</span>
                Check-in Sessions
              </h3>
            </div>
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-4"
                  style={{
                    backgroundColor: s.upcoming ? "rgba(196,236,206,0.05)" : "#131313",
                    borderLeft: s.upcoming ? "2px solid #C4ECCE" : "2px solid rgba(66,72,66,0.3)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#e5e2e1", fontFamily: SG }}>{s.date}</p>
                      {s.note && (
                        <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
                          {s.note}
                        </p>
                      )}
                    </div>
                    {s.upcoming ? (
                      <span
                        className="text-[9px] uppercase tracking-widest px-2 py-0.5 shrink-0"
                        style={{ backgroundColor: "rgba(196,236,206,0.1)", color: "#C4ECCE", fontFamily: SG }}
                      >
                        Upcoming
                      </span>
                    ) : s.submitted ? (
                      <span
                        className="text-[9px] uppercase tracking-widest px-2 py-0.5 shrink-0"
                        style={{ backgroundColor: "rgba(196,236,206,0.1)", color: "#C4ECCE", border: "1px solid rgba(196,236,206,0.2)", fontFamily: SG }}
                      >
                        Logged
                      </span>
                    ) : (
                      <span
                        className="text-[9px] uppercase tracking-widest px-2 py-0.5 shrink-0 opacity-40"
                        style={{ border: "1px solid rgba(180,202,214,0.2)", color: "#b4cad6", fontFamily: SG }}
                      >
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RED alert */}
          {red > 0 && (
            <div className="p-6 space-y-3" style={{ backgroundColor: "#1c1b1b", borderLeft: "2px solid #ffb4ab" }}>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2" style={{ color: "#ffb4ab", fontFamily: SG }}>
                <span className="material-symbols-outlined text-sm">warning</span>
                Needs_Attention
              </h3>
              {students.filter((s) => s.label === "RED").map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium" style={{ color: "#e5e2e1", fontFamily: SG }}>{s.name}</p>
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>{s.venture}</p>
                  </div>
                  <span className="text-2xl font-bold" style={{ fontFamily: NS, color: "#ffb4ab" }}>{s.score}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer decoration */}
        <div className="col-span-12 flex flex-col md:flex-row gap-6 pt-8 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px flex-1" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "#C4ECCE", fontFamily: SG }}>
                Legacy Protocol // 00-KYOTO-44
              </span>
              <span className="h-px flex-1" style={{ backgroundColor: "rgba(196,236,206,0.2)" }} />
            </div>
            <p className="text-[11px] text-center uppercase tracking-widest" style={{ color: "rgba(180,202,214,0.4)", fontFamily: SG }}>
              All simulation data is ephemeral and cleared upon node disconnect. Version 1.0 Stable Build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar nav ────────────────────────────────────────────────────────────────

const SIDE_LINKS = [
  { icon: "grid_view",    label: "Dashboard", active: true },
  { icon: "tsunami",      label: "Protocols" },
  { icon: "account_tree", label: "Lattice" },
  { icon: "history_edu",  label: "Archive" },
  { icon: "memory",       label: "System" },
];

// ── Page ───────────────────────────────────────────────────────────────────────

type Role = "student" | "mentor" | "admin";

export default function DemoPage() {
  const [role, setRole] = useState<Role>("student");

  return (
    <div
      className="overflow-x-hidden"
      style={{ backgroundColor: "#131313", color: "#e5e2e1", fontFamily: SG }}
    >
      {/* ── Top App Bar ───────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16"
        style={{ backgroundColor: "#131313", borderBottom: "none" }}
      >
        <div className="flex items-center gap-8">
          <span
            className="text-xl font-bold tracking-[0.2em]"
            style={{ fontFamily: NS, color: "#C4ECCE" }}
          >
            MUJIN_CORE
          </span>
          <nav className="hidden md:flex gap-8">
            <span
              className="text-xs uppercase tracking-widest border-b-2 py-1"
              style={{ color: "#C4ECCE", borderColor: "#C4ECCE", fontFamily: SG }}
            >
              Dashboard
            </span>
            <span
              className="text-xs uppercase tracking-widest py-1"
              style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}
            >
              Protocols
            </span>
            <span
              className="text-xs uppercase tracking-widest py-1"
              style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}
            >
              Lattice
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <span className="material-symbols-outlined cursor-pointer hover:text-[#C4ECCE] transition-colors" style={{ color: "#C4ECCE" }}>
              sensors
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#C4ECCE] transition-colors" style={{ color: "#C4ECCE" }}>
              terminal
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#C4ECCE] transition-colors" style={{ color: "#C4ECCE" }}>
              settings_input_component
            </span>
          </div>
          <div
            className="w-8 h-8 flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "rgba(196,236,206,0.2)", color: "#C4ECCE", border: "1px solid rgba(196,236,206,0.3)", fontFamily: SG }}
          >
            KW
          </div>
        </div>
      </header>

      {/* ── Side Nav ──────────────────────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 h-full z-40 hidden lg:flex flex-col pt-20"
        style={{ width: "256px", backgroundColor: "#0E0E0E" }}
      >
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2" style={{ backgroundColor: "#C4ECCE" }} />
            <h2 className="text-lg italic" style={{ fontFamily: NS, color: "#A9D0B3" }}>MUJIN_OS</h2>
          </div>
          <p
            className="font-light tracking-[0.1em] text-[10px] uppercase"
            style={{ color: "rgba(180,202,214,0.5)", fontFamily: SG }}
          >
            V.1.0_STABLE
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {SIDE_LINKS.map((l) => (
            <div
              key={l.label}
              className="flex items-center gap-4 py-4 px-6 text-sm tracking-[0.1em] uppercase cursor-default transition-all"
              style={
                l.active
                  ? { backgroundColor: "#C4ECCE", color: "#131313", fontFamily: SG, fontWeight: "700", borderLeft: "4px solid #FFDDB4" }
                  : { color: "#b4cad6", fontFamily: SG }
              }
            >
              <span className="material-symbols-outlined">{l.icon}</span>
              {l.label}
            </div>
          ))}
        </nav>
        <div className="p-6 space-y-4">
          <Link
            href="/program"
            className="block w-full py-3 text-center text-xs font-bold tracking-widest uppercase transition-colors hover:bg-[#FFDDB4]"
            style={{ backgroundColor: "#C4ECCE", color: "#143723", fontFamily: SG }}
          >
            View_Program
          </Link>
          <div className="pt-4 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <Link
              href="/faq"
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-[#C4ECCE] transition-colors"
              style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}
            >
              <span className="material-symbols-outlined text-sm">contact_support</span>
              Help / FAQ
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-[#ffb4ab] transition-colors"
              style={{ color: "rgba(180,202,214,0.6)", fontFamily: SG }}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Exit Demo
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="lg:pl-64 pt-16 min-h-screen" style={{ backgroundColor: "#0e0e0e" }}>
        {role === "student" ? (
          <StudentView onRoleChange={setRole} />
        ) : role === "mentor" ? (
          <MentorView onRoleChange={setRole} />
        ) : (
          <AdminView onRoleChange={setRole} />
        )}
      </main>

      {/* ── Decorative right rail ─────────────────────────────────────────── */}
      <div className="fixed right-0 top-0 h-full w-12 z-10 hidden xl:flex flex-col items-center py-12 gap-12 pointer-events-none opacity-20">
        <span
          className="text-2xl italic tracking-[0.5em]"
          style={{ fontFamily: NS, color: "#C4ECCE", writingMode: "vertical-rl" }}
        >
          無尽
        </span>
        <div className="flex-1" style={{ borderRight: "1px solid rgba(196,236,206,0.2)" }} />
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "#b4cad6", fontFamily: SG, writingMode: "vertical-rl" }}
        >
          082-99-44-X
        </span>
      </div>
    </div>
  );
}
