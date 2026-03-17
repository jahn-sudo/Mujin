// Use the app's generated client directly
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("../src/generated/prisma/index.js");
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create org
  const org = await prisma.organization.upsert({
    where: { id: "org-mujin" },
    update: {},
    create: { id: "org-mujin", name: "Mujin" },
  });
  console.log("Org:", org.name);

  // Create staff/admin account
  const passwordHash = await bcrypt.hash("mujin2026!", 10);
  const staff = await prisma.user.upsert({
    where: { email: "admin@mujin.jp" },
    update: {},
    create: {
      email: "admin@mujin.jp",
      passwordHash,
      role: "ORG_ADMIN",
      orgId: org.id,
    },
  });
  console.log("Staff:", staff.email, "/ role:", staff.role);

  // Create a student account
  const studentHash = await bcrypt.hash("student2026!", 10);
  const studentUser = await prisma.user.upsert({
    where: { email: "student@mujin.jp" },
    update: {},
    create: {
      email: "student@mujin.jp",
      passwordHash: studentHash,
      role: "STUDENT",
      orgId: org.id,
    },
  });

  // Create student profile
  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: { userId: studentUser.id },
  });
  console.log("Student:", studentUser.email, "/ role:", studentUser.role);

  console.log("\nDone. Credentials:");
  console.log("  Admin  → admin@mujin.jp  / mujin2026!");
  console.log("  Student → student@mujin.jp / student2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
