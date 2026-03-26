"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  background:              "#f9f9f9",
  surfaceContainerLowest:  "#ffffff",
  surfaceContainerLow:     "#f2f4f4",
  surfaceContainer:        "#ebeeef",
  surfaceContainerHigh:    "#e4e9ea",
  surfaceContainerHighest: "#dde4e5",
  onBackground:            "#2d3435",
  onSurface:               "#2d3435",
  onSurfaceVariant:        "#5a6061",
  outline:                 "#757c7d",
  outlineVariant:          "#adb3b4",
  primary:                 "#465f88",
  primaryContainer:        "#d6e3ff",
  onPrimary:               "#f6f7ff",
  onPrimaryContainer:      "#39527b",
  secondary:               "#486558",
  secondaryContainer:      "#c9ead9",
  onSecondaryContainer:    "#3a584b",
} as const;

const SG  = "var(--font-space-grotesk), sans-serif";
const NS  = "var(--font-noto-serif), serif";
const IBM = "var(--font-ibm-mono), monospace";

const NAV_LINKS = [
  { label: "Program",    href: "/program" },
  { label: "Leadership", href: "/team"    },
  { label: "Network",    href: "/alumni"  },
  { label: "Mission",    href: "/about"   },
  { label: "FAQ",        href: "/faq"     },
  { label: "Partners",   href: "/partners" },
];

