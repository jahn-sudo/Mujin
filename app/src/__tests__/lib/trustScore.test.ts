jest.mock("@/lib/prisma", () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn() },
    checkInSession: { findMany: jest.fn() },
    attendanceRecord: { count: jest.fn() },
    pLSubmission: { findUnique: jest.fn(), findMany: jest.fn() },
    townHall: { findMany: jest.fn(), findFirst: jest.fn() },
    townHallSubmission: { count: jest.fn(), findUnique: jest.fn() },
    trustScore: { upsert: jest.fn(), findMany: jest.fn() },
    graduationRecord: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    user: { findMany: jest.fn() },
  },
}));

import {
  assignLabel,
  calculateTrustScore,
  hasGreenStreak,
  monthFromDate,
  TrustScoreLabel,
} from "@/lib/scoring/trustScore";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const p = prisma as unknown as {
  studentProfile: { findUnique: jest.Mock };
  checkInSession: { findMany: jest.Mock };
  attendanceRecord: { count: jest.Mock };
  pLSubmission: { findUnique: jest.Mock; findMany: jest.Mock };
  townHall: { findMany: jest.Mock; findFirst: jest.Mock };
  townHallSubmission: { count: jest.Mock; findUnique: jest.Mock };
  trustScore: { upsert: jest.Mock; findMany: jest.Mock };
  graduationRecord: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
  user: { findMany: jest.Mock };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockStudent(cohortId = "cohort-1", userId = "user-1", orgId = "org-1") {
  p.studentProfile.findUnique.mockResolvedValue({
    cohortId,
    userId,
    user: { orgId },
  });
}

function defaultMocks() {
  p.checkInSession.findMany.mockResolvedValue([]);
  p.pLSubmission.findUnique.mockResolvedValue(null);
  p.pLSubmission.findMany.mockResolvedValue([]);
  p.townHall.findMany.mockResolvedValue([]);
  p.townHall.findFirst.mockResolvedValue(null);
  p.trustScore.upsert.mockResolvedValue({});
  // detectEligibility called after score write — return stable INELIGIBLE record so it's a no-op
  p.graduationRecord.findUnique.mockResolvedValue({ status: "INELIGIBLE", lastInterviewFailedAt: null });
  // S9.4 red alert — return empty staff list so no emails attempted
  p.user.findMany.mockResolvedValue([]);
}

// ── assignLabel ───────────────────────────────────────────────────────────────

describe("assignLabel", () => {
  it("returns GREEN for score >= 75", () => {
    expect(assignLabel(75)).toBe(TrustScoreLabel.GREEN);
    expect(assignLabel(100)).toBe(TrustScoreLabel.GREEN);
    expect(assignLabel(80)).toBe(TrustScoreLabel.GREEN);
  });

  it("returns YELLOW for score 50–74", () => {
    expect(assignLabel(50)).toBe(TrustScoreLabel.YELLOW);
    expect(assignLabel(74)).toBe(TrustScoreLabel.YELLOW);
    expect(assignLabel(62)).toBe(TrustScoreLabel.YELLOW);
  });

  it("returns RED for score < 50", () => {
    expect(assignLabel(0)).toBe(TrustScoreLabel.RED);
    expect(assignLabel(49)).toBe(TrustScoreLabel.RED);
    expect(assignLabel(25)).toBe(TrustScoreLabel.RED);
  });
});

// ── monthFromDate ─────────────────────────────────────────────────────────────

describe("monthFromDate", () => {
  it("formats correctly", () => {
    expect(monthFromDate(new Date(2026, 2, 15))).toBe("2026-03");
    expect(monthFromDate(new Date(2026, 0, 1))).toBe("2026-01");
    expect(monthFromDate(new Date(2026, 11, 31))).toBe("2026-12");
  });
});

// ── calculateTrustScore ───────────────────────────────────────────────────────

describe("calculateTrustScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStudent();
    defaultMocks();
  });

  it("perfect score: all attended, P&L 100, all town halls, MEANINGFUL → 100 GREEN", async () => {
    p.checkInSession.findMany.mockResolvedValue([{ id: "s1" }, { id: "s2" }]);
    p.attendanceRecord.count.mockResolvedValue(2);
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 100 });
    p.townHall.findMany.mockResolvedValue([{ id: "t1" }, { id: "t2" }, { id: "t3" }]);
    p.townHallSubmission.count.mockResolvedValue(3);
    p.townHall.findFirst.mockResolvedValue({ id: "t3" });
    p.townHallSubmission.findUnique.mockResolvedValue({
      reflectionAssessment: { result: "MEANINGFUL" },
    });

    const result = await calculateTrustScore("student-1", "2026-03");

    expect(result.score).toBe(100);
    expect(result.label).toBe(TrustScoreLabel.GREEN);
    expect(result.responsivenessRaw).toBe(100);
    expect(result.transparencyRaw).toBe(100);
    expect(result.mutualismRaw).toBe(100);
    expect(result.reflectionRaw).toBe(100);
  });

  it("zero score: absent, no P&L, no town halls attended, NOT_MEANINGFUL → 0 RED", async () => {
    p.checkInSession.findMany.mockResolvedValue([{ id: "s1" }]);
    p.attendanceRecord.count.mockResolvedValue(0);
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 0 });
    p.townHall.findMany.mockResolvedValue([{ id: "t1" }]);
    p.townHallSubmission.count.mockResolvedValue(0);
    p.townHall.findFirst.mockResolvedValue({ id: "t1" });
    p.townHallSubmission.findUnique.mockResolvedValue({
      reflectionAssessment: { result: "NOT_MEANINGFUL" },
    });

    const result = await calculateTrustScore("student-1", "2026-03");

    expect(result.score).toBe(0);
    expect(result.label).toBe(TrustScoreLabel.RED);
  });

  it("partial score: 50% check-ins, 75 P&L, 100% town halls, NOT_MEANINGFUL → 56.25 YELLOW", async () => {
    p.checkInSession.findMany.mockResolvedValue([{ id: "s1" }, { id: "s2" }]);
    p.attendanceRecord.count.mockResolvedValue(1); // 50%
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 75 });
    p.townHall.findMany.mockResolvedValue([{ id: "t1" }]);
    p.townHallSubmission.count.mockResolvedValue(1); // 100%
    p.townHall.findFirst.mockResolvedValue({ id: "t1" });
    p.townHallSubmission.findUnique.mockResolvedValue({
      reflectionAssessment: { result: "NOT_MEANINGFUL" },
    });

    const result = await calculateTrustScore("student-1", "2026-03");

    // (50 + 75 + 100 + 0) / 4 = 56.25
    expect(result.score).toBeCloseTo(56.25);
    expect(result.label).toBe(TrustScoreLabel.YELLOW);
  });

  it("no sessions held → responsiveness defaults to 100", async () => {
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 100 });

    const result = await calculateTrustScore("student-1", "2026-03");

    expect(result.responsivenessRaw).toBe(100);
    expect(result.mutualismRaw).toBe(100);
    expect(result.reflectionRaw).toBe(0); // no town hall = no reflection
  });

  it("no P&L submission → transparency = 0", async () => {
    const result = await calculateTrustScore("student-1", "2026-03");
    expect(result.transparencyRaw).toBe(0);
  });

  it("no reflection assessment → reflection = 0", async () => {
    p.townHall.findFirst.mockResolvedValue({ id: "t1" });
    p.townHallSubmission.findUnique.mockResolvedValue({ reflectionAssessment: null });

    const result = await calculateTrustScore("student-1", "2026-03");
    expect(result.reflectionRaw).toBe(0);
  });

  it("throws if student not assigned to a cohort", async () => {
    p.studentProfile.findUnique.mockResolvedValue({
      cohortId: null,
      userId: "u1",
      user: { orgId: "o1" },
    });

    await expect(calculateTrustScore("student-1", "2026-03")).rejects.toThrow(
      "not assigned to a cohort"
    );
  });

  it("upserts trust score to DB with correct key", async () => {
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 80 });

    await calculateTrustScore("student-1", "2026-03");

    expect(p.trustScore.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { studentId_month: { studentId: "student-1", month: "2026-03" } },
      })
    );
  });

  it("upsert always resets isOverridden to false", async () => {
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 50 });

    await calculateTrustScore("student-1", "2026-03");

    const call = p.trustScore.upsert.mock.calls[0][0];
    expect(call.update.isOverridden).toBe(false);
  });

  it("correct label: score exactly 75 → GREEN", async () => {
    // responsiveness 100 + transparency 100 + mutualism 100 + reflection 0 = 75
    p.checkInSession.findMany.mockResolvedValue([{ id: "s1" }]);
    p.attendanceRecord.count.mockResolvedValue(1);
    p.pLSubmission.findUnique.mockResolvedValue({ finalScore: 100 });
    p.townHall.findMany.mockResolvedValue([{ id: "t1" }]);
    p.townHallSubmission.count.mockResolvedValue(1);
    p.townHall.findFirst.mockResolvedValue({ id: "t1" });
    p.townHallSubmission.findUnique.mockResolvedValue({ reflectionAssessment: null });

    const result = await calculateTrustScore("student-1", "2026-03");
    expect(result.score).toBe(75);
    expect(result.label).toBe(TrustScoreLabel.GREEN);
  });
});

