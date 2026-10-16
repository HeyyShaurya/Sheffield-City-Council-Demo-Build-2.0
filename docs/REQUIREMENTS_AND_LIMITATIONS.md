# Sheffield requirement traceability and capability boundaries

## Sources reviewed (source of truth ordering)

1. Original buyer requirements: **Pre-Market Engagement-HR-Payroll System Sheffield City Council v2.0(1).docx**, section 4.3/Table 1 (47 functional processes) and section 4.4/Table 2 (six demonstration use cases), section 5/Table 3 (seven criteria). Reference 100113345.
2. Respondent's final proposal: **Sheffield_City_Council_PME_Response_PayrollCloud_Limited_SUBMISSION_READY_FINAL_CLEAN(3).docx**. Separately reviewed PDF version **Sheffield_City_Council_PME_Response_PayrollCloud_Limited(1).pdf**. Baseline at **8,000** employees/payroll; **43 standard**, **4 additional-cost**; integrated Oracle HCM approach, Entra ID federation and external APIs/SFTP proposed.
3. Risk and usability regression checks: **Feedback Appendix- PayrollCloud (1).docx**, an evaluation from a different procurement. Candidate UX, hiring manager complexity, People Services integration exceptions and MI/report builder simplicity have been translated into acceptance tests, not incorrectly attributed as Sheffield findings.

The search of accessible SharePoint materials found the Sheffield PME original and response plus demo presentations from other opportunities. It did not identify or provide an existing modular application's original source code or authorised repository to reuse. This prototype is newly authored and should not be described as a modification of proprietary Oracle application code.

## Six use cases and real working evidence

| # | Buyer goal | Interactive demo delivery | Known limitation |
|---|---|---|---|
| 1 | Leave types and balance, employee request, team approval | Reactive state store for leave entitlement components, type selection, weekdays, overlap/available balance, manager approve/reject, audit | True holiday calendars, union policy and accrual engine not implemented |
| 2 | Establishment spans/tiers, jobs and FTE, cost centre roll-ups | Role-aware org hierarchy with posts, jobs, grades, FTE/headcount/cost-centre grouping; headcount updates after onboarding | No full future-dated workforce-restructure modelling or financial projection |
| 3 | Career search/application, selection/appointment and worker creation | Vacancy revision/publishing, mandatory cover letters, candidate token tracker, status, correspondence, interview schedule/reschedule, detailed scoring, offer, checks, new worker and tasks | SSO, live video meetings, electronic signing, external calendars and statutory right-to-work vetting are not connected |
| 4 | Multi-role upload, employee document view, retention and purge | File upload with allowed extension/size and ownership control, archive, artificial demo expiry, eligible purge and audit | No DPA/DPIA, legal hold, encrypted key vault, compliant retention schedules, malicious-file AV scanning |
| 5 | HR process visibility, actions, permission and audit | Assignee worklist, HR task creation/reassignment/completion, audit, optional casework | Workflow builder and HR policy engine are prototype subsets |
| 6 | Manager HR/payroll insight, tables/charts and drill-down | Live grouping, filters, restricted metrics and CSV export; role-aware report availability | Not full bespoke report designer, warehouse/BI product or Oracle reporting solution |

## 47-process classification

The app's **Requirements matrix** and `docs/capability_matrix.json` reproduce the classifications from the PCL response and honestly distinguish submitted *offer* from the level actually represented by this new *demonstrator*. Do not interpret a green **Standard Offer** classification as proof that this independent demo contains a production implementation of that capability. All 47 processes are tracked, but not all are fully functional in this prototype.

**Additional-cost per PCL response:**

1. Payroll claims/expenses;
2. Employee time and expense claims;
3. Advanced reporting capabilities;
4. HR case management.

The demo includes sample working paths for claims and HR casework, and baseline interactive reports, **without changing their contractual/quotation classification**. No production roadmap additions are presented as live.

## Feedback defence matrix

| Previous evaluation issue (not Sheffield-specific) | Preventive design/test |
|---|---|
| Lengthy, hard-to-follow manager vacancy journey | Create vacancy in a single modal; clearly named stage actions; edit/revision after publication |
| Candidate couldn't self-select or reschedule interviews | Candidate token tracking portal and self-service interview choice/rescheduling |
| Missing candidate correspondence | Portal inbox with recruiter message and status events (no false claim of mail delivery) |
| Mobile access unclear | Responsive career and employee screen layout (requires separate real-device QA) |
| Cover letters and detailed interview feedback | Cover-letter-required validation; mandatory score and narrative feedback |
| Integration failures, withdrawals, multiple offers/change scenarios | Withdraw invalidates future steps; mock event queue with forced failure/retry/idempotence; multiple offers across candidates not yet enterprise-grade orchestration |
| HR onboarding duplication | New worker linked directly to applicant identity and onboarding tasks; no duplicated shadow ATS record in an external HR system |
| EDI language checks | Candidate application fields; no autonomous bias-detection or independent EDI compliance tool is claimed |
| Complexity building custom reports | Filter, group, measure & CSV in same workspace; full BI builder is separate/optional |

## Portal message rules implemented

- `To` behaves like BCC; recipients see neither the other recipients nor a visible multi-recipient address list.
- **Force email notification** is a selectable boolean stored as a **mock queue intent**, never delivered to a real external email server.
- Subject maximum **255**, body maximum **4,000** characters; both frontend and backend validate these limits.
- Draft longer messages in an external text editor before pasting, as Sheffield's portal guidance recommends for session-timeout avoidance.

## Performance, accessibility and live deployment status

The 8,000-employee number is an indicative population/price baseline from the opportunity response. The demo ships only **16 fictional seeded worker records**, so scalability to 8,000 real concurrent users and statutory throughput is **not proven**. The application uses semantic labels/keyboard-focus controls, but independent accessibility (WCAG) certification has **not** been performed. All browser tests here ran in local isolated test environments; no live public deployment, production domain, app-store release or Oracle tenant integration was executed. Treat Docker only as a packaging convenience for a **private** demo, not a security sign-off.
