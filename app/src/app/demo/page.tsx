"use client";

import { useState } from "react";
import PublicNav from "@/components/PublicNav";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { ScoreBar } from "@/components/ui/ScoreBar";

// ── Static demo data ──────────────────────────────────────────────────────────

const STUDENT_DATA = {
  name: "kai.watanabe",
  venture: "KaiKitchen",
  cohort: "Cohort A — Spring 2027",
  trustScore: {
    score: 82,
    label: "GREEN",
    month: "2027-03",
    responsivenessRaw: 88,
    transparencyRaw: 79,
    mutualismRaw: 75,
    reflectionRaw: 84,
  },
  graduation: {
    ventureExists: true,
    cashFlowStreak: 3,
    greenStreak: 4,
    exitInterviewStatus: "INELIGIBLE",
  },
  group: [
    { initial: "You", score: 82, label: "GREEN", isMe: true },
    { initial: "A", score: 91, label: "GREEN", isMe: false },
    { initial: "B", score: 67, label: "YELLOW", isMe: false },
    { initial: "C", score: 44, label: "RED", isMe: false },
    { initial: "D", score: 78, label: "GREEN", isMe: false },
  ],
};

const MENTOR_COHORT = {
  name: "Cohort A — Spring 2027",
  students: [
    {
      id: "s1", name: "tanaka.r", venture: "MedLink AI", category: "HEALTHTECH",
      score: 91, label: "GREEN", attendance: { attended: 11, total: 12 },
      notes: [
        {
          sessionId: "cs1", date: "2027-03-19",
          agendaRecap: "Discussed user onboarding funnel and drop-off at step 3.",
          actionItems: "A/B test two onboarding variants by Apr 2. Reach out to 5 potential beta users.",
          reflection: "I realised I've been building features users didn't ask for. This week I'm going to interview 3 users before writing any more code.",
          grade: { rating: 5, feedback: "Outstanding self-awareness. Action items are specific and measurable." },
        },
      ],
    },
    {
      id: "s2", name: "kim.j", venture: "YenWise", category: "FINTECH",
      score: 82, label: "GREEN", attendance: { attended: 10, total: 12 }, notes: [],
    },
    {
      id: "s3", name: "liu.m", venture: "EduBridge", category: "EDTECH",
      score: 67, label: "YELLOW", attendance: { attended: 8, total: 12 },
      notes: [
        {
          sessionId: "cs1", date: "2027-03-19",
          agendaRecap: "Platform roadmap for Q2. Discussed teacher acquisition strategy.",
          actionItems: "Cold email 20 teachers. Set up a simple landing page for teacher sign-ups.",
          reflection: "Feeling overwhelmed. Hard to balance product work and business development at the same time.",
          grade: null,
        },
      ],
    },
    {
      id: "s4", name: "patel.a", venture: "ShokuNow", category: "FOOD_BEVERAGE",
      score: 78, label: "GREEN", attendance: { attended: 9, total: 12 }, notes: [],
    },
    {
      id: "s5", name: "santos.e", venture: "CraftHub", category: "CREATIVE_MEDIA",
      score: 44, label: "RED", attendance: { attended: 6, total: 12 },
      notes: [
        {
          sessionId: "cs1", date: "2027-03-19",
          agendaRecap: "No clear agenda set before session.",
          actionItems: "Define one goal for April. Write it down and share before next session.",
          reflection: "Did not submit.",
          grade: null,
        },
      ],
    },
  ],
};

const MENTOR_SESSIONS = [
  { id: "cs3", date: "2027-04-02", note: "Q2 kickoff check-in", attendanceSubmitted: false, upcoming: true },
  { id: "cs1", date: "2027-03-19", note: "March mid-month", attendanceSubmitted: true, upcoming: false },
  { id: "cs2", date: "2027-03-05", note: "March early check-in", attendanceSubmitted: true, upcoming: false },
];

// ── Shared components ─────────────────────────────────────────────────────────

