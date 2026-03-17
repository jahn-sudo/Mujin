import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date } = body;

    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "date must be a valid ISO date string" },
        { status: 400 }
      );
    }

    const townHall = await prisma.townHall.create({
      data: { orgId, date: parsedDate },
    });

    return NextResponse.json(townHall, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const townHalls = await prisma.townHall.findMany({
      where: { orgId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(townHalls, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
