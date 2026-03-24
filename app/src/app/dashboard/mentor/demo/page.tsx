"use client";

import { useState } from "react";
import Link from "next/link";
import { TrafficLight } from "@/components/ui/TrafficLight";
import { useTranslation } from "react-i18next";

const COHORT = {
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
          grade: { rating: 5, feedback: "Outstanding self-awareness. Action items are specific and measurable. Keep this up." },
        },
        {
          sessionId: "cs2", date: "2027-03-05",
          agendaRecap: "Revenue model review — freemium vs. subscription.",
          actionItems: "Model out 12-month revenue for both options. Present comparison next session.",
          reflection: "Struggling to decide on pricing. I need to talk to more hospitals before committing.",
          grade: null,
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

const SESSIONS = [
  { id: "cs3", date: "2027-04-02", note: "Q2 kickoff check-in", attendanceSubmitted: false, upcoming: true },
  { id: "cs1", date: "2027-03-19", note: "March mid-month", attendanceSubmitted: true, upcoming: false },
  { id: "cs2", date: "2027-03-05", note: "March early check-in", attendanceSubmitted: true, upcoming: false },
];

type Student = typeof COHORT.students[0];
type Note = Student["notes"][0];

function DemoBanner() {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Demo</span>
      <p className="text-sm text-gray-500">{t("demo.banner")}</p>
    </div>
  );
}

function GradePanel({ note, onClose }: { note: Note; onClose: () => void }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
        <p className="text-sm font-medium text-green-800">{t("demo.mentor.gradeSubmitted")}</p>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">
          {t("common.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">{t("mentor.checkin.rating")} — {note.date}</h4>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700">
          {t("common.back")}
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">{t("mentor.checkin.agendaRecap")}</p>
          <p>{note.agendaRecap}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">{t("mentor.checkin.actionItems")}</p>
          <p>{note.actionItems}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">{t("mentor.checkin.reflection")}</p>
          <p>{note.reflection}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{t("mentor.checkin.rating")}</p>
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
        <p className="text-sm font-medium text-gray-700 mb-2">{t("mentor.checkin.feedbackLabel")}</p>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t("mentor.checkin.feedbackPlaceholder")}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={rating === 0 || feedback.trim().length === 0}
          onClick={() => setSubmitted(true)}
          className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          {t("mentor.checkin.saveGrade")}
        </button>
        <p className="text-xs text-gray-400">{t("demo.notSaved")}</p>
      </div>
    </div>
  );
}

function StudentDetail({ student, onBack }: { student: Student; onBack: () => void }) {
  const { t } = useTranslation();
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
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">
          {t("common.back")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase mb-2">{t("student.dashboard.trustScore")}</p>
          <div className="flex items-center gap-2">
            <TrafficLight label={student.label} score={student.score} size="sm" />
            <span className="text-2xl font-bold font-mono text-gray-900">{student.score}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase mb-2">{t("admin.studentDetail.attendance")}</p>
          <p className="text-2xl font-bold font-mono text-gray-900">
            {student.attendance.attended}/{student.attendance.total}
          </p>
          <p className="text-xs text-gray-400">{t("mentor.checkin.submitted").toLowerCase()}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("mentor.checkin.title")}</h4>
          {ungraded.length > 0 && (
            <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-2 py-0.5">
              {ungraded.length} {t("demo.mentor.toGrade")}
            </span>
          )}
        </div>

        {student.notes.length === 0 && (
          <p className="text-sm text-gray-400">{t("mentor.checkin.noNotes")}</p>
        )}

        {student.notes.map((note) => (
          <div key={note.sessionId} className="border border-gray-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{note.date}</p>
              {note.grade ? (
                <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                  {t("mentor.checkin.graded")} · {note.grade.rating}/5
                </span>
              ) : (
                <button
                  onClick={() => setGradingNote(note)}
                  className="text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-200 transition-colors"
                >
                  {t("mentor.checkin.gradeBtn")}
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-700">{t("mentor.checkin.agendaRecap")}:</span> {note.agendaRecap}</p>
              <p><span className="font-medium text-gray-700">{t("mentor.checkin.actionItems")}:</span> {note.actionItems}</p>
              <p><span className="font-medium text-gray-700">{t("mentor.checkin.reflection")}:</span> {note.reflection}</p>
            </div>

            {note.grade && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800">
                <span className="font-medium">{t("student.checkin.mentorFeedback")}:</span> {note.grade.feedback}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DemoMentorDashboard() {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const ungradedCount = COHORT.students.reduce(
    (acc, s) => acc + s.notes.filter((n) => !n.grade).length,
    0
  );

  return (
    <div className="space-y-6">
      <DemoBanner />

      {selectedStudent && (
        <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
      )}

      {!selectedStudent && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t("mentor.dashboard.title")}</h2>
            <span className="text-xs text-gray-400">{COHORT.name}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t("demo.mentor.students"), value: "5" },
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("demo.mentor.myCohort")}</h3>
              {ungradedCount > 0 && (
                <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                  {ungradedCount} {t("demo.mentor.toGrade")}
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {COHORT.students.map((s) => {
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
                        {s.venture} · {s.attendance.attended}/{s.attendance.total} {t("mentor.checkin.submitted").toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {pending > 0 && (
                        <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                          {pending} {t("demo.mentor.toGrade")}
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
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("demo.mentor.checkInSessions")}</h3>
            <div className="divide-y divide-gray-100">
              {SESSIONS.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{s.date}</p>
                      {s.upcoming && (
                        <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 rounded px-1.5 py-0.5">
                          {t("mentor.dashboard.upcoming")}
                        </span>
                      )}
                    </div>
                    {s.note && <p className="text-xs text-gray-400">{s.note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {s.attendanceSubmitted ? (
                      <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                        {t("mentor.dashboard.attendanceLogged")}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 opacity-60 cursor-not-allowed">
                        {t("mentor.dashboard.logAttendance")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="pt-2 border-t border-gray-100">
        <Link href="/dashboard/mentor" className="text-sm text-gray-400 hover:text-gray-700">
          {t("demo.backToLive")}
        </Link>
      </div>
    </div>
  );
}
