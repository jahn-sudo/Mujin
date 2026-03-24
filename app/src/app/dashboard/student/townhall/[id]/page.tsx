"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";

interface GroupMember {
  userId: string;
  email: string;
}

export default function TownHallPage() {
  const { id: townHallId } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const [cohortMembers, setCohortMembers] = useState<GroupMember[]>([]);
  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    apiFetch("/api/student/me", {}, session)
      .then((r) => r.json())
      .then(() => {
        setCohortMembers([]);
        setAttendeeIds([session.userId]);
      })
      .catch(() => setError(t("student.townhall.error")))
      .finally(() => setLoading(false));
  }, [townHallId]);

  const wordCount = reflectionText.trim().split(/\s+/).filter(Boolean).length;

  function toggleAttendee(userId: string) {
    setAttendeeIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (wordCount < 50) {
      setError(t("student.townhall.tooShort"));
      return;
    }
    setError(null);
    setSubmitting(true);

    const session = loadSession();
    if (!session) return;

    const res = await apiFetch(
      `/api/student/townhalls/${townHallId}/submit`,
      {
        method: "POST",
        body: JSON.stringify({ attendeeIds, reflectionText }),
      },
      session
    );

    const body = await res.json();
    if (!res.ok) {
      if (res.status === 409) {
        setAlreadySubmitted(true);
      } else {
        setError(body.error ?? t("student.townhall.submissionFailed"));
      }
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/student?submitted=townhall");
  }

  if (loading) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  if (alreadySubmitted) {
    return (
      <div className="max-w-lg">
        <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
          <p className="text-green-700 font-medium">{t("student.townhall.alreadyTitle")}</p>
          <p className="text-sm text-green-600 mt-1">{t("student.townhall.alreadyBody")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("student.townhall.title")}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t("student.townhall.anonymous")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <span className="font-medium">{t("student.townhall.youLabel")}</span>
            </label>

            {cohortMembers.map((member) => (
              <label key={member.userId} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendeeIds.includes(member.userId)}
                  onChange={() => toggleAttendee(member.userId)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                {member.email}
              </label>
            ))}

            {cohortMembers.length === 0 && (
              <p className="text-xs text-gray-400">{t("student.townhall.loadingMembers")}</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">{t("student.townhall.part2Title")}</h3>
          <p className="text-xs text-gray-500">{t("student.townhall.part2Help")}</p>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={6}
            required
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

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || wordCount < 50}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? t("common.submitting") : t("common.submit")}
        </button>
      </form>
    </div>
  );
}
