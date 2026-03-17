import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendPLReminderEmail,
  sendPLOverdueEmail,
  sendCheckInReminderEmail,
} from "@/lib/email";

/**
 * POST /api/cron/send-notifications
 *
 * Designed to be called daily by Vercel Cron (see vercel.json).
 * Protected by CRON_SECRET header.
 *
 * Date-based dispatch:
 *   Day 24 of month  → S9.1: P&L reminder emails to students with PENDING submissions
 *   Day  1 of month  → S9.2: P&L overdue emails to students with previous-month PENDING submissions
 *   Every day        → S9.5: Check-in session reminder to mentors for sessions tomorrow
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-based

  const currentMonth = `${year}-${String(month).padStart(2, "0")}`;
  const prevMonthDate = new Date(year, month - 2, 1);
  const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const results: Record<string, number> = {
    plReminders: 0,
    plOverdue: 0,
    checkInReminders: 0,
  };

  // ── S9.1: P&L reminder — runs on day 24 ─────────────────────────────────────
  if (day === 24) {
    const pending = await prisma.pLSubmission.findMany({
      where: { month: currentMonth, status: "PENDING" },
      include: { student: { include: { user: { select: { email: true } } } } },
    });

    await Promise.allSettled(
      pending.map((sub) =>
        sendPLReminderEmail(sub.student.user.email, currentMonth)
      )
    );
    results.plReminders = pending.length;
  }

  // ── S9.2: P&L overdue — runs on day 1 ───────────────────────────────────────
  if (day === 1) {
    const overdue = await prisma.pLSubmission.findMany({
      where: { month: prevMonth, status: "PENDING" },
      include: { student: { include: { user: { select: { email: true } } } } },
    });

    await Promise.allSettled(
      overdue.map((sub) =>
        sendPLOverdueEmail(sub.student.user.email, prevMonth)
      )
    );
    results.plOverdue = overdue.length;
  }

  // ── S9.5: Check-in session reminder — runs every day ────────────────────────
  // Find sessions scheduled in the next 24–48 hours (tomorrow window)
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const upcomingSessions = await prisma.checkInSession.findMany({
    where: {
      date: { gte: tomorrowStart, lte: tomorrowEnd },
      attendanceSubmittedAt: null,
    },
    include: {
      cohort: {
        include: {
          mentorAssignment: {
            include: {
              mentor: { select: { email: true, orgId: true } },
            },
          },
          org: {
            include: {
              users: {
                where: {
                  role: { in: ["STAFF", "ORG_ADMIN"] },
                  deletedAt: null,
                },
                select: { email: true },
              },
            },
          },
        },
      },
    },
  });

  for (const session of upcomingSessions) {
    const recipients: string[] = [];

    // Cohort mentor
    if (session.cohort.mentorAssignment?.mentor.email) {
      recipients.push(session.cohort.mentorAssignment.mentor.email);
    }
    // Org staff
    for (const u of session.cohort.org.users) {
      if (!recipients.includes(u.email)) recipients.push(u.email);
    }

    await Promise.allSettled(
      recipients.map((email) =>
        sendCheckInReminderEmail(email, session.cohort.name, session.date)
      )
    );
    results.checkInReminders += recipients.length;
  }

  return NextResponse.json({ ok: true, results });
}
