import { NextRequest } from "next/server";
import { POST } from "@/app/api/student/townhalls/[id]/submit/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    townHall: { findUnique: jest.fn() },
    townHallSubmission: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    studentProfile: { findUnique: jest.fn(), findMany: jest.fn() },
  },
}));

jest.mock("@/lib/attendance/majorityRule", () => ({
  computeMajorityAttendance: jest.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const USER_ID = "user-1";
const TOWN_HALL_ID = "th-1";
const COHORT_ID = "cohort-1";

const mockTownHall = {
  id: TOWN_HALL_ID,
  orgId: "org-1",
  date: new Date("2026-03-22"),
  createdAt: new Date(),
};

const mockStudentProfile = { cohortId: COHORT_ID };

const cohortMembers = [
  { userId: "user-1" },
  { userId: "user-2" },
  { userId: "user-3" },
  { userId: "user-4" },
  { userId: "user-5" },
];

const validBody = {
  attendeeIds: ["user-1", "user-2", "user-3"],
  reflectionText: "This month I learned a lot about market validation. Our team struggled with pricing but we kept iterating. I noticed peers facing similar challenges.",
};

const mockCreatedSubmission = {
  id: "sub-1",
  townHallId: TOWN_HALL_ID,
  submittedById: USER_ID,
  attendeeIds: validBody.attendeeIds,
  attended: null,
  submittedAt: new Date(),
};

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(
    `http://localhost/api/student/townhalls/${TOWN_HALL_ID}/submit`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-user-id": USER_ID,
        "x-user-role": "STUDENT",
        ...headers,
      },
      body: JSON.stringify(body),
    }
  );
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("POST /api/student/townhalls/[id]/submit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockPrisma.townHall.findUnique as jest.Mock).mockResolvedValue(mockTownHall);
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(mockStudentProfile);
    (mockPrisma.studentProfile.findMany as jest.Mock).mockResolvedValue(cohortMembers);
    (mockPrisma.townHallSubmission.create as jest.Mock).mockResolvedValue(mockCreatedSubmission);
  });

  it("creates submission — 201, no reflectionText in response", async () => {
    const res = await POST(makeRequest(validBody), mockParams(TOWN_HALL_ID));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe("sub-1");
    expect(body.reflectionText).toBeUndefined();
  });

  it("duplicate submission — 409", async () => {
    (mockPrisma.townHallSubmission.findUnique as jest.Mock).mockResolvedValue(
      mockCreatedSubmission
    );
    const res = await POST(makeRequest(validBody), mockParams(TOWN_HALL_ID));
    expect(res.status).toBe(409);
  });

  it("town hall not found — 404", async () => {
    (mockPrisma.townHall.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await POST(makeRequest(validBody), mockParams(TOWN_HALL_ID));
    expect(res.status).toBe(404);
  });

  it("attendeeIds contains user not in cohort — 400", async () => {
    const res = await POST(
      makeRequest({ ...validBody, attendeeIds: ["user-1", "outsider-99"] }),
      mockParams(TOWN_HALL_ID)
    );
    expect(res.status).toBe(400);
  });

  it("missing reflectionText — 400", async () => {
    const res = await POST(
      makeRequest({ attendeeIds: ["user-1"] }),
      mockParams(TOWN_HALL_ID)
    );
    expect(res.status).toBe(400);
  });

  it("empty reflectionText — 400", async () => {
    const res = await POST(
      makeRequest({ attendeeIds: [], reflectionText: "   " }),
      mockParams(TOWN_HALL_ID)
    );
    expect(res.status).toBe(400);
  });

  it("attendeeIds not an array — 400", async () => {
    const res = await POST(
      makeRequest({ attendeeIds: "user-1", reflectionText: validBody.reflectionText }),
      mockParams(TOWN_HALL_ID)
    );
    expect(res.status).toBe(400);
  });

  it("student not in a cohort — 403", async () => {
    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      cohortId: null,
    });
    const res = await POST(makeRequest(validBody), mockParams(TOWN_HALL_ID));
    expect(res.status).toBe(403);
  });

  it("missing x-user-id — 401", async () => {
    const req = new NextRequest(
      `http://localhost/api/student/townhalls/${TOWN_HALL_ID}/submit`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody),
      }
    );
    const res = await POST(req, mockParams(TOWN_HALL_ID));
    expect(res.status).toBe(401);
  });
});
