import React, { useState } from 'react';
import { User, Integration, IntegrationEvent, AuditEvent } from '../../types';
import { store, ago } from '../../store/sheffieldStore';
import { PageHead, StatusBadge } from '../../components/CommonUI';
import { Modal } from '../../components/Modal';

interface AdminDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const integrations: Integration[] = state.integrations;
  const events: IntegrationEvent[] = state.integration_events;
  const auditLogs: AuditEvent[] = state.audit;

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetPhrase, setResetPhrase] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const handleTestEvent = (it: Integration) => {
    store.stageEvent(it.name, 'health-probe', it.id, { ping: 'ok', timestamp: new Date().toISOString() }, user.id);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      store.resetDemo(resetPhrase, user);
      setResetStatus('Demonstration dataset restored to clean baseline.');
      setIsResetOpen(false);
      setResetPhrase('');
      setTimeout(() => setResetStatus(null), 5000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHead
        kicker="SYSTEM ADMINISTRATION &amp; INTEGRATION CONSOLE"
        title={`Administrator Workspace &bull; ${user.name}`}
        desc="Monitor enterprise ERP adapter health, inspect real-time transaction event streams, simulate fault handling, and review immutable audit compliance."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn primary"
              onClick={() => onNavigate('integrations')}
              type="button"
            >
              Integration Control Center
            </button>
            <button
              className="btn subtle"
              onClick={() => onNavigate('audit')}
              type="button"
            >
              Immutable Audit Evidence
            </button>
          </div>
        }
      />

      {/* Admin Metrics */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #005A36' }}>
          <div className="kicker">MOCK ERP ADAPTERS</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            {integrations.length} <span style={{ fontSize: 16, color: '#64748B' }}>active</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Oracle, HMRC, Active Directory, LMS
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2D77C7' }}>
          <div className="kicker">EVENT STREAM QUEUED</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            {events.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Total simulated integration transactions
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kicker">FAILED / DEAD-LETTER QUEUE</div>
          <div className="metric-huge mono" style={{ color: '#D97706' }}>
            {events.filter((e) => e.status === 'Failed').length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Retryable staging buffer
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #102C50' }}>
          <div className="kicker">IMMUTABLE AUDIT LOGS</div>
          <div className="metric-huge mono" style={{ color: '#102C50' }}>
            {auditLogs.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Continuous compliance records
          </div>
        </div>
      </div>

      {/* Main Grid: Adapter Health & Audit Feed */}
      <div className="grid two" style={{ gap: 24, marginBottom: 24 }}>
        {/* Integrations Health */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Enterprise Mock Adapters</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('integrations')}
              type="button"
            >
              Configure &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {integrations.map((it) => (
              <div
                key={it.id}
                style={{
                  padding: 12,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: '#172C46' }}>{it.name}</strong>
                  <div className="micro muted" style={{ marginTop: 2 }}>
                    Method: {it.method} &bull; {it.description}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StatusBadge value={it.status} />
                  <button
                    className="btn small subtle"
                    onClick={() => handleTestEvent(it)}
                    type="button"
                  >
                    Ping
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Audit Trail Stream */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Recent Audit Activity Stream</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('audit')}
              type="button"
            >
              Full Audit Trail &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '10px 12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#172C46' }}>{log.action}</strong>
                  <span className="micro muted">{ago(log.created)}</span>
                </div>
                <div className="micro muted" style={{ marginTop: 2 }}>
                  By: {log.actor} &bull; Target: {log.entity} #{log.entity_id} {log.detail ? `\u2022 ${log.detail}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin-Only Demonstration Reset Control (Requirement 7) */}
      <div className="card" style={{ marginTop: 24, border: '1px solid #FCA5A5', background: '#FFF5F5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ color: '#991B1B' }}>ADMINISTRATIVE GOVERNANCE</div>
            <h3 style={{ margin: '4px 0', color: '#991B1B' }}>System &amp; Demonstration Sandbox Reset</h3>
            <p className="small muted" style={{ margin: 0, color: '#7F1D1D' }}>
              Restores all 16 initial persona records, reset leave balances, clears candidate submissions, and re-initializes standard demonstration state. Restricted strictly to System Administrator.
            </p>
          </div>
          <div>
            <button
              className="btn small danger"
              onClick={() => setIsResetOpen(true)}
              type="button"
              style={{ fontWeight: 700 }}
            >
              Reset Demonstration Dataset
            </button>
          </div>
        </div>
        {resetStatus && (
          <div className="note" style={{ marginTop: 12, background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' }}>
            ✓ {resetStatus}
          </div>
        )}
      </div>

      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title="Admin Reset Demonstration Dataset"
        intro="Permanently reset in-memory state and clear all mock transactions back to default."
      >
        <form onSubmit={handleConfirmReset} className="form-stack">
          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
            To verify authorized administrator action, type <strong>RESET DEMO</strong> in the confirmation box below:
          </p>
          <label>
            Confirmation Phrase
            <input
              type="text"
              value={resetPhrase}
              onChange={(e) => setResetPhrase(e.target.value)}
              placeholder="RESET DEMO"
              required
              autoFocus
            />
          </label>
          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsResetOpen(false)}>
              Cancel
            </button>
            <button className="btn danger" type="submit" disabled={resetPhrase !== 'RESET DEMO'}>
              Confirm Reset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
