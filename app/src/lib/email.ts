import { Resend } from "resend";

// Lazy-initialized so tests can load this module without a real API key.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "noreply@mujin.jp";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://mujin.jp";

export async function sendActivationEmail(
  to: string,
  activationUrl: string,
  role: "STUDENT" | "MENTOR"
): Promise<void> {
  const label = role === "MENTOR" ? "mentor" : "student";
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "You've been accepted — activate your Mujin account",
    html: `
      <p>Congratulations! You have been accepted into the Mujin programme as a <strong>${label}</strong>.</p>
      <p><a href="${activationUrl}">Click here to activate your account</a></p>
      <p>This link expires in 7 days.</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Reset your Mujin password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 60 minutes. If you did not request this, you can safely ignore it.</p>
    `,
  });
}

// ── Application status emails ──────────────────────────────────────────────────

export async function sendApplicationAcceptedEmail(
  to: string,
  activationUrl: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Congratulations — You've been accepted into the Mujin Programme",
    html: `
      <p>Dear applicant,</p>
      <p>We are delighted to inform you that your application to the <strong>Mujin Venture Scholarship Programme</strong> has been accepted.</p>
      <p>Please click the link below to activate your account and begin your onboarding:</p>
      <p><a href="${activationUrl}">Activate your Mujin account →</a></p>
      <p>This link expires in 7 days. If you have any questions, please reply to this email.</p>
      <p>We look forward to walking this journey with you.</p>
      <p>— The Mujin Team</p>
    `,
  });
}

export async function sendApplicationRejectedEmail(
  to: string,
  note?: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Mujin Programme — Application Update",
    html: `
      <p>Dear applicant,</p>
      <p>Thank you for taking the time to apply to the Mujin Venture Scholarship Programme.</p>
      <p>After careful review, we are unable to offer you a place in the current cohort.</p>
      ${note ? `<p><strong>Note from our team:</strong> ${note}</p>` : ""}
      <p>We encourage you to apply again in a future cohort. Thank you for your interest in Mujin.</p>
      <p>— The Mujin Team</p>
    `,
  });
}

export async function sendApplicationWaitlistedEmail(
  to: string,
  note?: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Mujin Programme — You've been waitlisted",
    html: `
      <p>Dear applicant,</p>
      <p>Thank you for applying to the Mujin Venture Scholarship Programme.</p>
      <p>We are pleased to let you know that you have been placed on our <strong>waitlist</strong> for the current cohort. We will contact you if a place becomes available.</p>
      ${note ? `<p><strong>Note from our team:</strong> ${note}</p>` : ""}
      <p>— The Mujin Team</p>
    `,
  });
}

// ── S9.1 — P&L submission reminder (student, 7 days before month end) ─────────

export async function sendPLReminderEmail(to: string, month: string): Promise<void> {
  const displayMonth = new Date(month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Reminder: Your ${displayMonth} P&L report is due soon`,
    html: `
      <p>Hi,</p>
      <p>Your monthly P&L report for <strong>${displayMonth}</strong> is due at the end of this month.</p>
      <p><a href="${BASE_URL}/dashboard/student/pl/${month}">Submit your report now →</a></p>
      <p>Stay consistent — your Transparency score depends on timely submission.</p>
    `,
  });
}

// ── S9.2 — P&L overdue alert (student, day after deadline missed) ──────────────

export async function sendPLOverdueEmail(to: string, month: string): Promise<void> {
  const displayMonth = new Date(month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Overdue: Your ${displayMonth} P&L report has not been submitted`,
    html: `
      <p>Hi,</p>
      <p>Your P&L report for <strong>${displayMonth}</strong> was due yesterday and has not been submitted.</p>
      <p>Your Transparency score for this month will be affected. Please submit as soon as possible.</p>
      <p><a href="${BASE_URL}/dashboard/student/pl/${month}">Submit your report →</a></p>
    `,
  });
}

// ── S9.3 — Graduation eligible alert (staff) ───────────────────────────────────

export async function sendGraduationEligibleEmail(
  to: string,
  studentEmail: string,
  studentId: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Student eligible for graduation: ${studentEmail}`,
    html: `
      <p>Hi,</p>
      <p>A student has met all graduation criteria and is now eligible for their exit interview.</p>
      <p><strong>Student:</strong> ${studentEmail}</p>
      <p><a href="${BASE_URL}/dashboard/admin/students/${studentId}">View student profile and schedule interview →</a></p>
    `,
  });
}

// ── S9.4 — Red score alert (staff) ─────────────────────────────────────────────

export async function sendRedScoreAlertEmail(
  to: string,
  studentEmail: string,
  studentId: string,
  score: number,
  month: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Red score alert: ${studentEmail} — ${month}`,
    html: `
      <p>Hi,</p>
      <p>A student's Trust Score has dropped to <strong>RED (${Math.round(score)})</strong> for ${month}.</p>
      <p><strong>Student:</strong> ${studentEmail}</p>
      <p><a href="${BASE_URL}/dashboard/admin/students/${studentId}">View student profile →</a></p>
    `,
  });
}

// ── S9.5 — Check-in session reminder (staff, 24hrs before) ────────────────────

export async function sendCheckInReminderEmail(
  to: string,
  cohortName: string,
  sessionDate: Date
): Promise<void> {
  const displayDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Reminder: Check-in session tomorrow — ${cohortName}`,
    html: `
      <p>Hi,</p>
      <p>You have a check-in session scheduled for <strong>${cohortName}</strong> tomorrow.</p>
      <p><strong>Date:</strong> ${displayDate}</p>
      <p>Remember to log attendance in the Mujin dashboard after the session.</p>
      <p><a href="${BASE_URL}/dashboard/mentor">Go to your dashboard →</a></p>
    `,
  });
}
