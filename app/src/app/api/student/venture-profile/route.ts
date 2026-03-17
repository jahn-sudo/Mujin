import { NextRequest, NextResponse } from "next/server";
import { prisma, TxClient } from "@/lib/prisma";
import { VentureCategory } from "@/generated/prisma/enums";

const VALID_CATEGORIES = Object.values(VentureCategory);
const MAX_CO_FOUNDERS = 5;

function validateCategory(
  ventureCategory: unknown,
  ventureCategoryOther: unknown
): string | null {
  if (!ventureCategory || !VALID_CATEGORIES.includes(ventureCategory as VentureCategory)) {
    return "ventureCategory must be a valid VentureCategory value";
  }
  if (
    ventureCategory === VentureCategory.OTHER &&
    (!ventureCategoryOther ||
      typeof ventureCategoryOther !== "string" ||
      (ventureCategoryOther as string).trim() === "")
  ) {
    return "ventureCategoryOther is required when ventureCategory is OTHER";
  }
  return null;
}

// S2.5 — Create venture profile
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const existing = await prisma.ventureProfile.findUnique({
      where: { studentId: student.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Venture profile already exists — use PUT to update" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { name, description, coFounders = [], ventureCategory, ventureCategoryOther } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const categoryError = validateCategory(ventureCategory, ventureCategoryOther);
    if (categoryError) {
      return NextResponse.json({ error: categoryError }, { status: 400 });
    }

    if (!Array.isArray(coFounders) || coFounders.length > MAX_CO_FOUNDERS) {
      return NextResponse.json(
        { error: `coFounders must be an array of at most ${MAX_CO_FOUNDERS} names` },
        { status: 400 }
      );
    }

    const profile = await prisma.$transaction(async (tx: TxClient) => {
      const vp = await tx.ventureProfile.create({
        data: {
          studentId: student.id,
          name: name.trim(),
          description: description ?? null,
          coFounders,
        },
      });

      await tx.studentProfile.update({
        where: { id: student.id },
        data: {
          ventureCategory,
          ventureCategoryOther:
            ventureCategory === VentureCategory.OTHER
              ? (ventureCategoryOther as string).trim()
              : null,
        },
      });

      return vp;
    });

    return NextResponse.json(profile, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.5 — Update venture profile
export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const profile = await prisma.ventureProfile.findUnique({
      where: { studentId: student.id },
    });
    if (!profile) {
      return NextResponse.json({ error: "Venture profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, coFounders, ventureCategory, ventureCategoryOther } = body;

    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
    }

    if (ventureCategory !== undefined) {
      const categoryError = validateCategory(ventureCategory, ventureCategoryOther);
      if (categoryError) {
        return NextResponse.json({ error: categoryError }, { status: 400 });
      }
    }

    if (coFounders !== undefined && (!Array.isArray(coFounders) || coFounders.length > MAX_CO_FOUNDERS)) {
      return NextResponse.json(
        { error: `coFounders must be an array of at most ${MAX_CO_FOUNDERS} names` },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx: TxClient) => {
      const vp = await tx.ventureProfile.update({
        where: { id: profile.id },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          ...(description !== undefined && { description }),
          ...(coFounders !== undefined && { coFounders }),
        },
      });

      if (ventureCategory !== undefined) {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: {
            ventureCategory,
            ventureCategoryOther:
              ventureCategory === VentureCategory.OTHER
                ? (ventureCategoryOther as string).trim()
                : null, // clear when switching away from OTHER
          },
        });
      }

      return vp;
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.5 — Get venture profile
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const profile = await prisma.ventureProfile.findUnique({
      where: { studentId: student.id },
    });
    if (!profile) {
      return NextResponse.json({ error: "Venture profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
