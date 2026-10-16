# Sheffield City Council — Presenter / Video Narration Script

**Reference 100113345 | PayrollCloud Limited | Target length: 48–50 minutes**

**Important pre-recording statement:** This is an **interactive opportunity-specific prototype using fictional records**, illustrating the journeys described by Sheffield's PME and PayrollCloud's response. It is NOT a connected Oracle Cloud HCM tenant, not a certified UK payroll engine, and not a production security environment. Do not claim that a simulated external interface has transmitted a message to Microsoft/finance/HMRC. This is a rehearsal script, not a statement that the Council approved the system.

## Recording setup — before pressing Record

1. Install and run from README. Use a **1365×900 or 1440×900** desktop viewport; 100% zoom. If mobile must be shown, switch to responsive device viewport for the candidate journey only.
2. Sign in as **Sofia Bennett**, navigate to **Demo walkthrough**, click **Reset**, enter `RESET DEMO` and confirm. This restores 16 fictional people and one posted vacancy.
3. Sign in as **Aisha Khan** for the opening journey. Access code is `sheffield-demo`, unless you changed `SHEFFIELD_DEMO_PIN`.
4. Prepare a small sample document (`signed-declaration.txt`, e.g. "Fictional employee confirmation — for demonstration only"). Never upload real staff records.
5. Silence notifications; keep a second browser tab available for public career portal, or use the in-app `Preview career portal` control and `Return to workspace`. For clean continuity, retain the same app database throughout the video.
6. Speaker opening: “Thank you for inviting us to illustrate a connected employee lifecycle. We will follow six scenarios from Sheffield's original PME, showing a real interactive workflow rather than disconnected static slides. Every person and transaction is fictional, and the connection to external corporate systems is modelled for this demonstration.”

## 00:00–03:00 | Orientation and evidence

**Screen/persona:** Aisha Khan → Overview.

**Say:** “We start with the employee. This workspace is personalised by security role, but all actions share the same transaction store. The dashboards are calculated from current sample records. The Council's 8,000-population planning figure is a sizing baseline; we have only 16 fictional users loaded to keep the flow easy to follow. The response maps 47 processes, categorised as 43 included in the proposed baseline and four separately scoped options. Our demonstrator visualises those classifications transparently.”

**Click:** Point to live cards, `Requirements matrix` under Demonstration evidence, open rows briefly, return `Overview`.

**Show evidence:** Change persona control and clearly labelled `SANDBOX DEMO`.

## 03:00–09:00 | Scenario 1 — Employee annual leave

**Screen/persona:** Aisha → `Absence & leave`.

**Say:** “An employee first sees leave entitlement in context: annual leave, carried-forward and purchased days, plus bank holidays. We'll now submit a genuine request stored in our running demo rather than moving to a second mock slide.”

**Click:** `+ Request leave`. Select `Annual`, choose two weekdays at least three weeks ahead, enter “Family commitment”, press `Submit for approval`. Watch the item become `Pending`.

**Say:** “The request is routed to the line manager. Overlapping requests and excessive annual leave are rejected by the server, not simply hidden on screen.”

**Switch persona:** bottom left `Change persona` → `Helen Walker` → `Absence & leave`. Click **Approve** on Aisha’s request.

**Say:** “Helen sees the team request in one queue, and approves with an auditable state transition. We'll switch back to the employee to confirm that status and available balance changed.”

**Switch:** Aisha → Leave. Show new Approved status and lower annual leave available balance.

**Recovery:** If the future dates fall on a weekend, pick weekdays instead. For a rejected-path example create a different request and use Reject; don’t accidentally attempt to decide the same request twice.

## 09:00–15:00 | Scenario 2 — Establishment and management structure

**Switch:** `Helen Walker` or `Matthew Grant` → `Organisation`.

**Say:** “We now view the establishment as connected people and posts rather than an unrelated chart. You can inspect position, grade, cost centre, fractional FTE and the reporting manager. Management roll-ups are calculated from those same worker records.”

