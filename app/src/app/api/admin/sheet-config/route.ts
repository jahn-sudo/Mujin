import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/sheet-config — return current sheet config for org
export async function GET(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json({ error: "Missing org context" }, { status: 400 });
  }

  const config = await prisma.sheetConfig.findUnique({ where: { orgId } });
  return NextResponse.json({ sheetId: config?.sheetId ?? null });
}

// POST /api/admin/sheet-config — save or update sheet ID for org
export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const body = await req.json();
    const { sheetId } = body;
    if (!sheetId || typeof sheetId !== "string") {
      return NextResponse.json({ error: "sheetId is required" }, { status: 400 });
    }

    const config = await prisma.sheetConfig.upsert({
      where: { orgId },
      create: { orgId, sheetId: sheetId.trim() },
      update: { sheetId: sheetId.trim() },
    });

    return NextResponse.json({ sheetId: config.sheetId });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
