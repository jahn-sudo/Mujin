import { NextRequest } from "next/server";
import { GET, DELETE } from "@/app/api/admin/cohorts/[cohortId]/mentor/route";
import { POST as invitePost } from "@/app/api/admin/invite/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    cohort: { findFirst: jest.fn() },
    mentorCohortAssignment: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    inviteToken: { updateMany: jest.fn(), create: jest.fn() },
  },
}));

jest.mock("@/lib/email", () => ({
  sendActivationEmail: jest.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockCohort = { id: "cohort-1", orgId: "org-1", maxStudents: 5 };
const mockAssignment = {
  id: "assign-1",
  mentorId: "user-mentor",
  cohortId: "cohort-1",
  mentor: { id: "user-mentor", email: "mentor@test.com" },
};

function makeCtx(cohortId = "cohort-1") {
  return { params: Promise.resolve({ cohortId }) };
}

function makeReq(method: string, cohortId = "cohort-1"): NextRequest {
  return new NextRequest(`http://localhost/api/admin/cohorts/${cohortId}/mentor`, {
    method,
    headers: { "x-org-id": "org-1" },
  });
}

describe("GET /api/admin/cohorts/[cohortId]/mentor", () => {
  it("assigned mentor — returns assigned:true with userId + email", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(mockAssignment);

    const res = await GET(makeReq("GET"), makeCtx());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.assigned).toBe(true);
    expect(body.email).toBe("mentor@test.com");
  });

  it("no mentor assigned — returns assigned:false", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeReq("GET"), makeCtx());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.assigned).toBe(false);
  });

  it("cohort not found — 404", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeReq("GET"), makeCtx());
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/admin/cohorts/[cohortId]/mentor", () => {
  it("unassigns mentor — 200; user account persists", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.mentorCohortAssignment.delete as jest.Mock).mockResolvedValue(mockAssignment);

    const res = await DELETE(makeReq("DELETE"), makeCtx());
    expect(res.status).toBe(200);
    // Only assignment deleted — not user
    expect(mockPrisma.mentorCohortAssignment.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { cohortId: "cohort-1" } })
    );
  });

  it("no mentor assigned — 404", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeReq("DELETE"), makeCtx());
    expect(res.status).toBe(404);
  });
});

describe("POST /api/admin/invite — mentor conflict check (S2.7 T1)", () => {
  beforeEach(() => {
    (mockPrisma.inviteToken.updateMany as jest.Mock).mockResolvedValue({ count: 0 });
    (mockPrisma.inviteToken.create as jest.Mock).mockResolvedValue({});
  });

  it("invite MENTOR to cohort that already has mentor — 409", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );

    const req = new NextRequest("http://localhost/api/admin/invite", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-org-id": "org-1",
        "x-user-id": "staff-1",
      },
      body: JSON.stringify({
        email: "newmentor@test.com",
        role: "MENTOR",
        cohortId: "cohort-1",
      }),
    });
    const res = await invitePost(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/already has a mentor/i);
  });

  it("invite MENTOR to cohort with no mentor — 200", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/admin/invite", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-org-id": "org-1",
        "x-user-id": "staff-1",
      },
      body: JSON.stringify({
        email: "mentor@test.com",
        role: "MENTOR",
        cohortId: "cohort-1",
      }),
    });
    const res = await invitePost(req);
    expect(res.status).toBe(200);
  });
});