**Click:** Scroll to a few sample post cards, identify cost centres ASC-110 and PH-200, and the headcount/FTE summary.

**Say:** “The privacy boundary is also important: an employee cannot drill into everyone’s sensitive information simply by navigating a chart. New starters added in our next journey update headcount and the structure automatically.”

**Optional:** Later return to this screen to show one extra worker after onboarding. Clarify that future-dated restructure modelling needs additional configuration rather than imply it is working in this prototype.

## 15:00–25:00 | Scenario 3 — Candidate-to-worker full lifecycle

**Switch:** `Grace Turner` → `Recruitment & onboarding`.

**Say:** “This is our longest connected sequence, because an intuitive candidate experience and a short manager journey matter as much as feature availability. Sheffield’s PME requires a seamless application-through-appointment handoff.”

**Click:** Explain a vacancy can be created in **one form** and edited after publishing with revision tracking. The initial vacancy **Community Support Officer** is already posted; use it to keep the video to schedule. If showing creation, create draft then publish as Grace.

**Click:** `Preview career portal` → apply to Community Support Officer. Type fictional candidate name **Maya Evans**, unique address `maya.demo@example.com`, statement about community support and a required cover letter. Submit.

**Say:** “The candidate immediately gets a private tracking view and an application receipt event. Duplicate applications and missing mandatory documents are rejected. The applicant is not asked to learn a separate HR portal to see status.”

**Click:** `Return to workspace`. As Grace, find Maya in pipeline → **Shortlisted**.

**Click:** Candidate portal again. Choose a future interview slot and **Video**, save; then demonstrate **Reschedule** to a different slot if time allows. This is metadata scheduling only, **not a live video meeting**.

**Switch:** Return to recruiter. Click **Message** beside Maya and send a concise “Thank you for your application. Please confirm your availability.” Return to candidate tracker and point to visible correspondence in portal inbox (not real email).

**Click:** Return to recruiter and click **Interview Completed**. Fill interview score 4 or 5 and specific structured feedback (“Service-user communication, example-led approach, safeguarding awareness”). Save.

**Click:** Move through **Offered → Offer Accepted → Checks Complete → Onboarded**.

**Say:** “A successful appointment generates an employee record, linked onboarding tasks and a local integration event. We have no hidden manual slide change; other screens now see this new person.”

**Show evidence:** Switch to Priya → HR journeys; find onboarding tasks. Switch to Matthew or Priya → dashboard/organisation → headcount increased from 16 to 17. Explain that true identity proofing, safeguarding integrations and real e-signatures require the separately configured platform.

**Recovery:** A candidate can apply only once per email and vacancy. If re-recording, admin Reset beforehand; otherwise use a genuinely different fictional email. The candidate tracker uses a locally stored access token; do not display it publicly outside the safe demo dataset.

## 25:00–32:00 | Scenario 4 — Documents, retention and deletion

**Switch:** Aisha → `Document records`.

**Say:** “A worker can upload their own classified record instead of emailing a confidential attachment. Access to other staff’s documents is blocked. This is a governed local demonstration of metadata and transitions.”

**Click:** Upload `signed-declaration.txt` using `+ Upload document`. Choose **Signed declaration** and a future retention date; submit. Confirm register entry.

**Switch:** Priya Shah → `Document records`. Find the new entry and click **Archive**.

**Say:** “Archiving isn't deletion. A retention rule must first be eligible. A premature purge will not remove this record.”

**Click:** Optional `Run eligible purge` before expiry → 0 removed.

**Switch:** Sofia Bennett → `Document records` → **Simulate expiry** for the archived fictional document.

**Say:** “For a repeatable demonstration, an administrator artificially sets this *sample record's* retention eligibility to yesterday. This is a sandbox-only testing feature, not a real retention schedule override.”

**Switch:** Priya → `Run eligible purge`; show removal from active register. Optional Priya → `Audit evidence` to show evidence.

