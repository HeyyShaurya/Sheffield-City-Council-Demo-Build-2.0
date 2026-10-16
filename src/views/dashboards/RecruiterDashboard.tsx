import React from 'react';
import { User, Vacancy, Application } from '../../types';
import { store } from '../../store/sheffieldStore';
import { PageHead, StatusBadge } from '../../components/CommonUI';

interface RecruiterDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const vacancies: Vacancy[] = state.vacancies;
  const applications: Application[] = state.applications;

  const publishedVacancies = vacancies.filter((v) => v.status === 'Published');
  const draftVacancies = vacancies.filter((v) => v.status === 'Draft');
  const pendingScoring = applications.filter((a) => a.stage === 'Interview Scheduled' || a.stage === 'Shortlisted');
  const offered = applications.filter((a) => a.stage === 'Offered' || a.stage === 'Offer Accepted' || a.stage === 'Onboarded');

  return (
    <div className="view-container">
      <PageHead
        kicker="TALENT ACQUISITION &amp; CANDIDATE PIPELINE"
        title={`Recruitment Console &bull; ${user.name}`}
        desc="Manage council recruitment requisitions, track applicants through video &amp; panel interview stages, and coordinate onboarding handoffs."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn primary"
              onClick={() => onNavigate('recruit')}
              type="button"
            >
              + Create Vacancy
            </button>
            <button
              className="btn subtle"
              onClick={() => onNavigate('documents')}
              type="button"
            >
              Verify RTW Documents
            </button>
          </div>
        }
      />

      {/* Recruiter Metrics */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #005A36' }}>
          <div className="kicker">ACTIVE VACANCIES</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            {publishedVacancies.length} <span style={{ fontSize: 16, color: '#64748B' }}>live</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {draftVacancies.length} requisitions in draft review
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2D77C7' }}>
          <div className="kicker">TOTAL CANDIDATES</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            {applications.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Across all council service areas
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kicker">INTERVIEWS &amp; SCORING</div>
          <div className="metric-huge mono" style={{ color: '#D97706' }}>
            {pendingScoring.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Active interview pipelines
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #102C50' }}>
          <div className="kicker">OFFERS / ONBOARDED</div>
          <div className="metric-huge mono" style={{ color: '#102C50' }}>
            {offered.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Starter profiles provisioned
          </div>
        </div>
      </div>

      {/* Main Grid: Live Vacancies & Candidate Pipeline */}
      <div className="grid two" style={{ gap: 24, marginBottom: 24 }}>
        {/* Active Vacancies */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Active Vacancies</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('recruit')}
              type="button"
            >
              Full Requisition List &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {vacancies.map((v) => (
              <div
                key={v.id}
                style={{
                  padding: 14,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: 14, color: '#172C46' }}>{v.title}</strong>
                  <div className="micro muted" style={{ marginTop: 2 }}>
                    {v.department} &bull; <span style={{ fontWeight: 700, color: '#005A36' }}>{v.grade}</span> &bull; Closing: {v.closing}
                  </div>
                  <div className="small" style={{ color: '#475569', marginTop: 4 }}>
                    Salary: <strong>{v.salary}</strong> &bull; Location: {v.location}
                  </div>
                </div>
                <StatusBadge value={v.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Pipeline Stages */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Candidate Stage Funnel</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('recruit')}
              type="button"
            >
              Manage Pipeline &rarr;
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="small muted" style={{ padding: 16 }}>
              No candidates registered yet. Candidates apply through the public careers portal.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
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
                    <strong style={{ color: '#172C46' }}>{app.name}</strong>
                    <div className="small muted" style={{ marginTop: 2 }}>
                      {app.email} &bull; Applied: {app.created}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusBadge value={app.stage} />
                    <button
                      className="btn small subtle"
                      onClick={() => onNavigate('recruit')}
                      type="button"
                    >
                      Process
                    </button>
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
