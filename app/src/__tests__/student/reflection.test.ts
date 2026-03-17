import { NextRequest } from "next/server";
import { POST as resubmit } from "@/app/api/student/townhalls/[id]/resubmit/route";
import { GET as reflectionStatus } from "@/app/api/student/townhalls/[id]/reflection-status/route";
import { ReflectionResult, ResubmissionState } from "@/generated/prisma/enums";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    townHallSubmission: { findUnique: jest.fn(), update: jest.fn() },
    reflectionAssessment: { update: jest.fn() },
  },
}));

jest.mock("@/lib/ai/reflectionAssessor", () => ({
  assessReflection: jest.fn(),
}));

jest.mock("@/lib/attendance/resubmissionLogic", () => ({
  getQuarter: jest.fn().mockReturnValue("2026-Q1"),
  resolveResubmissionState: jest.fn(),
}));

import { prisma } from "@/lib/prisma";
import { assessReflection } from "@/lib/ai/reflectionAssessor";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAssess = assessReflection as jest.Mock;

const USER_ID = "user-1";
const TH_ID = "th-1";

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

const windowOpen = new Date(Date.now() + 47 * 60 * 60 * 1000);
const windowExpired = new Date(Date.now() - 60 * 1000);

const mockSubmissionWithWindowOpen = {
  id: "sub-1",
  reflectionAssessment: {
    id: "ra-1",
    result: ReflectionResult.NOT_MEANINGFUL,
    resubmissionState: ResubmissionState.WINDOW_OPEN,
    windowExpiresAt: windowOpen,
  },
};

const mockSubmissionLocked = {
  id: "sub-1",
  reflectionAssessment: {
    id: "ra-1",
    result: ReflectionResult.NOT_MEANINGFUL,
    resubmissionState: ResubmissionState.LOCKED,
    windowExpiresAt: null,
  },
};

const mockSubmissionExpired = {
  id: "sub-1",
  reflectionAssessment: {
    id: "ra-1",
    result: ReflectionResult.NOT_MEANINGFUL,
    resubmissionState: ResubmissionState.WINDOW_OPEN,
    windowExpiresAt: windowExpired,
  },
};

function makeResubmitReq(body: unknown): NextRequest {
  return new NextRequest(`http://localhost/api/student/townhalls/${TH_ID}/resubmit`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-user-id": USER_ID },
    body: JSON.stringify(body),
  });
}

function makeStatusReq(): NextRequest {
  return new NextRequest(
    `http://localhost/api/student/townhalls/${TH_ID}/reflection-status`,
    { method: "GET", headers: { "x-user-id": USER_ID } }
  );
}

const GOOD_TEXT =
  "This month I learned a lot about market validation and pricing. My team struggled but we kept iterating based on customer feedback. I noticed peers facing similar challenges with distribution.";