**Boundary:** Never claim legal GDPR certification, immutable retention, encryption at rest or legal holds from this prototype alone.

## 32:00–39:00 | Scenario 5 — People Services activities

**Switch:** Priya → `HR journeys & tasks`.

**Say:** “People Services owns governed checks, clear handoffs and a straightforward worklist, without tracking actions across several disconnected pages. Each task has an assignee, due date, status and audit.”

**Click:** `+ Assign task` → “Validate new-starter checklist” → select Aisha or another active colleague → select upcoming due date → submit.

**Switch:** selected assignee → `HR journeys & tasks` → complete assigned task.

**Switch:** Priya → refresh tasks and show Closed/Completed status, plus audit entry. Demonstrate task reassignment on a separate open task if appropriate.

**Say:** “A case-management extension is demonstrated under Optional capabilities. It is not quietly added to the committed baseline: the submitted response explicitly identifies HR casework as an additional-cost option.”

**Optional:** Priya → Optional capabilities → open HR case with synthetic details → close it.

## 39:00–46:00 | Scenario 6 — Management information

**Switch:** Matthew Grant or Priya → `Workforce insights`.

**Say:** “Rather than building a bespoke query with an unfamiliar wizard, a service manager can change a metric and its grouping right here, then immediately see the recalculated answer. This addresses the need for usable, flexible management information.”

**Click:** Group by department → headcount → filter “Adult Social Care” → Apply filters → chart and summary update. Clear filter, switch `FTE`; then group by cost centre/grade. Export filtered CSV.

**Say:** “These are computed directly against the demo’s current worker data; any newly onboarded candidate appears automatically. Permissions limit the sensitive measures. A full BI model builder remains a separate capability rather than being misrepresented as included in this standalone prototype.”

## 46:00–50:00 | Close: payroll, learning, optional controls and integration recovery

**Switch:** Amira → Learning hub. Show browse/book/completion and manager records. Switch Oliver → Payroll & payslips → run period and finalise (once only). Switch Aisha → see private payslip.

**Say:** “The payroll figures use a fixed illustrative 18% deduction for product walk-through only. Real PAYE, NI, LGPS/TPS, HMRC interfaces and payments have not been implemented here.”

**Switch:** Sofia → `Integration control`. Find queued event, click **Inject failure**, then **Process** to recover.

**Say:** “The event remains auditable and retries without duplicating the local event ID. This is a mock connector: we are not claiming an Outlook invite or payroll payment was actually delivered. Production integration ownership, SSO/MFA and UK-hosted security remain implementation workstreams.”

**Switch:** Any manager/HR → `Private messaging`. Compose a demonstration message with two recipients, leaving `To` undisclosed to other recipients and checking `Send notification irrespective of preference` to show mock notification intent.

**Closing line:** “Our intended end-state is one joined-up employee lifecycle with clear role-driven journeys. Today we have shown functioning examples of the six scenarios, where information changes once and the next person receives an actionable handoff. For a procurement live-system assessment, we would validate these same journeys against the licensed Oracle-backed solution, real integrations, security controls and Sheffield policy.”

## Video completion checklist

- [ ] Source and demo-vs-production distinction made explicit on opening and closing
- [ ] Six Council use cases shown as working transactions (not merely screenshots)
- [ ] Leave request approved across **different user personas**; balance changed
- [ ] Org chart FTE/headcount visibly computed
- [ ] Candidate applied, received progress, shortlisted, scheduled interview, scored, offered, onboarded
- [ ] Candidate correspondence in portal and no false email delivery claim
- [ ] Document uploaded, archived, demo-expired, purged; permission explained
- [ ] HR task created and completed by assignee
- [ ] Filtered role-based metrics and CSV demonstrated
- [ ] Four additional-cost options not misclassified as baseline
- [ ] Mock failure/recovery + explicit UK payroll/SSO limitation explained
- [ ] No sensitive information or real personal records used
