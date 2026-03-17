import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/student/pledge/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    pledgeRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(body: unknown, userId = "user-1"): NextRequest {
  return new NextRequest("http://localhost/api/student/pledge", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-id": userId,
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(userId = "user-1"): NextRequest {
  return new NextRequest("http://localhost/api/student/pledge", {
    method: "GET",
    headers: { "x-user-id": userId },
  });
}

const mockRecord = {
  id: "pledge-1",
  userId: "user-1",
  pledgeVersion: "v1.0",
  ipAddress: "1.2.3.4",
  signedAt: new Date("2026-01-01"),
};

describe("POST /api/student/pledge", () => {
  it("happy path — 201, record created with correct userId + IP", async () => {
    (mockPrisma.pledgeRecord.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.pledgeRecord.create as jest.Mock).mockResolvedValue(mockRecord);

    const res = await POST(makeRequest({ pledgeVersion: "v1.0" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.pledgeVersion).toBe("v1.0");
    expect(mockPrisma.pledgeRecord.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          pledgeVersion: "v1.0",
          ipAddress: "1.2.3.4",
        }),
      })
    );
  });

  it("second attempt — 409", async () => {
    (mockPrisma.pledgeRecord.findUnique as jest.Mock).mockResolvedValue(mockRecord);

    const res = await POST(makeRequest({ pledgeVersion: "v1.0" }));
    expect(res.status).toBe(409);
  });

  it("missing pledgeVersion — 400", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/pledgeVersion/i);
  });

  it("empty pledgeVersion string — 400", async () => {
    const res = await POST(makeRequest({ pledgeVersion: "  " }));
    expect(res.status).toBe(400);
  });

  it("missing x-user-id — 400", async () => {
    const req = new NextRequest("http://localhost/api/student/pledge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pledgeVersion: "v1.0" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/student/pledge", () => {
  it("signed student — returns signed:true + pledgeVersion + signedAt", async () => {
    (mockPrisma.pledgeRecord.findUnique as jest.Mock).mockResolvedValue(mockRecord);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.signed).toBe(true);
    expect(body.pledgeVersion).toBe("v1.0");
    expect(body.signedAt).toBeDefined();
  });

  it("unsigned student — returns signed:false", async () => {
    (mockPrisma.pledgeRecord.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.signed).toBe(false);
  });

  it("missing x-user-id — 400", async () => {
    const req = new NextRequest("http://localhost/api/student/pledge", {
      method: "GET",
    });
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});
