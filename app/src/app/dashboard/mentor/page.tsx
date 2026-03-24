"use client";

import { useEffect, useState } from "react";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface Session {
  id: string;
  date: string;
  note: string | null;
  attendanceSubmittedAt: string | null;
}

export default function MentorDashboard() {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [noCohort, setNoCohort] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    apiFetch("/api/mentor/checkin-sessions", {}, session)
      .then((r) => {
        if (r.status === 404) { setNoCohort(true); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => { if (data) setSessions(data); })
      .catch(() => setError(t("mentor.dashboard.error")))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (loading) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  const locale = i18n.language === "ja" ? "ja-JP" : "en-US";
  const upcoming = sessions.filter((s) => new Date(s.date) >= new Date());
  const past = sessions.filter((s) => new Date(s.date) < new Date());

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">{t("mentor.dashboard.title")}</h2>

      {noCohort && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          {t("mentor.dashboard.noCohort")}
        </div>
      )}

      {!noCohort && sessions.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-400">
          {t("mentor.dashboard.noSessions")}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("mentor.dashboard.upcoming")}</h3>
          {upcoming.map((s) => (
            <SessionRow key={s.id} session={s} locale={locale} t={t} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t("mentor.dashboard.pastSessions")}</h3>
          {past.map((s) => (
            <SessionRow key={s.id} session={s} locale={locale} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionRow({
  session: s,
  locale,
  t,
}: {
  session: { id: string; date: string; note: string | null; attendanceSubmittedAt: string | null };
  locale: string;
  t: (key: string) => string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {new Date(s.date).toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric" })}
        </p>
        {s.note && <p className="text-xs text-gray-400">{s.note}</p>}
      </div>
      <div className="flex items-center gap-3">
        {s.attendanceSubmittedAt ? (
          <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
            {t("mentor.dashboard.attendanceLogged")}
          </span>
        ) : (
          <Link
            href={`/dashboard/mentor/checkin/${s.id}/attendance`}
            className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-100"
          >
            {t("mentor.dashboard.logAttendance")}
          </Link>
        )}
        <Link
          href={`/dashboard/mentor/checkin/${s.id}`}
          className="text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-200"
        >
          {t("mentor.dashboard.viewNotes")}
        </Link>
      </div>
    </div>
  );
}
