import React, { useState } from 'react';
import { User, Vacancy, Application } from '../types';
import { store, ago, isodays } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface RecruitViewProps {
  user: User;
  onNavigatePublic: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const RecruitView: React.FC<RecruitViewProps> = ({ user, onNavigatePublic, onToast }) => {
  const vacancies = store.getVacancies(user);
  const applications = store.getApplications(user);

  const isManager = ['manager', 'hr', 'admin'].includes(user.role);
  const isRecruiter = ['recruiter', 'hr', 'admin'].includes(user.role);
  const canCreate = isManager || user.role === 'recruiter';

  // Vacancy modal state
  const [isCreateVacOpen, setIsCreateVacOpen] = useState(false);
  const [vacTitle, setVacTitle] = useState('');
  const [vacDept, setVacDept] = useState('Adult Social Care');
  const [vacLoc, setVacLoc] = useState('Sheffield / hybrid');
  const [vacGrade, setVacGrade] = useState('G6');
  const [vacSalary, setVacSalary] = useState('GBP 30,000 - 34,000');
  const [vacSummary, setVacSummary] = useState('');
  const [vacClosing, setVacClosing] = useState(isodays(30));
  const [vacCoverReq, setVacCoverReq] = useState(true);

  // Edit Vacancy modal state
  const [editVac, setEditVac] = useState<Vacancy | null>(null);

  // Interview Scoring Modal state
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [interviewScore, setInterviewScore] = useState<number>(5);
  const [interviewFeedback, setInterviewFeedback] = useState<string>('');

  // Message Modal state
  const [msgApp, setMsgApp] = useState<Application | null>(null);
  const [msgSubject, setMsgSubject] = useState<string>('');
  const [msgBody, setMsgBody] = useState<string>('');

  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = store.createVacancy(user, {
        title: vacTitle,
        department: vacDept,
        location: vacLoc,
        grade: vacGrade,
        salary: vacSalary,
        summary: vacSummary,
        closing: vacClosing,
        cover_required: vacCoverReq,
      });
      onToast(`Vacancy #${res.id} saved as Draft`);
      setIsCreateVacOpen(false);
      setVacTitle('');
      setVacSummary('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleSaveEditVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVac) return;
    try {
      const updated = store.updateVacancy(editVac.id, user, {
        title: editVac.title,
        grade: editVac.grade,
        salary: editVac.salary,
        closing: editVac.closing,
        summary: editVac.summary,
        cover_required: editVac.cover_required,
      });
      onToast(`Vacancy revised to version v${updated.revision}`);
      setEditVac(null);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handlePublish = (id: number) => {
    try {
      store.publishVacancy(id, user);
      onToast('Vacancy published in public careers');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleCloseVacancy = (id: number) => {
    if (!window.confirm('Close this vacancy to new applications?')) return;
    try {
      store.closeVacancy(id, user);
      onToast('Vacancy closed');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleStageClick = (app: Application, nextStage: Application['stage']) => {
    if (nextStage === 'Interview Completed') {
      setInterviewApp(app);
      setInterviewScore(5);
      setInterviewFeedback('Strong demonstration of service user values, safeguarding principles, and community team collaboration.');
      return;
    }
    if (nextStage === 'Onboarded') {
      if (!window.confirm('Create the employee record and linked onboarding tasks?')) return;
    }
    try {
      store.updateApplicationStage(app.id, nextStage, user);
      onToast(`Application updated to ${nextStage}`);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleSaveInterviewOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewApp) return;
    try {
      store.updateApplicationStage(interviewApp.id, 'Interview Completed', user, interviewFeedback, interviewScore);
      onToast('Interview outcome saved with feedback');
      setInterviewApp(null);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgApp) return;
    try {
      store.recruiterSendMessage(msgApp.id, msgSubject, msgBody, user);
      onToast('Portal correspondence saved; no real email sent');
      setMsgApp(null);
      setMsgSubject('');
      setMsgBody('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const renderNextStageButtons = (app: Application) => {
    if (app.stage === 'Applied') {
      return (
        <span className="inline-actions">
          <button className="btn small light" onClick={() => handleStageClick(app, 'Shortlisted')} type="button">
            Shortlist
          </button>
          <button className="btn small danger" onClick={() => handleStageClick(app, 'Rejected')} type="button">
            Reject
          </button>
        </span>
      );
    }

    if (app.stage === 'Shortlisted') {
      return (
        <span className="micro muted" style={{ fontStyle: 'italic' }}>
          Awaiting candidate self-service interview booking
        </span>
      );
    }

    if (app.stage === 'Interview Scheduled') {
      return (
        <span className="inline-actions">
          <button className="btn small primary" onClick={() => handleStageClick(app, 'Interview Completed')} type="button">
            Score interview &rarr;
          </button>
          <button className="btn small danger" onClick={() => handleStageClick(app, 'Rejected')} type="button">
            Reject
          </button>
        </span>
      );
    }

    if (app.stage === 'Interview Completed') {
      return (
        <span className="inline-actions">
          <button className="btn small primary" onClick={() => handleStageClick(app, 'Offered')} type="button" style={{ background: '#005A36' }}>
            Issue Conditional Offer
          </button>
          <button className="btn small danger" onClick={() => handleStageClick(app, 'Rejected')} type="button">
            Reject
          </button>
        </span>
      );
    }

    if (app.stage === 'Offered') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="micro muted" style={{ fontWeight: 700, color: '#005A36' }}>
            ✓ Offer sent (awaiting candidate acceptance via portal)
          </span>
          <span className="inline-actions">
            <button
              className="btn small light"
              onClick={() => handleStageClick(app, 'Offer Accepted')}
              type="button"
              title="Record verified written acceptance from candidate"
            >
              Log offline acceptance
            </button>
            <button className="btn small danger" onClick={() => handleStageClick(app, 'Rejected')} type="button">
              Withdraw offer
            </button>
          </span>
        </div>
      );
    }

    if (app.stage === 'Offer Accepted') {
      return (
        <span className="inline-actions">
          <button
            className="btn small primary"
            onClick={() => handleStageClick(app, 'Checks Complete')}
            type="button"
            style={{ background: '#2D77C7' }}
          >
            Verify Pre-Employment Checks
          </button>
        </span>
      );
    }

    if (app.stage === 'Checks Complete') {
      return (
        <span className="inline-actions">
          <button
            className="btn small primary"
            onClick={() => handleStageClick(app, 'Onboarded')}
            type="button"
            style={{ background: '#005A36' }}
          >
            Complete Onboarding &amp; Create Worker
          </button>
        </span>
      );
    }

    if (app.stage === 'Onboarded') {
      return <span className="badge good">Onboarded (Worker #{app.worker_id})</span>;
    }

    return <span className="micro muted">{app.stage}</span>;
  };

  return (
    <div>
      <PageHead
        title="Recruitment & onboarding"
        kicker="USE CASE 03 / APPLICANT TO WORKER"
        desc="Short vacancy creation, candidate progress, interview feedback, offer and a shared employee record."
        actions={
          <div className="inline-actions">
            {canCreate && (
              <button className="btn primary" onClick={() => setIsCreateVacOpen(true)} type="button">
                + Create vacancy
              </button>
            )}
            <button className="btn ghost" onClick={onNavigatePublic} type="button">
              Preview career portal
            </button>
          </div>
        }
      />

      <div className="card">
        <div className="section-top">
          <h2>Vacancy management</h2>
          <span>One-page manager journey with editable revisions</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vacancy</th>
                <th>Service</th>
                <th>Grade / location</th>
                <th>Status</th>
                <th>Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vacancies.length ? (
                vacancies.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <strong>{x.title}</strong>
                      <div className="micro muted">Closes {x.closing}</div>
                    </td>
                    <td>{x.department}</td>
                    <td>
                      {x.grade} / {x.location}
                    </td>
                    <td>
                      <StatusBadge value={x.status} />
                    </td>
                    <td>v{x.revision}</td>
                    <td className="actions">
                      <div className="inline-actions">
                        {canCreate && (
                          <button
                            className="btn small ghost"
                            onClick={() => setEditVac({ ...x })}
                            type="button"
                          >
                            Edit
                          </button>
                        )}
                        {isRecruiter && x.status === 'Draft' && (
                          <button
                            className="btn small light"
                            onClick={() => handlePublish(x.id)}
                            type="button"
                          >
                            Publish
                          </button>
                        )}
                        {isRecruiter && x.status === 'Published' && (
                          <button
                            className="btn small danger"
                            onClick={() => handleCloseVacancy(x.id)}
                            type="button"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="No vacancies created yet." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-top">
          <h2>Candidate pipeline</h2>
          <span>Recorded shortlisting and interview outcomes</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate / vacancy</th>
                <th>Stage</th>
                <th>Interview</th>
                <th>Feedback</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length ? (
                applications.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <strong>{x.name}</strong>
                      <div className="micro muted">{x.vacancy}</div>
                    </td>
                    <td>
                      <StatusBadge value={x.stage} />
                    </td>
                    <td>{x.interview_slot ? ago(x.interview_slot) : 'Not yet booked'}</td>
                    <td>
                      {x.interview_feedback ? x.interview_feedback : '--'}
                      {x.interview_score !== null && x.interview_score !== undefined && (
                        <div className="micro">Score {x.interview_score}/5</div>
                      )}
                    </td>
                    <td className="actions">
                      <div className="inline-actions">
                        {renderNextStageButtons(x)}
                        <button
                          className="btn ghost small"
                          onClick={() => {
                            setMsgApp(x);
                            setMsgSubject(`Update regarding your application for ${x.vacancy}`);
                            setMsgBody(`Dear ${x.name},\n\nThank you for your application to Sheffield City Council. We are pleased to provide you with an update.`);
                          }}
                          type="button"
                        >
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState message="No applicants yet. Click 'Preview career portal' to submit a candidate application." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="note" style={{ marginTop: 17 }}>
        Candidate interview selection/rescheduling, mandatory cover letters, application status and detailed selection
        feedback have been included in response to the separate opportunity feedback. Delivery of invitation email to
        Outlook is represented by a mock integration queue.
      </div>

      {/* Create Vacancy Modal */}
      <Modal
        isOpen={isCreateVacOpen}
        onClose={() => setIsCreateVacOpen(false)}
        title="Create a vacancy"
        intro="Short, single-page journey. A recruiter can publish the draft when ready."
      >
        <form onSubmit={handleCreateVacancy} className="form-stack">
          <div className="field-grid">
            <label>
              Job title
              <input
                value={vacTitle}
                onChange={(e) => setVacTitle(e.target.value)}
                placeholder="e.g. Housing Services Adviser"
                required
              />
            </label>

            <label>
              Service / department
              <input
                value={vacDept}
                onChange={(e) => setVacDept(e.target.value)}
                placeholder="e.g. Adult Social Care"
                required
              />
            </label>

            <label>
              Grade
              <input
                value={vacGrade}
                onChange={(e) => setVacGrade(e.target.value)}
                placeholder="G6"
              />
            </label>

            <label>
              Salary display
              <input
                value={vacSalary}
                onChange={(e) => setVacSalary(e.target.value)}
                placeholder="GBP 30,000 - 34,000"
              />
            </label>

            <label>
              Location
              <input
                value={vacLoc}
                onChange={(e) => setVacLoc(e.target.value)}
                placeholder="Sheffield / hybrid"
              />
            </label>

            <label>
              Closing date
              <input
                type="date"
                value={vacClosing}
                onChange={(e) => setVacClosing(e.target.value)}
                required
              />
            </label>

            <label className="wide">
              Job summary
              <textarea
                value={vacSummary}
                onChange={(e) => setVacSummary(e.target.value)}
                placeholder="Describe the role and its public-service purpose"
                maxLength={1200}
                required
              />
            </label>

            <label className="check-row wide">
              <input
                type="checkbox"
                checked={vacCoverReq}
                onChange={(e) => setVacCoverReq(e.target.checked)}
              />
              Require a cover letter from applicants
            </label>
          </div>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsCreateVacOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Create draft vacancy
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Vacancy Modal */}
      {editVac && (
        <Modal
          isOpen={true}
          onClose={() => setEditVac(null)}
          title="Edit published vacancy"
          intro="Edits are permitted and versioned, including after posting."
        >
          <form onSubmit={handleSaveEditVacancy} className="form-stack">
            <div className="field-grid">
              <label>
                Job title
                <input
                  value={editVac.title}
                  onChange={(e) => setEditVac({ ...editVac, title: e.target.value })}
                  required
                />
              </label>

              <label>
                Grade
                <input
                  value={editVac.grade}
                  onChange={(e) => setEditVac({ ...editVac, grade: e.target.value })}
                />
              </label>

              <label>
                Salary band
                <input
                  value={editVac.salary}
                  onChange={(e) => setEditVac({ ...editVac, salary: e.target.value })}
                />
              </label>

              <label>
                Closing date
                <input
                  type="date"
                  value={editVac.closing}
                  onChange={(e) => setEditVac({ ...editVac, closing: e.target.value })}
                  required
                />
              </label>

              <label className="wide">
                Role summary
                <textarea
                  value={editVac.summary}
                  onChange={(e) => setEditVac({ ...editVac, summary: e.target.value })}
                  maxLength={1200}
                />
              </label>

              <label className="check-row wide">
                <input
                  type="checkbox"
                  checked={editVac.cover_required}
                  onChange={(e) => setEditVac({ ...editVac, cover_required: e.target.checked })}
                />
                Cover letter is mandatory
              </label>
            </div>

            <div className="form-actions">
              <button className="btn ghost" type="button" onClick={() => setEditVac(null)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Save revision
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Interview Outcome Modal */}
      {interviewApp && (
        <Modal
          isOpen={true}
          onClose={() => setInterviewApp(null)}
          title="Record interview outcome"
          intro="Score and substantive written feedback are mandatory for fair, auditable decisions."
        >
          <form onSubmit={handleSaveInterviewOutcome} className="form-stack">
            <label>
              Interview score 0 to 5
              <input
                type="number"
                min="0"
                max="5"
                step="1"
                value={interviewScore}
                onChange={(e) => setInterviewScore(Number(e.target.value))}
                required
              />
            </label>

            <label>
              Detailed panel feedback
              <textarea
                value={interviewFeedback}
                onChange={(e) => setInterviewFeedback(e.target.value)}
                maxLength={900}
                placeholder="Describe evidence against selection criteria"
                required
              />
            </label>

            <div className="form-actions">
              <button className="btn ghost" type="button" onClick={() => setInterviewApp(null)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Save interview outcome
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Candidate Correspondence Modal */}
      {msgApp && (
        <Modal
          isOpen={true}
          onClose={() => setMsgApp(null)}
          title="Candidate correspondence"
          intro="Delivered to the private candidate tracker inbox within this demo. It does not send a real email."
        >
          <form onSubmit={handleSendMessage} className="form-stack">
            <label>
              Subject
              <input
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                maxLength={255}
                required
              />
            </label>

            <label>
              Message
              <textarea
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                maxLength={4000}
                rows={5}
                required
              />
            </label>

            <div className="form-actions">
              <button className="btn ghost" type="button" onClick={() => setMsgApp(null)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Send to candidate portal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
