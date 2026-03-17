import { NextRequest } from "next/server";
import { GET as getSessionsList } from "@/app/api/mentor/checkin-sessions/route";
import {
  POST as postAttendance,
  GET as getAttendance,
} from "@/app/api/mentor/checkin-sessions/[id]/attendance/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    mentorCohortAssignment: { findUnique: jest.fn() },
    checkInSession: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    attendanceRecord: { createMany: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const MENTOR_ID = "mentor-1";
const COHORT_ID = "cohort-1";
const SESSION_ID = "session-1";
const OTHER_COHORT_ID = "cohort-99";

const mockAssignment = { mentorId: MENTOR_ID, cohortId: COHORT_ID };
const mockSession = {
  id: SESSION_ID,
  cohortId: COHORT_ID,
  date: new Date("2026-03-18"),
  note: null,
  attendanceSubmittedAt: null,
  createdAt: new Date(),
};
const mockSessionLocked = { ...mockSession, attendanceSubmittedAt: new Date() };
const mockSessionOtherCohort = { ...mockSession, cohortId: OTHER_COHORT_ID };

function mentorHeaders(extra: Record<string, string> = {}) {
  return { "x-user-id": MENTOR_ID, "x-user-role": "MENTOR", ...extra };
}

function makeGetList(): NextRequest {
  return new NextRequest("http://localhost/api/mentor/checkin-sessions", {
    method: "GET",
    headers: mentorHeaders(),
  });
}

function makeAttendancePost(
  sessionId: string,
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(
    `http://localhost/api/mentor/checkin-sessions/${sessionId}/attendance`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...mentorHeaders(),
        ...headers,
      },
      body: JSON.stringify(body),
    }
  );
}

function makeAttendanceGet(
  sessionId: string,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(
    `http://localhost/api/mentor/checkin-sessions/${sessionId}/attendance`,
    { method: "GET", headers: { ...mentorHeaders(), ...headers } }
  );
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

const validRecords = [
  { studentProfileId: "sp-1", present: true },
  { studentProfileId: "sp-2", present: false },
];

describe("GET /api/mentor/checkin-sessions", () => {
  it("returns sessions for mentor cohort — 200", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findMany as jest.Mock).mockResolvedValue([
      mockSession,
    ]);

    const res = await getSessionsList(makeGetList());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].cohortId).toBe(COHORT_ID);
  });

  it("no assignment — 404", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    const res = await getSessionsList(makeGetList());
    expect(res.status).toBe(404);
  });

  it("missing x-user-id — 401", async () => {
    const req = new NextRequest(
      "http://localhost/api/mentor/checkin-sessions",
      { method: "GET" }
    );
    const res = await getSessionsList(req);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/mentor/checkin-sessions/[id]/attendance", () => {
  it("submits attendance — 201", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSession
    );
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([{ count: 2 }, mockSession]);

    const res = await postAttendance(
      makeAttendancePost(SESSION_ID, { records: validRecords }),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.created).toBe(2);
  });

  it("re-submission (locked) — 409", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSessionLocked
    );

    const res = await postAttendance(
      makeAttendancePost(SESSION_ID, { records: validRecords }),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/contact staff/i);
  });

  it("session belongs to different cohort — 403", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSessionOtherCohort
    );

    const res = await postAttendance(
      makeAttendancePost(SESSION_ID, { records: validRecords }),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(403);
  });

  it("empty records array — 400", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSession
    );

    const res = await postAttendance(
      makeAttendancePost(SESSION_ID, { records: [] }),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(400);
  });

  it("malformed record (missing present) — 400", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSession
    );

    const res = await postAttendance(
      makeAttendancePost(SESSION_ID, {
        records: [{ studentProfileId: "sp-1" }],
      }),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(400);
  });

  it("no mentor assignment — 403", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      null
    );

    const res = await postAttendance(
      makeAttendancePost(SESSION_ID, { records: validRecords }),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(403);
  });

  it("missing x-user-id — 401", async () => {
    const req = new NextRequest(
      `http://localhost/api/mentor/checkin-sessions/${SESSION_ID}/attendance`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ records: validRecords }),
      }
    );
    const res = await postAttendance(req, mockParams(SESSION_ID));
    expect(res.status).toBe(401);
  });
});

describe("GET /api/mentor/checkin-sessions/[id]/attendance", () => {
  it("returns attendance records — 200", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSession
    );
    (mockPrisma.attendanceRecord.findMany as jest.Mock).mockResolvedValue([
      {
        id: "ar-1",
        studentProfileId: "sp-1",
        checkInSessionId: SESSION_ID,
        present: true,
        createdAt: new Date(),
        studentProfile: { id: "sp-1", userId: "user-1" },
      },
    ]);

    const res = await getAttendance(
      makeAttendanceGet(SESSION_ID),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].present).toBe(true);
  });

  it("session belongs to different cohort — 403", async () => {
    (mockPrisma.mentorCohortAssignment.findUnique as jest.Mock).mockResolvedValue(
      mockAssignment
    );
    (mockPrisma.checkInSession.findUnique as jest.Mock).mockResolvedValue(
      mockSessionOtherCohort
    );

    const res = await getAttendance(
      makeAttendanceGet(SESSION_ID),
      mockParams(SESSION_ID)
    );
    expect(res.status).toBe(403);
  });
});
