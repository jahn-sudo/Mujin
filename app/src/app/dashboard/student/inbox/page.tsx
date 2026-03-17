"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, loadSession } from "@/lib/auth/client";
import { useTranslation } from "react-i18next";

interface Flag {
  townHallId: string;
  windowExpiresAt: string;
}

export default function InboxPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    apiFetch("/api/student/me", {}, session)
      .then((r) => r.json())
      .then((data) => {
        setFlags(data.openReflectionFlags ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-gray-400">{t("common.loading")}</div>;

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">{t("student.inbox.title")}</h2>

      {flags.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">{t("student.inbox.empty")}</p>
        </div>
      )}

      {flags.map((flag) => (
        <ReflectionFlagCard
          key={flag.townHallId}
          flag={flag}
          onResubmit={() => router.push(`/dashboard/student/townhall/${flag.townHallId}/resubmit`)}
        />
      ))}
    </div>
  );
}

function ReflectionFlagCard({
  flag,
  onResubmit,
}: {
  flag: Flag;
  onResubmit: () => void;
}) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    function update() {
      const ms = new Date(flag.windowExpiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setTimeLeft(t("student.inbox.expired"));
        return;
      }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [flag.windowExpiresAt]);

  const expired = timeLeft === t("student.inbox.expired");

  return (
    <div
      className={`border rounded-xl p-5 space-y-3 ${
        expired ? "border-gray-200 bg-gray-50" : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${expired ? "text-gray-600" : "text-red-700"}`}>
            {expired ? `⏱ ${t("student.inbox.windowClosed")}` : `🔴 ${t("student.inbox.actionRequired")}`}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">{t("student.inbox.flaggedBody")}</p>
        </div>
      </div>

      {!expired && (
        <p className={`text-sm font-mono font-medium ${expired ? "text-gray-400" : "text-red-700"}`}>
          ⏱ {t("student.inbox.windowCountdown", { time: timeLeft })}
        </p>
      )}

      <div className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
        <p>ℹ️ {t("student.inbox.privacyNote")}</p>
        <p className="mt-1">{t("student.inbox.tips")}</p>
      </div>

      {!expired && (
        <button
          onClick={onResubmit}
          className="w-full bg-red-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-800 transition-colors"
        >
          {t("student.inbox.resubmit")}
        </button>
      )}
    </div>
  );
}
