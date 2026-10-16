# Sheffield Connect — HR & Payroll Opportunity Demonstrator (React)

**Opportunity:** Sheffield City Council, pre-market engagement reference **100113345**.  
**Respondent:** PayrollCloud Limited.  
**Framework:** Modern React + TypeScript SPA built with Vite.  
**What this is:** an interactive demonstration application designed for live narration, recording, and stakeholder exploration. It features role-aware workspaces, persistent local storage, responsive UI, and all six priority Sheffield City Council use cases.

---

## Quick Start

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Run verification and packaging:
```bash
npm test        # Run all 40 automated regression verification tests
npm run package # Generate release ZIP package (sheffield-connect-pme100113345.zip) and update BUILD_MANIFEST.json
```

The application runs on `http://0.0.0.0:3000` (or `http://localhost:3000`).

- **Demo access code:** `sheffield-demo`
- **Initial persona:** Aisha Khan (Employee) or choose any of the 10 personas in the dropdown.
- **Reset Demo Data:** Sign in as **Sofia Bennett** (System administrator) &rarr; **Demo walkthrough** &rarr; **Reset sample for a clean take** (type `RESET DEMO`).

---

## Demonstration Personas (All Fictional)

| Name | Role | Most Useful Demonstration |
|---|---|---|
| **Aisha Khan** | Employee | Absence request, personal profile, time submission, course booking, payslips |
| **Helen Walker** | Hiring / Team Manager | Approve/reject team leave & timesheet, inspect organisation hierarchy, create vacancy |
| **Grace Turner** | Recruiter | Create/publish vacancy, candidate pipeline, scored interview feedback, offer, onboarding |
| **Priya Shah** | People Services (HR) | Worklists & tasks, document lifecycle, archive & purge, restricted HR casework |
| **Sofia Bennett** | System Administrator | Demo state reset, simulate document expiry, retry mock integrations |
| **Matthew Grant** | Service Director | Role-aware workforce analytics, FTE/headcount roll-ups, CSV export |
| **Oliver Reed** | Payroll Lead | Illustrative monthly payroll calculation, finalisation, payslip generation |
| **Amira Yusuf** | Learning Administrator | Learning course catalogue, seat limits, completion tracking |

---

## The Six Priority Council Journeys

1. **Book and approve annual leave (Use Case 01):**
   - Aisha Khan submits annual leave with weekday calculations.
   - Helen Walker reviews the request, approving or rejecting with auditable state change.
   - Returning as Aisha confirms the decremented balance and approval record.
2. **Establishment & organisation hierarchy (Use Case 02):**
   - Review reporting lines, post grades, FTE, and cost centres.
   - Cost-centre and service roll-ups update dynamically when new staff are onboarded.
3. **Applicant-to-worker lifecycle (Use Case 03):**
   - Manager/Recruiter creates and publishes a vacancy with optional cover letter.
   - Candidate applies via the public careers portal and receives a private tracking token.
   - Candidate self-selects video or in-person interview slot and views recruiter correspondence.
   - Recruiter logs mandatory interview score (0-5) and feedback before issuing offer.
   - Onboarding automatically provisions a worker record, links onboarding tasks, and queues integration events.
4. **Document governance, retention & purge (Use Case 04):**
   - Employees upload classified files with retention deadlines.
   - HR archives eligible records; administrators simulate retention expiry for demo walkthroughs.
   - Eligible purge deletes expired archived records with full audit trail.
5. **People Services tasks & hand-offs (Use Case 05):**
   - Coordinated task assignments across employee, HR, and learning teams.
   - Optional HR casework module demonstrated transparently as an additional-cost option.
6. **Workforce insights & management information (Use Case 06):**
   - Dynamic grouping by department, cost centre, or grade across headcount, FTE, and salary.
   - Instant visual bar breakdown, filter search, and direct CSV export.

---

## Architecture & Technology

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Custom design system matching the original Sheffield Connect theme and brand tokens
- **State & Storage:** Reactive, in-memory and `localStorage`-backed store (`SheffieldStore`) maintaining entity relationships, audit logs, and integration queues
- **Requirements Matrix:** 47 PME requirements mapped against standard and additional-cost capabilities
