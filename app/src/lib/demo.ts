/**
 * Stable IDs for all demo cohorts (seeded with explicit IDs in prisma/seed.ts).
 * Used to filter demo data IN or OUT of API routes.
 */
export const DEMO_COHORT_IDS = [
  "cohort-alpha",
  "cohort-beta",
  "cohort-gamma",
  "cohort-delta",
  "cohort-epsilon",
  "cohort-zeta",
  "cohort-eta",
  "cohort-theta",
  "cohort-iota",
  "cohort-kappa",
] as const;

export const DEMO_EMAIL_DOMAIN = "@demo.mujin.jp";
