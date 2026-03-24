"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch, loadSession } from "@/lib/auth/client";

interface Student {
  id: string;
  userId: string;
  email: string;
  venture: string | null;
  cohortId: string | null;
  cohortName: string | null;
}

interface CohortMentor {
  assigned: boolean;
  userId?: string;
  email?: string;
}

interface Cohort {
  id: string;
  name: string;
  maxStudents: number;
  createdAt: string;
  mentor?: CohortMentor;
  members?: Student[];
}

export default function CohortsPage() {
  const { t } = useTranslation();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create cohort
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Invite mentor modal
  const [inviteMentorCohortId, setInviteMentorCohortId] = useState<string | null>(null);
  const [mentorEmail, setMentorEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Assign student
  const [assigningCohortId, setAssigningCohortId] = useState<string | null>(null);
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const session = loadSession();

  async function loadAll() {
    if (!session) return;
    setLoading(true);
    try {
      const [cohortsRes, studentsRes] = await Promise.all([
        apiFetch("/api/admin/cohorts", {}, session),
        apiFetch("/api/admin/students", {}, session),
      ]);
      const cohortsData: Cohort[] = await cohortsRes.json();
      const studentsData: Student[] = await studentsRes.json();

      // Load mentor for each cohort
      const withMentors = await Promise.all(
        cohortsData.map(async (c) => {
          const mr = await apiFetch(`/api/admin/cohorts/${c.id}/mentor`, {}, session!);
          const mentor: CohortMentor = await mr.json();
          return { ...c, mentor };
        })
      );

      setCohorts(withMentors);
      setAllStudents(studentsData);
    } catch {
      setError(t("cohorts.error"));
    } finally {
      setLoading(false);
    }
  }

  async function loadCohortMembers(cohortId: string) {
    if (!session) return;
    const res = await apiFetch(`/api/admin/cohorts/${cohortId}/members`, {}, session);
    const members: Student[] = await res.json();
    setCohorts((prev) =>
      prev.map((c) => (c.id === cohortId ? { ...c, members } : c))
    );
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleToggleExpand(cohortId: string) {
    if (expanded === cohortId) {
      setExpanded(null);
      return;
    }
    setExpanded(cohortId);
    await loadCohortMembers(cohortId);
  }

  async function handleCreateCohort(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await apiFetch("/api/admin/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }, session);
      if (!res.ok) {
        const d = await res.json();
        setCreateError(d.error ?? t("cohorts.error"));
        return;
      }
      setNewName("");
      setShowCreate(false);
      await loadAll();
    } catch {
      setCreateError(t("common.error"));
    } finally {
      setCreating(false);
    }
  }

  async function handleAssignStudent(cohortId: string) {
    if (!session || !assignStudentId) return;
    setAssigning(true);
    setAssignError(null);
    try {
      const res = await apiFetch(`/api/admin/cohorts/${cohortId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: assignStudentId }),
      }, session);
      if (!res.ok) {
        const d = await res.json();
        setAssignError(d.error ?? t("common.error"));
        return;
      }
      setAssigningCohortId(null);
      setAssignStudentId("");
      await loadAll();
      await loadCohortMembers(cohortId);
    } catch {
      setAssignError(t("common.error"));
    } finally {
      setAssigning(false);
    }
  }

  async function handleRemoveStudent(cohortId: string, studentUserId: string) {
    if (!session) return;
    await apiFetch(`/api/admin/cohorts/${cohortId}/members/${studentUserId}`, {
      method: "DELETE",
    }, session);
    await loadAll();
    await loadCohortMembers(cohortId);
  }

  async function handleInviteMentor(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !inviteMentorCohortId) return;
    setInviting(true);
    setInviteError(null);
    try {
      const res = await apiFetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mentorEmail, role: "MENTOR", cohortId: inviteMentorCohortId }),
      }, session);
      if (!res.ok) {
        const d = await res.json();
        setInviteError(d.error ?? t("common.error"));
        return;
      }
      setInviteSuccess(true);
    } catch {
      setInviteError(t("common.error"));
    } finally {
      setInviting(false);
    }
  }

  function closeInviteModal() {
    setInviteMentorCohortId(null);
    setMentorEmail("");
    setInviteError(null);
    setInviteSuccess(false);
  }

  const unassignedStudents = allStudents.filter((s) => !s.cohortId);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
        {t("cohorts.loading")}
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("cohorts.title")}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {cohorts.length} {t("cohorts.title").toLowerCase()} · {allStudents.length} {t("cohorts.students")} · {t("cohorts.unassigned", { count: unassignedStudents.length })}
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(null); }}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t("cohorts.newCohort")}
        </button>
      </div>

      {/* Create cohort form */}
      {showCreate && (
        <form onSubmit={handleCreateCohort} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-gray-900">{t("cohorts.newCohortTitle")}</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("cohorts.namePlaceholder")}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {createError && <p className="text-xs text-red-600">{createError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {creating ? t("cohorts.creating") : t("cohorts.create")}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t("cohorts.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* Cohort list */}
      {cohorts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-sm text-gray-400">{t("cohorts.noCohorts")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cohorts.map((cohort) => {
            const isExpanded = expanded === cohort.id;
            const memberCount = cohort.members?.length ?? allStudents.filter((s) => s.cohortId === cohort.id).length;
            const isFull = memberCount >= cohort.maxStudents;

            return (
              <div key={cohort.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Cohort header row */}
                <button
                  onClick={() => handleToggleExpand(cohort.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-medium text-gray-900">{cohort.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFull ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"}`}>
                      {memberCount}/{cohort.maxStudents} {t("cohorts.students")}
                    </span>
                    {cohort.mentor?.assigned ? (
                      <span className="text-xs text-gray-400">{cohort.mentor.email}</span>
                    ) : (
                      <span className="text-xs text-amber-600">{t("cohorts.noMentor")}</span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    viewBox="0 0 16 16" fill="none"
                  >
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">

                    {/* Members */}
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">{t("cohorts.members")}</p>
                      {cohort.members && cohort.members.length > 0 ? (
                        <ul className="divide-y divide-gray-50">
                          {cohort.members.map((m) => (
                            <li key={m.id} className="flex items-center justify-between py-2">
                              <div>
                                <p className="text-sm text-gray-900">{m.email}</p>
                                {m.venture && <p className="text-xs text-gray-400">{m.venture}</p>}
                              </div>
                              <button
                                onClick={() => handleRemoveStudent(cohort.id, m.userId)}
                                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                              >
                                {t("cohorts.remove")}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">{t("cohorts.noStudents")}</p>
                      )}
                    </div>

                    {/* Assign student */}
                    {!isFull && unassignedStudents.length > 0 && (
                      <div>
                        {assigningCohortId === cohort.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={assignStudentId}
                              onChange={(e) => setAssignStudentId(e.target.value)}
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <option value="">{t("cohorts.selectStudent")}</option>
                              {unassignedStudents.map((s) => (
                                <option key={s.id} value={s.userId}>
                                  {s.email}{s.venture ? ` — ${s.venture}` : ""}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignStudent(cohort.id)}
                              disabled={!assignStudentId || assigning}
                              className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                              {assigning ? t("cohorts.assigning") : t("cohorts.assign")}
                            </button>
                            <button
                              onClick={() => { setAssigningCohortId(null); setAssignStudentId(""); setAssignError(null); }}
                              className="text-xs text-gray-400 hover:text-gray-700"
                            >
                              {t("cohorts.cancel")}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setAssigningCohortId(cohort.id); setAssignError(null); }}
                            className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
                          >
                            {t("cohorts.assignStudent")}
                          </button>
                        )}
                        {assignError && assigningCohortId === cohort.id && (
                          <p className="text-xs text-red-600 mt-1">{assignError}</p>
                        )}
                      </div>
                    )}

                    {/* Mentor */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">{t("cohorts.mentorSection")}</p>
                        {cohort.mentor?.assigned ? (
                          <p className="text-sm text-gray-900">{cohort.mentor.email}</p>
                        ) : (
                          <p className="text-sm text-gray-400">{t("cohorts.noMentor")}</p>
                        )}
                      </div>
                      {!cohort.mentor?.assigned && (
                        <button
                          onClick={() => { setInviteMentorCohortId(cohort.id); setInviteError(null); setInviteSuccess(false); }}
                          className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
                        >
                          {t("cohorts.inviteMentor")}
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unassigned students panel */}
      {unassignedStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            {t("cohorts.unassigned", { count: unassignedStudents.length })}
          </p>
          <ul className="space-y-1">
            {unassignedStudents.map((s) => (
              <li key={s.id} className="text-sm text-amber-900">
                {s.email}{s.venture ? ` — ${s.venture}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Invite mentor modal */}
      {inviteMentorCohortId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            {inviteSuccess ? (
              <div className="text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">{t("cohorts.inviteSuccess", { email: mentorEmail })}</p>
                <p className="text-xs text-gray-500">{t("cohorts.inviteSuccessBody")}</p>
                <button
                  onClick={() => { closeInviteModal(); loadAll(); }}
                  className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t("cohorts.done")}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t("cohorts.inviteTitle")}</h3>
                <p className="text-sm text-gray-500 mb-5">{t("cohorts.inviteBody")}</p>
                <form onSubmit={handleInviteMentor} className="space-y-4">
                  <input
                    type="email"
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    placeholder={t("cohorts.invitePlaceholder")}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  {inviteError && <p className="text-xs text-red-600">{inviteError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={inviting}
                      className="flex-1 bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {inviting ? t("cohorts.sending") : t("cohorts.sendInvitation")}
                    </button>
                    <button
                      type="button"
                      onClick={closeInviteModal}
                      className="text-sm text-gray-500 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {t("cohorts.cancel")}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
