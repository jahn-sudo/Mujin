import { detectEligibility } from "@/lib/graduation/detectEligibility";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    graduationRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    studentProfile: { findUnique: jest.fn() },
    pLSubmission: { findMany: jest.fn() },
    trustScore: { findMany: jest.fn() },
    user: { findMany: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
const mock = prisma as jest.Mocked<typeof prisma>;


const STUDENT_ID = "student-1";

function greenScores(months: string[]) {
  return months.map((month) => ({ label: "GREEN", month }));
}

function makePLs(nets: number[]) {
  const months = ["2027-06", "2027-05", "2027-04", "2027-03", "2027-02", "2027-01"];
  return nets.map((net, i) => ({ net, month: months[i] }));
}

beforeEach(() => {
  jest.clearAllMocks();
  // S9.3 email path — return empty staff list so no real emails attempted
  (mock.user as unknown as { findMany: jest.Mock }).findMany?.mockResolvedValue([]);
});

describe("detectEligibility", () => {
  it("creates a GraduationRecord if none exists", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue(null);
    (mock.graduationRecord.create as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: null,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({ ventureProfile: null });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.create).toHaveBeenCalled();
  });

  it("does nothing when status is INTERVIEW_SCHEDULED (protected state)", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INTERVIEW_SCHEDULED",
      lastInterviewFailedAt: null,
    });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).not.toHaveBeenCalled();
    expect(mock.studentProfile.findUnique).not.toHaveBeenCalled();
  });

  it("does nothing when status is GRADUATED (protected state)", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "GRADUATED",
      lastInterviewFailedAt: null,
    });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).not.toHaveBeenCalled();
  });

  it("stays INELIGIBLE when venture profile missing (gate 1 fails)", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: null,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({ ventureProfile: null });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).not.toHaveBeenCalled();
  });

  it("stays INELIGIBLE when cash flow streak < 3 (gate 2 fails)", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: null,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ventureProfile: { id: "vp-1" },
    });
    (mock.pLSubmission.findMany as jest.Mock).mockResolvedValue(
      makePLs([1000, -500, 800]) // middle month negative — breaks streak
    );

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).not.toHaveBeenCalled();
  });

  it("stays INELIGIBLE when green streak < 6 (gate 3 fails)", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: null,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ventureProfile: { id: "vp-1" },
    });
    (mock.pLSubmission.findMany as jest.Mock).mockResolvedValue(makePLs([500, 400, 300]));
    (mock.trustScore.findMany as jest.Mock).mockResolvedValue(
      greenScores(["2027-06", "2027-05", "2027-04", "2027-03", "2027-02"]) // only 5
    );

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).not.toHaveBeenCalled();
  });

  it("transitions to ELIGIBLE when all 3 gates met", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: null,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ventureProfile: { id: "vp-1" },
      user: { email: "student@test.com", orgId: "org-1" },
    });
    (mock.pLSubmission.findMany as jest.Mock).mockResolvedValue(makePLs([500, 400, 300]));
    (mock.trustScore.findMany as jest.Mock).mockResolvedValue(
      greenScores(["2027-06", "2027-05", "2027-04", "2027-03", "2027-02", "2027-01"])
    );
    (mock.graduationRecord.update as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "ELIGIBLE",
    });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "ELIGIBLE" }),
      })
    );
  });

  it("resets ELIGIBLE → INELIGIBLE when gates are no longer met", async () => {
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "ELIGIBLE",
      lastInterviewFailedAt: null,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ventureProfile: { id: "vp-1" },
    });
    // Cash flow drops negative — gate 2 fails
    (mock.pLSubmission.findMany as jest.Mock).mockResolvedValue(makePLs([-100, 500, 400]));
    (mock.graduationRecord.update as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
    });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "INELIGIBLE" }),
      })
    );
  });

  it("blocks ELIGIBLE when green streak months predate lastInterviewFailedAt", async () => {
    // Failed interview on 2027-04, green streak from 2027-01–2027-06
    // oldest green month (2027-01) <= fail month (2027-04) → should block
    const failedAt = new Date("2027-04-15T00:00:00Z");
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: failedAt,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ventureProfile: { id: "vp-1" },
    });
    (mock.pLSubmission.findMany as jest.Mock).mockResolvedValue(makePLs([500, 400, 300]));
    // All 6 green months, but oldest is 2027-01 which is before the fail month 2027-04
    (mock.trustScore.findMany as jest.Mock).mockResolvedValue(
      greenScores(["2027-06", "2027-05", "2027-04", "2027-03", "2027-02", "2027-01"])
    );

    await detectEligibility(STUDENT_ID);
    // Should NOT transition to ELIGIBLE
    expect(mock.graduationRecord.update).not.toHaveBeenCalled();
  });

  it("allows ELIGIBLE when all 6 green months are after lastInterviewFailedAt", async () => {
    // Failed interview in 2027-01, green streak from 2027-02–2027-07
    const failedAt = new Date("2027-01-20T00:00:00Z");
    (mock.graduationRecord.findUnique as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "INELIGIBLE",
      lastInterviewFailedAt: failedAt,
    });
    (mock.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ventureProfile: { id: "vp-1" },
      user: { email: "student@test.com", orgId: "org-1" },
    });
    (mock.pLSubmission.findMany as jest.Mock).mockResolvedValue(makePLs([500, 400, 300]));
    // Oldest green month is 2027-02, fail month is 2027-01 → all after fail
    (mock.trustScore.findMany as jest.Mock).mockResolvedValue(
      greenScores(["2027-07", "2027-06", "2027-05", "2027-04", "2027-03", "2027-02"])
    );
    (mock.graduationRecord.update as jest.Mock).mockResolvedValue({
      studentId: STUDENT_ID,
      status: "ELIGIBLE",
    });

    await detectEligibility(STUDENT_ID);
    expect(mock.graduationRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "ELIGIBLE" }),
      })
    );
  });
});
