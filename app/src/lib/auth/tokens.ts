import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signRefreshToken, verifyRefreshToken } from "./jwt";

const REFRESH_TTL_DAYS = 30;

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function refreshExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TTL_DAYS);
  return d;
}

// Issue a new refresh token, store its hash in DB, return the signed JWT.
export async function issueRefreshToken(userId: string): Promise<string> {
  const id = crypto.randomUUID();
  const raw = signRefreshToken({ sub: userId, jti: id });
  const tokenHash = hashToken(raw);

  await prisma.refreshToken.create({
    data: {
      id,
      userId,
      tokenHash,
      expiresAt: refreshExpiresAt(),
    },
  });

  return raw;
}

// Rotate: validate existing token, invalidate it, issue a new one.
// Returns the new refresh token string.
export async function rotateRefreshToken(raw: string): Promise<string> {
  const payload = verifyRefreshToken(raw); // throws if expired/invalid
  const tokenHash = hashToken(raw);

  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.rotatedAt !== null || new Date() > record.expiresAt) {
    // Token reuse detected or already expired — invalidate all tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId: payload.sub, rotatedAt: null },
      data: { rotatedAt: new Date() },
    });
    throw new Error("Invalid or reused refresh token");
  }

  // Invalidate the old token
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { rotatedAt: new Date() },
  });

  return issueRefreshToken(payload.sub);
}

// Revoke all active refresh tokens for a user (logout).
export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, rotatedAt: null },
    data: { rotatedAt: new Date() },
  });
}

// ─── Password Reset Tokens ────────────────────────────────────────────────────

const RESET_TTL_MINUTES = 60;

function resetExpiresAt(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + RESET_TTL_MINUTES);
  return d;
}

export async function issuePasswordResetToken(userId: string): Promise<string> {
  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);

  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt: resetExpiresAt() },
  });

  return raw;
}

export async function consumePasswordResetToken(
  raw: string
): Promise<string | null> {
  const tokenHash = hashToken(raw);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.usedAt !== null || new Date() > record.expiresAt) {
    return null;
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.userId;
}
