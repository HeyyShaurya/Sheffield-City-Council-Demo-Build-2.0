# Sheffield Connect — Verified Quality Assurance & Test Report

**Reference:** 100113345 | Sheffield City Council Pre-Market Engagement  
**Demonstrator Architecture:** React 18, Vite 5, TypeScript 5, Tailwind CSS, Local In-Memory & LocalStorage State  
**Executed Date:** October 2026, Verified Sandbox Environment  
**Implementation State:** Opportunity-specific interactive demonstrator; NOT a connected Oracle Cloud HCM production tenant.

---

## 1. Automated Verification Record (40 of 40 Passed)

The automated test suite (`scripts/run_automated_tests.ts`) executes full behavioral assertions across all ten master requirements:

```bash
npm test
# runs: tsx scripts/run_automated_tests.ts
```

| Suite | Scope / Requirement | Tests | Result | Verification Method |
|---|---|:---:|:---:|---|
| **Suite 1** | Role-Based Authentication & Permissions | 4 | **PASS** | PIN authentication (`sheffield-demo`), invalid credential rejection, full admin system oversight, employee access restrictions |
| **Suite 2** | Employee Document Upload, Retention & Purge | 5 | **PASS** | Employee upload with future retention, cross-worker upload rejection, privacy isolation, premature purge rejection (0 purged), admin demo expiry simulation, eligible purge execution with audit |
| **Suite 3** | Candidate Recruitment & Onboarding Lifecycle | 9 | **PASS** | Vacancy application, duplicate prevention (same email/vacancy), recruiter shortlisting, candidate interview self-service, portal messaging (no email claims), interview scoring (0-5) with feedback, conditional offer issue, candidate-controlled offer acceptance (e-signature), onboarding handoff (headcount increment, 3 starter tasks, staged events) |
| **Suite 4** | Pre-Payroll Anomaly Detection & Finalisation Blocking | 4 | **PASS** | Automated scanning of unapproved timesheets & zero salaries, strict finalisation blocking when anomalies exist, resolution with audit note, finalisation execution, BACS disbursement export, duplicate run rejection |
| **Suite 5** | Integration Queue, Fault Injection & Idempotency | 2 | **PASS** | Simulated failure injection (503 Gateway Timeout), status update to Failed with exception detail, retry processing to Delivered without duplicate records |
| **Suite 6** | Private Messaging, Limits & BCC Delivery | 3 | **PASS** | Subject length enforcement (max 255 chars), body length enforcement (max 4,000 chars), multi-recipient BCC delivery isolation (recipients cannot view other identities) |
| **Suite 7** | Admin-Only Demonstration Reset | 3 | **PASS** | Non-admin rejection, invalid confirmation phrase rejection, successful reset with `RESET DEMO` restoring 16 baseline personas |
| **Suite 8** | Dynamic Management Reporting | 2 | **PASS** | Grouped rollups by department, grade, and cost-center; dynamic headcount and FTE calculation; salary metric restricted from employees |
| **Suite 9** | Annual Leave Request & Approval | 1 | **PASS** | Weekday leave request submission, manager review and approval, automatic annual leave balance reduction and audit entry |
| **Suite 10** | Organisation Structure & Spans / Tiers | 2 | **PASS** | Employee privacy restriction (sees only self and manager), Director full establishment view with cost-center FTE rollups |
| **Suite 11** | Learning Hub & Compliance Tracking | 3 | **PASS** | Course enrolment, duplicate enrolment prevention, employee course completion tracking with audit |
| **Suite 12** | Immutable Governance Audit Trail | 2 | **PASS** | Comprehensive audit trail logging actor, entity, action, and detail; employee access restriction |
| **Total** | **Comprehensive Regression Coverage** | **40** | **100% PASS** | Zero failures across all suites |

---

## 2. Interactive Browser Navigation & Workflow Checks

