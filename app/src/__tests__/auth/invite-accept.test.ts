import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/auth/invite/[token]/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn() },
    consentRecord: { create: jest.fn() },
    studentProfile: { create: jest.fn() },
    mentorCohortAssignment: { create: jest.fn() },
    inviteToken: { update: jest.fn() },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/lib/auth/inviteTokens", () => ({
  validateInviteToken: jest.fn(),
  consumeInviteToken: jest.fn(),
}));

jest.mock("@/lib/auth/password", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed"),
}));

import { prisma } from "@/lib/prisma";
import { validateInviteToken } from "@/lib/auth/inviteTokens";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const studentRecord = {
  id: "invite-1",
  email: "student@test.com",
  role: "STUDENT",
  orgId: "org-1",
  cohortId: null,
  tokenHash: "hash",
  expiresAt: new Date(Date.now() + 86400000),
  acceptedAt: null,
  createdById: "staff-1",
  createdAt: new Date(),
};

const mentorRecord = {
  ...studentRecord,
  id: "invite-2",
  email: "mentor@test.com",
  role: "MENTOR",
  cohortId: "cohort-1",
};

function makeGetRequest(token: string): [NextRequest, { params: Promise<{ token: string }> }] {
  return [
    new NextRequest(`http://localhost/api/auth/invite/${token}`),
    { params: Promise.resolve({ token }) },
  ];
}

function makePostRequest(
  token: string,
  body: unknown
): [NextRequest, { params: Promise<{ token: string }> }] {
  return [
    new NextRequest(`http://localhost/api/auth/invite/${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ token }) },
  ];
}

describe("GET /api/auth/invite/[token]", () => {
  it("valid token — 200 with email + role", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(studentRecord);

    const [req, ctx] = makeGetRequest("valid-token");
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBe("student@test.com");
    expect(body.role).toBe("STUDENT");
  });

  it("expired / invalid token — 400", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(null);

    const [req, ctx] = makeGetRequest("bad-token");
    const res = await GET(req, ctx);
    expect(res.status).toBe(400);
  });

  it("already accepted token — 400", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(null);

    const [req, ctx] = makeGetRequest("used-token");
    const res = await GET(req, ctx);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/invite/[token]/accept", () => {
  beforeEach(() => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    // Simulate transaction executing the callback
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (cb: (tx: typeof prisma) => Promise<unknown>) => {
      const txMock = {
        user: { create: jest.fn().mockResolvedValue({ id: "user-1", role: "STUDENT" }) },
        consentRecord: { create: jest.fn() },
        studentProfile: { create: jest.fn() },
        mentorCohortAssignment: { create: jest.fn() },
        inviteToken: { update: jest.fn() },
      };
      return cb(txMock as unknown as typeof prisma);
    });
  });

  it("STUDENT happy path — 201, User + StudentProfile created", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(studentRecord);

    const [req, ctx] = makePostRequest("valid-token", {
      password: "password123",
      tosVersion: "v1.0",
    });
    const res = await POST(req, ctx);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.userId).toBe("user-1");
    expect(body.role).toBe("STUDENT");
  });

  it("MENTOR with cohortId — 201, MentorCohortAssignment created", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(mentorRecord);
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (cb: (tx: typeof prisma) => Promise<unknown>) => {
      const txMock = {
        user: { create: jest.fn().mockResolvedValue({ id: "user-2", role: "MENTOR" }) },
        consentRecord: { create: jest.fn() },
        studentProfile: { create: jest.fn() },
        mentorCohortAssignment: { create: jest.fn() },
        inviteToken: { update: jest.fn() },
      };
      const result = await cb(txMock as unknown as typeof prisma);
      // Verify MentorCohortAssignment was created
      expect(txMock.mentorCohortAssignment.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { mentorId: "user-2", cohortId: "cohort-1" } })
      );
      return result;
    });

    const [req, ctx] = makePostRequest("valid-mentor-token", {
      password: "password123",
      tosVersion: "v1.0",
    });
    const res = await POST(req, ctx);
    expect(res.status).toBe(201);
  });

  it("password too short — 400", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(studentRecord);

    const [req, ctx] = makePostRequest("valid-token", {
      password: "short",
      tosVersion: "v1.0",
    });
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/8 characters/i);
  });

  it("invalid/expired token — 400", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(null);

    const [req, ctx] = makePostRequest("bad-token", {
      password: "password123",
      tosVersion: "v1.0",
    });
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);
  });

  it("duplicate email — 409", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(studentRecord);
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing" });

    const [req, ctx] = makePostRequest("valid-token", {
      password: "password123",
      tosVersion: "v1.0",
    });
    const res = await POST(req, ctx);
    expect(res.status).toBe(409);
  });

  it("missing tosVersion — 400", async () => {
    (validateInviteToken as jest.Mock).mockResolvedValue(studentRecord);

    const [req, ctx] = makePostRequest("valid-token", { password: "password123" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);
  });
});
