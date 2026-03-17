import { NextRequest } from "next/server";
import {
  GET as getSubmission,
  POST as submitPL,
} from "@/app/api/student/pl-submissions/[month]/route";
import { POST as uploadReceipt } from "@/app/api/student/pl-submissions/[month]/receipts/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    studentProfile: { findUnique: jest.fn() },
    pLSubmission: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

jest.mock("@/lib/storage/r2", () => ({
  uploadReceipt: jest.fn().mockResolvedValue("https://r2.example.com/receipt.pdf"),
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const USER_ID = "user-1";
const ORG_ID = "org-1";
const STUDENT_ID = "sp-1";
const MONTH = "2026-03";

const mockStudentProfile = { id: STUDENT_ID };
const mockPendingSubmission = {
  id: "sub-1",
  studentId: STUDENT_ID,
  month: MONTH,
  status: "PENDING",
  receiptUrls: [],
  revenue: null,
  expenses: null,
  net: null,
  notes: null,
  autoScore: null,
  finalScore: null,
  submittedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function studentHeaders(extra: Record<string, string> = {}) {
  return {
    "x-user-id": USER_ID,
    "x-user-role": "STUDENT",
    "x-org-id": ORG_ID,
    ...extra,
  };
}

const mockParams = (month: string) => ({ params: Promise.resolve({ month }) });

describe("GET /api/student/pl-submissions/[month]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns submission — 200", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockPendingSubmission
    );

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      { method: "GET", headers: studentHeaders() }
    );
    const res = await getSubmission(req, mockParams(MONTH));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.month).toBe(MONTH);
    // staffScore and spotAudit must not appear
    expect(body.staffScore).toBeUndefined();
    expect(body.spotAudit).toBeUndefined();
  });

  it("not generated yet — 404", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      { method: "GET", headers: studentHeaders() }
    );
    const res = await getSubmission(req, mockParams(MONTH));
    expect(res.status).toBe(404);
  });

  it("invalid month format — 400", async () => {
    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/march-2026`,
      { method: "GET", headers: studentHeaders() }
    );
    const res = await getSubmission(req, mockParams("march-2026"));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/student/pl-submissions/[month]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("submits P&L — 200, correct autoScore (all fields, expenses < 50k)", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockPendingSubmission
    );
    (mockPrisma.pLSubmission.update as jest.Mock).mockResolvedValue({
      ...mockPendingSubmission,
      revenue: 100000,
      expenses: 30000,
      net: 70000,
      notes: "Good month",
      autoScore: 100,
      finalScore: 100,
      status: "SUBMITTED",
      submittedAt: new Date(),
    });

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...studentHeaders() },
        body: JSON.stringify({ revenue: 100000, expenses: 30000, notes: "Good month" }),
      }
    );
    const res = await submitPL(req, mockParams(MONTH));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.autoScore).toBe(100);
    expect(body.net).toBe(70000);
    expect(body.staffScore).toBeUndefined();
    expect(body.spotAudit).toBeUndefined();
  });

  it("re-submission (already SUBMITTED) — 409", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue({
      ...mockPendingSubmission,
      status: "SUBMITTED",
    });

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...studentHeaders() },
        body: JSON.stringify({ revenue: 100000, expenses: 30000 }),
      }
    );
    const res = await submitPL(req, mockParams(MONTH));
    expect(res.status).toBe(409);
  });

  it("negative revenue — 400", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(mockPendingSubmission);

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...studentHeaders() },
        body: JSON.stringify({ revenue: -1000, expenses: 30000 }),
      }
    );
    const res = await submitPL(req, mockParams(MONTH));
    expect(res.status).toBe(400);
  });

  it("non-integer expenses — 400", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(mockPendingSubmission);

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...studentHeaders() },
        body: JSON.stringify({ revenue: 100000, expenses: 30000.5 }),
      }
    );
    const res = await submitPL(req, mockParams(MONTH));
    expect(res.status).toBe(400);
  });

  it("submission not generated — 404", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}`,
      {
        method: "POST",
        headers: { "content-type": "application/json", ...studentHeaders() },
        body: JSON.stringify({ revenue: 100000, expenses: 30000 }),
      }
    );
    const res = await submitPL(req, mockParams(MONTH));
    expect(res.status).toBe(404);
  });
});

describe("POST /api/student/pl-submissions/[month]/receipts", () => {
  beforeEach(() => jest.clearAllMocks());

  it("uploads receipt — 201, URL appended", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockPendingSubmission
    );
    (mockPrisma.pLSubmission.update as jest.Mock).mockResolvedValue({
      id: "sub-1",
      receiptUrls: ["https://r2.example.com/receipt.pdf"],
    });

    const formData = new FormData();
    formData.append(
      "file",
      new Blob(["dummy content"], { type: "application/pdf" }),
      "receipt.pdf"
    );

    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}/receipts`,
      {
        method: "POST",
        headers: { ...studentHeaders() },
        body: formData,
      }
    );

    const res = await uploadReceipt(req, mockParams(MONTH));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.receiptUrls).toHaveLength(1);
    expect(body.receiptUrls[0]).toContain("r2.example.com");
  });

  it("no file provided — 400", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.pLSubmission.findUnique as jest.Mock).mockResolvedValue(mockPendingSubmission);

    const formData = new FormData();
    const req = new NextRequest(
      `http://localhost/api/student/pl-submissions/${MONTH}/receipts`,
      { method: "POST", headers: studentHeaders(), body: formData }
    );

    const res = await uploadReceipt(req, mockParams(MONTH));
    expect(res.status).toBe(400);
  });
});
