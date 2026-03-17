import { getQuarter, resolveResubmissionState } from "@/lib/attendance/resubmissionLogic";
import { ReflectionResult, ResubmissionState } from "@/generated/prisma/enums";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    reflectionAssessment: { count: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("getQuarter", () => {
  it("Jan-Mar → Q1", () => {
    expect(getQuarter(new Date("2026-01-15"))).toBe("2026-Q1");
    expect(getQuarter(new Date("2026-03-31"))).toBe("2026-Q1");
  });
  it("Apr-Jun → Q2", () => {
    expect(getQuarter(new Date("2026-04-01"))).toBe("2026-Q2");
    expect(getQuarter(new Date("2026-06-30"))).toBe("2026-Q2");
  });
  it("Jul-Sep → Q3", () => {
    expect(getQuarter(new Date("2026-07-01"))).toBe("2026-Q3");
  });
  it("Oct-Dec → Q4", () => {
    expect(getQuarter(new Date("2026-12-31"))).toBe("2026-Q4");
  });
});

describe("resolveResubmissionState", () => {
  beforeEach(() => jest.clearAllMocks());

  it("MEANINGFUL → NONE, no window", async () => {
    const result = await resolveResubmissionState(
      "user-1",
      "2026-Q1",
      ReflectionResult.MEANINGFUL
    );
    expect(result.resubmissionState).toBe(ResubmissionState.NONE);
    expect(result.windowExpiresAt).toBeNull();
  });

  it("NOT_MEANINGFUL, first flag → WINDOW_OPEN, windowExpiresAt ~48h from now", async () => {
    (mockPrisma.reflectionAssessment.count as jest.Mock).mockResolvedValue(0);

    const before = Date.now();
    const result = await resolveResubmissionState(
      "user-1",
      "2026-Q1",
      ReflectionResult.NOT_MEANINGFUL
    );
    const after = Date.now();

    expect(result.resubmissionState).toBe(ResubmissionState.WINDOW_OPEN);
    expect(result.windowExpiresAt).not.toBeNull();
    const expiresMs = result.windowExpiresAt!.getTime();
    expect(expiresMs).toBeGreaterThanOrEqual(before + 47 * 60 * 60 * 1000);
    expect(expiresMs).toBeLessThanOrEqual(after + 49 * 60 * 60 * 1000);
  });

  it("NOT_MEANINGFUL, second flag same quarter → LOCKED", async () => {
    (mockPrisma.reflectionAssessment.count as jest.Mock).mockResolvedValue(1);

    const result = await resolveResubmissionState(
      "user-1",
      "2026-Q1",
      ReflectionResult.NOT_MEANINGFUL
    );
    expect(result.resubmissionState).toBe(ResubmissionState.LOCKED);
    expect(result.windowExpiresAt).toBeNull();
  });

  it("NOT_MEANINGFUL, first flag new quarter → WINDOW_OPEN again", async () => {
    (mockPrisma.reflectionAssessment.count as jest.Mock).mockResolvedValue(0);

    const result = await resolveResubmissionState(
      "user-1",
      "2026-Q2",
      ReflectionResult.NOT_MEANINGFUL
    );
    expect(result.resubmissionState).toBe(ResubmissionState.WINDOW_OPEN);
  });
});
