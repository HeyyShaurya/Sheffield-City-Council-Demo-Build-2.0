import React, { useState } from 'react';
import { User } from '../types';
import { store } from '../store/sheffieldStore';
import { PageHead } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface GuideViewProps {
  user: User;
  onNavigate: (page: string) => void;
  onToast: (msg: string, isError?: boolean) => void;
}

const SCRIPT = [
  { time: '00:00 - 03:00', title: 'Platform orientation', desc: 'Explain role-based workspaces, source of truth, 8,000-person baseline versus synthetic sample records.', page: 'overview' },
  { time: '03:00 - 09:00', title: 'Use case 1: annual leave', desc: 'Aisha submits annual leave, Helen approves; return as Aisha and show updated remaining balance and audit.', page: 'leave' },
  { time: '09:00 - 15:00', title: 'Use case 2: organisation structure', desc: 'Explore post, grade, FTE, cost centre, hierarchy and manager/team roll-up.', page: 'org' },
  { time: '15:00 - 25:00', title: 'Use case 3: applicant to employee', desc: 'Create/publish vacancy, apply as public candidate, shortlist, self-select/reschedule video slot, score interview, offer and onboard.', page: 'recruit' },
  { time: '25:00 - 32:00', title: 'Use case 4: document lifecycle', desc: 'Upload a sample record, inspect employee visibility, archive it and discuss retention-based purge.', page: 'documents' },
  { time: '32:00 - 39:00', title: 'Use case 5: HR process', desc: 'Create HR check, complete as assignee, review hand-off and audit. Demonstrate optional cases distinctly.', page: 'tasks' },
  { time: '39:00 - 46:00', title: 'Use case 6: management information', desc: 'Change report grouping, filter by service, drill into metrics and export CSV.', page: 'reports' },
  { time: '46:00 - 50:00', title: 'Architecture and closing', desc: 'Discuss learning, illustrative payroll, controlled integration failure/retry, Entra/UK payroll boundaries and Q&A.', page: 'integrations' },
];

export const GuideView: React.FC<GuideViewProps> = ({ user, onNavigate, onToast }) => {
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState('');

  const handleOpenReset = () => {
    if (user.role !== 'admin') {
      onToast('Sign in as Sofia Bennett (System administrator) to reset the demo.', true);
      return;
    }
    setConfirmPhrase('');
    setIsResetOpen(true);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      store.resetDemo(confirmPhrase, user);
      onToast('Initial demonstration records restored');
      setIsResetOpen(false);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Presenter run-of-show"
        kicker="SHEFFIELD / 45-50 MINUTE LIVE DEMO"
        desc="The script below is also provided as a standalone presenter guide inside the repository."
        actions={
          <button className="btn primary" onClick={handleOpenReset} type="button">
            Reset sample for a clean take
          </button>
        }
      />

      <div className="hero-strip">
        <div>
          <h2>Six connected stories. One employee record.</h2>
          <p>Always narrate what just changed in the shared system, and show the next persona receiving the hand-off.</p>
        </div>
        <button className="btn" onClick={() => onNavigate('overview')} type="button">
          Back to workspace
        </button>
      </div>

      <div className="story-timeline">
        {['Leave', 'Structure', 'Recruit', 'Records', 'HR process', 'Insights'].map((x, i) => (
          <div key={x} className="story-part">
            <strong>{i + 1}</strong>
            <small>{x}</small>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Demo sequence and talking points</h2>
        <p className="card-sub">Change persona from the lower-left account control at each hand-off.</p>

        {SCRIPT.map((a, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr auto',
              alignItems: 'start',
              gap: 14,
              borderBottom: '1px solid #edf1f5',
              padding: '19px 0',
            }}
          >
            <div className="badge blue">{a.time}</div>
            <div>
              <h3>
                {i + 1}. {a.title}
              </h3>
              <p className="small muted">{a.desc}</p>
            </div>
            <button
              className="btn ghost small"
              onClick={() => onNavigate(a.page)}
              type="button"
            >
              Open
            </button>
          </div>
        ))}
      </div>

      <div className="note attention" style={{ marginTop: 20 }}>
        For a video, use a fresh dataset (Reset), hide test emails/access tokens, switch personas deliberately and avoid
        portraying a simulated system as the live Oracle Fusion Cloud product.
      </div>

      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title="Restore demonstration records"
        intro="Danger: this permanently clears local demo transactions and uploaded records."
      >
        <form onSubmit={handleConfirmReset} className="form-stack">
          <label>
            Confirmation phrase
            <input
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="RESET DEMO"
              required
            />
          </label>
          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsResetOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Reset all demo data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
