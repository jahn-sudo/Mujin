import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/admin/cohorts/[cohortId]/members/route";
import { DELETE } from "@/app/api/admin/cohorts/[cohortId]/members/[studentId]/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    cohort: { findFirst: jest.fn() },
    studentProfile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockCohort = { id: "cohort-1", orgId: "org-1", maxStudents: 5 };
const mockStudent = {
  id: "sp-1",
  userId: "user-1",
  cohortId: null,
  user: { id: "user-1", email: "s@test.com", orgId: "org-1" },
};

function makePostReq(body: unknown, cohortId = "cohort-1"): [NextRequest, { params: Promise<{ cohortId: string }> }] {
  return [
    new NextRequest(`http://localhost/api/admin/cohorts/${cohortId}/members`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-org-id": "org-1" },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ cohortId }) },
  ];
}

function makeGetReq(cohortId = "cohort-1"): [NextRequest, { params: Promise<{ cohortId: string }> }] {
  return [
    new NextRequest(`http://localhost/api/admin/cohorts/${cohortId}/members`, {
      headers: { "x-org-id": "org-1" },
    }),
    { params: Promise.resolve({ cohortId }) },
  ];
}

function makeDeleteReq(
  cohortId = "cohort-1",
  studentId = "user-1"
): [NextRequest, { params: Promise<{ cohortId: string; studentId: string }> }] {
  return [
    new NextRequest(
      `http://localhost/api/admin/cohorts/${cohortId}/members/${studentId}`,
      { method: "DELETE", headers: { "x-org-id": "org-1" } }
    ),
    { params: Promise.resolve({ cohortId, studentId }) },
  ];
}

describe("POST /api/admin/cohorts/[cohortId]/members", () => {
  beforeEach(() => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudent);
    (mockPrisma.studentProfile.count as jest.Mock).mockResolvedValue(2);
    (mockPrisma.studentProfile.update as jest.Mock).mockResolvedValue({
      ...mockStudent,
      cohortId: "cohort-1",
    });
  });

  it("assign student — 200, cohortId updated", async () => {
    const [req, ctx] = makePostReq({ studentId: "user-1" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.cohortId).toBe("cohort-1");
  });

  it("cohort full — 409", async () => {
    (mockPrisma.studentProfile.count as jest.Mock).mockResolvedValue(5);
    const [req, ctx] = makePostReq({ studentId: "user-1" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/full/i);
  });

  it("student not found — 404", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(null);
    const [req, ctx] = makePostReq({ studentId: "unknown" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(404);
  });

  it("cohort not in org — 404", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);
    const [req, ctx] = makePostReq({ studentId: "user-1" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(404);
  });

  it("student in different org — 400", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ...mockStudent,
      user: { ...mockStudent.user, orgId: "org-2" },
    });
    const [req, ctx] = makePostReq({ studentId: "user-1" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);
  });

  it("reassign to different cohort — 200 (no capacity error for previous cohort)", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ...mockStudent,
      cohortId: "cohort-other",
    });
    (mockPrisma.studentProfile.count as jest.Mock).mockResolvedValue(3);
    const [req, ctx] = makePostReq({ studentId: "user-1" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(200);
  });

  it("already in this cohort — re-assign succeeds even if full", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ...mockStudent,
      cohortId: "cohort-1", // already in this cohort
    });
    (mockPrisma.studentProfile.count as jest.Mock).mockResolvedValue(5); // full
    const [req, ctx] = makePostReq({ studentId: "user-1" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(200); // no 409 — skip capacity check
  });
});

describe("DELETE /api/admin/cohorts/[cohortId]/members/[studentId]", () => {
  it("removes student — 200", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ...mockStudent,
      cohortId: "cohort-1",
    });
    (mockPrisma.studentProfile.update as jest.Mock).mockResolvedValue({
      ...mockStudent,
      cohortId: null,
    });

    const [req, ctx] = makeDeleteReq();
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(200);
  });

  it("student not in this cohort — 404", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      ...mockStudent,
      cohortId: "cohort-other",
    });

    const [req, ctx] = makeDeleteReq();
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/admin/cohorts/[cohortId]/members", () => {
  it("returns members with ventureProfile — 200", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.studentProfile.findMany as jest.Mock).mockResolvedValue([
      { ...mockStudent, ventureProfile: null },
    ]);

    const [req, ctx] = makeGetReq();
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].user.email).toBe("s@test.com");
  });
});
