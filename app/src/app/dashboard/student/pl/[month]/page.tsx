"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";

interface PLSubmission {
  id: string;
  month: string;
  revenue: number | null;
  expenses: number | null;
  net: number | null;
  notes: string | null;
  receiptUrls: string[];
  autoScore: number | null;
  finalScore: number | null;
  status: string;
  submittedAt: string | null;
}

export default function PLFormPage() {
  const { month } = useParams<{ month: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [submission, setSubmission] = useState<PLSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    apiFetch(`/api/student/pl-submissions/${month}`, {}, session)
      .then((r) => r.json())
      .then((data) => {
        setSubmission(data);
        if (data.status !== "PENDING") {
          setRevenue(String(data.revenue ?? ""));
          setExpenses(String(data.expenses ?? ""));
          setNotes(data.notes ?? "");
        }
      })
      .catch(() => setError(t("student.pl.error")))
      .finally(() => setLoading(false));
  }, [month]);

  const net =
    revenue !== "" && expenses !== ""
      ? Number(revenue) - Number(expenses)
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const session = loadSession();
    if (!session) return;

    const res = await apiFetch(
      `/api/student/pl-submissions/${month}`,
      {
        method: "POST",
        body: JSON.stringify({
          revenue: Number(revenue),
          expenses: Number(expenses),
          notes: notes || undefined,
        }),
      },
      session
    );

    const body = await res.json();
    if (!res.ok) {
      setSubmitError(body.error ?? t("student.pl.error"));
      setSubmitting(false);
      return;
    }

    setSubmission(body);
    setSubmitting(false);
    router.push("/dashboard/student");
  }

  if (loading) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!submission) return <p className="text-sm text-gray-500">{t("student.pl.noSubmission")}</p>;

  const displayMonth = new Date(month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isSubmitted = submission.status !== "PENDING";

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("student.pl.title")}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{displayMonth}</p>
      </div>

      {isSubmitted && (
        <div className="border border-green-200 bg-green-50 rounded-xl px-4 py-3">
          <p className="text-sm text-green-700 font-medium">
            ✅ {t("student.pl.submitted", { status: submission.status })}
          </p>
          {submission.finalScore !== null && (
            <p className="text-sm text-green-600 mt-0.5">
              {t("student.pl.completeness", { score: submission.finalScore })}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <Field label={t("student.pl.revenue")} required>
            <input
              type="number"
              min={0}
              required
              disabled={isSubmitted}
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="0"
            />
          </Field>

          <Field label={t("student.pl.expenses")} required>
            <input
              type="number"
              min={0}
              required
              disabled={isSubmitted}
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="0"
            />
          </Field>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{t("student.pl.net")}</span>
            <span className={`font-mono font-medium ${net !== null && net >= 0 ? "text-green-700" : "text-red-600"}`}>
              {net !== null ? `¥${net.toLocaleString()}` : t("common.noData")}
            </span>
          </div>

          <Field label={t("student.pl.notes")}>
            <textarea
              disabled={isSubmitted}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
              placeholder={t("student.pl.notesPlaceholder")}
            />
          </Field>

          {!isSubmitted && Number(expenses) >= 50000 && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⚠ {t("student.pl.receiptWarning")}
            </div>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        {!isSubmitted && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {submitting ? t("student.pl.submitting") : t("student.pl.submit")}
          </button>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
