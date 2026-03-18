import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── Helpers ───────────────────────────────────────────────────────────────────

function rand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function monthRange(start: string, end: string): string[] {
  const result: string[] = [];
  let [y, m] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  while (y < ey || (y === ey && m <= em)) {
    result.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return result;
}

function monthDate(month: string, day = 1): Date {
  return new Date(`${month}-${String(day).padStart(2, "0")}T10:00:00Z`);
}

type Label = "GREEN" | "YELLOW" | "RED";
interface ScoreEntry { month: string; score: number; label: Label; resp: number; trans: number; mutu: number; refl: number; }

const PROFILES: Record<string, { base: number; trend: number }> = {
  GREEN_STRONG:       { base: 83, trend: 1.2 },
  GREEN_STEADY:       { base: 78, trend: 0.4 },
  YELLOW_RECOVERING:  { base: 62, trend: 2.8 },
  YELLOW_STRUGGLING:  { base: 60, trend: -0.6 },
  RED_ATRISK:         { base: 47, trend: -1.0 },
};

function makeScores(months: string[], profile: string, seed: number): ScoreEntry[] {
  const { base, trend } = PROFILES[profile] ?? PROFILES.GREEN_STEADY;
  return months.map((month, i) => {
    const noise = (rand(seed + i * 3) - 0.5) * 12;
    const raw   = Math.min(100, Math.max(0, base + trend * i + noise));
    const score = Math.round(raw);
    const label: Label = score >= 75 ? "GREEN" : score >= 50 ? "YELLOW" : "RED";
    const comp  = (n: number) => Math.min(100, Math.max(0, Math.round(score + (rand(seed + i * 7 + n) - 0.5) * 18)));
    return { month, score, label, resp: comp(1), trans: comp(2), mutu: comp(3), refl: label === "RED" ? 0 : 100 };
  });
}

const REV_RAMP = [0, 15000, 35000, 65000, 105000, 155000, 210000, 280000, 360000];
const EXP_BASE = [65000, 72000, 80000, 90000, 100000, 112000, 125000, 138000, 150000];

function makePL(months: string[], seed: number) {
  return months.map((month, i) => {
    const revenue  = Math.max(0, REV_RAMP[Math.min(i, 8)] + Math.round((rand(seed + i * 11) - 0.3) * 35000));
    const expenses = EXP_BASE[Math.min(i, 8)] + Math.round(rand(seed + i * 13) * 25000);
    const net      = revenue - expenses;
    const autoScore = (revenue > 0 ? 25 : 0) + 25 + 25 + (expenses >= 50000 ? 25 : 0);
    return { month, revenue, expenses, net, autoScore };
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ORG_ID   = "org-mujin";
const DEMO_END = "2027-12";

const COHORTS = [
  { idx: 0, name: "Alpha",   id: "cohort-alpha",   start: "2027-04" },
  { idx: 1, name: "Beta",    id: "cohort-beta",    start: "2027-06" },
  { idx: 2, name: "Gamma",   id: "cohort-gamma",   start: "2027-08" },
  { idx: 3, name: "Delta",   id: "cohort-delta",   start: "2027-09" },
  { idx: 4, name: "Epsilon", id: "cohort-epsilon", start: "2027-10" },
  { idx: 5, name: "Zeta",    id: "cohort-zeta",    start: "2027-11" },
  { idx: 6, name: "Eta",     id: "cohort-eta",     start: "2027-11" },
  { idx: 7, name: "Theta",   id: "cohort-theta",   start: "2027-12" },
  { idx: 8, name: "Iota",    id: "cohort-iota",    start: "2027-12" },
  { idx: 9, name: "Kappa",   id: "cohort-kappa",   start: "2027-12" },
];

type StudentDef = { email: string; name: string; cohortIdx: number; cat: string; venture: string; desc: string; profile: string; grad: string; };

const STUDENTS: StudentDef[] = [
  // Cohort Alpha — 9 months
  { email: "kai.watanabe@demo.mujin.jp",     name: "Kai Watanabe",     cohortIdx: 0, cat: "FINTECH",           venture: "PayRoute",       desc: "Cross-border payment rails for international students in Japan",                  profile: "GREEN_STRONG",      grad: "INTERVIEW_SCHEDULED" },
  { email: "amara.osei@demo.mujin.jp",       name: "Amara Osei",       cohortIdx: 0, cat: "EDTECH",            venture: "StudyBridge",    desc: "Connects international students with Japanese tutors for university prep",         profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "minjun.lee@demo.mujin.jp",       name: "Min-Jun Lee",      cohortIdx: 0, cat: "HEALTHTECH",        venture: "PharmaLink",     desc: "Multilingual pharmacy guidance app for foreign residents in Japan",               profile: "YELLOW_RECOVERING", grad: "INELIGIBLE" },
  { email: "sofia.martins@demo.mujin.jp",    name: "Sofia Martins",    cohortIdx: 0, cat: "SOCIAL_ENTERPRISE", venture: "GiveChain",      desc: "Transparent micro-donation platform connecting donors to verified local causes",  profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "yuki.tanaka2@demo.mujin.jp",     name: "Yuki Tanaka",      cohortIdx: 0, cat: "ECOMMERCE",         venture: "SakuraShop",     desc: "Curated Japanese artisan goods e-commerce for overseas buyers",                  profile: "GREEN_STRONG",      grad: "ELIGIBLE" },
  // Cohort Beta — 7 months
  { email: "riku.yamamoto@demo.mujin.jp",    name: "Riku Yamamoto",    cohortIdx: 1, cat: "CREATIVE_MEDIA",    venture: "StoryLab",       desc: "Bilingual storytelling platform for Japanese indie creators",                    profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "priya.sharma@demo.mujin.jp",     name: "Priya Sharma",     cohortIdx: 1, cat: "FINTECH",           venture: "RemitFlow",      desc: "Low-fee remittance service designed for South Asian students in Japan",           profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "hiroshi.ito@demo.mujin.jp",      name: "Hiroshi Ito",      cohortIdx: 1, cat: "FOOD_BEVERAGE",     venture: "RiceRoots",      desc: "Premium regional rice subscription connecting farmers to urban households",       profile: "YELLOW_STRUGGLING", grad: "INELIGIBLE" },
  { email: "fatima.alhassan@demo.mujin.jp",  name: "Fatima Al-Hassan", cohortIdx: 1, cat: "EDTECH",            venture: "ArabLearn",      desc: "Arabic-Japanese language learning app with cultural context modules",             profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "daniel.kim@demo.mujin.jp",       name: "Daniel Kim",       cohortIdx: 1, cat: "SOCIAL_ENTERPRISE", venture: "RefugeLink",     desc: "Employment matching platform for refugees and small Japanese businesses",         profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  // Cohort Gamma — 5 months
  { email: "lin.wei@demo.mujin.jp",          name: "Lin Wei",          cohortIdx: 2, cat: "ECOMMERCE",         venture: "SilkCart",       desc: "Premium China-Japan import marketplace with verified supplier ratings",           profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "tomoya.suzuki@demo.mujin.jp",    name: "Tomoya Suzuki",    cohortIdx: 2, cat: "HEALTHTECH",        venture: "CareNavi",       desc: "Healthcare navigation app for non-Japanese speakers in Japan",                   profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "isabella.santos@demo.mujin.jp",  name: "Isabella Santos",  cohortIdx: 2, cat: "FINTECH",           venture: "ZenPay",         desc: "Budgeting tool built around Japan's envelope budgeting philosophy",               profile: "YELLOW_RECOVERING", grad: "INELIGIBLE" },
  { email: "kwame.asante@demo.mujin.jp",     name: "Kwame Asante",     cohortIdx: 2, cat: "CREATIVE_MEDIA",    venture: "AfroBeat Tokyo", desc: "African music events and artist promotion platform for the Tokyo scene",         profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "nana.kobayashi@demo.mujin.jp",   name: "Nana Kobayashi",   cohortIdx: 2, cat: "SOCIAL_ENTERPRISE", venture: "TsunagiNet",     desc: "Community connection platform for elderly Japanese residents in rural areas",    profile: "RED_ATRISK",        grad: "INELIGIBLE" },
  // Cohort Delta — 4 months
  { email: "james.okonkwo@demo.mujin.jp",    name: "James Okonkwo",    cohortIdx: 3, cat: "EDTECH",            venture: "TutorHub",       desc: "On-demand academic tutoring marketplace connecting university students",          profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "yuna.park@demo.mujin.jp",        name: "Yuna Park",        cohortIdx: 3, cat: "FINTECH",           venture: "WonWise",        desc: "Currency management tool for Korean-Japanese dual-currency households",          profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "takeshi.nakamura@demo.mujin.jp", name: "Takeshi Nakamura", cohortIdx: 3, cat: "FOOD_BEVERAGE",     venture: "UmamiBox",       desc: "Monthly subscription box featuring artisanal Japanese condiments and recipes",   profile: "YELLOW_STRUGGLING", grad: "INELIGIBLE" },
  { email: "mei.chen@demo.mujin.jp",         name: "Mei Chen",         cohortIdx: 3, cat: "HEALTHTECH",        venture: "WellPath",       desc: "Mental wellness app for international students experiencing culture shock",       profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "carlos.rivera@demo.mujin.jp",    name: "Carlos Rivera",    cohortIdx: 3, cat: "OTHER",             venture: "TechBridge",     desc: "IT staffing platform connecting bilingual tech talent with Japanese SMEs",       profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  // Cohort Epsilon — 3 months
  { email: "akiko.hayashi@demo.mujin.jp",    name: "Akiko Hayashi",    cohortIdx: 4, cat: "CREATIVE_MEDIA",    venture: "PixelStudio",    desc: "Freelance design marketplace connecting Japanese illustrators with global brands", profile: "GREEN_STEADY",     grad: "INELIGIBLE" },
  { email: "emmanuel.boateng@demo.mujin.jp", name: "Emmanuel Boateng", cohortIdx: 4, cat: "SOCIAL_ENTERPRISE", venture: "SafeHaven",      desc: "Emergency housing registry for migrants and refugees arriving in Tokyo",         profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "sora.inoue@demo.mujin.jp",       name: "Sora Inoue",       cohortIdx: 4, cat: "ECOMMERCE",         venture: "NihonGift",      desc: "Curated Japanese gift-sending service for overseas families",                    profile: "YELLOW_RECOVERING", grad: "INELIGIBLE" },
  { email: "aisha.ibrahim@demo.mujin.jp",    name: "Aisha Ibrahim",    cohortIdx: 4, cat: "FINTECH",           venture: "SavingsFirst",   desc: "Gamified savings app designed for students with irregular income",               profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "kenji.matsuda@demo.mujin.jp",    name: "Kenji Matsuda",    cohortIdx: 4, cat: "EDTECH",            venture: "CramSmart",      desc: "AI-powered exam prep platform for Japanese university entrance exams",           profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  // Cohort Zeta — 2 months
  { email: "ryo.fujita@demo.mujin.jp",       name: "Ryo Fujita",       cohortIdx: 5, cat: "HEALTHTECH",        venture: "VitaTrack",      desc: "Nutrition tracking app localized for Japanese dietary habits",                   profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "grace.okafor@demo.mujin.jp",     name: "Grace Okafor",     cohortIdx: 5, cat: "FOOD_BEVERAGE",     venture: "SpiceMate",      desc: "African and South Asian spice delivery for Japan's diaspora community",         profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "jinho.choi@demo.mujin.jp",       name: "Jin-Ho Choi",      cohortIdx: 5, cat: "FINTECH",           venture: "KoremitPay",     desc: "Korea-Japan remittance service with real-time exchange rate alerts",             profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "sakura.ogawa@demo.mujin.jp",     name: "Sakura Ogawa",     cohortIdx: 5, cat: "CREATIVE_MEDIA",    venture: "ZinePress",      desc: "Independent zine publishing and distribution network for Japanese creatives",   profile: "YELLOW_RECOVERING", grad: "INELIGIBLE" },
  { email: "amit.patel@demo.mujin.jp",       name: "Amit Patel",       cohortIdx: 5, cat: "OTHER",             venture: "CloudBiz",       desc: "Cloud infrastructure consulting for Japanese SMEs migrating to AWS",             profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  // Cohort Eta — 2 months
  { email: "yosuke.kato@demo.mujin.jp",      name: "Yosuke Kato",      cohortIdx: 6, cat: "ECOMMERCE",         venture: "GadgetDen",      desc: "Refurbished electronics marketplace for eco-conscious consumers in Japan",      profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "lena.hoffmann@demo.mujin.jp",    name: "Lena Hoffmann",    cohortIdx: 6, cat: "SOCIAL_ENTERPRISE", venture: "GreenStart",     desc: "Zero-waste packaging consultancy for Japanese food and beverage businesses",    profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "taro.kimura@demo.mujin.jp",      name: "Taro Kimura",      cohortIdx: 6, cat: "FINTECH",           venture: "FXClub",         desc: "FX education and simulation app for university students learning to invest",     profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "adaeze.eze@demo.mujin.jp",       name: "Adaeze Eze",       cohortIdx: 6, cat: "EDTECH",            venture: "AfriLearn",      desc: "Swahili and Igbo language learning app designed for the Japanese diaspora",     profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "rina.okamoto@demo.mujin.jp",     name: "Rina Okamoto",     cohortIdx: 6, cat: "HEALTHTECH",        venture: "MindBridge",     desc: "Mental health first-aid training platform for Japanese university student unions", profile: "YELLOW_STRUGGLING", grad: "INELIGIBLE" },
  // Cohort Theta — 1 month
  { email: "kevin.nakajima@demo.mujin.jp",   name: "Kevin Nakajima",   cohortIdx: 7, cat: "FOOD_BEVERAGE",     venture: "CurryHouse",     desc: "Pop-up curry kitchen membership connecting diasporic cooks with local customers", profile: "GREEN_STEADY",     grad: "INELIGIBLE" },
  { email: "chioma.uchenna@demo.mujin.jp",   name: "Chioma Uchenna",   cohortIdx: 7, cat: "CREATIVE_MEDIA",    venture: "AfroVoice",      desc: "Podcast production house amplifying African voices in Japan",                   profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "park.seoyeon@demo.mujin.jp",     name: "Park Seo-Yeon",    cohortIdx: 7, cat: "FINTECH",           venture: "NanoSave",       desc: "Round-up savings automation for students with cashless payment habits",          profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "hiroki.shimizu@demo.mujin.jp",   name: "Hiroki Shimizu",   cohortIdx: 7, cat: "OTHER",             venture: "TechCommons",    desc: "Co-working community platform for early-stage founders in Tokyo",               profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "nina.volkov@demo.mujin.jp",      name: "Nina Volkov",      cohortIdx: 7, cat: "SOCIAL_ENTERPRISE", venture: "PeaceHub",       desc: "Conflict resolution and mediation training for multicultural university environments", profile: "GREEN_STRONG", grad: "INELIGIBLE" },
  // Cohort Iota — 1 month
  { email: "makoto.abe@demo.mujin.jp",       name: "Makoto Abe",       cohortIdx: 8, cat: "ECOMMERCE",         venture: "TokyoFlea",      desc: "Digital flea market for authenticated vintage Japanese collectibles",            profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "blessing.nwosu@demo.mujin.jp",   name: "Blessing Nwosu",   cohortIdx: 8, cat: "HEALTHTECH",        venture: "CarePoint",      desc: "Telemedicine platform bridging Nigerian patients in Japan with home-country doctors", profile: "GREEN_STRONG",   grad: "INELIGIBLE" },
  { email: "tatsuya.moriwaki@demo.mujin.jp", name: "Tatsuya Moriwaki", cohortIdx: 8, cat: "FINTECH",           venture: "YieldMax",       desc: "Robo-advisory platform for Japan's low interest rate investment landscape",      profile: "YELLOW_RECOVERING", grad: "INELIGIBLE" },
  { email: "jieun.oh@demo.mujin.jp",         name: "Ji-Eun Oh",        cohortIdx: 8, cat: "CREATIVE_MEDIA",    venture: "KpopZine",       desc: "K-pop fan content platform with Japanese localization and creator monetization", profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "pedro.alves@demo.mujin.jp",      name: "Pedro Alves",      cohortIdx: 8, cat: "EDTECH",            venture: "PortuLearn",     desc: "Portuguese-Japanese language exchange for the Brazil-Japan corridor",            profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  // Cohort Kappa — 1 month
  { email: "kohei.ueda@demo.mujin.jp",       name: "Kohei Ueda",       cohortIdx: 9, cat: "SOCIAL_ENTERPRISE", venture: "CommuLink",      desc: "Volunteer coordination platform connecting international students with local NGOs", profile: "GREEN_STEADY",    grad: "INELIGIBLE" },
  { email: "yasmin.alrashid@demo.mujin.jp",  name: "Yasmin Al-Rashid", cohortIdx: 9, cat: "FINTECH",           venture: "GulfRemit",      desc: "Halal-compliant remittance and savings for Middle Eastern students in Japan",    profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
  { email: "shota.tanaka2@demo.mujin.jp",    name: "Shota Tanaka",     cohortIdx: 9, cat: "FOOD_BEVERAGE",     venture: "RamenLab",       desc: "Monthly ramen recipe kit subscription celebrating regional Japanese varieties",  profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "joyce.kamau@demo.mujin.jp",      name: "Joyce Kamau",      cohortIdx: 9, cat: "EDTECH",            venture: "SwahiliStar",    desc: "Swahili language learning app built for East African diaspora in Japan",         profile: "GREEN_STEADY",      grad: "INELIGIBLE" },
  { email: "ryusei.mori@demo.mujin.jp",      name: "Ryusei Mori",      cohortIdx: 9, cat: "HEALTHTECH",        venture: "BioTrack",       desc: "Wearable health data aggregation app for Japan's aging population caregivers",  profile: "GREEN_STRONG",      grad: "INELIGIBLE" },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── Preserved accounts ───────────────────────────────────────────────────

  const org = await prisma.organization.upsert({
    where: { id: ORG_ID },
    update: {},
    create: { id: ORG_ID, name: "Mujin" },
  });
  console.log("Org:", org.name);

  const passwordHash = await bcrypt.hash("mujin2026!", 10);
  const staff = await prisma.user.upsert({
    where: { email: "admin@mujin.jp" },
    update: {},
    create: { email: "admin@mujin.jp", passwordHash, role: "ORG_ADMIN", orgId: ORG_ID },
  });
  console.log("Admin:", staff.email);

  const studentHash = await bcrypt.hash("student2026!", 10);
  const studentUser = await prisma.user.upsert({
    where: { email: "student@mujin.jp" },
    update: {},
    create: { email: "student@mujin.jp", passwordHash: studentHash, role: "STUDENT", orgId: ORG_ID },
  });
  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: { userId: studentUser.id },
  });

  const mentorHash = await bcrypt.hash("mentor2026!", 10);
  await prisma.user.upsert({
    where: { email: "mentor@mujin.jp" },
    update: {},
    create: { email: "mentor@mujin.jp", passwordHash: mentorHash, role: "MENTOR", orgId: ORG_ID },
  });

  const alumniHash = await bcrypt.hash("alumni2026!", 10);
  const alumniUser = await prisma.user.upsert({
    where: { email: "alumni@mujin.jp" },
    update: {},
    create: { email: "alumni@mujin.jp", passwordHash: alumniHash, role: "ALUMNI", orgId: ORG_ID },
  });
  const alumniProfile = await prisma.studentProfile.upsert({
    where: { userId: alumniUser.id },
    update: {},
    create: { userId: alumniUser.id, ventureCategory: "FINTECH" },
  });
  await prisma.ventureProfile.upsert({
    where: { studentId: alumniProfile.id },
    update: {},
    create: { studentId: alumniProfile.id, name: "YenWise", description: "AI-powered savings and budgeting for international students in Japan", coFounders: ["Kenji Nakamura"] },
  });
  await prisma.pledgeRecord.upsert({
    where: { userId: alumniUser.id },
    update: {},
    create: { userId: alumniUser.id, pledgeVersion: "1.0", ipAddress: "127.0.0.1" },
  });
  const alumniMonths = ["2026-05","2026-06","2026-07","2026-08","2026-09","2026-10","2026-11","2026-12"];
  const alumniScores = [76,79,82,85,88,91,88,94];
  for (let i = 0; i < alumniMonths.length; i++) {
    await prisma.trustScore.upsert({
      where: { studentId_month: { studentId: alumniProfile.id, month: alumniMonths[i] } },
      update: {},
      create: { studentId: alumniProfile.id, month: alumniMonths[i], score: alumniScores[i], label: "GREEN", responsivenessRaw: alumniScores[i] - 2, transparencyRaw: alumniScores[i] + 2, mutualismRaw: alumniScores[i] - 4, reflectionRaw: alumniScores[i] + 4 },
    });
  }
  const gradRecord = await prisma.graduationRecord.upsert({
    where: { studentId: alumniProfile.id },
    update: {},
    create: { studentId: alumniProfile.id, status: "GRADUATED", interviewScheduledAt: new Date("2027-01-10"), interviewDate: new Date("2027-01-15"), interviewConductedAt: new Date("2027-01-15"), interviewResult: "PASSED", bankIntroDate: new Date("2027-01-22") },
  });
  await prisma.bankIntroTracking.upsert({
    where: { graduationRecordId: gradRecord.id },
    update: {},
    create: { graduationRecordId: gradRecord.id, bankName: "Kiraboshi Bank", bankContactName: "Tanaka Hiroshi", firstMeetingDate: new Date("2027-02-05"), firstMeetingOutcome: "COMPLETED", accountOpenedAt: new Date("2027-02-20"), staffNotes: "Strong meeting. Loan application submitted." },
  });
  console.log("Alumni:", alumniUser.email);

  // ── Demo cohorts ─────────────────────────────────────────────────────────

  for (const c of COHORTS) {
    await prisma.cohort.upsert({
      where: { id: c.id },
      update: {},
      create: { id: c.id, name: c.name, orgId: ORG_ID, maxStudents: 5 },
    });
  }
  console.log("Cohorts seeded:", COHORTS.length);

  // ── Demo mentors + cohort assignments ────────────────────────────────────

  for (const c of COHORTS) {
    const email = `mentor.${c.name.toLowerCase()}@demo.mujin.jp`;
    const mentor = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: mentorHash, role: "MENTOR", orgId: ORG_ID },
    });
    await prisma.mentorCohortAssignment.upsert({
      where: { mentorId: mentor.id },
      update: {},
      create: { mentorId: mentor.id, cohortId: c.id },
    });
  }
  console.log("Demo mentors seeded:", COHORTS.length);

  // ── Demo students ─────────────────────────────────────────────────────────

  const cohortMonths = COHORTS.map(c => monthRange(c.start, DEMO_END));
  const userIds  = new Map<string, string>(); // email → userId
  const profileIds = new Map<string, string>(); // email → studentProfileId
  const demoPass = await bcrypt.hash("demo2027!", 10);

  // Pass 1: create all users + profiles (needed before town hall loop)
  for (let si = 0; si < STUDENTS.length; si++) {
    const s = STUDENTS[si];
    const cohort = COHORTS[s.cohortIdx];
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { email: s.email, passwordHash: demoPass, role: "STUDENT", orgId: ORG_ID },
    });
    userIds.set(s.email, user.id);

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, cohortId: cohort.id, ventureCategory: s.cat as any },
    });
    profileIds.set(s.email, profile.id);

    await prisma.ventureProfile.upsert({
      where: { studentId: profile.id },
      update: {},
      create: { studentId: profile.id, name: s.venture, description: s.desc, coFounders: [] },
    });

    await prisma.pledgeRecord.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, pledgeVersion: "1.0", ipAddress: "127.0.0.1" },
    });
  }
  console.log("Student users + profiles seeded:", STUDENTS.length);

  // Pass 2: trust scores, P&L, graduation records
  for (let si = 0; si < STUDENTS.length; si++) {
    const s = STUDENTS[si];
    const months  = cohortMonths[s.cohortIdx];
    const pid     = profileIds.get(s.email)!;
    const scores  = makeScores(months, s.profile, si * 100);
    const plData  = makePL(months, si * 200);

    for (const sc of scores) {
      await prisma.trustScore.upsert({
        where: { studentId_month: { studentId: pid, month: sc.month } },
        update: {},
        create: { studentId: pid, month: sc.month, score: sc.score, label: sc.label as any, responsivenessRaw: sc.resp, transparencyRaw: sc.trans, mutualismRaw: sc.mutu, reflectionRaw: sc.refl },
      });
    }

    for (const pl of plData) {
      await prisma.pLSubmission.upsert({
        where: { studentId_month: { studentId: pid, month: pl.month } },
        update: {},
        create: { studentId: pid, month: pl.month, revenue: pl.revenue, expenses: pl.expenses, net: pl.net, notes: "Monthly report submitted on time.", receiptUrls: [], submittedAt: monthDate(pl.month, 28), autoScore: pl.autoScore, finalScore: pl.autoScore, status: "APPROVED" },
      });
    }

    // Graduation record
    const gradData: any = { studentId: pid, status: s.grad };
    if (s.grad === "INTERVIEW_SCHEDULED") {
      gradData.interviewScheduledAt = new Date("2027-12-20T10:00:00Z");
      gradData.interviewDate        = new Date("2028-01-05T10:00:00Z");
    }
    await prisma.graduationRecord.upsert({
      where: { studentId: pid },
      update: {},
      create: gradData,
    });
  }
  console.log("Trust scores, P&L, graduation records seeded");

  // ── Check-in sessions + attendance ───────────────────────────────────────

  for (const c of COHORTS) {
    const months          = cohortMonths[c.idx];
    const cohortStudents  = STUDENTS.filter(s => s.cohortIdx === c.idx);

    for (let mi = 0; mi < months.length; mi++) {
      const month = months[mi];
      for (let si = 0; si < 2; si++) {
        const day       = si === 0 ? 8 : 22;
        const sessionId = `session-${c.id}-${month}-${si}`;

        await prisma.checkInSession.upsert({
          where: { id: sessionId },
          update: {},
          create: { id: sessionId, cohortId: c.id, date: monthDate(month, day), attendanceSubmittedAt: monthDate(month, day + 1) },
        });

        for (const sd of cohortStudents) {
          const pid = profileIds.get(sd.email);
          if (!pid) continue;
          const noiseSeed = sd.email.length * 31 + mi * 7 + si;
          const absent = (sd.profile === "YELLOW_STRUGGLING" && rand(noiseSeed) < 0.3)
                      || (sd.profile === "RED_ATRISK"        && rand(noiseSeed) < 0.5);
          await prisma.attendanceRecord.upsert({
            where: { studentProfileId_checkInSessionId: { studentProfileId: pid, checkInSessionId: sessionId } },
            update: {},
            create: { studentProfileId: pid, checkInSessionId: sessionId, present: !absent },
          });
        }
      }
    }
  }
  console.log("Check-in sessions + attendance seeded");

  // ── Town halls + submissions + reflection assessments ─────────────────────

  const allMonths = monthRange("2027-04", DEMO_END);

  for (const month of allMonths) {
    const thId = `townhall-${month}`;
    await prisma.townHall.upsert({
      where: { id: thId },
      update: {},
      create: { id: thId, orgId: ORG_ID, date: monthDate(month, 15) },
    });

    for (let si = 0; si < STUDENTS.length; si++) {
      const sd     = STUDENTS[si];
      const months = cohortMonths[sd.cohortIdx];
      if (!months.includes(month)) continue;

      const uid = userIds.get(sd.email);
      if (!uid) continue;

      const cohortStudents = STUDENTS.filter(s => s.cohortIdx === sd.cohortIdx);
      const attendeeIds = cohortStudents
        .filter(cs => cs.email !== sd.email && rand(si * 17 + allMonths.indexOf(month) * 3) > 0.15)
        .map(cs => userIds.get(cs.email)!)
        .filter(Boolean);

      const subId = `thsub-${thId}-${uid}`;

      await prisma.townHallSubmission.upsert({
        where: { townHallId_submittedById: { townHallId: thId, submittedById: uid } },
        update: {},
        create: {
          id: subId, townHallId: thId, submittedById: uid, attendeeIds,
          attended: sd.profile !== "RED_ATRISK",
          reflectionText: `This month I focused on building traction for ${sd.venture}. The peer conversations helped me think more clearly about my customer acquisition strategy. Still working through some operational challenges but feeling more grounded.`,
          submittedAt: monthDate(month, 16),
        },
      });

      const quarterNum = Math.ceil(parseInt(month.split("-")[1]) / 3);
      const quarter    = `${month.split("-")[0]}-Q${quarterNum}`;

      await prisma.reflectionAssessment.upsert({
        where: { submissionId: subId },
        update: {},
        create: {
          submissionId: subId,
          result: sd.profile === "RED_ATRISK" ? "NOT_MEANINGFUL" : "MEANINGFUL",
          resubmissionState: "NONE",
          quarter,
        },
      });
    }
  }
  console.log("Town halls + reflections seeded");

  console.log("\n── Done ──────────────────────────────────────────────────────");
  console.log("  Admin       → admin@mujin.jp        / mujin2026!");
  console.log("  Student     → student@mujin.jp      / student2026!");
  console.log("  Mentor      → mentor@mujin.jp       / mentor2026!");
  console.log("  Alumni      → alumni@mujin.jp       / alumni2026!");
  console.log("  Demo pass   → [firstname]@demo.mujin.jp / demo2027!");
  console.log("  Demo mentors→ mentor.[cohort]@demo.mujin.jp / mentor2026!");
  console.log(`  50 students across ${COHORTS.length} cohorts seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
