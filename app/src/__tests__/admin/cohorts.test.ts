import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/admin/cohorts/route";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    cohort: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest("http://localhost/api/admin/cohorts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-org-id": "org-1",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("http://localhost/api/admin/cohorts", {
    method: "GET",
    headers: { "x-org-id": "org-1", ...headers },
  });
}

const mockCohort = {
  id: "cohort-1",
  name: "Alpha",
  orgId: "org-1",
  maxStudents: 5,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("POST /api/admin/cohorts", () => {
  it("creates a cohort with defaults — 201", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.cohort.create as jest.Mock).mockResolvedValue(mockCohort);

    const res = await POST(makeRequest({ name: "Alpha" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Alpha");
    expect(body.orgId).toBe("org-1");
  });

  it("creates a cohort with explicit maxStudents — 201", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.cohort.create as jest.Mock).mockResolvedValue({
      ...mockCohort,
      maxStudents: 3,
    });

    const res = await POST(makeRequest({ name: "Beta", maxStudents: 3 }));
    expect(res.status).toBe(201);
  });

  it("missing name — 400", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/name/i);
  });

  it("empty name string — 400", async () => {
    const res = await POST(makeRequest({ name: "   " }));
    expect(res.status).toBe(400);
  });

  it("maxStudents = 0 — 400", async () => {
    const res = await POST(makeRequest({ name: "X", maxStudents: 0 }));
    expect(res.status).toBe(400);
  });

  it("maxStudents = 11 — 400", async () => {
    const res = await POST(makeRequest({ name: "X", maxStudents: 11 }));
    expect(res.status).toBe(400);
  });

  it("maxStudents = 1.5 (non-integer) — 400", async () => {
    const res = await POST(makeRequest({ name: "X", maxStudents: 1.5 }));
    expect(res.status).toBe(400);
  });

  it("duplicate name same org — 409", async () => {
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(mockCohort);

    const res = await POST(makeRequest({ name: "Alpha" }));
    expect(res.status).toBe(409);
  });

  it("duplicate name different org is allowed — 201", async () => {
    // findFirst scoped to orgId — returns null (different org has the name, not this one)
    (mockPrisma.cohort.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.cohort.create as jest.Mock).mockResolvedValue({
      ...mockCohort,
      orgId: "org-2",
    });

    const res = await POST(
      makeRequest({ name: "Alpha" }, { "x-org-id": "org-2" })
    );
    expect(res.status).toBe(201);
  });

  it("missing x-org-id header — 400", async () => {
    const req = new NextRequest("http://localhost/api/admin/cohorts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "X" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/admin/cohorts", () => {
  it("returns cohorts for org ordered by createdAt asc — 200", async () => {
    (mockPrisma.cohort.findMany as jest.Mock).mockResolvedValue([mockCohort]);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].orgId).toBe("org-1");

    expect(mockPrisma.cohort.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { orgId: "org-1" },
        orderBy: { createdAt: "asc" },
      })
    );
  });

  it("returns empty array when no cohorts — 200", async () => {
    (mockPrisma.cohort.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it("missing x-org-id — 400", async () => {
    const req = new NextRequest("http://localhost/api/admin/cohorts", {
      method: "GET",
    });
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});
