import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// S2.4 — Student signs Pledge of Honor
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 400 });
    }

    const body = await req.json();
    const { pledgeVersion } = body;

    if (!pledgeVersion || typeof pledgeVersion !== "string" || pledgeVersion.trim() === "") {
      return NextResponse.json({ error: "pledgeVersion is required" }, { status: 400 });
    }

    // One pledge per student — check for existing
    const existing = await prisma.pledgeRecord.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json(
        { error: "Pledge already signed" },
        { status: 409 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    const record = await prisma.pledgeRecord.create({
      data: { userId, pledgeVersion: pledgeVersion.trim(), ipAddress: ip },
    });

    return NextResponse.json(
      { pledgeVersion: record.pledgeVersion, signedAt: record.signedAt },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.4 — Check pledge status
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 400 });
    }

    const record = await prisma.pledgeRecord.findUnique({ where: { userId } });

    if (!record) {
      return NextResponse.json({ signed: false });
    }

    return NextResponse.json({
      signed: true,
      pledgeVersion: record.pledgeVersion,
      signedAt: record.signedAt,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
