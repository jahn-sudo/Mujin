"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

const PLEDGE_VERSION = "1.0";

export default function PledgePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checking, setChecking] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed, skip to dashboard
  useEffect(() => {
    const session = loadSession();
    if (!session) { router.replace("/login"); return; }

    apiFetch("/api/student/pledge", {}, session)
      .then((r) => r.json())
      .then((d) => {
        if (d.signed) router.replace("/dashboard/student");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSign() {
    const session = loadSession();
    if (!session) return;
    setSigning(true);
    setError(null);
    try {
      const res = await apiFetch("/api/student/pledge", {
        method: "POST",
        body: JSON.stringify({ pledgeVersion: PLEDGE_VERSION }),
      }, session);
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.replace("/dashboard/student");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSigning(false);
    }
  }

  if (checking) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
        {t("pledge.loading")}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{t("pledge.beforeYouBegin")}</p>
        <h2 className="text-xl font-semibold text-gray-900">{t("pledge.title")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("pledge.intro")}</p>
      </div>

      {/* Pledge document */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-5 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400 uppercase tracking-widest">誓約書 · Seiyaku-sho · Pledge of Honor</p>

        <p>
          I am receiving a Venture Scholarship of <strong>¥500,000</strong> from Mujin, disbursed in two tranches,
          to support the early operations of my venture. I understand and agree to the following:
        </p>

        <ol className="list-decimal list-outside pl-5 space-y-4">
          <li>
            <strong>This is a grant, not a loan.</strong> I have no legal obligation to repay this amount.
            Mujin will not pursue repayment and does not use debt collection under any circumstances.
          </li>
          <li>
            <strong>I make a voluntary moral commitment.</strong> If my venture succeeds and I graduate to
            a partner bank introduction, I pledge to voluntarily return ¥500,000 plus a 5% success tithe
            (¥25,000) — a total of ¥525,000 — to the Mujin Mutual Aid Fund. This replenishes the fund
            for the entrepreneur behind me.
          </li>
          <li>
            <strong>The grant is for venture operations only.</strong> I will use the funds exclusively for
            legitimate early-stage business expenses: incorporation fees, tools, software, hosting, co-working,
            travel, and marketing. I will not use the grant for personal living expenses.
          </li>
          <li>
            <strong>I will participate in good faith.</strong> I will attend bi-weekly mentor check-ins,
            submit monthly P&L reports honestly, participate in peer Town Halls, and submit monthly reflections.
            I understand these signals form my Trust Score, which is the behavioral track record I bring to the bank.
          </li>
          <li>
            <strong>I understand the Trust Engine.</strong> My Trust Score is computed monthly from four signals:
            Responsiveness, Transparency, Mutualism, and Reflection. A Green score (75+) for six consecutive
            months, combined with an incorporated company and non-negative cash flow, triggers my exit
            interview and eventual bank introduction.
          </li>
          <li>
            <strong>I understand the second tranche condition.</strong> The second tranche of ¥200,000 is
            released at Month 3 only if my company is incorporated and my Trust Score was not Red at
            months 2 or 3. This tranche is earned, not automatic.
          </li>
          <li>
            <strong>I accept that my reflection is private but assessed.</strong> My monthly reflection is
            anonymous and cannot be read by Mujin staff. It is assessed by an automated system for
            meaningfulness only. I commit to writing reflections in good faith.
          </li>
        </ol>

        <p className="text-gray-500">
          This pledge is a moral commitment grounded in the spirit of <em>mujin</em> (無尽) — mutual aid,
          trust, and the belief that capital should move toward those who earn it through character, not
          just credit history. By signing, I join a community that depends on each member honoring this spirit.
        </p>

        <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          {t("pledge.version", { version: PLEDGE_VERSION })}
        </p>
      </div>

      {/* Acknowledgement */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            {t("pledge.acknowledge")}
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleSign}
          disabled={!agreed || signing}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {signing ? t("pledge.signing") : t("pledge.sign")}
        </button>
      </div>
    </div>
  );
}
