import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

const INVITE_TTL_DAYS = 7;

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function inviteExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + INVITE_TTL_DAYS);
  return d;
}

interface IssueInviteParams {
  email: string;
  role: Role;
  orgId: string;
  cohortId?: string;
  createdById: string;
}

// Issue a new invite token.
// Any existing pending (unaccepted) token for the same email + role is invalidated first.
export async function issueInviteToken(params: IssueInviteParams): Promise<string> {
  const { email, role, orgId, cohortId, createdById } = params;

  // Invalidate existing pending tokens for same email + role
  await prisma.inviteToken.updateMany({
    where: { email, role, acceptedAt: null },
    data: { acceptedAt: new Date() }, // mark as "consumed" to invalidate
  });

  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);

  await prisma.inviteToken.create({
    data: {
      email,
      role,
      orgId,
      cohortId: cohortId ?? null,
      tokenHash,
      expiresAt: inviteExpiresAt(),
      createdById,
    },
  });

  return raw;
}

// Validate a raw token. Returns the record if valid, null otherwise.
// Does NOT mark the token as accepted — call acceptInviteToken for that.
export async function validateInviteToken(raw: string) {
  const tokenHash = hashToken(raw);

  const record = await prisma.inviteToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return null;
  if (record.acceptedAt !== null) return null;
  if (new Date() > record.expiresAt) return null;

  return record;
}

// Consume a token (mark as accepted). Returns the record or null if invalid.
export async function consumeInviteToken(raw: string) {
  const record = await validateInviteToken(raw);
  if (!record) return null;

  await prisma.inviteToken.update({
    where: { id: record.id },
    data: { acceptedAt: new Date() },
  });

  return record;
}
