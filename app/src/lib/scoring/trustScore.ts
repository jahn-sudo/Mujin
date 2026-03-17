import { prisma } from "@/lib/prisma";
import { TrustScoreLabel } from "@/generated/prisma/enums";
import { detectEligibility } from "@/lib/graduation/detectEligibility";
import { sendRedScoreAlertEmail } from "@/lib/email";

export { TrustScoreLabel };

export interface TrustScoreResult {
  score: number;
  label: TrustScoreLabel;
  responsivenessRaw: number;
  transparencyRaw: number;
  mutualismRaw: number;
  reflectionRaw: number;
}

export function assignLabel(score: number): TrustScoreLabel {
  if (score >= 75) return TrustScoreLabel.GREEN;
  if (score >= 50) return TrustScoreLabel.YELLOW;
  return TrustScoreLabel.RED;
}

/** Returns [start, end) for the 3-month rolling window ending in `month`. */
function getRollingWindow(month: string): { start: Date; end: Date } {
  const [yearStr, moStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const mo = parseInt(moStr, 10);
  return {
    start: new Date(year, mo - 3, 1), // 2 months back, inclusive
    end: new Date(year, mo, 1),       // first of next month, exclusive
  };
}

/** Returns [start, end) for exactly the given month. */
function getMonthWindow(month: string): { start: Date; end: Date } {
  const [yearStr, moStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const mo = parseInt(moStr, 10);
  return {
    start: new Date(year, mo - 1, 1),
    end: new Date(year, mo, 1),
  };
}

/**
 * Compute and upsert the Trust Score for a student for a given month.
 * Always recomputes from raw data — overrides are captured in TrustScoreOverride.
 */
export async function calculateTrustScore(
  studentId: string,
  month: string
): Promise<TrustScoreResult> {
  const { start: rollingStart, end: rollingEnd } = getRollingWindow(month);
  const { start: monthStart, end: monthEnd } = getMonthWindow(month);

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: {
      cohortId: true,
      userId: true,
      user: { select: { orgId: true } },
    },
  });

  if (!student?.cohortId) {
    throw new Error(`Student ${studentId} is not assigned to a cohort`);
  }

  const { cohortId, userId, user: { orgId } } = student;

  // ── Responsiveness ────────────────────────────────────────────────────────
  const sessions = await prisma.checkInSession.findMany({
    where: {
      cohortId,
      date: { gte: rollingStart, lt: rollingEnd },
      attendanceSubmittedAt: { not: null },
    },
    select: { id: true },
  });

  let responsivenessRaw = 100; // no sessions held = no penalty
  if (sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id);
    const attended = await prisma.attendanceRecord.count({
      where: {
        studentProfileId: studentId,
        checkInSessionId: { in: sessionIds },
        present: true,
      },
    });
    responsivenessRaw = (attended / sessions.length) * 100;
  }

  // ── Transparency ─────────────────────────────────────────────────────────
  const plSubmission = await prisma.pLSubmission.findUnique({
    where: { studentId_month: { studentId, month } },
    select: { finalScore: true },
  });
  const transparencyRaw = plSubmission?.finalScore ?? 0;

  // ── Mutualism ─────────────────────────────────────────────────────────────
  const townHalls = await prisma.townHall.findMany({
    where: {
      orgId,
      date: { gte: rollingStart, lt: rollingEnd },
    },
    select: { id: true },
  });

  let mutualismRaw = 100; // no town halls held = no penalty
  if (townHalls.length > 0) {
    const townHallIds = townHalls.map((t) => t.id);
    const attended = await prisma.townHallSubmission.count({
      where: {
        submittedById: userId,
        townHallId: { in: townHallIds },
        attended: true,
      },
    });
    mutualismRaw = (attended / townHalls.length) * 100;
  }

  // ── Reflection ────────────────────────────────────────────────────────────
  const thisMonthTownHall = await prisma.townHall.findFirst({
    where: {
      orgId,
      date: { gte: monthStart, lt: monthEnd },
    },
    select: { id: true },
  });

  let reflectionRaw = 0;
  if (thisMonthTownHall) {
    const sub = await prisma.townHallSubmission.findUnique({
      where: {
        townHallId_submittedById: {
          townHallId: thisMonthTownHall.id,
          submittedById: userId,
        },
      },
      select: {
        reflectionAssessment: { select: { result: true } },
      },
    });
    if (sub?.reflectionAssessment?.result === "MEANINGFUL") {
      reflectionRaw = 100;
    }
  }

  // ── Composite ─────────────────────────────────────────────────────────────
  const score =
    responsivenessRaw * 0.25 +
    transparencyRaw * 0.25 +
    mutualismRaw * 0.25 +
    reflectionRaw * 0.25;

  const label = assignLabel(score);

  await prisma.trustScore.upsert({
    where: { studentId_month: { studentId, month } },
    update: {
      score,
      label,
      responsivenessRaw,
      transparencyRaw,
      mutualismRaw,
      reflectionRaw,
      isOverridden: false,
    },
    create: {
      studentId,
      month,
      score,
      label,
      responsivenessRaw,
      transparencyRaw,
      mutualismRaw,
      reflectionRaw,
    },
  });

  // Re-evaluate graduation eligibility after every score recalculation
  await detectEligibility(studentId);

  // S9.4 — alert staff when a student drops to RED
  if (label === TrustScoreLabel.RED) {
    const studentWithOrg = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { user: { select: { email: true, orgId: true } } },
    });
    if (studentWithOrg) {
      const staff = await prisma.user.findMany({
        where: {
          orgId: studentWithOrg.user.orgId,
          role: { in: ["STAFF", "ORG_ADMIN", "SUPER_ADMIN"] },
          deletedAt: null,
        },
        select: { email: true },
      });
      await Promise.allSettled(
        staff.map((s) =>
          sendRedScoreAlertEmail(
            s.email,
            studentWithOrg.user.email,
            studentId,
            score,
            month
          )
        )
      );
    }
  }

  return { score, label, responsivenessRaw, transparencyRaw, mutualismRaw, reflectionRaw };
}

function isPreviousMonth(later: string, earlier: string): boolean {
  const [ly, lm] = later.split("-").map(Number);
  const [ey, em] = earlier.split("-").map(Number);
  if (lm === 1) return ey === ly - 1 && em === 12;
  return ey === ly && em === lm - 1;
}

/**
 * Returns true if the student has `requiredMonths` consecutive GREEN scores
 * ending with the most recent month on record.
 */
export async function hasGreenStreak(
  studentId: string,
  requiredMonths = 6
): Promise<boolean> {
  const scores = await prisma.trustScore.findMany({
    where: { studentId },
    orderBy: { month: "desc" },
    take: requiredMonths,
    select: { label: true, month: true },
  });

  if (scores.length < requiredMonths) return false;
  if (!scores.every((s) => s.label === TrustScoreLabel.GREEN)) return false;

  // Verify months are consecutive with no gaps
  for (let i = 0; i < scores.length - 1; i++) {
    if (!isPreviousMonth(scores[i].month, scores[i + 1].month)) return false;
  }

  return true;
}

/** Derive "YYYY-MM" from a Date. */
export function monthFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
