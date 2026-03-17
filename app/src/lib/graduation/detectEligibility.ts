import { prisma } from "@/lib/prisma";
import { GraduationStatus } from "@/generated/prisma/enums";
import { sendGraduationEligibleEmail } from "@/lib/email";

/**
 * Evaluates the 3 hard gates for graduation and transitions GraduationRecord
 * between INELIGIBLE ↔ ELIGIBLE.
 *
 * Only acts when current status is INELIGIBLE or ELIGIBLE.
 * Does NOT override INTERVIEW_SCHEDULED, INTERVIEW_PASSED, INTERVIEW_FAILED, or GRADUATED.
 *
 * Gate 1: Venture profile exists (company incorporated + product live)
 * Gate 2: 3+ consecutive non-negative cash flow months (ordered most-recent first)
 * Gate 3: 6 consecutive GREEN trust scores, all after lastInterviewFailedAt if set
 */
export async function detectEligibility(studentId: string): Promise<void> {
  // Load or create the graduation record
  let record = await prisma.graduationRecord.findUnique({
    where: { studentId },
  });

  if (!record) {
    record = await prisma.graduationRecord.create({
      data: { studentId },
    });
  }

  // Only act when in a transitional state
  const actionableStatuses: GraduationStatus[] = [GraduationStatus.INELIGIBLE, GraduationStatus.ELIGIBLE];
  if (!actionableStatuses.includes(record.status)) return;

  const allMet = await checkAllGates(studentId, record.lastInterviewFailedAt);
  const targetStatus = allMet ? GraduationStatus.ELIGIBLE : GraduationStatus.INELIGIBLE;

  if (record.status !== targetStatus) {
    await prisma.graduationRecord.update({
      where: { studentId },
      data: { status: targetStatus },
    });

    // S9.3 — notify all staff when student becomes ELIGIBLE
    if (targetStatus === GraduationStatus.ELIGIBLE) {
      const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        select: { user: { select: { email: true, orgId: true } } },
      });
      if (student) {
        const staff = await prisma.user.findMany({
          where: {
            orgId: student.user.orgId,
            role: { in: ["STAFF", "ORG_ADMIN", "SUPER_ADMIN"] },
            deletedAt: null,
          },
          select: { email: true },
        });
        await Promise.allSettled(
          staff.map((s) =>
            sendGraduationEligibleEmail(s.email, student.user.email, studentId)
          )
        );
      }
    }
  }
}

async function checkAllGates(
  studentId: string,
  lastInterviewFailedAt: Date | null
): Promise<boolean> {
  // Gate 1: venture profile exists
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { ventureProfile: { select: { id: true } } },
  });
  if (!student?.ventureProfile) return false;

  // Gate 2: 3+ consecutive non-negative cash flow months
  const recentPLs = await prisma.pLSubmission.findMany({
    where: { studentId },
    orderBy: { month: "desc" },
    take: 3,
    select: { net: true },
  });
  if (recentPLs.length < 3) return false;
  const cashFlowMet = recentPLs.every((pl) => pl.net !== null && pl.net >= 0);
  if (!cashFlowMet) return false;

  // Gate 3: 6 consecutive GREEN trust scores, all after lastInterviewFailedAt if applicable
  const scores = await prisma.trustScore.findMany({
    where: { studentId },
    orderBy: { month: "desc" },
    take: 6,
    select: { label: true, month: true },
  });

  if (scores.length < 6) return false;
  if (!scores.every((s) => s.label === "GREEN")) return false;

  // Verify consecutive months (no gaps)
  for (let i = 0; i < scores.length - 1; i++) {
    if (!isPreviousMonth(scores[i].month, scores[i + 1].month)) return false;
  }

  // If there was a failed interview, all 6 GREEN months must be after that date
  if (lastInterviewFailedAt) {
    const failYear = lastInterviewFailedAt.getFullYear();
    const failMo = lastInterviewFailedAt.getMonth() + 1;
    const failMonth = `${failYear}-${String(failMo).padStart(2, "0")}`;

    const oldestGreenMonth = scores[scores.length - 1].month;
    if (oldestGreenMonth <= failMonth) return false;
  }

  return true;
}

function isPreviousMonth(later: string, earlier: string): boolean {
  const [ly, lm] = later.split("-").map(Number);
  const [ey, em] = earlier.split("-").map(Number);
  if (lm === 1) return ey === ly - 1 && em === 12;
  return ey === ly && em === lm - 1;
}