| Journey | Steps Executed | Observed Result | Evidence Status |
|---|---|---|---|
| **Scenario 1: Annual Leave** | Aisha Khan requests 3 days leave → Helen Walker signs in and approves → Aisha re-checks balance | Approved status shown; available balance reduced from 25 to 22 days; audit record logged. | **VERIFIED** |
| **Scenario 2: Org Structure** | Matthew Grant / Helen Walker navigates to Organisation view | Spans and tiers rendered; cost centres ASC-110 and PH-200 rollups computed dynamically. | **VERIFIED** |
| **Scenario 3: Recruitment Lifecycle** | Public candidate applies → Grace Turner shortlists → Candidate self-selects interview → Grace scores & offers → Candidate accepts in portal → HR onboards | Complete end-to-end lifecycle verified; headcount incremented from 16 to 17; 3 onboarding tasks created. | **VERIFIED** |
| **Scenario 4: Document Governance** | Aisha uploads declaration → Priya archives → Premature purge run (0 removed) → Sofia simulates expiry → Purge run removes expired record | Strict lifecycle governance verified; purge blocked until retention expired; audit trail preserved. | **VERIFIED** |
| **Scenario 5: HR Journeys & Tasks** | Priya assigns new task to colleague → Assignee marks complete → Audit record created | Worklist updated in real time; completed task filtered; audit stream reflects action. | **VERIFIED** |
| **Scenario 6: Workforce Insights** | Filter by Adult Social Care → Group by department / cost center → Switch to FTE → Export CSV | Bar charts and summary tables recalculate instantly; CSV downloads valid dataset. | **VERIFIED** |
| **Scenario 7: Pre-Payroll Anomaly Audit** | Oliver Reed calculates payroll run → 1 critical timesheet anomaly detected → Finalise blocked → Anomaly resolved → Finalise executes | Finalisation strictly blocked until anomaly resolved; BACS instruction file staged and downloadable. | **VERIFIED** |
| **Scenario 8: Integration Fault Recovery** | Sofia Bennett opens Integration Control → Injects failure on Entra ID event → Retries event | State transitions from Queued → Failed (503) → Delivered without duplicate records. | **VERIFIED** |
| **Scenario 9: Private BCC Messaging** | Oliver composes message to 2 recipients with 255-char subject limit → Sent privately | Each recipient sees only their own incoming message; BCC privacy preserved. | **VERIFIED** |
| **Scenario 10: Sandbox Dataset Reset** | Sofia Bennett enters `RESET DEMO` on Admin Dashboard / Guide view | System cleanly restores all 16 initial personas, initial vacancy, and resets leave/payroll state. | **VERIFIED** |

---

## 3. Explicit Boundaries & Unverified Items (NOT VERIFIED)

To maintain absolute transparency with Sheffield City Council, the following boundaries are stated:

1. **Oracle Cloud HCM Connection:** **NOT VERIFIED / NOT CONNECTED.** This application is a self-contained opportunity demonstrator. No live Oracle Cloud tenant, REST API, or Fusion database is connected.
2. **Statutory UK Payroll & HMRC RTI:** **NOT VERIFIED.** Payroll figures use an illustrative explainable model (18% nominal deductions) for workflow demonstration only. It is NOT certified for HMRC Real Time Information (RTI), National Insurance, or statutory pension schemes (LGPS/TPS).
3. **Microsoft Entra ID / Real SSO:** **NOT VERIFIED.** Role-based login uses a local demonstrator PIN mechanism (`sheffield-demo`). Real OAuth2/SAML federation with Sheffield's corporate Active Directory is not connected.
4. **External Email / Calendar Delivery:** **NOT VERIFIED.** Notifications and messages are delivered strictly to the in-app Candidate Portal and Staff Message Centre. No real emails or Microsoft Graph calendar invites are transmitted.
5. **8,000 Employee Production Scale:** **NOT VERIFIED.** 8,000 represents Sheffield's procurement sizing baseline. The demonstrator contains 16 synthetic seed records; performance testing under real 8,000-user concurrency has not been performed.
6. **Statutory Right to Work & DBS Check Integration:** **NOT VERIFIED.** Candidate onboarding simulates document verification and checklist generation; external Home Office or DBS electronic verification systems are not connected.
7. **Legal GDPR / Records Retention Certification:** **NOT VERIFIED.** Document retention dates and purge routines demonstrate policy governance workflows; formal GDPR compliance, DPIA approval, and cryptographic erasure are not certified.

---

## 4. How to Repeat Build & Test Execution

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript lint check
npm run lint

# 3. Execute full automated verification suite (40 tests)
npm test

# 4. Build production bundle
npm run build

# 5. Generate verified release package ZIP
npm run package

# 6. Start local development server
npm run dev
```
