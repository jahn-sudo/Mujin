"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WAITLISTED";

interface ApplicationSummary {
  id: string;
  fullName: string;
  email: string;
  university: string;
  nationality: string;
  ventureCategory: string;
  ventureCategoryOther: string | null;
  ventureName: string;
  status: ApplicationStatus;
  appliedAt: string;
  syncedAt: string;
}

interface SyncResult {
  synced: number;
  created: number;
  updated: number;
  lastSyncedAt: string;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WAITLISTED: "bg-blue-100 text-blue-800",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState("");
  const [sheetIdInput, setSheetIdInput] = useState("");
  const [savingSheet, setSavingSheet] = useState(false);
  const [showSheetConfig, setShowSheetConfig] = useState(false);

  const STATUS_FILTERS = [
    { label: t("applications.filterAll"), value: "" },
    { label: t("applications.filterPending"), value: "PENDING" },
    { label: t("applications.filterAccepted"), value: "ACCEPTED" },
    { label: t("applications.filterWaitlisted"), value: "WAITLISTED" },
    { label: t("applications.filterRejected"), value: "REJECTED" },
  ];

  function loadApplications(pg = page, status = statusFilter, q = search) {
    const session = loadSession();
    if (!session) return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(pg) });
    if (status) params.set("status", status);
    if (q) params.set("search", q);
    apiFetch(`/api/admin/applications?${params}`, {}, session)
      .then((r) => {
        if (!r.ok) throw new Error(t("applications.loading"));
        return r.json();
      })
      .then((data) => {
        setApplications(data.applications);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  function loadSheetConfig() {
    const session = loadSession();
    if (!session) return;
    apiFetch("/api/admin/sheet-config", {}, session)
      .then((r) => r.json())
      .then((data) => {
        if (data.sheetId) {
          setSheetId(data.sheetId);
          setSheetIdInput(data.sheetId);
        }
      });
  }

  useEffect(() => {
    loadApplications(1, statusFilter, search);
    loadSheetConfig();
  }, []);

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
    loadApplications(1, value, search);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    loadApplications(1, statusFilter, searchInput);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    loadApplications(newPage, statusFilter, search);
  }

  async function handleSync() {
    const session = loadSession();
    if (!session) return;
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    try {
      const r = await apiFetch("/api/admin/applications/sync", { method: "POST" }, session);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Sync failed");
      setSyncResult(data);
      loadApplications(1, statusFilter, search);
      setPage(1);
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function handleSaveSheetId(e: React.FormEvent) {
    e.preventDefault();
    const session = loadSession();
    if (!session) return;
    setSavingSheet(true);
    try {
      const r = await apiFetch(
        "/api/admin/sheet-config",
        { method: "POST", body: JSON.stringify({ sheetId: sheetIdInput }) },
        session
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Save failed");
      setSheetId(data.sheetId);
      setShowSheetConfig(false);
    } finally {
      setSavingSheet(false);
    }
  }

  function ventureCategoryLabel(cat: string, other: string | null) {
    if (cat === "OTHER" && other) return `Other: ${other}`;
    return cat.replace(/_/g, " ");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("applications.title")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {total} {t("applications.title").toLowerCase()}
              {statusFilter ? ` · ${statusFilter.toLowerCase()}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSheetConfig(!showSheetConfig)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              {sheetId ? `⚙ ${t("applications.sheetConfig")}` : `⚙ ${t("applications.connectSheet")}`}
            </button>
            <button
              onClick={handleSync}
              disabled={syncing || !sheetId}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {syncing ? t("applications.syncing") : `↻ ${t("applications.syncFromSheet")}`}
            </button>
          </div>
        </div>

        {/* Sheet config panel */}
        {showSheetConfig && (
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{t("applications.sheetConfigTitle")}</h2>
            <p className="text-xs text-gray-500 mb-3">{t("applications.sheetConfigBody")}</p>
            <form onSubmit={handleSaveSheetId} className="flex gap-2">
              <input
                type="text"
                value={sheetIdInput}
                onChange={(e) => setSheetIdInput(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                disabled={savingSheet || !sheetIdInput.trim()}
                className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {savingSheet ? t("applications.saving") : t("applications.save")}
              </button>
            </form>
            {sheetId && (
              <p className="text-xs text-green-600 mt-2">{t("applications.connected", { id: sheetId })}</p>
            )}
          </div>
        )}

        {/* Sync feedback */}
        {syncResult && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            {t("applications.syncComplete", { synced: syncResult.synced, created: syncResult.created, updated: syncResult.updated })}
          </div>
        )}
        {syncError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {t("applications.syncError", { error: syncError })}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex gap-1 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleStatusFilter(f.value)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  statusFilter === f.value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("applications.searchPlaceholder")}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md w-56"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              {t("applications.search")}
            </button>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">{t("applications.loading")}</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {t("applications.noApplications")}{" "}
            {!sheetId && t("applications.connectPrompt")}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("applications.colApplicant")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("applications.colUniversity")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("applications.colVenture")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("applications.colCategory")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("applications.colApplied")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("applications.colStatus")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => router.push(`/dashboard/admin/applications/${app.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.university}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.ventureName}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {ventureCategoryLabel(app.ventureCategory, app.ventureCategoryOther)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[app.status]}`}>
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-40"
            >
              {t("applications.prev")}
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-40"
            >
              {t("applications.next")}
            </button>
          </div>
        )}

        {/* Back */}
        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/admin")}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            {t("applications.backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}
