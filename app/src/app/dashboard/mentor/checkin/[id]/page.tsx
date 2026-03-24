"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface Grade { rating: number; feedback: string; gradedAt: string; }
interface Note {
  id: string;
  agendaRecap: string;
  actionItems: string;
  reflection: string;
  submittedAt: string;
  grade: Grade | null;
  studentProfile: { id: string; user: { email: string } };
}
interface PendingStudent { id: string; user: { email: string } }
interface SessionData {
  session: { id: string; date: string; note: string | null };
  notes: Note[];
  pendingStudents: PendingStudent[];
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`text-2xl transition-colors ${s <= value ? "text-yellow-500" : "text-gray-200 hover:text-yellow-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function GradeForm({ noteId, sessionId, existingGrade, onGraded }: {
  noteId: string; sessionId: string; existingGrade: Grade | null; onGraded: () => void;
}) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(existingGrade?.rating ?? 0);
  const [feedback, setFeedback] = useState(existingGrade?.feedback ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError(t("mentor.checkin.ratingRequired")); return; }
    setError(null);
    setSubmitting(true);
    const session = loadSession();
    if (!session) return;
    const res = await apiFetch(
      `/api/mentor/checkin-sessions/${sessionId}/notes/${noteId}/grade`,
      { method: "POST", body: JSON.stringify({ rating, feedback }) },
      session
    );
    setSubmitting(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? t("common.error")); return; }
    setOpen(false);
    onGraded();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
          existingGrade
            ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
            : "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        {existingGrade
          ? t("mentor.checkin.gradedBtn").replace("{{rating}}", String(existingGrade.rating))
          : t("mentor.checkin.gradeBtn")}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-gray-100 pt-4 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1">{t("mentor.checkin.rating")}</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1">{t("mentor.checkin.feedbackLabel")}</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          placeholder={t("mentor.checkin.feedbackPlaceholder")}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
          {submitting ? t("common.saving") : existingGrade ? t("mentor.checkin.updateGrade") : t("mentor.checkin.saveGrade")}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}

export default function MentorCheckInNotesPage() {
  const { id: sessionId } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    const session = loadSession();
    if (!session) return;
    apiFetch(`/api/mentor/checkin-sessions/${sessionId}/notes`, {}, session)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(t("mentor.checkin.error")));
  }

  useEffect(() => { load(); }, [sessionId]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  const { session, notes, pendingStudents } = data;
  const locale = i18n.language === "ja" ? "ja-JP" : "en-US";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("mentor.checkin.title")}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(session.date).toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" })}
            {session.note && <span className="ml-2 text-gray-400">· {session.note}</span>}
          </p>
        </div>
        <Link href="/dashboard/mentor" className="text-sm text-gray-500 hover:text-gray-900">{t("common.back")}</Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("mentor.checkin.submitted"), value: notes.length },
          { label: t("mentor.checkin.graded"), value: notes.filter((n) => n.grade).length },
          { label: t("mentor.checkin.pending"), value: pendingStudents.length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold font-mono text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
          {t("mentor.checkin.noNotes")}
        </div>
      )}

      {notes.map((note) => (
        <div key={note.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {note.studentProfile.user.email.split("@")[0]}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {t("mentor.checkin.submittedOn", {
                  date: new Date(note.submittedAt).toLocaleDateString(locale),
                })}
              </span>
            </div>
            <GradeForm noteId={note.id} sessionId={sessionId} existingGrade={note.grade} onGraded={load} />
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t("mentor.checkin.agendaRecap")}</p>
              <p className="text-gray-800 whitespace-pre-wrap">{note.agendaRecap}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t("mentor.checkin.actionItems")}</p>
              <p className="text-gray-800 whitespace-pre-wrap">{note.actionItems}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t("mentor.checkin.reflection")}</p>
              <p className="text-gray-800 whitespace-pre-wrap">{note.reflection}</p>
            </div>
          </div>
        </div>
      ))}

      {pendingStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-medium text-amber-800 mb-2">{t("mentor.checkin.notSubmitted")}</h3>
          <ul className="space-y-1">
            {pendingStudents.map((s) => (
              <li key={s.id} className="text-sm text-amber-700">{s.user.email.split("@")[0]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
