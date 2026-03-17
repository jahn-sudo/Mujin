import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/invite/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    cohort: { findFirst: jest.fn() },
    mentorCohortAssignment: { findUnique: jest.fn() },
    inviteToken: {
      updateMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/email", () => ({
  sendActivationEmail: jest.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/prisma";
import { sendActivationEmail } from "@/lib/email";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest("http://localhost/api/admin/invite", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-org-id": "org-1",
      "x-user-id": "staff-1",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const mockCohort = { id: "cohort-1", orgId: "org-1", name: "Alpha", maxStudents: 5 };

describe("POST /api/admin/invite", () => {
  beforeEach(() => {
    (mockPrisma.inviteToken.updateMany as jest.Mock).mockResolvedValue({ count: 0 });
    (mockPrisma.inviteToken.create as jest.Mock).mockResolvedValue({});
  });

  it("STUDENT invite — happy path — 200", async () => {
    const res = await POST(makeRequest({ email: "student@test.com", role: "STUDENT" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Invitation sent");
    expect(sendActivationEmail).toHaveBeenCalledWith(
      "student@test.com",
      expect.stringContaining("/activate?token="),
      "STUDENT"
    );
  });

  it("MENTOR invite with cohortId — happy path — 200", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makeRequest({ email: "mentor@test.com", role: "MENTOR", cohortId: "cohort-1" })
    );
    expect(res.status).toBe(200);
    expect(sendActivationEmail).toHaveBeenCalledWith(
      "mentor@test.com",
      expect.any(String),
      "MENTOR"
    );
  });

  it("MENTOR missing cohortId — 400", async () => {
    const res = await POST(makeRequest({ email: "mentor@test.com", role: "MENTOR" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/cohortId/i);
  });

  it("MENTOR cohortId from different org — 400", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makeRequest({ email: "mentor@test.com", role: "MENTOR", cohortId: "cohort-other" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/cohort/i);
  });

  it("MENTOR cohort already has a mentor — 409", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue({
      id: "assign-1",
      mentorId: "existing-mentor",
      cohortId: "cohort-1",
    });

    const res = await POST(
      makeRequest({ email: "mentor2@test.com", role: "MENTOR", cohortId: "cohort-1" })
    );
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/already has a mentor/i);
  });

  it("invalid role — 400", async () => {
    const res = await POST(makeRequest({ email: "x@test.com", role: "STAFF" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/STUDENT or MENTOR/i);
  });

  it("invalid role ORG_ADMIN — 400", async () => {
    const res = await POST(makeRequest({ email: "x@test.com", role: "ORG_ADMIN" }));
    expect(res.status).toBe(400);
  });

  it("missing email — 400", async () => {
    const res = await POST(makeRequest({ role: "STUDENT" }));
    expect(res.status).toBe(400);
  });

  it("invalid email format — 400", async () => {
    const res = await POST(makeRequest({ email: "notanemail", role: "STUDENT" }));
    expect(res.status).toBe(400);
  });

  it("re-invite same email+role — old tokens invalidated, new one issued — 200", async () => {
    (mockPrisma.inviteToken.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (mockPrisma.inviteToken.create as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest({ email: "student@test.com", role: "STUDENT" }));
    expect(res.status).toBe(200);
    expect(mockPrisma.inviteToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ email: "student@test.com", role: "STUDENT" }),
      })
    );
  });

  it("missing x-org-id — 400", async () => {
    const req = new NextRequest("http://localhost/api/admin/invite", {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": "staff-1" },
      body: JSON.stringify({ email: "x@test.com", role: "STUDENT" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
