import React, { useState } from 'react';
import { User } from '../types';
import { store, fmt, ago } from '../store/sheffieldStore';
import { PageHead } from '../components/CommonUI';

import { EmployeeDashboard } from './dashboards/EmployeeDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { RecruiterDashboard } from './dashboards/RecruiterDashboard';
import { HrDashboard } from './dashboards/HrDashboard';
import { PayrollDashboard } from './dashboards/PayrollDashboard';
import { DirectorDashboard } from './dashboards/DirectorDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

interface OverviewViewProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ user, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'role' | 'cross-council'>('role');

  // If in role mode, render the tailored dashboard for the current persona
  if (viewMode === 'role') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -12 }}>
          <button
            type="button"
            className="btn small subtle"
            onClick={() => setViewMode('cross-council')}
            style={{ fontSize: 11, fontWeight: 700 }}
          >
            Switch to Cross-Council Executive Map &rarr;
          </button>
        </div>

        {(() => {
          switch (user.role) {
            case 'employee':
              return <EmployeeDashboard user={user} onNavigate={onNavigate} />;
            case 'manager':
              return <ManagerDashboard user={user} onNavigate={onNavigate} />;
            case 'recruiter':
              return <RecruiterDashboard user={user} onNavigate={onNavigate} />;
            case 'hr':
              return <HrDashboard user={user} onNavigate={onNavigate} />;
            case 'payroll':
              return <PayrollDashboard user={user} onNavigate={onNavigate} />;
            case 'service':
              return <DirectorDashboard user={user} onNavigate={onNavigate} />;
            case 'admin':
              return <AdminDashboard user={user} onNavigate={onNavigate} />;
            default:
              return <EmployeeDashboard user={user} onNavigate={onNavigate} />;
          }
        })()}
      </div>
    );
  }

  // Cross-council master view
  const stats = store.getDashboardStats(user);
  const firstName = user.name.split(' ')[0];

  const cards = [
    { label: 'People records', num: fmt(stats.headcount), foot: 'Synthetic sample, not entire workforce' },
    { label: 'Approvals pending', num: fmt(stats.pending_leave), foot: 'Updated from leave transactions' },
    { label: 'Assigned tasks', num: fmt(stats.open_tasks), foot: 'Actionable workflow assignments' },
    { label: 'Applications', num: fmt(stats.applications), foot: 'Applicant pipeline records' },
  ];

  const ways = [
    { page: 'leave', icon: '◔', title: 'Book and approve leave', desc: 'Employee to manager approval, audit and balance' },
    { page: 'org', icon: '☵', title: 'Explore organisation', desc: 'Manager spans, position attributes and FTE' },
    { page: 'recruit', icon: '▷', title: 'Recruit a new colleague', desc: 'Vacancy, candidate, interview, offer and onboarding' },
    { page: 'documents', icon: '▨', title: 'Manage employee records', desc: 'Upload, retention policy, archive and purge' },
    { page: 'tasks', icon: '☑', title: 'Complete an HR journey', desc: 'Task ownership, exceptions and audit trail' },
    { page: 'reports', icon: '◕', title: 'Explore workforce insights', desc: 'Filters, role-aware metrics and CSV export' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          type="button"
          className="btn small primary"
          onClick={() => setViewMode('role')}
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          &larr; Return to {user.name}&apos;s Role Dashboard
        </button>
      </div>

      <PageHead
        title="Cross-Council Modernisation Map"
        kicker="OVERVIEW / MASTER ARCHITECTURE"
        desc={`Welcome, ${firstName}. Every completed action immediately updates your live council records.`}
      />

      <div className="hero-strip">
        <div>
          <div className="caps">SHEFFIELD CITY COUNCIL / PEOPLE PLATFORM</div>
          <h2>From first application to employee success.</h2>
          <p>One unified council experience. Live transactions, transparent decisions and audit records across priority operational journeys.</p>
        </div>
      </div>

      <div className="grid four">
        {cards.map((c, i) => (
          <div key={i} className="card stat">
            <div className="stat-label">{c.label}</div>
            <div className="stat-num mono">{c.num}</div>
            <div className="stat-foot">
              <span className="stat-dot"></span>
              {c.foot}
            </div>
          </div>
        ))}
      </div>

      <div className="section-top" style={{ marginTop: 29 }}>
        <h2>Explore operational journeys</h2>
        <span>Council priority workforce workflows</span>
      </div>

      <div className="path-grid">
        {ways.map((w) => (
          <button
            key={w.page}
            className="path-card"
            onClick={() => onNavigate(w.page)}
            type="button"
          >
            <span className="path-icon">{w.icon}</span>
            <strong>{w.title}</strong>
            <span>{w.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid two" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-top">
            <h2>Recent activity</h2>
            <span>Audited actions</span>
          </div>
          <div className="timeline">
            {stats.activity.length ? (
              stats.activity.map((a) => (
                <div key={a.id} className="timeline-item">
                  <div className="timeline-bullet"></div>
                  <div>
                    <strong>
                      {a.actor} {a.action.replace(/-/g, ' ')}
                    </strong>
                    <div className="small muted">
                      {a.entity} #{a.entity_id}
                      {a.detail ? ` / ${a.detail}` : ''}
                    </div>
                    <small>{ago(a.created)}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="small muted">No activity recorded yet</div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Solution evidence snapshot</h2>
          <p className="card-sub">Proposal mapping from the submitted PME response</p>
          <div className="grid two">
            <div className="metric-teaser">
              <strong style={{ fontSize: 29 }}>47</strong>
              <div className="small muted">Process requirements</div>
            </div>
            <div className="metric-teaser">
              <strong style={{ fontSize: 29 }}>43 / 4</strong>
              <div className="small muted">Base / additional cost</div>
            </div>
            <div className="metric-teaser">
              <strong style={{ fontSize: 29 }}>6</strong>
              <div className="small muted">Priority scenarios</div>
            </div>
            <div className="metric-teaser">
              <strong style={{ fontSize: 29 }}>8,000</strong>
              <div className="small muted">Pricing population baseline</div>
            </div>
          </div>
          <div className="note attention" style={{ marginTop: 16 }}>
            <span className="warning-dot"></span>
            {stats.note}
          </div>
        </div>
      </div>
    </div>
  );
};
