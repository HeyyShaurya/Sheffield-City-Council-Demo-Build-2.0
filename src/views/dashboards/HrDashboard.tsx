import React from 'react';
import { User, Task, HRCase, DocumentRecord } from '../../types';
import { store } from '../../store/sheffieldStore';
import { PageHead, StatusBadge } from '../../components/CommonUI';

interface HrDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const HrDashboard: React.FC<HrDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const allTasks: Task[] = state.tasks;
  const pendingTasks = allTasks.filter((t) => t.status === 'Open');
  const hrCases: HRCase[] = state.hr_cases;
  const openCases = hrCases.filter((c) => c.status === 'Open');
  const docRecords: DocumentRecord[] = state.documents;
  const archivedDocs = docRecords.filter((d) => d.archived && !d.deleted);

  return (
    <div className="view-container">
      <PageHead
        kicker="WORKFORCE OPERATIONS &amp; GOVERNANCE HUB"
        title={`People Services Console &bull; ${user.name}`}
        desc="Monitor council-wide starter onboarding, employee relations casework, GDPR document retention cycles, and statutory compliance checks."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn primary"
              onClick={() => onNavigate('tasks')}
              type="button"
            >
              + Onboarding Checklists
            </button>
            <button
              className="btn subtle"
              onClick={() => onNavigate('documents')}
              type="button"
            >
              Retention Governance
            </button>
          </div>
        }
      />

      {/* HR Operations Metrics */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #005A36' }}>
          <div className="kicker">PENDING HR TASKS</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            {pendingTasks.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Onboarding &amp; RTW compliance
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kicker">OPEN CASEWORK</div>
          <div className="metric-huge mono" style={{ color: '#D97706' }}>
            {openCases.length} <span style={{ fontSize: 16, color: '#64748B' }}>cases</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Confidential employee relations
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2D77C7' }}>
          <div className="kicker">ARCHIVED DOCUMENTS</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            {archivedDocs.length} <span style={{ fontSize: 16, color: '#64748B' }}>files</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Under GDPR retention schedule
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #102C50' }}>
          <div className="kicker">ESTABLISHMENT TOTAL</div>
          <div className="metric-huge mono" style={{ color: '#102C50' }}>
            {state.users.length} <span style={{ fontSize: 16, color: '#64748B' }}>staff</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Across all council Directorates
          </div>
        </div>
      </div>

      {/* Onboarding Queue & Confidential Casework */}
      <div className="grid two" style={{ gap: 24, marginBottom: 24 }}>
        {/* Onboarding Checklist Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Starter Onboarding &amp; Task SLA</h3>
              <p className="small muted" style={{ margin: '2px 0 0' }}>
                Pre-employment and first-month milestone verifications
              </p>
            </div>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('tasks')}
              type="button"
            >
              All Tasks &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allTasks.slice(0, 5).map((t) => (
              <div
                key={t.id}
                style={{
                  padding: 12,
                  background: t.status === 'Open' ? '#FFFBEB' : '#F8FAFC',
                  border: t.status === 'Open' ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: '#172C46' }}>{t.title}</strong>
                  <div className="small muted" style={{ marginTop: 2 }}>
                    Assigned: <strong>{t.owner || `User #${t.assigned_to}`}</strong> &bull; Due: {t.due}
                  </div>
                </div>
                <StatusBadge value={t.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Confidential Casework Queue */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>HR Casework &amp; Employee Relations</h3>
              <p className="small muted" style={{ margin: '2px 0 0' }}>
                Grievances, disciplinaries, and flexible working requests
              </p>
            </div>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('optional')}
              type="button"
            >
              Manage Cases &rarr;
            </button>
          </div>

          {hrCases.length === 0 ? (
            <p className="muted" style={{ padding: 12 }}>No open HR cases.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hrCases.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: 12,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#172C46' }}>{c.title}</strong>
                    <StatusBadge value={c.status} />
                  </div>
                  <div className="small muted" style={{ marginTop: 4 }}>
                    Employee: <strong>{c.employee}</strong> &bull; Category: {c.category}
                  </div>
                  <div className="micro muted" style={{ marginTop: 4 }}>
                    {c.details}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
