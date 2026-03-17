import { prisma } from "@/lib/prisma";
import { ReflectionResult, ResubmissionState } from "@/generated/prisma/enums";

/**
 * Returns the calendar quarter string for a given date.
 * e.g. 2026-03-17 → "2026-Q1"
 */
export function getQuarter(date: Date): string {
  const year = date.getUTCFullYear();
  const quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
  return `${year}-Q${quarter}`;
}

/**
 * Determines the resubmission state for a new reflection assessment.
 *
 * Rules:
 * - MEANINGFUL → state = NONE (no window needed)
 * - NOT_MEANINGFUL, first flag this quarter → state = WINDOW_OPEN, windowExpiresAt = now + 48h
 * - NOT_MEANINGFUL, second flag this quarter → state = LOCKED (score = 0, no window)
 */
export async function resolveResubmissionState(
  userId: string,
  quarter: string,
  result: ReflectionResult
): Promise<{
  resubmissionState: ResubmissionState;
  windowExpiresAt: Date | null;
}> {
  if (result === ReflectionResult.MEANINGFUL) {
    return { resubmissionState: ResubmissionState.NONE, windowExpiresAt: null };
  }

  // Count NOT_MEANINGFUL flags this quarter for this user
  const priorFlags = await prisma.reflectionAssessment.count({
    where: {
      result: ReflectionResult.NOT_MEANINGFUL,
      quarter,
      submission: {
        submittedById: userId,
      },
    },
  });

  if (priorFlags === 0) {
    // First flag this quarter → open 48h window
    const windowExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    return {
      resubmissionState: ResubmissionState.WINDOW_OPEN,
      windowExpiresAt,
    };
  }

  // Second (or more) flag → locked
  return { resubmissionState: ResubmissionState.LOCKED, windowExpiresAt: null };
}
