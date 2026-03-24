import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function main() {
  const email = "alumni@mujin.jp";
  const password = "alumni2026!";

  console.log("1. Connecting to DB...");
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("2. Finding user...");
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("   user:", user ? { id: user.id, role: user.role, orgId: user.orgId } : null);

  if (!user) { console.log("USER NOT FOUND"); process.exit(1); }

  console.log("3. Verifying password...");
  const valid = await bcrypt.compare(password, user.passwordHash);
  console.log("   valid:", valid);

  console.log("4. Signing JWT...");
  const secret = process.env.JWT_ACCESS_SECRET ?? "test-secret";
  const token = jwt.sign({ sub: user.id, orgId: user.orgId, role: user.role }, secret, { expiresIn: "15m" });
  console.log("   token prefix:", token.slice(0, 20));

  console.log("5. Creating refresh token...");
  const record = await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: "pending", expiresAt: new Date(Date.now() + 30 * 86400000) },
  });
  console.log("   refresh record id:", record.id);

  await prisma.$disconnect();
  console.log("ALL STEPS PASSED");
}

main().catch((err) => { console.error("FAILED AT STEP:", err); process.exit(1); });
