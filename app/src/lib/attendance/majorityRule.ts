import { prisma } from "@/lib/prisma";

/**
 * Computes majority-rule town hall attendance for all students in a cohort.
 *
 * For each student in the cohort:
 *   - Count how many submissions list that student's userId in attendeeIds
 *   - If count >= ceil(totalSubmissions / 2) → attended = true
 *   - Otherwise → attended = false
 *   - Students who didn't submit have no TownHallSubmission → treated as absent (attended = false)
 *
 * Updates the `attended` field on all TownHallSubmission records for this cohort.
 * Called after each new submission (idempotent).
 */
export async function computeMajorityAttendance(
  townHallId: string,
  cohortId: string
): Promise<void> {
  // Get all students in the cohort
  const students = await prisma.studentProfile.findMany({
    where: { cohortId },
    select: { userId: true },
  });

  if (students.length === 0) return;

  // Get all submissions for this town hall from this cohort's students
  const studentUserIds = students.map((s) => s.userId);
  const submissions = await prisma.townHallSubmission.findMany({
    where: {
      townHallId,
      submittedById: { in: studentUserIds },
    },
    select: { id: true, submittedById: true, attendeeIds: true },
  });

  const totalSubmissions = submissions.length;
  if (totalSubmissions === 0) return;

  const threshold = Math.ceil(totalSubmissions / 2);

  // For each submitter, count how many other submissions list them as present
  for (const submission of submissions) {
    const mentionCount = submissions.filter((s) =>
      s.attendeeIds.includes(submission.submittedById)
    ).length;

    const attended = mentionCount >= threshold;

    await prisma.townHallSubmission.update({
      where: { id: submission.id },
      data: { attended },
    });
  }
}
