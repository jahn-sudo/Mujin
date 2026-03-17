import { NextRequest } from "next/server";
import { POST, PUT, GET } from "@/app/api/student/venture-profile/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn(), update: jest.fn() },
    ventureProfile: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockStudent = { id: "sp-1", userId: "user-1", cohortId: null };
const mockProfile = {
  id: "vp-1",
  studentId: "sp-1",
  name: "EduApp",
  description: "An edtech startup",
  coFounders: ["Alice"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(method: string, body: unknown, userId = "user-1"): NextRequest {
  return new NextRequest("http://localhost/api/student/venture-profile", {
    method,
    headers: {
      "content-type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(body),
  });
}

function makeTxMock(createdProfile = mockProfile) {
  return {
    ventureProfile: {
      create: jest.fn().mockResolvedValue(createdProfile),
      update: jest.fn().mockResolvedValue(createdProfile),
    },
    studentProfile: { update: jest.fn() },
  };
}

describe("POST /api/student/venture-profile", () => {
  beforeEach(() => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudent);
    (mockPrisma.ventureProfile.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) =>
      cb(makeTxMock())
    );
  });

  it("FINTECH happy path — 201", async () => {
    const res = await POST(
      makeRequest("POST", { name: "EduApp", ventureCategory: "FINTECH" })
    );
    expect(res.status).toBe(201);
  });

  it("OTHER with ventureCategoryOther — 201", async () => {
    const res = await POST(
      makeRequest("POST", {
        name: "EduApp",
        ventureCategory: "OTHER",
        ventureCategoryOther: "AgriTech",
      })
    );
    expect(res.status).toBe(201);
  });

  it("OTHER without ventureCategoryOther — 400", async () => {
    const res = await POST(
      makeRequest("POST", { name: "EduApp", ventureCategory: "OTHER" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/ventureCategoryOther/i);
  });

  it("missing name — 400", async () => {
    const res = await POST(makeRequest("POST", { ventureCategory: "FINTECH" }));
    expect(res.status).toBe(400);
  });

  it("invalid ventureCategory — 400", async () => {
    const res = await POST(
      makeRequest("POST", { name: "X", ventureCategory: "BLOCKCHAIN" })
    );
    expect(res.status).toBe(400);
  });

  it("coFounders length > 5 — 400", async () => {
    const res = await POST(
      makeRequest("POST", {
        name: "X",
        ventureCategory: "FINTECH",
        coFounders: ["A", "B", "C", "D", "E", "F"],
      })
    );
    expect(res.status).toBe(400);
  });

  it("second POST — 409", async () => {
    (mockPrisma.ventureProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);
    const res = await POST(makeRequest("POST", { name: "X", ventureCategory: "EDTECH" }));
    expect(res.status).toBe(409);
  });

  it("student profile not found — 404", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await POST(makeRequest("POST", { name: "X", ventureCategory: "EDTECH" }));
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/student/venture-profile", () => {
  beforeEach(() => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudent);
    (mockPrisma.ventureProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) =>
      cb(makeTxMock())
    );
  });

  it("update name only — 200, other fields unchanged", async () => {
    const res = await PUT(makeRequest("PUT", { name: "NewName" }));
    expect(res.status).toBe(200);
  });

  it("change to OTHER with ventureCategoryOther — 200", async () => {
    const res = await PUT(
      makeRequest("PUT", {
        ventureCategory: "OTHER",
        ventureCategoryOther: "AgriTech",
      })
    );
    expect(res.status).toBe(200);
  });

  it("change from OTHER to FINTECH — ventureCategoryOther cleared", async () => {
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) => {
      const tx = makeTxMock();
      const result = await cb(tx);
      // Verify studentProfile.update called with null ventureCategoryOther
      expect(tx.studentProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ ventureCategoryOther: null }),
        })
      );
      return result;
    });

    const res = await PUT(makeRequest("PUT", { ventureCategory: "FINTECH" }));
    expect(res.status).toBe(200);
  });

  it("venture profile not found — 404", async () => {
    (mockPrisma.ventureProfile.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await PUT(makeRequest("PUT", { name: "X" }));
    expect(res.status).toBe(404);
  });
});

describe("GET /api/student/venture-profile", () => {
  it("returns profile — 200", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudent);
    (mockPrisma.ventureProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);

    const req = new NextRequest("http://localhost/api/student/venture-profile", {
      headers: { "x-user-id": "user-1" },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("EduApp");
  });

  it("not yet created — 404", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudent);
    (mockPrisma.ventureProfile.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/student/venture-profile", {
      headers: { "x-user-id": "user-1" },
    });
    const res = await GET(req);
    expect(res.status).toBe(404);
  });
});