describe("POST /api/student/townhalls/[id]/resubmit", () => {
  beforeEach(() => jest.clearAllMocks());

  it("MEANINGFUL resubmission → RESUBMITTED state — 200", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockSubmissionWithWindowOpen
    );
    mockAssess.mockResolvedValue("MEANINGFUL");
    (mockPrisma.townHallSubmission.update as jest.Mock).mockResolvedValue({});
    (mockPrisma.reflectionAssessment.update as jest.Mock).mockResolvedValue({
      result: ReflectionResult.MEANINGFUL,
      resubmissionState: ResubmissionState.RESUBMITTED,
      windowExpiresAt: null,
      resubmittedAt: new Date(),
    });

    const res = await resubmit(makeResubmitReq({ reflectionText: GOOD_TEXT }), mockParams(TH_ID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.resubmissionState).toBe(ResubmissionState.RESUBMITTED);
  });

  it("NOT_MEANINGFUL resubmission → LOCKED — 200", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockSubmissionWithWindowOpen
    );
    mockAssess.mockResolvedValue("NOT_MEANINGFUL");
    (mockPrisma.townHallSubmission.update as jest.Mock).mockResolvedValue({});
    (mockPrisma.reflectionAssessment.update as jest.Mock).mockResolvedValue({
      result: ReflectionResult.NOT_MEANINGFUL,
      resubmissionState: ResubmissionState.LOCKED,
      windowExpiresAt: null,
      resubmittedAt: new Date(),
    });

    const res = await resubmit(makeResubmitReq({ reflectionText: "ok" }), mockParams(TH_ID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.resubmissionState).toBe(ResubmissionState.LOCKED);
  });

  it("window expired → 409", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockSubmissionExpired
    );
    (mockPrisma.reflectionAssessment.update as jest.Mock).mockResolvedValue({});

    const res = await resubmit(makeResubmitReq({ reflectionText: GOOD_TEXT }), mockParams(TH_ID));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/expired/i);
  });

  it("LOCKED state → 409", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockSubmissionLocked
    );
    const res = await resubmit(makeResubmitReq({ reflectionText: GOOD_TEXT }), mockParams(TH_ID));
    expect(res.status).toBe(409);
  });

  it("no submission → 404", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await resubmit(makeResubmitReq({ reflectionText: GOOD_TEXT }), mockParams(TH_ID));
    expect(res.status).toBe(404);
  });

  it("missing reflectionText → 400", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockSubmissionWithWindowOpen
    );
    const res = await resubmit(makeResubmitReq({}), mockParams(TH_ID));
    expect(res.status).toBe(400);
  });

  it("missing x-user-id → 401", async () => {
    const req = new NextRequest(
      `http://localhost/api/student/townhalls/${TH_ID}/resubmit`,
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reflectionText: GOOD_TEXT }) }
    );
    const res = await resubmit(req, mockParams(TH_ID));
    expect(res.status).toBe(401);
  });
});

describe("GET /api/student/townhalls/[id]/reflection-status", () => {
  beforeEach(() => jest.clearAllMocks());

  it("WINDOW_OPEN → returns status WINDOW_OPEN + windowExpiresAt", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
      reflectionAssessment: {
        result: ReflectionResult.NOT_MEANINGFUL,
        resubmissionState: ResubmissionState.WINDOW_OPEN,
        windowExpiresAt: windowOpen,
      },
    });
    const res = await reflectionStatus(makeStatusReq(), mockParams(TH_ID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("WINDOW_OPEN");
    expect(body.windowExpiresAt).not.toBeNull();
    expect(body.reflectionText).toBeUndefined();
  });

  it("MEANINGFUL → returns status MEANINGFUL", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
      reflectionAssessment: {
        result: ReflectionResult.MEANINGFUL,
        resubmissionState: ResubmissionState.NONE,
        windowExpiresAt: null,
      },
    });
    const res = await reflectionStatus(makeStatusReq(), mockParams(TH_ID));
    const body = await res.json();
    expect(body.status).toBe("MEANINGFUL");
  });

  it("LOCKED → returns status LOCKED", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
      reflectionAssessment: {
        result: ReflectionResult.NOT_MEANINGFUL,
        resubmissionState: ResubmissionState.LOCKED,
        windowExpiresAt: null,
      },
    });
    const res = await reflectionStatus(makeStatusReq(), mockParams(TH_ID));
    const body = await res.json();
    expect(body.status).toBe("LOCKED");
  });

  it("no assessment yet → PENDING", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
      reflectionAssessment: null,
    });
    const res = await reflectionStatus(makeStatusReq(), mockParams(TH_ID));
    const body = await res.json();
    expect(body.status).toBe("PENDING");
  });

  it("no submission → 404", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await reflectionStatus(makeStatusReq(), mockParams(TH_ID));
    expect(res.status).toBe(404);
  });

  it("response never contains reflectionText", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
      reflectionAssessment: {
        result: ReflectionResult.MEANINGFUL,
        resubmissionState: ResubmissionState.NONE,
        windowExpiresAt: null,
      },
    });
    const res = await reflectionStatus(makeStatusReq(), mockParams(TH_ID));
    const body = await res.json();
    expect(JSON.stringify(body)).not.toContain("reflectionText");
  });

  it("missing x-user-id → 401", async () => {
    const req = new NextRequest(
      `http://localhost/api/student/townhalls/${TH_ID}/reflection-status`,
      { method: "GET" }
    );
    const res = await reflectionStatus(req, mockParams(TH_ID));
    expect(res.status).toBe(401);
  });
});