// ── hasGreenStreak ────────────────────────────────────────────────────────────

describe("hasGreenStreak", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns true for 6 consecutive GREEN months", async () => {
    p.trustScore.findMany.mockResolvedValue([
      { month: "2026-06", label: TrustScoreLabel.GREEN },
      { month: "2026-05", label: TrustScoreLabel.GREEN },
      { month: "2026-04", label: TrustScoreLabel.GREEN },
      { month: "2026-03", label: TrustScoreLabel.GREEN },
      { month: "2026-02", label: TrustScoreLabel.GREEN },
      { month: "2026-01", label: TrustScoreLabel.GREEN },
    ]);
    expect(await hasGreenStreak("student-1")).toBe(true);
  });

  it("returns false when one month is YELLOW", async () => {
    p.trustScore.findMany.mockResolvedValue([
      { month: "2026-06", label: TrustScoreLabel.GREEN },
      { month: "2026-05", label: TrustScoreLabel.YELLOW },
      { month: "2026-04", label: TrustScoreLabel.GREEN },
      { month: "2026-03", label: TrustScoreLabel.GREEN },
      { month: "2026-02", label: TrustScoreLabel.GREEN },
      { month: "2026-01", label: TrustScoreLabel.GREEN },
    ]);
    expect(await hasGreenStreak("student-1")).toBe(false);
  });

  it("returns false when fewer than 6 months on record", async () => {
    p.trustScore.findMany.mockResolvedValue([
      { month: "2026-05", label: TrustScoreLabel.GREEN },
      { month: "2026-04", label: TrustScoreLabel.GREEN },
    ]);
    expect(await hasGreenStreak("student-1")).toBe(false);
  });

  it("returns false when months are not consecutive (gap present)", async () => {
    p.trustScore.findMany.mockResolvedValue([
      { month: "2026-06", label: TrustScoreLabel.GREEN },
      { month: "2026-05", label: TrustScoreLabel.GREEN },
      { month: "2026-04", label: TrustScoreLabel.GREEN },
      { month: "2026-02", label: TrustScoreLabel.GREEN }, // skipped March
      { month: "2026-01", label: TrustScoreLabel.GREEN },
      { month: "2025-12", label: TrustScoreLabel.GREEN },
    ]);
    expect(await hasGreenStreak("student-1")).toBe(false);
  });

  it("handles year boundary correctly (Jan ← Dec)", async () => {
    p.trustScore.findMany.mockResolvedValue([
      { month: "2026-03", label: TrustScoreLabel.GREEN },
      { month: "2026-02", label: TrustScoreLabel.GREEN },
      { month: "2026-01", label: TrustScoreLabel.GREEN },
      { month: "2025-12", label: TrustScoreLabel.GREEN },
      { month: "2025-11", label: TrustScoreLabel.GREEN },
      { month: "2025-10", label: TrustScoreLabel.GREEN },
    ]);
    expect(await hasGreenStreak("student-1")).toBe(true);
  });

  it("supports custom requiredMonths", async () => {
    p.trustScore.findMany.mockResolvedValue([
      { month: "2026-03", label: TrustScoreLabel.GREEN },
      { month: "2026-02", label: TrustScoreLabel.GREEN },
      { month: "2026-01", label: TrustScoreLabel.GREEN },
    ]);
    expect(await hasGreenStreak("student-1", 3)).toBe(true);
  });
});
