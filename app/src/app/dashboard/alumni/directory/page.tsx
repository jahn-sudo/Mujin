"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

interface AlumniEntry {
  id: string;
  email: string;
  studentProfile: {
    ventureCategory: string | null;
    cohort: { name: string } | null;
    ventureProfile: { name: string; description: string } | null;
    graduationRecord: {
      bankIntroDate: string | null;
      bankIntroTracking: {
        firstMeetingOutcome: string | null;
        accountOpenedAt: string | null;
        loanSecuredAt: string | null;
        businessManagerVisaAt: string | null;
      } | null;
    } | null;
  } | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  FINTECH: "Fintech",
  EDTECH: "EdTech",
  HEALTHTECH: "HealthTech",
  SOCIAL_ENTERPRISE: "Social Enterprise",
  ECOMMERCE: "E-Commerce",
  FOOD_BEVERAGE: "Food & Beverage",
  CREATIVE_MEDIA: "Creative / Media",
  OTHER: "Other",
};

function MilestoneDot({ met }: { met: boolean }) {
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full border ${
        met ? "bg-green-500 border-green-600" : "bg-gray-100 border-gray-200"
      }`}
    />
  );
}

export default function AlumniDirectory() {
  const { t } = useTranslation();
  const [alumni, setAlumni] = useState<AlumniEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    apiFetch("/api/alumni/directory", {}, session)
      .then((r) => r.json())
      .then((d) => setAlumni(d.alumni ?? []))
      .catch(() => setError(t("alumni.directory.error")));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("alumni.directory.title")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {alumni.length !== 1
              ? t("alumni.directory.graduates_other", { count: alumni.length })
              : t("alumni.directory.graduates_one", { count: alumni.length })}
          </p>
        </div>
        <Link
          href="/dashboard/alumni"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          {t("alumni.directory.back")}
        </Link>
      </div>

      {/* Milestone legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <MilestoneDot met={true} />
          <span>{t("alumni.directory.milestoneMet")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MilestoneDot met={false} />
          <span>{t("alumni.directory.milestoneInProgress")}</span>
        </div>
      </div>

      {alumni.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">{t("alumni.directory.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alumni.map((a) => {
            const p = a.studentProfile;
            const grad = p?.graduationRecord;
            const tracking = grad?.bankIntroTracking;

            return (
              <div
                key={a.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
              >
                {/* Venture name + category */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {p?.ventureProfile?.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p?.cohort?.name ?? "—"}
                    </p>
                  </div>
                  {p?.ventureCategory && (
                    <span className="text-[11px] bg-gray-100 text-gray-500 rounded px-2 py-0.5 shrink-0">
                      {CATEGORY_LABELS[p.ventureCategory] ?? p.ventureCategory}
                    </span>
                  )}
                </div>

                {/* Description */}
                {p?.ventureProfile?.description && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {p.ventureProfile.description}
                  </p>
                )}

                {/* Graduation date */}
                {grad?.bankIntroDate && (
                  <p className="text-xs text-green-700 mb-3">
                    {t("alumni.directory.graduated", { date: new Date(grad.bankIntroDate).toLocaleDateString() })}
                  </p>
                )}

                {/* Milestone dots */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">{t("alumni.directory.journey")}</span>
                  <div className="flex items-center gap-2">
                    {[
                      { key: "intro", label: t("alumni.directory.milestoneIntro"), met: !!grad?.bankIntroDate },
                      { key: "meeting", label: t("alumni.directory.milestoneMeeting"), met: tracking?.firstMeetingOutcome === "COMPLETED" },
                      { key: "account", label: t("alumni.directory.milestoneAccount"), met: !!tracking?.accountOpenedAt },
                      { key: "loan", label: t("alumni.directory.milestoneLoan"), met: !!tracking?.loanSecuredAt },
                      { key: "visa", label: t("alumni.directory.milestoneVisa"), met: !!tracking?.businessManagerVisaAt },
                    ].map(({ key, label, met }) => (
                      <div key={key} className="flex items-center gap-1" title={label}>
                        <MilestoneDot met={met} />
                        <span className="text-[10px] text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
