# 無尽（むじん）— Project Working Document

A "Redemptive Fintech" platform that modernizes Japan's historical mutual aid systems. Mujin leverages a **Recyclable Grant Model** to provide capital and community to international students excluded from Japan's mainstream financial system.

**Owner:** Jonathan Ahn (Founder) + Andrew Feng (Director of Programs)
**Status:** MVP complete — go-to-market phase

---

## How to Resume This Project

At the start of a new session, tell Claude:
> *"Read /Users/jonathanahn/Desktop/mujin2.0/docs/mujin2.0.md and resume as the consulting team on Mujin 2.0."*

**Companion files:**
- `mujin2.0-tech.md` — tech stack, schema, seed accounts, deploy instructions, API routes
- `mujin2.0-sessions.md` — full session history, all decisions made, completed sprint log
- `mujin2.0-manifesto.md` — founding document (EN/JP), Canva design notes, cover email template
- `mujin2.0-ux.md` — UX decisions, user flows (Sally)
- `mujin2.0-sprints.md` — epics, build order, sprint stories (Bob / Amelia)

---

## Consulting Team

| Persona | Name | Role | When to Invoke |
| :--- | :--- | :--- | :--- |
| 📊 **Analyst** | Mary | Business Analyst | Market research, competitive analysis, requirements discovery |
| 📋 **PM** | John | Product Manager | PRD creation, feature definition, success metrics |
| 🏗️ **Architect** | Winston | System Architect | Tech stack, system design, scalability decisions |
| 🎨 **UX Designer** | Sally | UX Designer | User flows, wireframes, UI planning |
| 💻 **Dev** | Amelia | Senior Engineer | Story implementation, code, tests |
| 🏃 **Scrum Master** | Bob | Scrum Master | Sprint planning, story creation, sprint tracking |
| 📚 **Tech Writer** | Paige | Technical Writer | Documentation, diagrams, clarity |
| 🧪 **Test Architect** | Murat | Master Test Architect | Test strategy, quality gates, CI/CD |

---

## Goals

- Prove that "Social Collateral" (behavior) is a better predictor of creditworthiness than financial history
- Launch a ¥500,000 Recyclable Grant Program for 50 university students as pilot
- **Individual graduation metric:** Bank introduction (4 hard gates + exit interview)
- **Program success metric:** Business Manager Visa obtained (org-level lagging indicator)
- Build financial rails to eventually serve broader credit-invisible populations in Japan

---

## Target Users

**Pilot:** International students in Christian student ministry with entrepreneurial vision
**Second cohort:** Refugees (steepest credit invisibility; same product, same model)

**Key insight:** The church/ministry is the distribution channel and trust pipeline. Andrew Feng is already known to the ISM network (IFI, KGK, CCC, JCMN). Parachurch orgs are the side door — not individual cold church outreach. Tokyo wards (Taito City model) actively seek community partners under their Multicultural Coexistence plans, creating a government alignment and registration pathway.

---

## The Core Model

### Recyclable Grant Loop
1. **Inflow:** Donor gives to Religious Corp (tax deductible)
2. **Outflow:** ¥500,000 "Venture Scholarship" to student (grant, not loan) — 2 tranches: ¥300K on signing / ¥200K at Month 3
3. **Recycling:** Student signs non-binding Pledge of Honor — upon success, returns principal + covenant gift to fund next generation

### Legal Architecture
- **Entity:** Religious Corporation (Shukyo Hojin)
- **Tax Shield:** "Deemed Donation" — up to 20% of co-working revenue donated tax-free to Mutual Aid Fund
- **Key boundary:** Pledge is non-binding. No debt collection. Structured to avoid FSA classification as de facto loan.

### Physical Layer
- Church assets within 15 min walk of major universities
- Mon–Fri: "The Mujin Commons" (secular co-working)
- Church Usage Agreement (~¥10,000/mo) satisfies Immigration Bureau "Physical Office" requirement for Business Manager Visa

---

## The Trust Engine (Core Digital Product)

### 4-Signal Scoring Model

| Signal | How Measured | Weight |
| :--- | :--- | :--- |
| **Responsiveness** | % of bi-weekly mentor check-ins attended | 25% |
| **Transparency** | Monthly P&L submitted on time + completeness | 25% |
| **Mutualism** | % of monthly Town Halls attended (peer-reported, majority rule) | 25% |
| **Reflection** | Monthly reflection submitted + AI-assessed as meaningful | 25% |

**Traffic Light:** Green 75–100 / Yellow 50–74 / Red 0–49

