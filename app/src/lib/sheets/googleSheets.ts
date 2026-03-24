import { google } from "googleapis";
import { VentureCategory } from "@/generated/prisma/enums";

// ── Google Sheets API client ───────────────────────────────────────────────────
// Expects env vars:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL — service account email
//   GOOGLE_PRIVATE_KEY           — service account private key (newlines as \n)

function getAuthClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const keyB64 = process.env.GOOGLE_PRIVATE_KEY_B64;

  if (!email || !keyB64) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY_B64 env vars");
  }

  const private_key = Buffer.from(keyB64.trim(), "base64").toString("utf-8");

  return new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

// ── Expected column order (Google Forms output) ───────────────────────────────
// A: Timestamp
// B: Full Name
// C: Email
// D: University / Institution
// E: Nationality
// F: Venture Category
// G: Venture Category (Other)
// H: Venture Name
// I: Venture Description
// J: Japan Pain Point Statement
// K: Faith Motivation Statement

const VENTURE_CATEGORY_MAP: Record<string, VentureCategory> = {
  FINTECH: "FINTECH",
  EDTECH: "EDTECH",
  HEALTHTECH: "HEALTHTECH",
  SOCIAL_ENTERPRISE: "SOCIAL_ENTERPRISE",
  ECOMMERCE: "ECOMMERCE",
  FOOD_BEVERAGE: "FOOD_BEVERAGE",
  CREATIVE_MEDIA: "CREATIVE_MEDIA",
  OTHER: "OTHER",
};

function parseVentureCategory(raw: string): VentureCategory {
  const normalized = raw.trim().toUpperCase().replace(/[\s-]/g, "_");
  return VENTURE_CATEGORY_MAP[normalized] ?? "OTHER";
}

export interface SheetRow {
  sheetRowIndex: number; // 1-based (row 2 = first data row, row 1 = header)
  appliedAt: Date;
  fullName: string;
  email: string;
  university: string;
  nationality: string;
  ventureCategory: VentureCategory;
  ventureCategoryOther: string | null;
  ventureName: string;
  ventureDescription: string;
  japanPainPoint: string;
  faithMotivation: string;
}

export async function fetchSheetRows(sheetId: string): Promise<SheetRow[]> {
  const auth = await getAuthClient().getClient();
  const sheets = google.sheets({ version: "v4", auth: auth as Parameters<typeof google.sheets>[0]["auth"] });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A:K", // columns A–K
  });

  const rows = response.data.values ?? [];
  if (rows.length <= 1) return []; // header only or empty

  const dataRows = rows.slice(1); // skip header row

  return dataRows
    .map((row, index): SheetRow | null => {
      const [
        timestamp = "",
        fullName = "",
        email = "",
        university = "",
        nationality = "",
        ventureCategoryRaw = "",
        ventureCategoryOther = "",
        ventureName = "",
        ventureDescription = "",
        japanPainPoint = "",
        faithMotivation = "",
      ] = row as string[];

      // Skip rows missing critical fields
      if (!email.trim() || !fullName.trim()) return null;

      const parsedDate = new Date(timestamp);
      const appliedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      const ventureCategory = parseVentureCategory(ventureCategoryRaw);

      return {
        sheetRowIndex: index + 2, // +2 because row 1 is header, index is 0-based
        appliedAt,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        university: university.trim(),
        nationality: nationality.trim(),
        ventureCategory,
        ventureCategoryOther:
          ventureCategory === "OTHER" && ventureCategoryOther.trim()
            ? ventureCategoryOther.trim()
            : null,
        ventureName: ventureName.trim(),
        ventureDescription: ventureDescription.trim(),
        japanPainPoint: japanPainPoint.trim(),
        faithMotivation: faithMotivation.trim(),
      };
    })
    .filter((r): r is SheetRow => r !== null);
}
