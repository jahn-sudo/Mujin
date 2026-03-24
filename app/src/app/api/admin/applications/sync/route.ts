import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchSheetRows } from "@/lib/sheets/googleSheets";

// POST /api/admin/applications/sync
// Pulls all rows from configured Google Sheet and upserts into Application table.
// Existing rows matched by sheetRowIndex are updated; new rows are created.
// Application status/reviewNote are never overwritten on re-sync.
export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const config = await prisma.sheetConfig.findUnique({ where: { orgId } });
    if (!config) {
      return NextResponse.json(
        { error: "No Google Sheet configured. Set a sheet ID first." },
        { status: 400 }
      );
    }

    const rows = await fetchSheetRows(config.sheetId);

    let created = 0;
    let updated = 0;

    for (const row of rows) {
      const existing = await prisma.application.findUnique({
        where: { orgId_sheetRowIndex: { orgId, sheetRowIndex: row.sheetRowIndex } },
      });

      if (existing) {
        // Update data fields only — never touch status/reviewNote/reviewedById/reviewedAt
        await prisma.application.update({
          where: { id: existing.id },
          data: {
            fullName: row.fullName,
            email: row.email,
            university: row.university,
            nationality: row.nationality,
            ventureCategory: row.ventureCategory,
            ventureCategoryOther: row.ventureCategoryOther,
            ventureName: row.ventureName,
            ventureDescription: row.ventureDescription,
            japanPainPoint: row.japanPainPoint,
            faithMotivation: row.faithMotivation,
            appliedAt: row.appliedAt,
            syncedAt: new Date(),
          },
        });
        updated++;
      } else {
        await prisma.application.create({
          data: {
            orgId,
            sheetRowIndex: row.sheetRowIndex,
            fullName: row.fullName,
            email: row.email,
            university: row.university,
            nationality: row.nationality,
            ventureCategory: row.ventureCategory,
            ventureCategoryOther: row.ventureCategoryOther,
            ventureName: row.ventureName,
            ventureDescription: row.ventureDescription,
            japanPainPoint: row.japanPainPoint,
            faithMotivation: row.faithMotivation,
            appliedAt: row.appliedAt,
            syncedAt: new Date(),
          },
        });
        created++;
      }
    }

    return NextResponse.json({
      synced: rows.length,
      created,
      updated,
      lastSyncedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
