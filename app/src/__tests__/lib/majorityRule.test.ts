// Unit test for majority-rule computation logic (isolated from Prisma)

/**
 * Mirrors the core logic of computeMajorityAttendance without DB calls.
 * This validates the algorithm independently.
 */
function computeAttendance(
  studentUserIds: string[],
  submissions: { submittedById: string; attendeeIds: string[] }[]
): Record<string, boolean> {
  const totalSubmissions = submissions.length;
  if (totalSubmissions === 0) return {};

  const threshold = Math.ceil(totalSubmissions / 2);
  const results: Record<string, boolean> = {};

  for (const submission of submissions) {
    const mentionCount = submissions.filter((s) =>
      s.attendeeIds.includes(submission.submittedById)
    ).length;
    results[submission.submittedById] = mentionCount >= threshold;
  }

  // Non-submitters are absent
  for (const userId of studentUserIds) {
    if (!(userId in results)) {
      results[userId] = false;
    }
  }

  return results;
}

const STUDENTS = ["u1", "u2", "u3", "u4", "u5"];

describe("majorityRule — computeAttendance", () => {
  it("3 of 3 submitters mark each other present → all attended", () => {
    const submissions = [
      { submittedById: "u1", attendeeIds: ["u1", "u2", "u3"] },
      { submittedById: "u2", attendeeIds: ["u1", "u2", "u3"] },
      { submittedById: "u3", attendeeIds: ["u1", "u2", "u3"] },
    ];
    const result = computeAttendance(STUDENTS, submissions);
    expect(result["u1"]).toBe(true);
    expect(result["u2"]).toBe(true);
    expect(result["u3"]).toBe(true);
    // Non-submitters = absent
    expect(result["u4"]).toBe(false);
    expect(result["u5"]).toBe(false);
  });

  it("3 submissions, only 1 marks u2 present → u2 absent (threshold=2)", () => {
    const submissions = [
      { submittedById: "u1", attendeeIds: ["u1", "u2"] },
      { submittedById: "u2", attendeeIds: ["u1", "u3"] },
      { submittedById: "u3", attendeeIds: ["u1", "u3"] },
    ];
    const result = computeAttendance(STUDENTS, submissions);
    // u1 mentioned by all 3 → threshold 2 → attended
    expect(result["u1"]).toBe(true);
    // u2 mentioned by 1 (u1 only) → < threshold 2 → absent
    expect(result["u2"]).toBe(false);
    // u3 mentioned by 2 (u2, u3) → = threshold 2 → attended
    expect(result["u3"]).toBe(true);
  });

  it("2 of 5 submit, 1 marks other present → threshold ceil(2/2)=1 → attended", () => {
    const submissions = [
      { submittedById: "u1", attendeeIds: ["u1", "u2"] },
      { submittedById: "u2", attendeeIds: ["u1", "u2"] },
    ];
    const result = computeAttendance(STUDENTS, submissions);
    // threshold = ceil(2/2) = 1; u1 mentioned by 2 → attended
    expect(result["u1"]).toBe(true);
    expect(result["u2"]).toBe(true);
    expect(result["u3"]).toBe(false);
    expect(result["u4"]).toBe(false);
    expect(result["u5"]).toBe(false);
  });

  it("no submissions → returns empty attendance", () => {
    const result = computeAttendance(STUDENTS, []);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("non-submitters always false", () => {
    const submissions = [
      { submittedById: "u1", attendeeIds: ["u1"] },
    ];
    const result = computeAttendance(STUDENTS, submissions);
    expect(result["u2"]).toBe(false);
    expect(result["u3"]).toBe(false);
    expect(result["u4"]).toBe(false);
    expect(result["u5"]).toBe(false);
  });

  it("5 of 5 submit, all mark all present → all attended", () => {
    const allIds = [...STUDENTS];
    const submissions = STUDENTS.map((id) => ({
      submittedById: id,
      attendeeIds: allIds,
    }));
    const result = computeAttendance(STUDENTS, submissions);
    for (const id of STUDENTS) {
      expect(result[id]).toBe(true);
    }
  });
});
