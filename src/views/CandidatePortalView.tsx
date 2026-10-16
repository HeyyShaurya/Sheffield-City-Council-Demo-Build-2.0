import React, { useState } from 'react';
import { User, Vacancy } from '../types';
import { store, ago, isodays } from '../store/sheffieldStore';
import { PageHead, StatusBadge } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface CandidatePortalViewProps {
  user: User | null;
  onExitPublic: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

const STAGES = [
  'Applied',
  'Shortlisted',
  'Interview Scheduled',
  'Interview Completed',
  'Offered',
  'Offer Accepted',
  'Checks Complete',
  'Onboarded',
];

export const CandidatePortalView: React.FC<CandidatePortalViewProps> = ({ user, onExitPublic, onToast }) => {
  const publishedVacancies = store.getVacancies(null).filter((v) => v.status === 'Published');
  const candidateToken = store.candidateToken;
  const currentApp = candidateToken ? store.getCandidateByToken(candidateToken) : null;
  const candidateMessages = candidateToken ? store.getCandidateMessages(candidateToken) : [];

  // Apply modal
  const [applyVac, setApplyVac] = useState<Vacancy | null>(null);
  const [candidateName, setCandidateName] = useState('Maya Evans');
  const [candidateEmail, setCandidateEmail] = useState('maya.demo@example.com');
  const [candidateStatement, setCandidateStatement] = useState(
    'Experienced community support specialist committed to person-centred care, safeguarding best practices, and neighbourhood collaboration.'
  );
  const [candidateCover, setCandidateCover] = useState(
    'I am writing to express my strong enthusiasm for joining Sheffield City Council. My background in local frontline casework aligns directly with the Council’s objectives.'
  );
  const [candidateSource, setCandidateSource] = useState('Council careers');

  // Interview Schedule modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [interviewSlot, setInterviewSlot] = useState(`${isodays(7)}T11:00`);
  const [interviewType, setInterviewType] = useState<'Video' | 'In-person'>('Video');

  // Accept Offer modal
  const [isAcceptOfferOpen, setIsAcceptOfferOpen] = useState(false);
  const [offerSignature, setOfferSignature] = useState(currentApp?.name || 'Maya Evans');

  // Lookup token form
  const [lookupInput, setLookupInput] = useState(candidateToken);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyVac) return;
    try {
      const app = store.applyCandidate(applyVac.id, {
        name: candidateName,
        email: candidateEmail,
        statement: candidateStatement,
        cover_letter: candidateCover,
        source: candidateSource,
      });
      onToast(`Application received: #${app.id}`);
      setApplyVac(null);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateToken) return;
    try {
      store.candidateScheduleInterview(candidateToken, interviewSlot, interviewType);
      onToast('Interview preference saved; calendar event queued');
      setIsScheduleOpen(false);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleAcceptOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateToken) return;
    try {
      store.candidateAcceptOffer(candidateToken, offerSignature);
      onToast('Offer accepted! People Services notified for pre-employment checks.');
      setIsAcceptOfferOpen(false);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleDeclineOffer = () => {
    if (!window.confirm('Are you sure you wish to decline this appointment offer?')) return;
    try {
      store.candidateDeclineOffer(candidateToken, 'Candidate declined offer via portal');
      onToast('Offer declined');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleWithdraw = () => {
    if (!window.confirm('Withdraw this application? This cannot be undone.')) return;
    try {
      store.candidateWithdraw(candidateToken);
      onToast('Application withdrawn');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const token = lookupInput.trim();
    if (!token) return;
    const found = store.getCandidateByToken(token);
    if (!found) {
      onToast('Application access code not found', true);
    } else {
      store.setCandidateToken(token);
      onToast(`Application found: ${found.stage}`);
    }
  };

  const handleClearCandidate = () => {
    store.setCandidateToken('');
    setLookupInput('');
    onToast('Candidate session cleared');
  };

  const currentStageIndex = currentApp ? STAGES.indexOf(currentApp.stage) : -1;

  return (
    <div>
      <PageHead
        title="Your next role starts here."
        kicker="SHEFFIELD / PUBLIC CANDIDATE EXPERIENCE"
        desc="Clear applications, transparent progress and self-selected interviews in a mobile-friendly experience."
        actions={
          <button className="btn ghost" onClick={onExitPublic} type="button">
            {user ? 'Return to workspace' : 'Staff sign in'}
          </button>
        }
      />

      <div className="hero-strip">
        <div>
          <h2>Make a difference across Sheffield.</h2>
          <p>Explore service opportunities and follow each step from application to offer.</p>
        </div>
        <span style={{ fontSize: 34, opacity: 0.7 }}>☆</span>
      </div>

      {/* Tracker Card if Candidate Token Found */}
      {currentApp && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="row space">
              <div>
                <div className="eyebrow">YOUR APPLICATION TRACKER</div>
                <h3>{currentApp.vacancy}</h3>
                <p className="small muted">
                  Applicant: <strong>{currentApp.name}</strong> ({currentApp.email})
                </p>
              </div>
              <StatusBadge value={currentApp.stage} />
            </div>

            <div className="steps" style={{ marginTop: 18 }}>
              {STAGES.map((s, idx) => (
                <span
                  key={s}
                  className={`step-pill ${currentStageIndex >= idx ? 'done' : ''}`}
                >
                  {s}
                </span>
              ))}
            </div>

            {['Shortlisted', 'Interview Scheduled'].includes(currentApp.stage) && (
              <div className="row wrap" style={{ marginTop: 16 }}>
                <button
                  className="btn primary small"
                  onClick={() => setIsScheduleOpen(true)}
                  type="button"
                >
                  {currentApp.interview_slot ? 'Reschedule interview' : 'Choose interview slot'}
                </button>
                <span className="small muted">
                  {currentApp.interview_slot
                    ? `${ago(currentApp.interview_slot)} / ${currentApp.interview_type}`
                    : 'Choose a future time for interview'}
                </span>
              </div>
            )}

            {currentApp.stage === 'Offered' && (
              <div
                style={{
                  marginTop: 18,
                  padding: 16,
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 800, fontSize: 14 }}>
                  <span>🎉</span> Formal Appointment Offer Received
                </div>
                <p style={{ margin: '8px 0 12px', fontSize: 13, color: '#14532D', lineHeight: 1.5 }}>
                  Sheffield City Council has issued you a conditional appointment offer for <strong>{currentApp.vacancy}</strong>.
                  {currentApp.offer_details && (
                    <span style={{ display: 'block', marginTop: 4 }}>
                      Grade: <strong>{currentApp.offer_details.grade}</strong> • Remuneration: <strong>{currentApp.offer_details.salary}</strong> • Target Start: <strong>{currentApp.offer_details.start_date}</strong>
                    </span>
                  )}
                </p>
                <div className="row wrap" style={{ gap: 10 }}>
                  <button
                    className="btn primary small"
                    onClick={() => {
                      setOfferSignature(currentApp.name);
                      setIsAcceptOfferOpen(true);
                    }}
                    type="button"
                    style={{ background: '#166534' }}
                  >
                    ✓ Review &amp; Accept Offer
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={handleDeclineOffer}
                    type="button"
                  >
                    Decline Offer
                  </button>
                </div>
              </div>
            )}

            {currentApp.stage === 'Offer Accepted' && (
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#1E40AF',
                }}
              >
                <strong>Offer Accepted by Candidate ({currentApp.offer_signature || currentApp.name})</strong>
                <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                  Your signed electronic acceptance has been received by People Services. Pre-employment checks (Right to Work, referencing, criminal record checks) are underway.
                </p>
              </div>
            )}

            {currentApp.stage === 'Checks Complete' && (
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  background: '#F5F3FF',
                  border: '1px solid #DDD6FE',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#5B21B6',
                }}
              >
                <strong>Pre-Employment Checks Verified</strong>
                <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                  All statutory identity and referencing checks are satisfied. Your manager is provisioning your IT access, line equipment, and workplace induction checklist.
                </p>
              </div>
            )}

            {currentApp.stage === 'Onboarded' && (
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#065F46',
                }}
              >
                <strong>🎉 Welcome to Sheffield City Council!</strong>
                <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                  Your official worker profile is now live in the Council directory (Staff ID #{currentApp.worker_id}). You can sign in using your staff credentials to access employee self-service.
                </p>
              </div>
            )}

            <div className="row wrap" style={{ marginTop: 16 }}>
              {!['Onboarded', 'Rejected', 'Withdrawn'].includes(currentApp.stage) && (
                <button
                  className="btn small danger"
                  onClick={handleWithdraw}
                  type="button"
                >
                  Withdraw application
                </button>
              )}
              <button
                className="btn small ghost"
                onClick={handleClearCandidate}
                type="button"
              >
                Track a different application
              </button>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Updates &amp; correspondence</h3>
            <p className="small muted">
              Candidate-only portal inbox; any message from a recruiter appears below without claiming external email delivery.
            </p>

            {candidateMessages.length ? (
              candidateMessages.map((m) => (
                <div
                  key={m.id}
                  style={{ padding: '12px 0', borderBottom: '1px solid #e5edf4' }}
                >
                  <div className="row space">
                    <strong>{m.title}</strong>
                    <span className="micro muted">{ago(m.created)}</span>
                  </div>
                  <p>{m.body}</p>
                </div>
              ))
            ) : (
              <p className="small muted" style={{ marginTop: 12 }}>
                No correspondence yet.
              </p>
            )}
          </div>
        </>
      )}

      {/* Vacancies List */}
      <div className="section-top">
        <h2>Open opportunities</h2>
        <span>Published roles only</span>
      </div>

      <div className="grid two">
        {publishedVacancies.length ? (
          publishedVacancies.map((v) => (
            <div key={v.id} className="card">
              <div className="row space">
                <div className="eyebrow">{v.department}</div>
                <StatusBadge value={v.status} />
              </div>
              <h2>{v.title}</h2>
              <p className="small muted">
                {v.location} &nbsp; / &nbsp; {v.grade} &nbsp; / &nbsp; {v.salary}
              </p>
              <p style={{ minHeight: 50 }}>{v.summary}</p>
              <div className="row space" style={{ marginTop: 19 }}>
                <span className="small muted">Closes {v.closing}</span>
                <button
                  className="btn primary small"
                  onClick={() => setApplyVac(v)}
                  type="button"
                >
                  Apply for role &rarr;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card">There are no published vacancies at this time.</div>
        )}
      </div>

      {/* Candidate Code Lookup Form */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Already applied?</h3>
        <p className="card-sub">Enter the secure application tracking token you received after submitting.</p>
        <form onSubmit={handleLookup} className="input-row">
          <label>
            Application access code
            <input
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              placeholder="Paste your application token"
              required
            />
          </label>
          <button className="btn light" type="submit">
            View progress
          </button>
        </form>
      </div>

      {/* Apply Modal */}
      {applyVac && (
        <Modal
          isOpen={true}
          onClose={() => setApplyVac(null)}
          title={`Apply - ${applyVac.title}`}
          intro="Submit an application, then save the token to track progress and schedule interviews."
        >
          <form onSubmit={handleApplySubmit} className="form-stack">
            <div className="field-grid">
              <label>
                Full name
                <input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Maya Evans"
                  required
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="maya@example.com"
                  required
                />
              </label>

              <label className="wide">
                Personal statement
                <textarea
                  value={candidateStatement}
                  onChange={(e) => setCandidateStatement(e.target.value)}
                  maxLength={2000}
                  placeholder="How do your skills match this role?"
                  required
                />
              </label>

              <label className="wide">
                Cover letter {applyVac.cover_required ? '(required)' : '(optional)'}
                <textarea
                  value={candidateCover}
                  onChange={(e) => setCandidateCover(e.target.value)}
                  maxLength={2000}
                  placeholder="Introduce yourself to the selection panel"
                  required={applyVac.cover_required}
                />
              </label>

              <label className="wide">
                Application source
                <select
                  value={candidateSource}
                  onChange={(e) => setCandidateSource(e.target.value)}
                >
                  <option value="Council careers">Council careers</option>
                  <option value="External job board">External job board</option>
                  <option value="Referral">Referral</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button className="btn ghost" type="button" onClick={() => setApplyVac(null)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Submit application
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Interview Slot Modal */}
      <Modal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        title="Choose your interview slot"
        intro="You can return and reschedule while the application is in the interview stage."
      >
        <form onSubmit={handleScheduleSubmit} className="form-stack">
          <label>
            Interview time
            <input
              type="datetime-local"
              value={interviewSlot}
              onChange={(e) => setInterviewSlot(e.target.value)}
              required
            />
          </label>

          <label>
            Interview format
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as 'Video' | 'In-person')}
            >
              <option value="Video">Video</option>
              <option value="In-person">In-person</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Confirm interview
            </button>
          </div>
        </form>
      </Modal>

      {/* Accept Offer Modal */}
      {currentApp && (
        <Modal
          isOpen={isAcceptOfferOpen}
          onClose={() => setIsAcceptOfferOpen(false)}
          title="Accept Appointment Offer"
          intro={`Position: ${currentApp.vacancy} • Sheffield City Council`}
        >
          <form onSubmit={handleAcceptOfferSubmit} className="form-stack">
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <h4 style={{ margin: '0 0 6px', color: '#166534' }}>Appointment Terms &amp; Confirmation</h4>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#334155' }}>
                By electronically signing below, you formally accept the conditional offer of employment for the role of{' '}
                <strong>{currentApp.vacancy}</strong>. You confirm your intention to take up appointment subject to satisfactory
                completion of pre-employment right-to-work, medical declaration, and referencing checks.
              </p>
            </div>

            <label>
              Electronic Signature (Full Legal Name)
              <input
                type="text"
                value={offerSignature}
                onChange={(e) => setOfferSignature(e.target.value)}
                placeholder="Enter your full legal name"
                required
              />
            </label>

            <div className="note" style={{ fontSize: 11 }}>
              Your electronic acceptance timestamp and IP audit trail will be transmitted to People Services and recorded in the council audit register.
            </div>

            <div className="form-actions">
              <button className="btn ghost" type="button" onClick={() => setIsAcceptOfferOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary" style={{ background: '#166534' }}>
                ✓ Confirm &amp; Sign Acceptance
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
