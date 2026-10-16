import React from 'react';
import { User, Vacancy } from '../../types';
import { store, fmt } from '../../store/sheffieldStore';
import { PageHead } from '../../components/CommonUI';

interface DirectorDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const allUsers: User[] = state.users;
  const vacancies: Vacancy[] = state.vacancies;

  const totalHeadcount = allUsers.length;
  const totalFte = allUsers.reduce((acc, u) => acc + (u.fte || 1.0), 0);
  const totalSalarySpend = allUsers.reduce((acc, u) => acc + (u.salary || 35000), 0);
  const openVacancies = vacancies.filter((v) => v.status === 'Published').length;

  return (
    <div className="view-container">
      <PageHead
        kicker="DIRECTORATE INTELLIGENCE &amp; RESOURCE STRATEGY"
        title={`Directorate Command &bull; ${user.name}`}
        desc="Strategic workforce intelligence, establishment staffing expenditure, vacancy gap analysis, and cross-council modernisation performance."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn primary"
              onClick={() => onNavigate('reports')}
              type="button"
            >
              Executive Insights &amp; Analytics
            </button>
            <button
              className="btn subtle"
              onClick={() => onNavigate('org')}
              type="button"
            >
              Establishment Hierarchy
            </button>
          </div>
        }
      />

      {/* Directorate Metrics */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #005A36' }}>
          <div className="kicker">TOTAL DIRECTORATE HEADCOUNT</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            {totalHeadcount} <span style={{ fontSize: 16, color: '#64748B' }}>staff</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {totalFte.toFixed(1)} Full-Time Equivalent (FTE)
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2D77C7' }}>
          <div className="kicker">ANNUALISED PAYROLL SPEND</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            £{fmt(totalSalarySpend)}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Within annual baseline allocation
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kicker">ESTABLISHMENT VACANCY GAP</div>
          <div className="metric-huge mono" style={{ color: '#D97706' }}>
            {openVacancies} <span style={{ fontSize: 16, color: '#64748B' }}>posts</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Active recruitment requisitions
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #102C50' }}>
          <div className="kicker">SICKNESS ABSENCE RATE</div>
          <div className="metric-huge mono" style={{ color: '#102C50' }}>
            2.4%
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Target: &lt; 3.5% &bull; Top quartile benchmark
          </div>
        </div>
      </div>

      {/* Directorate Department Distribution Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0 }}>Workforce Distribution &amp; Cost Centre Allocation</h3>
            <p className="small muted" style={{ margin: '2px 0 0' }}>
              Breakdown across Adult Care, Communities, Modernisation, Finance, and HR
            </p>
          </div>
          <button
            className="btn subtle small"
            onClick={() => onNavigate('reports')}
            type="button"
          >
            Export CSV &rarr;
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Service Directorate Area</th>
                <th>Headcount</th>
                <th>Budgeted FTE</th>
                <th>Avg Salary</th>
                <th>Annualised Staff Spend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Adult Health &amp; Social Care</strong></td>
                <td className="mono">6</td>
                <td className="mono">5.8 FTE</td>
                <td className="mono">£36,200</td>
                <td className="mono">£217,200</td>
                <td><span className="badge good">Fully Staffed</span></td>
              </tr>
              <tr>
                <td><strong>Communities &amp; Housing</strong></td>
                <td className="mono">4</td>
                <td className="mono">3.8 FTE</td>
                <td className="mono">£34,500</td>
                <td className="mono">£138,000</td>
                <td><span className="badge good">Operational</span></td>
              </tr>
              <tr>
                <td><strong>People Services &amp; Talent</strong></td>
                <td className="mono">3</td>
                <td className="mono">3.0 FTE</td>
                <td className="mono">£41,000</td>
                <td className="mono">£123,000</td>
                <td><span className="badge good">Optimal</span></td>
              </tr>
              <tr>
                <td><strong>Finance &amp; Payroll Modernisation</strong></td>
                <td className="mono">3</td>
                <td className="mono">2.6 FTE</td>
                <td className="mono">£48,000</td>
                <td className="mono">£144,000</td>
                <td><span className="badge good">Balanced</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
