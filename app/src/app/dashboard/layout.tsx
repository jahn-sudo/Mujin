"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { loadSession, clearSession, type AuthSession } from "@/lib/auth/client";
import "@/lib/i18n/config";
import { useTranslation } from "react-i18next";
import i18n, { LANG_KEY } from "@/lib/i18n/config";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    setReady(true);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  function toggleLanguage() {
    const next = i18n.language === "en" ? "ja" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem(LANG_KEY, next);
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-sm text-gray-400">{t("common.loading")}</div>
      </div>
    );
  }

  const isAdmin = session && ["STAFF", "ORG_ADMIN", "SUPER_ADMIN"].includes(session.role);
  const isStudent = session?.role === "STUDENT";
  const isMentor = session?.role === "MENTOR";

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-base font-semibold tracking-tight text-gray-900">
              Mujin
            </Link>
            {isStudent && (
              <>
                <NavLink href="/dashboard/student" pathname={pathname}>{t("nav.dashboard")}</NavLink>
                <NavLink href="/dashboard/student/inbox" pathname={pathname}>{t("nav.inbox")}</NavLink>
                <NavLink href="/dashboard/student/demo" pathname={pathname}>
                  <span className="text-amber-600">[TEST]</span>
                </NavLink>
              </>
            )}
            {isMentor && (
              <>
                <NavLink href="/dashboard/mentor" pathname={pathname}>{t("nav.dashboard")}</NavLink>
              </>
            )}
            {isAdmin && (
              <>
                <NavLink href="/dashboard/admin" pathname={pathname}>{t("nav.dashboard")}</NavLink>
                <NavLink href="/dashboard/admin/pl-reviews" pathname={pathname}>{t("nav.plReviews")}</NavLink>
                <NavLink href="/dashboard/admin/demo" pathname={pathname}>
                  <span className="text-amber-600">[TEST]</span>
                </NavLink>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 rounded px-2 py-1"
            >
              {t("nav.langToggle")}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        active ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}