### Graduation Gates (Bank Introduction Trigger)
1. Company incorporated + product live
2. 3 months non-negative cash flow
3. Green trust score for 6 consecutive months
4. Exit interview passed

**State machine:** `INELIGIBLE → ELIGIBLE → INTERVIEW_SCHEDULED → INTERVIEW_PASSED/FAILED → GRADUATED`

---

## Roadmap

| Quarter | Milestone |
| :--- | :--- |
| Q2 2026 | Legal opinion. Informal bank outreach (JFC + 1–2 regional banks). |
| Q3 2026 | Fundraising (¥50M). Secure church partner. |
| Q1 2027 | Sign bank MOU. |
| Q2 2027 | **LAUNCH Pilot Cohort (50 Students)** |

---

## Strategic Context

- **無尽講 (Mujin-ko):** Japan's original rotating mutual aid association — Mujin is a revival, not a foreign import
- **350,000 international students** in Japan (92% Asian); visa support identified as "most urgent" practical need by ISM workers
- **Taito City model:** Church created volunteer bridge org → city now funds multicultural coexistence program → city distributes church info to all new foreign residents. This is the operational template.
- **2030 Problem:** 50% of Protestant churches in Japan face closure — foreign residents and "reverse evangelism" are cited as renewal pathway
- **Visa Crisis (Oct 2025):** Business Manager Visa capital requirement surged ¥5M → ¥30M — Mujin's physical office solution is more urgent than ever
- **Competitive whitespace:** Grant orgs give money and walk away. Banks require history students can't build. Mujin is the bridge.

---

## Risk Assessment

| Risk | Mitigation |
| :--- | :--- |
| FSA views grant as de facto loan | Non-binding pledge. No debt collectors. Legal opinion secured. |
| Banks won't recognize Trust Score | Dual-track: JFC + Kiraboshi/Tokyo Star. Entry via FinCity Tokyo + ministry network. |
| Student ghosts after grant | Social Kill-Switch: exclusion from alumni network + university career support |
| Church conservatism | Relationship-first via ISM network. Never pitch cold. Andrew is the connector. |

---

## Session State
> Last updated: 2026-03-19 (session 22) — CLOSED
> Current phase: **Go-to-market — all documents finalized and exported as .docx, awaiting Canva formatting before pastor send**

### Session 22 Summary
- Manifesto revised: consistent short sentence rhythm, all em dashes removed, operational asks stripped, person-to-person register held throughout
- Fixed "carrying degrees" — students arrive to obtain degrees, not with them. Now reads: "They arrived carrying dreams."
- Fixed "Founded in Japan" — now reads: "Rooted in Japan. Built for the world." Updated in both manifesto and donor projection.
- Financial model built with PM John: $1M / ¥158.7M raise fully justified
- Key finding: co-working revenue + Frontier Commons self-funded staff = zero operational cost to donors
- 7-year projection: 275 students served, ¥65.3M fund remaining, recycling accelerating from year 3
- Conservative pilot: 15 students year 1 (pipeline not yet established)
- Addressable pipeline: 150–560 students within ISM network
- Donor projection document created: `mujin2.0-donor-projection.md` (includes full assumptions appendix)
- Full shareable report created: `mujin2.0-report.md` (16-18 page formal research report, APA citations, no bullet points, TNR 12 spec, no content from old PDF)
- All three documents exported as .docx via Pandoc: `mujin2.0-report.docx`, `mujin2.0-donor-projection.docx`, `mujin2.0-manifesto.docx`

### Open Task List
| # | Task | Owner | Priority |
|---|------|-------|----------|
| 1 | Format manifesto in Canva → PDF (A4, serif, white, dual-language) | Jonathan | This week |
| 2 | Send PDF + cover email to pastor contact in Japan | Jonathan | This week |
| 3 | 2–3 conversations with ISM network contacts | Andrew | This week |
| 4 | Secure real domain (replace mujin2.vercel.app) | Jonathan | Before wider sharing |
| 5 | Explore Taito City multicultural coexistence partner registration | Jonathan + Andrew | Next 30 days |
| 6 | Draft FAQ one-pager (for second wave, when pastor shares with others) | — | After first send |
| 7 | Format donor projection in Canva → PDF | Jonathan | Before donor conversations |
| 8 | Ask Andrew to map IFI donor network (who gave, at what level, why) | Andrew | This week |
| 9 | Get Andrew's honest read on year 1 pipeline (how many students realistically) | Andrew | This week |
| 10 | **Migrate demo site** — remove demo from login screen, add as dedicated tab on main page with side panel to switch views (requires re-login to GitHub + Vercel first) | Jonathan | Next sprint |
