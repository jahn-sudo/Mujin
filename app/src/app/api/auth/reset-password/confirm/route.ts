import { NextRequest, NextResponse } from "next/server";
import { prisma, TxClient } from "@/lib/prisma";
import { consumePasswordResetToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { revokeAllRefreshTokens } from "@/lib/auth/tokens";

// S1.7 — Password reset: confirm with token + new password
export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Missing token or new password" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const userId = await consumePasswordResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx: TxClient) => {
      await tx.user.update({ where: { id: userId }, data: { passwordHash } });
      // Revoke all sessions — user must log in fresh after reset
      await revokeAllRefreshTokens(userId);
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
