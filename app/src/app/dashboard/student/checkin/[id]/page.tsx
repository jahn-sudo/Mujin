"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface Grade {
  rating: number;
  feedback: string;
  gradedAt: string;
}

interface ExistingNote {
  id: string;
  agendaRecap: string;
  actionItems: string;
  reflection: string;
  submittedAt: string;
  grade: Grade | null;
}

export default function CheckInNotePage() {
  const { id: sessionId } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [existing, setExisting] = useState<ExistingNote | null>(null);
  const [agendaRecap, setAgendaRecap] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    apiFetch(`/api/student/checkin-sessions/${sessionId}/notes`, {}, session)
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setExisting(data);
          setAgendaRecap(data.agendaRecap);
          setActionItems(data.actionItems);
          setReflection(data.reflection);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const session = loadSession();
    if (!session) return;

    const res = await apiFetch(
      `/api/student/checkin-sessions/${sessionId}/notes`,
      { method: "POST", body: JSON.stringify({ agendaRecap, actionItems, reflection }) },
      session
    );
    const body = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      if (res.status === 409) setError(t("student.checkin.locked"));
      else setError(body.error ?? t("common.error"));
      return;
    }
    setExisting(body);
    setSaved(true);
    setTimeout(() => router.push("/dashboard/student"), 1500);
  }

  if (loading) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  const isLocked = !!existing?.grade;
  const locale = i18n.language === "ja" ? "ja-JP" : "en-US";

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("student.checkin.title")}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLocked
              ? t("student.checkin.statusLocked")
              : existing
              ? t("student.checkin.statusEdit")
              : t("student.checkin.statusNew")}
          </p>
        </div>
        <Link href="/dashboard/student" className="text-sm text-gray-500 hover:text-gray-900">
          {t("common.back")}
        </Link>
      </div>

      {existing?.grade && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-900">{t("student.checkin.mentorFeedback")}</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-lg ${s <= existing.grade!.rating ? "text-yellow-500" : "text-gray-200"}`}>★</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-blue-800">{existing.grade.feedback}</p>
          <p className="text-xs text-blue-400">
            {t("student.checkin.gradedOn", {
              date: new Date(existing.grade.gradedAt).toLocaleDateString(locale),
            })}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-900">{t("student.checkin.agenda")}</label>
            <p className="text-xs text-gray-500 mt-0.5">{t("student.checkin.agendaHelp")}</p>
          </div>
          <textarea
            value={agendaRecap}
            onChange={(e) => setAgendaRecap(e.target.value)}
            disabled={isLocked}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none disabled:bg-gray-50 disabled:text-gray-500"
            placeholder={t("student.checkin.agendaPlaceholder")}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-900">{t("student.checkin.actions")}</label>
            <p className="text-xs text-gray-500 mt-0.5">{t("student.checkin.actionsHelp")}</p>
          </div>
          <textarea
            value={actionItems}
            onChange={(e) => setActionItems(e.target.value)}
            disabled={isLocked}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none disabled:bg-gray-50 disabled:text-gray-500"
            placeholder={t("student.checkin.actionsPlaceholder")}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-900">{t("student.checkin.reflection")}</label>
            <p className="text-xs text-gray-500 mt-0.5">{t("student.checkin.reflectionHelp")}</p>
          </div>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            disabled={isLocked}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none disabled:bg-gray-50 disabled:text-gray-500"
            placeholder={t("student.checkin.reflectionPlaceholder")}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        {saved && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {t("student.checkin.saved")}
          </p>
        )}

        {!isLocked && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {submitting
              ? t("common.saving")
              : existing
              ? t("student.checkin.updateNotes")
              : t("student.checkin.submitNotes")}
          </button>
        )}
      </form>
    </div>
  );
}