function DemoBanner() {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Demo</span>
      <p className="text-sm text-gray-500">This is sample data. No real student information is displayed.</p>
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

// ── Student view ──────────────────────────────────────────────────────────────

function StudentTownHallForm({ onBack }: { onBack: () => void }) {
  const peers = STUDENT_DATA.group.filter((m) => !m.isMe);
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
          <p className="text-green-700 font-medium">Submission received.</p>
          <p className="text-sm text-green-600">Your reflection will be assessed for quality by the Trust Engine.</p>
        </div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">← Back to dashboard</button>
        <p className="text-xs text-gray-400">Demo only — no data was saved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DemoBanner />
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Monthly Town Hall</h2>
          <p className="text-sm text-gray-500 mt-0.5">Anonymous peer reporting — {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">Back</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (wordCount >= 50) setSubmitted(true); }} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Part 1 — Who attended?</h3>
          <p className="text-xs text-gray-500">Mark which group members attended the Town Hall today.</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-default">
              <span className="w-4 h-4 rounded border-2 border-gray-900 bg-gray-900 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-medium">You — kai.watanabe</span>
            </label>
            {peers.map((member) => (
              <label key={member.initial} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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
          <p className="text-xs text-gray-400">{attendeeIds.length + 1} of {STUDENT_DATA.group.length} members marked present.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Part 2 — Monthly reflection</h3>
          <p className="text-xs text-gray-500">What did you learn, struggle with, or discover this month? Minimum 50 words.</p>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Write your reflection here..."
          />
          <div className="flex items-center justify-between text-xs">
            <span className={wordCount >= 50 ? "text-green-600" : "text-gray-400"}>
              {wordCount} words
            </span>
            {wordCount >= 50 && <span className="text-green-600">Minimum met</span>}
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={wordCount < 50}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
          <p className="text-xs text-gray-400 text-center">Demo only — no data will be saved.</p>
        </div>
      </form>
    </div>
  );
}

function StudentView() {
  const [view, setView] = useState<"dashboard" | "townhall">("dashboard");
  const { trustScore, graduation, group, name, venture, cohort } = STUDENT_DATA;

  if (view === "townhall") {
    return <StudentTownHallForm onBack={() => setView("dashboard")} />;
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{name} — {venture}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{cohort}</p>
        </div>
        <button
          onClick={() => setView("townhall")}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Submit Town Hall →
        </button>
      </div>

      {/* Trust score */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trust Score</h3>
          <span className="text-xs text-gray-400">{trustScore.month}</span>
        </div>
        <div className="flex items-center gap-3">
          <TrafficLight label={trustScore.label} size="lg" />
          <span className="text-4xl font-bold font-mono text-gray-900">{trustScore.score}</span>
        </div>
        <div className="space-y-2 pt-2">
          <ScoreBar label="Responsiveness" value={trustScore.responsivenessRaw} />
          <ScoreBar label="Transparency"   value={trustScore.transparencyRaw} />
          <ScoreBar label="Mutualism"      value={trustScore.mutualismRaw} />
          <ScoreBar label="Reflection"     value={trustScore.reflectionRaw} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Graduation checklist */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Graduation Progress</h3>
          <ul className="space-y-2 text-sm">
            <CheckItem checked={graduation.ventureExists}          label="Company incorporated + product live" />
            <CheckItem checked={graduation.cashFlowStreak >= 3}    label={`3 months non-negative cash flow (${graduation.cashFlowStreak}/3)`} />
            <CheckItem checked={graduation.greenStreak >= 6}       label={`Green trust score × 6 months (${graduation.greenStreak}/6)`} />
            <CheckItem checked={graduation.exitInterviewStatus === "INTERVIEW_PASSED" || graduation.exitInterviewStatus === "GRADUATED"}
              label="Exit interview passed" />
          </ul>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Upcoming</h3>
          <ul className="space-y-3 text-sm divide-y divide-gray-50">
            <li className="pt-2 first:pt-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">P&L due</span>
                <span className="text-xs text-gray-400">Apr 1</span>
              </div>
            </li>
            <li className="pt-2">
              <div className="flex items-center justify-between">
                <button onClick={() => setView("townhall")} className="font-medium text-gray-900 hover:underline text-left">
                  Town Hall
                </button>
                <span className="text-xs text-gray-400">Apr 2</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Group view */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">My Group</h3>
        <div className="flex flex-wrap gap-4">
          {group.map((member) => (
            <div
              key={member.initial}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border ${
                member.isMe ? "border-gray-900 bg-gray-50" : "border-gray-100"
              }`}
            >
              <span className="text-xs font-medium text-gray-700">
                {member.isMe ? "You" : `[${member.initial}]`}
              </span>
              <TrafficLight label={member.label} score={member.score ?? 0} size="sm" />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Scores are anonymized — you can only see your own breakdown.</p>
      </div>
    </div>
  );
}

// ── Mentor view ───────────────────────────────────────────────────────────────

type Student = typeof MENTOR_COHORT.students[0];
type Note = Student["notes"][0];

function GradePanel({ note, onClose }: { note: Note; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
        <p className="text-sm font-medium text-green-800">Grade submitted.</p>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">Back</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Rate this check-in — {note.date}</h4>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700">Back</button>
      </div>

      <div className="space-y-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">Agenda recap</p>
          <p>{note.agendaRecap}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">Action items</p>
          <p>{note.actionItems}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">Student reflection</p>
          <p>{note.reflection}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Rating (1–5)</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                rating >= n
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "border-gray-200 text-gray-400 hover:border-gray-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Feedback</p>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback for the student..."
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={rating === 0 || feedback.trim().length === 0}
          onClick={() => setSubmitted(true)}
          className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          Save grade
        </button>
        <p className="text-xs text-gray-400">Demo only — no data will be saved.</p>
      </div>
    </div>
  );
}

function StudentDetailView({ student, onBack }: { student: Student; onBack: () => void }) {
  const [gradingNote, setGradingNote] = useState<Note | null>(null);
  const ungraded = student.notes.filter((n) => !n.grade);

  if (gradingNote) {
    return <GradePanel note={gradingNote} onClose={() => setGradingNote(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {student.venture}{" "}
            <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 ml-1">{student.category}</span>
          </p>
        </div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">Back</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase mb-2">Trust Score</p>
          <div className="flex items-center gap-2">
            <TrafficLight label={student.label} score={student.score} size="sm" />
            <span className="text-2xl font-bold font-mono text-gray-900">{student.score}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase mb-2">Attendance</p>
          <p className="text-2xl font-bold font-mono text-gray-900">
            {student.attendance.attended}/{student.attendance.total}
          </p>
          <p className="text-xs text-gray-400">check-ins attended</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Check-in notes</h4>
          {ungraded.length > 0 && (
            <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-2 py-0.5">
              {ungraded.length} to grade
            </span>
          )}
        </div>

        {student.notes.length === 0 && (
          <p className="text-sm text-gray-400">No notes yet.</p>
        )}

        {student.notes.map((note) => (
          <div key={note.sessionId} className="border border-gray-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{note.date}</p>
              {note.grade ? (
                <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                  Graded · {note.grade.rating}/5
                </span>
              ) : (
                <button
                  onClick={() => setGradingNote(note)}
                  className="text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-200 transition-colors"
                >
                  Grade
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-700">Agenda:</span> {note.agendaRecap}</p>
              <p><span className="font-medium text-gray-700">Action items:</span> {note.actionItems}</p>
              <p><span className="font-medium text-gray-700">Reflection:</span> {note.reflection}</p>
            </div>

            {note.grade && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800">
                <span className="font-medium">Feedback:</span> {note.grade.feedback}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorView() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const ungradedCount = MENTOR_COHORT.students.reduce(
    (acc, s) => acc + s.notes.filter((n) => !n.grade).length,
    0
  );

  return (
    <div className="space-y-6">
      <DemoBanner />

      {selectedStudent ? (
        <StudentDetailView student={selectedStudent} onBack={() => setSelectedStudent(null)} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Mentor Dashboard</h2>
            <span className="text-xs text-gray-400">{MENTOR_COHORT.name}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Students", value: "5" },
              { label: "Green", value: "3", color: "text-green-700" },
              { label: "Yellow", value: "1", color: "text-yellow-600" },
              { label: "Red", value: "1", color: "text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold font-mono ${stat.color ?? "text-gray-900"}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">My Cohort</h3>
              {ungradedCount > 0 && (
                <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                  {ungradedCount} to grade
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {MENTOR_COHORT.students.map((s) => {
                const pending = s.notes.filter((n) => !n.grade).length;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="w-full flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">
                        {s.venture} · {s.attendance.attended}/{s.attendance.total} check-ins
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {pending > 0 && (
                        <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                          {pending} to grade
                        </span>
                      )}
                      <TrafficLight label={s.label} score={s.score} size="sm" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Check-in Sessions</h3>
            <div className="divide-y divide-gray-100">
              {MENTOR_SESSIONS.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{s.date}</p>
                      {s.upcoming && (
                        <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded px-1.5 py-0.5">
                          Upcoming
                        </span>
                      )}
                    </div>
                    {s.note && <p className="text-xs text-gray-400">{s.note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {s.attendanceSubmitted ? (
                      <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                        Attendance logged
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 opacity-60 cursor-not-allowed">
                        Log attendance
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Admin view ────────────────────────────────────────────────────────────────

function AdminView() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const students = MENTOR_COHORT.students;
  const green  = students.filter((s) => s.label === "GREEN").length;
  const yellow = students.filter((s) => s.label === "YELLOW").length;
  const red    = students.filter((s) => s.label === "RED").length;

  const clearDetail = () => setSelectedStudent(null);

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <DemoBanner />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {MENTOR_COHORT.name} · {selectedStudent.venture}{" "}
              <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 ml-1">{selectedStudent.category}</span>
            </p>
          </div>
          <button onClick={clearDetail} className="text-sm text-gray-500 hover:text-gray-900">Back</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Trust Score</h3>
            <div className="flex items-center gap-3 mb-4">
              <TrafficLight label={selectedStudent.label} size="lg" />
              <span className="text-3xl font-bold font-mono text-gray-900">{selectedStudent.score}</span>
            </div>
            <p className="text-xs text-gray-400">Score breakdown available after 3+ months of data.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Attendance</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-mono text-gray-900">
                {Math.round((selectedStudent.attendance.attended / selectedStudent.attendance.total) * 100)}%
              </span>
              <span className="text-sm text-gray-500">
                {selectedStudent.attendance.attended} of {selectedStudent.attendance.total} sessions
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Graduation Status</h3>
            <span className="text-xs font-semibold rounded-full px-2.5 py-1 border bg-gray-100 border-gray-200 text-gray-600">
              INELIGIBLE
            </span>
          </div>
          <p className="text-xs text-gray-400">Actions (schedule interview, release tranche 2, etc.) are disabled in demo mode.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DemoBanner />

      <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Needs attention */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Needs Attention</h3>
          {students.filter((s) => s.label === "RED").length === 0 ? (
            <p className="text-sm text-gray-400">No students in RED.</p>
          ) : (
            <ul className="space-y-2">
              {students.filter((s) => s.label === "RED").map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="font-medium text-gray-900 hover:underline text-left"
                    >
                      {s.name}
                    </button>
                    <span className="text-gray-400 ml-1">· {MENTOR_COHORT.name}</span>
                  </div>
                  <TrafficLight label={s.label} score={s.score} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions due */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Actions Due</h3>
          <ul className="space-y-3 text-sm divide-y divide-gray-50">
            <li className="pt-2 first:pt-0 flex items-center justify-between">
              <span className="text-gray-900 font-medium">P&L reviews pending</span>
              <span className="font-mono font-medium text-gray-900 bg-gray-100 rounded px-2 py-0.5 text-xs">3</span>
            </li>
            <li className="pt-2 text-gray-600">
              Next check-in: {MENTOR_COHORT.name} — Apr 2, 2027
            </li>
            <li className="pt-2 text-gray-600">
              1 student in RED — review required
            </li>
          </ul>
        </div>
      </div>

      {/* All students */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">All Students — {MENTOR_COHORT.name}</h3>
        <div className="flex flex-wrap gap-3">
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
            >
              <span className="text-xs text-gray-600 font-medium">{s.name.slice(0, 10)}</span>
              <TrafficLight label={s.label} score={s.score} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: String(students.length) },
          { label: "Green",  value: String(green),  color: "text-green-700" },
          { label: "Yellow", value: String(yellow), color: "text-yellow-600" },
          { label: "Red",    value: String(red),    color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold font-mono ${stat.color ?? "text-gray-900"}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Role = "student" | "mentor" | "admin";

const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: "student", label: "Student", desc: "Track your trust score, submit reflections, and monitor graduation progress." },
  { id: "mentor",  label: "Mentor",  desc: "View your cohort, grade check-in notes, and track attendance." },
  { id: "admin",   label: "Admin",   desc: "Oversee all cohorts, flag at-risk students, and manage the program." },
];

export default function DemoPage() {
  const [role, setRole] = useState<Role>("student");

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      <PublicNav />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-[0.15em] mb-3">Interactive Demo</p>
          <h1 className="text-3xl font-light text-gray-900 mb-2">See Mujin in action.</h1>
          <p className="text-gray-500 text-sm max-w-lg">
            Explore the platform from every angle — no login required. Select a role to see what each participant experiences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
            <div className="md:sticky md:top-28 space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    role === r.id
                      ? "bg-gray-900 border-gray-900 text-white"
                      : "bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className={`text-xs mt-0.5 leading-snug ${role === r.id ? "text-white/60" : "text-gray-400"}`}>
                    {r.desc}
                  </p>
                </button>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 leading-relaxed">
                  All data is sample data. No real student information is displayed.
                </p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {role === "student" && <StudentView />}
            {role === "mentor"  && <MentorView />}
            {role === "admin"   && <AdminView />}
          </main>
        </div>
      </div>
    </div>
  );
}
