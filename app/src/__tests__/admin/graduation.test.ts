import { NextRequest } from "next/server";
import { POST as scheduleInterview } from "@/app/api/admin/students/[id]/graduation/schedule-interview/route";
import { POST as recordInterview } from "@/app/api/admin/students/[id]/graduation/record-interview/route";
import { POST as triggerBankIntro } from "@/app/api/admin/students/[id]/graduation/trigger-bank-intro/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn() },
    graduationRecord: { update: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const PARAMS = Promise.resolve({ id: "student-1" });

function makeReq(
  url: string,
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-org-id": "org-1", ...headers },
    body: JSON.stringify(body),
  });
}

// ── schedule-interview ────────────────────────────────────────────────────────

describe("POST /graduation/schedule-interview", () => {
  const url = "http://localhost/api/admin/students/student-1/graduation/schedule-interview";

  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when no org header", async () => {
    const req = new NextRequest(url, { method: "POST", body: "{}" });
    const res = await scheduleInterview(req, { params: PARAMS });
    expect(res.status).toBe(401);
  });

  it("returns 400 when interviewDate missing", async () => {
    const req = makeReq(url, {});
    const res = await scheduleInterview(req, { params: PARAMS });
    expect(res.status).toBe(400);
  });

  it("returns 400 when interviewDate is invalid", async () => {
    const req = makeReq(url, { interviewDate: "not-a-date" });
    const res = await scheduleInterview(req, { params: PARAMS });
    expect(res.status).toBe(400);
  });

  it("returns 404 when student not found", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(null);
    const req = makeReq(url, { interviewDate: "2027-03-15T10:00:00Z" });
    const res = await scheduleInterview(req, { params: PARAMS });
    expect(res.status).toBe(404);
  });

  it("returns 403 when student belongs to different org", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-2" },
      graduationRecord: { status: "ELIGIBLE" },
    });
    const req = makeReq(url, { interviewDate: "2027-03-15T10:00:00Z" });
    const res = await scheduleInterview(req, { params: PARAMS });
    expect(res.status).toBe(403);
  });

  it("returns 409 when status is not ELIGIBLE", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "INELIGIBLE" },
    });
    const req = makeReq(url, { interviewDate: "2027-03-15T10:00:00Z" });
    const res = await scheduleInterview(req, { params: PARAMS });
    expect(res.status).toBe(409);
  });

  it("transitions ELIGIBLE → INTERVIEW_SCHEDULED", async () => {
    const mockRecord = {
      status: "INTERVIEW_SCHEDULED",
      interviewDate: new Date("2027-03-15T10:00:00Z"),
      interviewScheduledAt: new Date(),
    };
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "ELIGIBLE" },
    });
    (mockPrisma.graduationRecord.update as jest.Mock).mockResolvedValue(mockRecord);

    const req = makeReq(url, { interviewDate: "2027-03-15T10:00:00Z" });
    const res = await scheduleInterview(req, { params: PARAMS });

    expect(res.status).toBe(200);
    expect(mockPrisma.graduationRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "INTERVIEW_SCHEDULED" }),
      })
    );
    const body = await res.json();
    expect(body.graduationRecord.status).toBe("INTERVIEW_SCHEDULED");
  });
});

// ── record-interview ──────────────────────────────────────────────────────────

describe("POST /graduation/record-interview", () => {
  const url = "http://localhost/api/admin/students/student-1/graduation/record-interview";

  beforeEach(() => jest.clearAllMocks());

  it("returns 400 for invalid result value", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "INTERVIEW_SCHEDULED" },
    });
    const req = makeReq(url, { result: "MAYBE" });
    const res = await recordInterview(req, { params: PARAMS });
    expect(res.status).toBe(400);
  });

  it("returns 409 when status is not INTERVIEW_SCHEDULED", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "ELIGIBLE" },
    });
    const req = makeReq(url, { result: "PASSED" });
    const res = await recordInterview(req, { params: PARAMS });
    expect(res.status).toBe(409);
  });

  it("transitions INTERVIEW_SCHEDULED → INTERVIEW_PASSED on PASSED", async () => {
    const mockRecord = { status: "INTERVIEW_PASSED", interviewResult: "PASSED" };
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "INTERVIEW_SCHEDULED" },
    });
    (mockPrisma.graduationRecord.update as jest.Mock).mockResolvedValue(mockRecord);

    const req = makeReq(url, { result: "PASSED" });
    const res = await recordInterview(req, { params: PARAMS });

    expect(res.status).toBe(200);
    expect(mockPrisma.graduationRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "INTERVIEW_PASSED",
          interviewResult: "PASSED",
        }),
      })
    );
  });

  it("transitions INTERVIEW_SCHEDULED → INELIGIBLE on FAILED and sets lastInterviewFailedAt", async () => {
    const mockRecord = {
      status: "INELIGIBLE",
      interviewResult: "FAILED",
      lastInterviewFailedAt: new Date(),
    };
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "INTERVIEW_SCHEDULED" },
    });
    (mockPrisma.graduationRecord.update as jest.Mock).mockResolvedValue(mockRecord);

    const req = makeReq(url, { result: "FAILED" });
    const res = await recordInterview(req, { params: PARAMS });

    expect(res.status).toBe(200);
    const updateCall = (mockPrisma.graduationRecord.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.status).toBe("INELIGIBLE");
    expect(updateCall.data.interviewResult).toBe("FAILED");
    expect(updateCall.data.lastInterviewFailedAt).toBeInstanceOf(Date);
  });
});

// ── trigger-bank-intro ────────────────────────────────────────────────────────

describe("POST /graduation/trigger-bank-intro", () => {
  const url = "http://localhost/api/admin/students/student-1/graduation/trigger-bank-intro";

  beforeEach(() => jest.clearAllMocks());

  it("returns 409 when status is not INTERVIEW_PASSED", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "ELIGIBLE" },
    });
    const req = new NextRequest(url, {
      method: "POST",
      headers: { "x-org-id": "org-1" },
    });
    const res = await triggerBankIntro(req, { params: PARAMS });
    expect(res.status).toBe(409);
  });

  it("transitions INTERVIEW_PASSED → GRADUATED and writes bankIntroDate", async () => {
    const mockRecord = {
      status: "GRADUATED",
      bankIntroDate: new Date(),
    };
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      user: { orgId: "org-1" },
      graduationRecord: { status: "INTERVIEW_PASSED" },
    });
    (mockPrisma.graduationRecord.update as jest.Mock).mockResolvedValue(mockRecord);

    const req = new NextRequest(url, {
      method: "POST",
      headers: { "x-org-id": "org-1" },
    });
    const res = await triggerBankIntro(req, { params: PARAMS });

    expect(res.status).toBe(200);
    const updateCall = (mockPrisma.graduationRecord.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.status).toBe("GRADUATED");
    expect(updateCall.data.bankIntroDate).toBeInstanceOf(Date);
  });
});