/* ── Traffic light ─────────────────────────────────────────────────────────── */
function TrafficDot({ label, score, size = "sm" }: { label: string; score?: number | null; size?: "sm" | "lg" }) {
  const color =
    label === "GREEN"  ? "#16a34a" :
    label === "YELLOW" ? "#ca8a04" :
    label === "RED"    ? "#dc2626" : "#9ca3af";
  const dot = size === "lg" ? 14 : 9;
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: dot, height: dot, borderRadius: "9999px", backgroundColor: color, flexShrink: 0 }} />
      {score != null && (
        <span style={{ fontFamily: IBM, fontWeight: 700, color: C.onSurface, fontSize: size === "lg" ? 28 : 13 }}>
          {score}
        </span>
      )}
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, (value / 25) * 100);
  const barColor =
    value < 12.5 ? "#dc2626" :   // red
    value < 18.75 ? "#ca8a04" :  // yellow
    "#166534";                    // green
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs shrink-0" style={{ color: C.onSurfaceVariant, fontFamily: SG }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: C.surfaceContainerHigh }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span className="w-8 text-right text-xs" style={{ color: barColor, fontFamily: IBM, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function DemoBanner() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ backgroundColor: C.surfaceContainerHigh, border: `1px solid ${C.outlineVariant}40` }}>
      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>Demo</span>
      <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
        This is simulated data. No login required. Real dashboards require an account.
      </p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-6 ${className}`}
      style={{ backgroundColor: C.surfaceContainerLowest, border: `1px solid ${C.outlineVariant}20` }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>
      {children}
    </p>
  );
}

/* ── Admin Demo View ───────────────────────────────────────────────────────── */

const ADMIN_COHORTS = [
  {
    name: "Cohort Alpha",
    students: [
      { name: "kai.watanabe",   venture: "PayRoute",    label: "YELLOW", score: 65, grad: "INELIGIBLE" },
      { name: "yuki.tanaka",    venture: "SoilSense",   label: "GREEN",  score: 81, grad: "ELIGIBLE" },
      { name: "lena.fischer",   venture: "StudyBridge", label: "GREEN",  score: 76, grad: "INELIGIBLE" },
      { name: "omar.hassan",    venture: "HalalEats",   label: "YELLOW", score: 62, grad: "INELIGIBLE" },
      { name: "sofia.martins",  venture: "ArtPass",     label: "GREEN",  score: 79, grad: "INELIGIBLE" },
    ],
  },
  {
    name: "Cohort Beta",
    students: [
      { name: "nana.kobayashi", venture: "TsunagiNet",  label: "RED",    score: 38, grad: "INELIGIBLE" },
      { name: "arjun.mehta",    venture: "ClimaCheck",  label: "YELLOW", score: 58, grad: "INELIGIBLE" },
      { name: "mei.chen",       venture: "NoteFlow",    label: "GREEN",  score: 83, grad: "INELIGIBLE" },
      { name: "pedro.silva",    venture: "MoveLink",    label: "RED",    score: 41, grad: "INELIGIBLE" },
      { name: "yuna.park",      venture: "KoreaTaste",  label: "GREEN",  score: 77, grad: "INELIGIBLE" },
    ],
  },
];

const NEEDS_ATTENTION = [
  { name: "nana.kobayashi", cohort: "Cohort Beta",  venture: "TsunagiNet",  label: "RED",    score: 38 },
  { name: "pedro.silva",    cohort: "Cohort Beta",  venture: "MoveLink",    label: "RED",    score: 41 },
];

type AdminStudent = typeof ADMIN_COHORTS[0]["students"][0];

function AdminView() {
  const [selected, setSelected] = useState<AdminStudent | null>(null);

  const allStudents = ADMIN_COHORTS.flatMap((c) => c.students);
  const green  = allStudents.filter((s) => s.label === "GREEN").length;
  const yellow = allStudents.filter((s) => s.label === "YELLOW").length;
  const red    = allStudents.filter((s) => s.label === "RED").length;

  if (selected) {
    return (
      <div className="space-y-5">
        <DemoBanner />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: C.onSurface }}>{selected.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>
              {selected.venture}
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: C.surfaceContainer, color: C.onSurfaceVariant, fontFamily: IBM }}>
                {selected.grad}
              </span>
            </p>
          </div>
          <button onClick={() => setSelected(null)} className="text-sm" style={{ color: C.onSurfaceVariant }}>← Back</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <SectionLabel>Trust Score</SectionLabel>
            <TrafficDot label={selected.label} score={selected.score} size="lg" />
            <div className="mt-4 space-y-2">
              <ScoreRow label="Responsiveness" value={Math.round(selected.score * 0.27)} />
              <ScoreRow label="Transparency"   value={Math.round(selected.score * 0.25)} />
              <ScoreRow label="Mutualism"       value={Math.round(selected.score * 0.24)} />
              <ScoreRow label="Reflection"      value={Math.round(selected.score * 0.24)} />
            </div>
          </Card>
          <Card>
            <SectionLabel>Attendance</SectionLabel>
            <p className="text-3xl font-bold" style={{ fontFamily: IBM, color: C.onSurface }}>
              {selected.label === "RED" ? "50%" : selected.label === "YELLOW" ? "75%" : "92%"}
            </p>
            <p className="text-xs mt-1" style={{ color: C.onSurfaceVariant }}>of bi-weekly check-ins attended</p>
          </Card>
        </div>

        <Card>
          <SectionLabel>P&L History</SectionLabel>
          <ul className="space-y-1.5 text-sm">
            {["2027-01", "2027-02", "2027-03"].map((month, i) => {
              const net = selected.label === "RED" ? [-12000, -8000, -15000][i] : [42000, 67000, 55000][i];
              return (
                <li key={month} className="flex items-center justify-between">
                  <span style={{ fontFamily: IBM, color: C.onSurfaceVariant }}>{month}</span>
                  <span style={{ color: net >= 0 ? "#16a34a" : "#dc2626", fontFamily: IBM, fontWeight: 600 }}>
                    ¥{net.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DemoBanner />
      <h2 className="text-lg font-semibold" style={{ color: C.onSurface }}>Admin Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <SectionLabel>Needs Attention</SectionLabel>
          <ul className="space-y-2">
            {NEEDS_ATTENTION.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <div>
                  <button onClick={() => setSelected(ADMIN_COHORTS.flatMap(c=>c.students).find(x=>x.name===s.name)!)}
                    className="font-medium hover:underline text-left" style={{ color: C.onSurface }}>
                    {s.name}
                  </button>
                  <span className="ml-1.5 text-xs" style={{ color: C.onSurfaceVariant }}>· {s.cohort}</span>
                </div>
                <TrafficDot label={s.label} score={s.score} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionLabel>Actions Due</SectionLabel>
          <ul className="space-y-2 text-sm divide-y" style={{ borderColor: C.outlineVariant + "20" }}>
            <li className="pt-2 first:pt-0 flex items-center justify-between">
              <span style={{ color: C.onSurface }}>P&L Reviews Pending</span>
              <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: IBM, backgroundColor: C.surfaceContainerHigh, color: C.onSurface }}>7</span>
            </li>
            <li className="pt-2" style={{ color: C.onSurfaceVariant }}>Next check-in: Cohort Alpha — Apr 2, 2027</li>
            <li className="pt-2" style={{ color: C.onSurfaceVariant }}>2 students in RED — review required</li>
          </ul>
        </Card>
      </div>

      <Card>
        <SectionLabel>All Students by Cohort</SectionLabel>
        <div className="space-y-5">
          {ADMIN_COHORTS.map((cohort) => (
            <div key={cohort.name}>
              <p className="text-xs font-medium uppercase mb-2" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>{cohort.name}</p>
              <div className="flex flex-wrap gap-2">
                {cohort.students.map((s) => (
                  <button key={s.name} onClick={() => setSelected(s)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                    style={{ border: `1px solid ${C.outlineVariant}30`, backgroundColor: C.surfaceContainerLow }}>
                    <span className="text-xs font-medium" style={{ color: C.onSurface }}>{s.name.split(".")[0]}</span>
                    <TrafficDot label={s.label} score={s.score} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Students", value: String(allStudents.length), color: C.primary },
          { label: "Green",  value: String(green),  color: "#16a34a" },
          { label: "Yellow", value: String(yellow), color: "#ca8a04" },
          { label: "Red",    value: String(red),    color: "#dc2626" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: IBM, color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: C.onSurfaceVariant }}>{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Student Demo View ─────────────────────────────────────────────────────── */

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">
        {checked ? (
          <svg className="w-4 h-4" style={{ color: "#16a34a" }} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
            <path d="M4.5 8.5L6.5 10.5L11.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="w-4 h-4" style={{ color: C.outlineVariant }} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
      </span>
      <span className="text-sm" style={{ color: checked ? C.onSurface : C.onSurfaceVariant }}>{label}</span>
    </li>
  );
}

const KAI = {
  name: "kai.watanabe",
  venture: "PayRoute",
  cohort: "Cohort Alpha",
  score: { value: 65, label: "YELLOW", month: "2027-03", responsiveness: 23, transparency: 8, mutualism: 20, reflection: 14 },
  grad: { ventureExists: true, cashFlowStreak: 3, greenStreak: 4, interviewStatus: "INELIGIBLE" },
  group: [
    { initial: "K", label: "YELLOW", score: 65, isMe: true },
    { initial: "Y", label: "GREEN",  score: 81, isMe: false },
    { initial: "L", label: "GREEN",  score: 76, isMe: false },
    { initial: "O", label: "YELLOW", score: 62, isMe: false },
    { initial: "S", label: "GREEN",  score: 79, isMe: false },
  ],
};

function StudentView() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h2 className="text-lg font-semibold" style={{ color: C.onSurface }}>{KAI.name} — {KAI.venture}</h2>
        <p className="text-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>{KAI.cohort}</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Trust Score</SectionLabel>
          <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>{KAI.score.month}</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <TrafficDot label={KAI.score.label} score={KAI.score.value} size="lg" />
        </div>
        <div className="space-y-2 pt-2">
          <ScoreRow label="Responsiveness" value={KAI.score.responsiveness} />
          <ScoreRow label="Transparency"   value={KAI.score.transparency} />
          <ScoreRow label="Mutualism"       value={KAI.score.mutualism} />
          <ScoreRow label="Reflection"      value={KAI.score.reflection} />
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <SectionLabel>Graduation Progress</SectionLabel>
          <ul className="space-y-2">
            <CheckItem checked={KAI.grad.ventureExists}         label="Company incorporated + product live" />
            <CheckItem checked={KAI.grad.cashFlowStreak >= 3}   label={`3 mo non-negative cash flow (${KAI.grad.cashFlowStreak} mo streak)`} />
            <CheckItem checked={KAI.grad.greenStreak >= 6}      label={`6 consecutive Green months (${KAI.grad.greenStreak} mo)`} />
            <CheckItem checked={false}                          label="Exit interview passed" />
          </ul>
          <div className="mt-4 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, fontFamily: IBM }}>
            Status: INTERVIEW_SCHEDULED
          </div>
        </Card>
        <Card>
          <SectionLabel>Upcoming</SectionLabel>
          <ul className="space-y-3 text-sm divide-y" style={{ borderColor: C.outlineVariant + "20" }}>
            <li className="pt-2 first:pt-0 flex items-center justify-between">
              <span className="font-medium" style={{ color: C.onSurface }}>P&L Due</span>
              <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>2027-04-01</span>
            </li>
            <li className="pt-2 flex items-center justify-between">
              <span className="font-medium" style={{ color: C.onSurface }}>Town Hall</span>
              <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>Apr 5, 2027</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <SectionLabel>My Group</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {KAI.group.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
              style={{ border: `1px solid ${m.isMe ? C.onSurface : C.outlineVariant + "30"}`, backgroundColor: m.isMe ? C.surfaceContainerHigh : C.surfaceContainerLowest }}>
              <span className="text-xs font-medium" style={{ color: C.onSurface }}>{m.isMe ? "You" : `[${m.initial}]`}</span>
              <TrafficDot label={m.label} score={m.score} />
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: C.onSurfaceVariant }}>
          Scores visible within your cohort group only.
        </p>
      </Card>
    </div>
  );
}

/* ── Mentor Demo View ──────────────────────────────────────────────────────── */

const MENTOR_COHORT = {
  name: "Cohort Alpha — Spring 2027",
  students: [
    {
      id: "s1", name: "tanaka.r", venture: "MedLink AI", category: "HEALTHTECH",
      score: 91, label: "GREEN", attendance: { attended: 11, total: 12 },
      notes: [
        {
          id: "n1", date: "2027-03-19",
          agendaRecap: "Discussed user onboarding funnel and drop-off at step 3.",
          actionItems: "A/B test two onboarding variants by Apr 2. Reach out to 5 potential beta users.",
          reflection: "I realised I've been building features users didn't ask for. This week I'm going to interview 3 users before writing any more code.",
          grade: { rating: 5, feedback: "Outstanding self-awareness. Action items are specific and measurable. Keep this up." },
        },
        {
          id: "n2", date: "2027-03-05",
          agendaRecap: "Revenue model review — freemium vs. subscription.",
          actionItems: "Model out 12-month revenue for both options. Present comparison next session.",
          reflection: "Struggling to decide on pricing. I need to talk to more hospitals before committing.",
          grade: null,
        },
      ],
    },
    { id: "s2", name: "kim.j",    venture: "YenWise",  category: "FINTECH",        score: 82, label: "GREEN",  attendance: { attended: 10, total: 12 }, notes: [] },
    { id: "s3", name: "liu.m",    venture: "EduBridge", category: "EDTECH",         score: 67, label: "YELLOW", attendance: { attended: 8,  total: 12 }, notes: [
      { id: "n3", date: "2027-03-19", agendaRecap: "Platform roadmap for Q2.", actionItems: "Cold email 20 teachers.", reflection: "Feeling overwhelmed.", grade: null },
    ]},
    { id: "s4", name: "patel.a",  venture: "ShokuNow", category: "FOOD_BEVERAGE",  score: 78, label: "GREEN",  attendance: { attended: 9,  total: 12 }, notes: [] },
    { id: "s5", name: "santos.e", venture: "CraftHub", category: "CREATIVE_MEDIA", score: 44, label: "RED",    attendance: { attended: 6,  total: 12 }, notes: [
      { id: "n4", date: "2027-03-19", agendaRecap: "No clear agenda.", actionItems: "Define one goal for April.", reflection: "Did not submit.", grade: null },
    ]},
  ],
};

type MentorStudent = typeof MENTOR_COHORT.students[0];
type MentorNote = MentorStudent["notes"][0];

function GradePanel({ note, onClose }: { note: MentorNote; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card>
        <p className="text-sm font-medium" style={{ color: "#16a34a" }}>Grade submitted (demo — not saved).</p>
        <button onClick={onClose} className="text-sm mt-3" style={{ color: C.onSurfaceVariant }}>← Back</button>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium" style={{ color: C.onSurface }}>Grade Note — {note.date}</h4>
        <button onClick={onClose} className="text-sm" style={{ color: C.onSurfaceVariant }}>← Back</button>
      </div>
      <div className="space-y-3 text-sm rounded-lg p-4" style={{ backgroundColor: C.surfaceContainerLow }}>
        <div>
          <p className="text-xs font-semibold uppercase mb-1" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>Agenda Recap</p>
          <p style={{ color: C.onSurface }}>{note.agendaRecap}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase mb-1" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>Action Items</p>
          <p style={{ color: C.onSurface }}>{note.actionItems}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase mb-1" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>Reflection</p>
          <p style={{ color: C.onSurface }}>{note.reflection}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: C.onSurface }}>Rating</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}
              className="w-9 h-9 rounded-lg border text-sm font-semibold transition-colors"
              style={{
                backgroundColor: rating >= n ? C.onSurface : C.surfaceContainerLowest,
                borderColor:     rating >= n ? C.onSurface : C.outlineVariant + "60",
                color:           rating >= n ? C.onPrimary : C.onSurfaceVariant,
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>
      <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)}
        placeholder="Written feedback for the student…"
        className="w-full text-sm border rounded-lg px-3 py-2 resize-none focus:outline-none"
        style={{ borderColor: C.outlineVariant + "60", color: C.onSurface, fontFamily: SG, backgroundColor: C.surfaceContainerLowest }} />
      <div className="flex items-center gap-3">
        <button disabled={rating === 0 || feedback.trim().length === 0} onClick={() => setSubmitted(true)}
          className="text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          style={{ backgroundColor: C.onSurface, color: C.onPrimary, fontFamily: SG }}>
          Save Grade
        </button>
        <p className="text-xs" style={{ color: C.onSurfaceVariant }}>Not saved — demo only</p>
      </div>
    </Card>
  );
}

function MentorStudentDetail({ student, onBack }: { student: MentorStudent; onBack: () => void }) {
  const [gradingNote, setGradingNote] = useState<MentorNote | null>(null);
  const ungraded = student.notes.filter((n) => !n.grade);

  if (gradingNote) {
    return <GradePanel note={gradingNote} onClose={() => setGradingNote(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: C.onSurface }}>{student.name}</h3>
          <p className="text-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>
            {student.venture}
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: C.surfaceContainerHigh, color: C.onSurfaceVariant, fontFamily: IBM }}>
              {student.category}
            </span>
          </p>
        </div>
        <button onClick={onBack} className="text-sm" style={{ color: C.onSurfaceVariant }}>← Back</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <SectionLabel>Trust Score</SectionLabel>
          <div className="flex items-center gap-2">
            <TrafficDot label={student.label} score={student.score} size="lg" />
          </div>
        </Card>
        <Card>
          <SectionLabel>Attendance</SectionLabel>
          <p className="text-3xl font-bold" style={{ fontFamily: IBM, color: C.onSurface }}>
            {student.attendance.attended}/{student.attendance.total}
          </p>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionLabel>Check-in Notes</SectionLabel>
          {ungraded.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: C.onSurfaceVariant, borderColor: C.outlineVariant + "40", fontFamily: IBM }}>
              {ungraded.length} to grade
            </span>
          )}
        </div>
        {student.notes.length === 0 && (
          <p className="text-sm" style={{ color: C.onSurfaceVariant }}>No notes submitted yet.</p>
        )}
        {student.notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4 space-y-3" style={{ borderColor: C.outlineVariant + "30" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: C.onSurface }}>{note.date}</p>
              {note.grade ? (
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                  Graded · {note.grade.rating}/5
                </span>
              ) : (
                <button onClick={() => setGradingNote(note)}
                  className="text-xs px-2 py-0.5 rounded transition-colors"
                  style={{ backgroundColor: C.surfaceContainerHigh, color: C.onSurface, border: `1px solid ${C.outlineVariant}40` }}>
                  Grade
                </button>
              )}
            </div>
            <div className="text-sm space-y-1" style={{ color: C.onSurfaceVariant }}>
              <p><span className="font-medium" style={{ color: C.onSurface }}>Recap:</span> {note.agendaRecap}</p>
              <p><span className="font-medium" style={{ color: C.onSurface }}>Actions:</span> {note.actionItems}</p>
              <p><span className="font-medium" style={{ color: C.onSurface }}>Reflection:</span> {note.reflection}</p>
            </div>
            {note.grade && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
                <span className="font-medium">Feedback:</span> {note.grade.feedback}
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function MentorView() {
  const [selected, setSelected] = useState<MentorStudent | null>(null);

  const ungradedCount = MENTOR_COHORT.students.reduce(
    (acc, s) => acc + s.notes.filter((n) => !n.grade).length,
    0
  );

  const SESSIONS = [
    { id: "cs3", date: "2027-04-02", note: "Q2 kickoff check-in",    submitted: false, upcoming: true  },
    { id: "cs1", date: "2027-03-19", note: "March mid-month",        submitted: true,  upcoming: false },
    { id: "cs2", date: "2027-03-05", note: "March early check-in",   submitted: true,  upcoming: false },
  ];

  if (selected) {
    return (
      <div className="space-y-5">
        <DemoBanner />
        <MentorStudentDetail student={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: C.onSurface }}>Mentor Dashboard</h2>
        <span className="text-xs" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>{MENTOR_COHORT.name}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Students", value: "5",   color: C.primary },
          { label: "Green",    value: "3",   color: "#16a34a" },
          { label: "Yellow",   value: "1",   color: "#ca8a04" },
          { label: "Red",      value: "1",   color: "#dc2626" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: IBM, color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: C.onSurfaceVariant }}>{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>My Cohort</SectionLabel>
          {ungradedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: C.onSurfaceVariant, borderColor: C.outlineVariant + "40", fontFamily: IBM }}>
              {ungradedCount} to grade
            </span>
          )}
        </div>
        <div className="divide-y" style={{ borderColor: C.outlineVariant + "20" }}>
          {MENTOR_COHORT.students.map((s) => {
            const pending = s.notes.filter((n) => !n.grade).length;
            return (
              <button key={s.id} onClick={() => setSelected(s)}
                className="w-full flex items-center justify-between py-3 rounded-lg -mx-2 px-2 transition-colors text-left"
                style={{ color: C.onSurface }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: C.onSurface }}>{s.name}</p>
                  <p className="text-xs" style={{ color: C.onSurfaceVariant }}>
                    {s.venture} · {s.attendance.attended}/{s.attendance.total} check-ins
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {pending > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ fontFamily: IBM, color: C.onSurfaceVariant, borderColor: C.outlineVariant + "40" }}>
                      {pending} to grade
                    </span>
                  )}
                  <TrafficDot label={s.label} score={s.score} />
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionLabel>Check-in Sessions</SectionLabel>
        <div className="divide-y" style={{ borderColor: C.outlineVariant + "20" }}>
          {SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium" style={{ color: C.onSurface }}>{s.date}</p>
                  {s.upcoming && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, fontFamily: IBM }}>
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: C.onSurfaceVariant }}>{s.note}</p>
              </div>
              {s.submitted ? (
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                  Attendance Logged
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded opacity-60" style={{ backgroundColor: C.surfaceContainerHigh, color: C.onSurfaceVariant, border: `1px solid ${C.outlineVariant}40` }}>
                  Log Attendance
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

type Tab = "admin" | "student" | "mentor";

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>("admin");

  return (
    <div style={{ backgroundColor: C.background, color: C.onBackground, fontFamily: SG }}
      className="min-h-screen selection:bg-[#d6e3ff] selection:text-[#39527b]">

      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50"
        style={{
          backgroundColor: `${C.background}e8`,
          backdropFilter:   "blur(20px)",
          boxShadow:        "0 32px 64px -15px rgba(45,52,53,0.06)",
          borderBottom:     `1px solid ${C.outlineVariant}30`,
        }}>
        <div className="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
          <Link href="/" className="text-2xl font-bold tracking-widest" style={{ fontFamily: NS, color: "#1B365D", textDecoration: "none" }}>
            MUJIN
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="font-medium transition-colors duration-300"
                style={{ color: C.onSurfaceVariant, fontFamily: SG }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="px-8 py-3 font-medium text-sm tracking-wide"
              style={{ backgroundColor: C.primary, color: C.onPrimary, borderRadius: "0.125rem" }}>
              Demo
            </Link>
            <Link href="/login" className="font-medium text-sm transition-colors duration-200"
              style={{ color: C.onSurfaceVariant, fontFamily: SG }}>
              Log In
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="px-12 py-20 max-w-screen-2xl mx-auto">
          <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase"
            style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, borderRadius: "0.75rem", fontFamily: IBM }}>
            Platform Preview
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: NS, color: C.onSurface }}>
            Three Views.<br />
            <em className="font-normal italic" style={{ color: C.primary }}>One Platform.</em>
          </h1>
          <p className="text-xl max-w-2xl leading-relaxed" style={{ color: C.onSurfaceVariant }}>
            Explore the Trust Engine from every angle — as a program administrator
            overseeing all 50 students, as a student tracking your own graduation
            progress, or as a mentor guiding your cohort.
          </p>
        </section>

        {/* ── Tab Shell ─────────────────────────────────────────────────────── */}
        <section className="px-12 pb-24 max-w-screen-2xl mx-auto">

          {/* Tab bar */}
          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
            style={{ backgroundColor: C.surfaceContainerHigh }}>
            {(["admin", "student", "mentor"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 capitalize"
                style={{
                  backgroundColor: tab === t ? C.surfaceContainerLowest : "transparent",
                  color:           tab === t ? C.primary : C.onSurfaceVariant,
                  boxShadow:       tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  fontFamily:      SG,
                }}>
                {t === "admin" ? "Admin View" : t === "student" ? "Student View" : "Mentor View"}
              </button>
            ))}
          </div>

          {/* Tab description */}
          <p className="mb-8 text-sm" style={{ color: C.onSurfaceVariant }}>
            {tab === "admin"   && "Program staff see all 50 students across 10 cohorts. Click any student to drill into their trust score history, P&L, and graduation status."}
            {tab === "student" && "Students see their own trust score breakdown, graduation gate progress, and peer group. Shown here: Kai Watanabe (PayRoute) — interview scheduled."}
            {tab === "mentor"  && "Mentors see their assigned cohort of 5. Click a student to review check-in notes and submit grades. Interactive — try grading a note."}
          </p>

          {/* Dashboard shell */}
          <div className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${C.outlineVariant}30`, backgroundColor: C.surfaceContainerLowest, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ backgroundColor: C.surfaceContainerLow, borderColor: C.outlineVariant + "30" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#fc6058" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#fea429" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#29cb41" }} />
              </div>
              <div className="flex-1 mx-4">
                <div className="rounded-md px-3 py-1 text-xs" style={{ backgroundColor: C.surfaceContainerHigh, color: C.onSurfaceVariant, fontFamily: IBM, maxWidth: 320 }}>
                  mujin2.vercel.app / dashboard / {tab} / demo
                </div>
              </div>
            </div>

            {/* Dashboard nav bar */}
            <div className="border-b px-6 h-14 flex items-center gap-6" style={{ borderColor: C.outlineVariant + "30", backgroundColor: C.surfaceContainerLowest }}>
              <span className="text-base font-semibold tracking-tight" style={{ color: C.onSurface, fontFamily: SG }}>Mujin</span>
              <span className="text-sm" style={{ color: C.primary, fontFamily: SG, fontWeight: 600 }}>Dashboard</span>
              <span className="text-sm" style={{ color: C.onSurfaceVariant, fontFamily: SG }}>Demo</span>
              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs px-2 py-1 rounded border" style={{ color: C.onSurfaceVariant, borderColor: C.outlineVariant + "40", fontFamily: IBM }}>EN</span>
                <span className="text-sm" style={{ color: C.onSurfaceVariant, fontFamily: SG }}>Sign Out</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-w-3xl">
              {tab === "admin"   && <AdminView />}
              {tab === "student" && <StudentView />}
              {tab === "mentor"  && <MentorView />}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="px-12 pb-24 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-16 py-14 rounded-2xl"
            style={{ backgroundColor: C.onSurface }}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: NS, color: C.onPrimary }}>
                Ready for the real platform?
              </h2>
              <p className="mt-3 text-base" style={{ color: C.outlineVariant }}>
                Log in with demo credentials to explore the full dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 text-center">
              <Link href="/login" className="px-10 py-4 font-semibold text-sm rounded-sm transition-all"
                style={{ backgroundColor: C.primary, color: C.onPrimary, fontFamily: SG }}>
                Log In to Demo
              </Link>
              <p className="text-xs" style={{ color: C.outlineVariant, fontFamily: IBM }}>
                admin@demo.mujin.jp · admin2026!
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="w-full py-16 px-12"
        style={{ backgroundColor: C.surfaceContainerLow, borderTop: `1px solid ${C.outlineVariant}30` }}>
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-widest uppercase"
              style={{ fontFamily: NS, color: "#1B365D" }}>
              MUJIN
            </Link>
            <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: C.onSurfaceVariant, fontFamily: IBM }}>
              © 2026 · A Frontier Commons Prototype
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            {[...NAV_LINKS, { label: "Demo", href: "/demo" }].map((l) => (
              <Link key={l.label} href={l.href} className="text-sm font-medium hover:text-[#465f88] transition-colors"
                style={{ color: C.onSurfaceVariant, fontFamily: SG }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
