import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/admin/checkin-sessions/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    cohort: { findFirst: jest.fn() },
    checkInSession: { create: jest.fn(), findMany: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const ORG_ID = "org-1";
const COHORT_ID = "cohort-1";
const SESSION_DATE = "2026-03-18T10:00:00.000Z";

const mockCohort = { id: COHORT_ID, orgId: ORG_ID, name: "Group 1" };
const mockSession = {
  id: "session-1",
  cohortId: COHORT_ID,
  date: new Date(SESSION_DATE),
  note: null,
  attendanceSubmittedAt: null,
  createdAt: new Date(),
};

function makePost(
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest("http://localhost/api/admin/checkin-sessions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-org-id": ORG_ID,
      "x-user-role": "STAFF",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function makeGet(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("http://localhost/api/admin/checkin-sessions", {
    method: "GET",
    headers: { "x-org-id": ORG_ID, ...headers },
  });
}

describe("POST /api/admin/checkin-sessions", () => {
  it("creates session — 201", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);
    (mockPrisma.checkInSession.create as jest.Mock).mockResolvedValue(
      mockSession
    );

    const res = await POST(makePost({ date: SESSION_DATE, cohortId: COHORT_ID }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.cohortId).toBe(COHORT_ID);
  });

  it("missing date — 400", async () => {
    const res = await POST(makePost({ cohortId: COHORT_ID }));
    expect(res.status).toBe(400);
  });

  it("invalid date string — 400", async () => {
    const res = await POST(
      makePost({ date: "not-a-date", cohortId: COHORT_ID })
    );
    expect(res.status).toBe(400);
  });

  it("missing cohortId — 400", async () => {
    const res = await POST(makePost({ date: SESSION_DATE }));
    expect(res.status).toBe(400);
  });

  it("cohort not in org — 403", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);
    const res = await POST(
      makePost({ date: SESSION_DATE, cohortId: "other-cohort" })
    );
    expect(res.status).toBe(403);
  });

  it("missing x-org-id — 401", async () => {
    const res = await POST(
      makePost({ date: SESSION_DATE, cohortId: COHORT_ID }, { "x-org-id": "" })
    );
    expect(res.status).toBe(401);
  });
});

describe("GET /api/admin/checkin-sessions", () => {
  it("returns sessions for org — 200", async () => {
    (mockPrisma.checkInSession.findMany as jest.Mock).mockResolvedValue([
      { ...mockSession, cohort: { id: COHORT_ID, name: "Group 1" } },
    ]);

    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].cohortId).toBe(COHORT_ID);
  });

  it("missing x-org-id — 401", async () => {
    const res = await GET(makeGet({ "x-org-id": "" }));
    expect(res.status).toBe(401);
  });
});
