/**
 * Layer B auto-score for P&L completeness (0–100).
 *
 * Rules:
 * +25 revenue filled (non-null integer)
 * +25 expenses filled (non-null integer)
 * +25 notes non-empty string
 * +25 receipts: if expenses >= 50000, receipts required (uploaded); else free points
 */
export function computeAutoScore({
  revenue,
  expenses,
  notes,
  receiptUrls,
}: {
  revenue: number | null | undefined;
  expenses: number | null | undefined;
  notes: string | null | undefined;
  receiptUrls: string[];
}): number {
  let score = 0;

  if (revenue !== null && revenue !== undefined) score += 25;
  if (expenses !== null && expenses !== undefined) score += 25;
  if (notes && notes.trim().length > 0) score += 25;

  if (expenses !== null && expenses !== undefined && expenses >= 50000) {
    if (receiptUrls.length > 0) score += 25;
  } else {
    score += 25; // receipts not required
  }

  return score;
}
