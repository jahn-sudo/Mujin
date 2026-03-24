import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.findUnique({ where: { email: "alumni@mujin.jp" } });
  console.log({
    id: user?.id,
    role: user?.role,
    orgId: user?.orgId,
    hasHash: !!user?.passwordHash,
    hashPrefix: user?.passwordHash?.slice(0, 10),
    deletedAt: user?.deletedAt,
  });

  await prisma.$disconnect();
}

main().catch(console.error);
