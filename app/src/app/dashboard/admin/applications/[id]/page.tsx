"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WAITLISTED";

interface Application {
  id: string;
  fullName: string;
  email: string;
  university: string;
  nationality: string;
  ventureCategory: string;
  ventureCategoryOther: string | null;
  ventureName: string;
  ventureDescription: string;
  japanPainPoint: string;
  faithMotivation: string;
  status: ApplicationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  reviewedBy: { id: string; email: string } | null;
  appliedAt: string;
  syncedAt: string;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WAITLISTED: "bg-blue-100 text-blue-800",
};

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function loadApplication() {
    const session = loadSession();
    if (!session) return;
    setLoading(true);
    apiFetch(`/api/admin/applications/${id}`, {}, session)
      .then((r) => {
        if (!r.ok) throw new Error("Application not found");
        return r.json();
      })
      .then((data) => setApp(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadApplication();
  }, [id]);

  async function handleReview(action: "ACCEPTED" | "REJECTED" | "WAITLISTED") {
    const session = loadSession();
    if (!session || !app) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const r = await apiFetch(
        `/api/admin/applications/${id}/review`,
        { method: "POST", body: JSON.stringify({ action, note: note.trim() || undefined }) },
        session
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Review failed");
      setApp((prev) => (prev ? { ...prev, ...data.application } : prev));
      setNote("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Review failed");
    } finally {
      setSubmitting(false);
    }
  }

  function ventureCategoryLabel(cat: string, other: string | null) {
    if (cat === "OTHER" && other) return `Other — ${other}`;
    return cat.replace(/_/g, " ");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        {t("applicationDetail.loading")}
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error ?? "Application not found"}
      </div>
    );
  }

  const isPending = app.status === "PENDING";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard/admin/applications")}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 block"
        >
          {t("applicationDetail.back")}
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{app.fullName}</h1>
            <p className="text-sm text-gray-500">{app.email}</p>
          </div>
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[app.status]}`}>
            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column — profile + review panel */}
          <div className="md:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">{t("applicationDetail.applicant")}</h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">{t("applicationDetail.university")}</dt>
                  <dd className="text-gray-800">{app.university}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">{t("applicationDetail.nationality")}</dt>
                  <dd className="text-gray-800">{app.nationality}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">{t("applicationDetail.applied")}</dt>
                  <dd className="text-gray-800">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Venture card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">{t("applicationDetail.venture")}</h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">{t("applicationDetail.ventureName")}</dt>
                  <dd className="text-gray-800 font-medium">{app.ventureName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">{t("applicationDetail.category")}</dt>
                  <dd className="text-gray-800">
                    {ventureCategoryLabel(app.ventureCategory, app.ventureCategoryOther)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">{t("applicationDetail.description")}</dt>
                  <dd className="text-gray-700 text-xs leading-relaxed">{app.ventureDescription}</dd>
                </div>
              </dl>
            </div>

            {/* Review panel */}
            {isPending ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  {t("applicationDetail.reviewDecision")}
                </h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("applicationDetail.notePlaceholder")}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-3 resize-none"
                />
                {actionError && (
                  <p className="text-xs text-red-500 mb-3">{actionError}</p>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleReview("ACCEPTED")}
                    disabled={submitting}
                    className="w-full py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                  >
                    {t("applicationDetail.accept")}
                  </button>
                  <button
                    onClick={() => handleReview("WAITLISTED")}
                    disabled={submitting}
                    className="w-full py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t("applicationDetail.waitlist")}
                  </button>
                  <button
                    onClick={() => handleReview("REJECTED")}
                    disabled={submitting}
                    className="w-full py-2 text-sm bg-white text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t("applicationDetail.reject")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  {t("applicationDetail.reviewRecord")}
                </h2>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-gray-400">{t("applicationDetail.decision")}</dt>
                    <dd>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[app.status]}`}>
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </dd>
                  </div>
                  {app.reviewedAt && (
                    <div>
                      <dt className="text-xs text-gray-400">{t("applicationDetail.reviewed")}</dt>
                      <dd className="text-gray-700">
                        {new Date(app.reviewedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                  {app.reviewedBy && (
                    <div>
                      <dt className="text-xs text-gray-400">{t("applicationDetail.reviewer")}</dt>
                      <dd className="text-gray-700">{app.reviewedBy.email}</dd>
                    </div>
                  )}
                  {app.reviewNote && (
                    <div>
                      <dt className="text-xs text-gray-400">{t("applicationDetail.note")}</dt>
                      <dd className="text-gray-700 text-xs leading-relaxed">{app.reviewNote}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>

          {/* Right column — statements */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                {t("applicationDetail.japanPainPoint")}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {app.japanPainPoint}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                {t("applicationDetail.faithMotivation")}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {app.faithMotivation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
