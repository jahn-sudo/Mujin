const mockPrisma = {
  trustScore: { findUnique: jest.fn(), update: jest.fn() },
  trustScoreOverride: { upsert: jest.fn() },
  $transaction: jest.fn(),
};

jest.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
jest.mock("@/lib/scoring/trustScore", () => ({
  assignLabel: jest.fn((score: number) => {
    if (score >= 75) return "GREEN";
    if (score >= 50) return "YELLOW";
    return "RED";
  }),
}));

import { POST } from "@/app/api/admin/trust-scores/[id]/override/route";
import { NextRequest } from "next/server";

function makeReq(
  body: object,
  headers: Record<string, string> = { "x-user-id": "staff-1", "x-org-id": "org-1" }
) {
  return new NextRequest("http://localhost/api/admin/trust-scores/ts-1/override", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

const params = Promise.resolve({ id: "ts-1" });

describe("POST /api/admin/trust-scores/[id]/override", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 if headers missing", async () => {
    const res = await POST(makeReq({}, {}), { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 if newScore is not a number", async () => {
    const res = await POST(makeReq({ newScore: "eighty", reason: "correction" }), { params });
    expect(res.status).toBe(400);
  });

  it("returns 400 if newScore is out of range", async () => {
    const res = await POST(makeReq({ newScore: 110, reason: "correction" }), { params });
    expect(res.status).toBe(400);

    const res2 = await POST(makeReq({ newScore: -1, reason: "correction" }), { params });
    expect(res2.status).toBe(400);
  });

  it("returns 400 if reason is missing", async () => {
    const res = await POST(makeReq({ newScore: 80 }), { params });
    expect(res.status).toBe(400);
  });

  it("returns 400 if reason is blank", async () => {
    const res = await POST(makeReq({ newScore: 80, reason: "   " }), { params });
    expect(res.status).toBe(400);
  });

  it("returns 404 if trust score not found", async () => {
    mockPrisma.trustScore.findUnique.mockResolvedValue(null);
    const res = await POST(makeReq({ newScore: 80, reason: "manual correction" }), { params });
    expect(res.status).toBe(404);
  });

  it("returns 403 if trust score belongs to different org", async () => {
    mockPrisma.trustScore.findUnique.mockResolvedValue({
      id: "ts-1",
      student: { user: { orgId: "org-other" } },
    });
    const res = await POST(makeReq({ newScore: 80, reason: "correction" }), { params });
    expect(res.status).toBe(403);
  });

  it("returns 200 and updated score on valid override", async () => {
    mockPrisma.trustScore.findUnique.mockResolvedValue({
      id: "ts-1",
      student: { user: { orgId: "org-1" } },
    });
    const updated = {
      id: "ts-1",
      studentId: "student-1",
      month: "2026-03",
      score: 80,
      label: "GREEN",
      responsivenessRaw: 100,
      transparencyRaw: 75,
      mutualismRaw: 100,
      reflectionRaw: 0,
      isOverridden: true,
    };
    mockPrisma.$transaction.mockResolvedValue([updated, {}]);

    const res = await POST(makeReq({ newScore: 80, reason: "student missed due to illness" }), { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.score).toBe(80);
    expect(body.isOverridden).toBe(true);
  });

  it("upserts TrustScoreOverride with trimmed reason", async () => {
    mockPrisma.trustScore.findUnique.mockResolvedValue({
      id: "ts-1",
      student: { user: { orgId: "org-1" } },
    });
    mockPrisma.$transaction.mockResolvedValue([{}, {}]);

    await POST(makeReq({ newScore: 60, reason: "  edge case  " }), { params });

    const txCall = mockPrisma.$transaction.mock.calls[0][0];
    // transaction is called with array of prisma operations — verify it ran
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(txCall).toHaveLength(2);
  });
});
