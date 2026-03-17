import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/admin/townhalls/route";
import { GET as getMonitoring } from "@/app/api/admin/townhalls/[id]/monitoring/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    townHall: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    cohort: { findMany: jest.fn() },
    townHallSubmission: { findMany: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const ORG_ID = "org-1";
const TOWN_HALL_ID = "th-1";
const TOWN_HALL_DATE = "2026-03-22T10:00:00.000Z";

const mockTownHall = {
  id: TOWN_HALL_ID,
  orgId: ORG_ID,
  date: new Date(TOWN_HALL_DATE),
  createdAt: new Date(),
};

function makePost(body: unknown, orgId = ORG_ID): NextRequest {
  return new NextRequest("http://localhost/api/admin/townhalls", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-org-id": orgId,
    },
    body: JSON.stringify(body),
  });
}

function makeGet(orgId = ORG_ID): NextRequest {
  return new NextRequest("http://localhost/api/admin/townhalls", {
    method: "GET",
    headers: { "x-org-id": orgId },
  });
}

function makeMonitoring(townHallId: string, orgId = ORG_ID): NextRequest {
  return new NextRequest(
    `http://localhost/api/admin/townhalls/${townHallId}/monitoring`,
    { method: "GET", headers: { "x-org-id": orgId } }
  );
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("POST /api/admin/townhalls", () => {
  it("creates town hall — 201", async () => {
    (mockPrisma.townHall.create as jest.Mock).mockResolvedValue(mockTownHall);
    const res = await POST(makePost({ date: TOWN_HALL_DATE }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.orgId).toBe(ORG_ID);
  });

  it("missing date — 400", async () => {
    const res = await POST(makePost({}));
    expect(res.status).toBe(400);
  });

  it("invalid date string — 400", async () => {
    const res = await POST(makePost({ date: "bad-date" }));
    expect(res.status).toBe(400);
  });

  it("missing x-org-id — 401", async () => {
    const req = new NextRequest("http://localhost/api/admin/townhalls", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date: TOWN_HALL_DATE }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/admin/townhalls", () => {
  it("returns town halls for org — 200", async () => {
    (mockPrisma.townHall.findMany as jest.Mock).mockResolvedValue([
      mockTownHall,
    ]);
    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].orgId).toBe(ORG_ID);
  });

  it("missing x-org-id — 401", async () => {
    const req = new NextRequest("http://localhost/api/admin/townhalls", {
      method: "GET",
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/admin/townhalls/[id]/monitoring", () => {
  const mockCohort = {
    id: "cohort-1",
    name: "Group 1",
    students: [
      { id: "sp-1", userId: "user-1" },
      { id: "sp-2", userId: "user-2" },
      { id: "sp-3", userId: "user-3" },
      { id: "sp-4", userId: "user-4" },
      { id: "sp-5", userId: "user-5" },
    ],
  };

  it("returns per-cohort attendance summary — 200", async () => {
    (mockPrisma.townHall.findUnique as jest.Mock).mockResolvedValue(
      mockTownHall
    );
    (mockPrisma.cohort.findMany as jest.Mock).mockResolvedValue([mockCohort]);
    // 4 submissions, 3 mark user-1 as present → majority (threshold=2) → attended=true
    (mockPrisma.townHallSubmission.findMany as jest.Mock).mockResolvedValue([
      { id: "sub-1", submittedById: "user-1", attended: true, submittedAt: new Date() },
      { id: "sub-2", submittedById: "user-2", attended: false, submittedAt: new Date() },
      { id: "sub-3", submittedById: "user-3", attended: true, submittedAt: new Date() },
      { id: "sub-4", submittedById: "user-4", attended: false, submittedAt: new Date() },
    ]);

    const res = await getMonitoring(
      makeMonitoring(TOWN_HALL_ID),
      mockParams(TOWN_HALL_ID)
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].cohortId).toBe("cohort-1");
    expect(body[0].totalStudents).toBe(5);
    expect(typeof body[0].majorityAttended).toBe("boolean");
    expect(body[0].sentiment).toBeNull();
    // Ensure no reflectionText in response
    expect(JSON.stringify(body)).not.toContain("reflectionText");
  });

  it("town hall not found — 404", async () => {
    (mockPrisma.townHall.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await getMonitoring(
      makeMonitoring("nonexistent"),
      mockParams("nonexistent")
    );
    expect(res.status).toBe(404);
  });

  it("town hall belongs to different org — 403", async () => {
    (mockPrisma.townHall.findUnique as jest.Mock).mockResolvedValue({
      ...mockTownHall,
      orgId: "other-org",
    });
    const res = await getMonitoring(
      makeMonitoring(TOWN_HALL_ID),
      mockParams(TOWN_HALL_ID)
    );
    expect(res.status).toBe(403);
  });

  it("missing x-org-id — 401", async () => {
    const req = new NextRequest(
      `http://localhost/api/admin/townhalls/${TOWN_HALL_ID}/monitoring`,
      { method: "GET" }
    );
    const res = await getMonitoring(req, mockParams(TOWN_HALL_ID));
    expect(res.status).toBe(401);
  });
});
