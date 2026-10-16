import React from 'react';
import { User, LeaveRequest, TimeEntry } from '../../types';
import { store } from '../../store/sheffieldStore';
import { PageHead } from '../../components/CommonUI';

interface ManagerDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const allUsers = state.users;

  // Direct reports (users whose manager_id === user.id)
  const directReports = allUsers.filter((u) => u.manager_id === user.id);
  const reportIds = directReports.map((r) => r.id);

  // Pending leave requests for team
  const pendingLeaves: LeaveRequest[] = state.leave_requests.filter(
    (l) => l.status === 'Pending' && reportIds.includes(l.employee_id)
  );

  // Pending timesheets for team
  const pendingTimesheets: TimeEntry[] = state.time_entries.filter(
    (t) => t.status === 'Submitted' && reportIds.includes(t.employee_id)
  );

  // Team headcount & total FTE
  const totalFte = directReports.reduce((sum, r) => sum + r.fte, 0);

  const handleApproveLeave = (id: number) => {
    store.decideLeaveRequest(id, 'Approved', user);
  };

  const handleRejectLeave = (id: number) => {
    store.decideLeaveRequest(id, 'Rejected', user);
  };

  const handleApproveTimesheet = (id: number) => {
    store.decideTimesheet(id, 'Approved', user);
  };

  const handleApproveAll = () => {
    pendingLeaves.forEach((l) => store.decideLeaveRequest(l.id, 'Approved', user));
    pendingTimesheets.forEach((t) => store.decideTimesheet(t.id, 'Approved', user));
  };

  const getEmployeeName = (id: number): string => {
    const found = allUsers.find((u) => u.id === id);
    return found ? found.name : `Employee #${id}`;
  };

  return (
    <div className="view-container">
      <PageHead
        kicker="TEAM LEADERSHIP &amp; APPROVALS COMMAND CENTRE"
        title={`Manager Workspace &bull; ${user.name}`}
        desc="Oversee your service team's leave requests, weekly attendance submissions, establishment headcount, and performance journeys."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            {(pendingLeaves.length > 0 || pendingTimesheets.length > 0) && (
              <button
                className="btn primary"
                onClick={handleApproveAll}
                type="button"
              >
                ✓ Approve All Pending ({pendingLeaves.length + pendingTimesheets.length})
              </button>
            )}
            <button
              className="btn subtle"
              onClick={() => onNavigate('org')}
              type="button"
            >
              Team Hierarchy
            </button>
          </div>
        }
      />

      {/* Hero Stats */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kicker">PENDING LEAVE APPROVALS</div>
          <div className="metric-huge mono" style={{ color: pendingLeaves.length > 0 ? '#D97706' : '#005A36' }}>
            {pendingLeaves.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {pendingLeaves.length > 0 ? 'Urgent action required' : 'All leave requests reviewed'}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2D77C7' }}>
          <div className="kicker">PENDING TIMESHEETS</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            {pendingTimesheets.length}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Weekly submissions awaiting review
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #005A36' }}>
          <div className="kicker">TEAM HEADCOUNT</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            {directReports.length} <span style={{ fontSize: 16, color: '#64748B' }}>staff</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Establishment: {totalFte.toFixed(1)} Total FTE
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #172C46' }}>
          <div className="kicker">DEPARTMENTAL ROSTER</div>
          <div className="metric-huge mono" style={{ color: '#172C46' }}>
            100%
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {user.department} &bull; No active cover gaps
          </div>
        </div>
      </div>

      {/* Main Approval Queues Grid */}
      <div className="grid two" style={{ gap: 24, marginBottom: 24 }}>
        {/* Urgent Leave Approvals Queue */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Team Leave Approval Queue</h3>
              <p className="small muted" style={{ margin: '2px 0 0' }}>
                Requests submitted by your direct reporting staff
              </p>
            </div>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('leave')}
              type="button"
            >
              All Absences &rarr;
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                background: '#F8FAFC',
                borderRadius: 8,
                border: '1px dashed #CBD5E1',
              }}
            >
              <div style={{ fontSize: 24 }}>✓</div>
              <strong style={{ display: 'block', color: '#172C46', marginTop: 6 }}>
                All clear! No pending leave requests
              </strong>
              <span className="small muted">Your team members have no outstanding leave requests.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingLeaves.map((l) => (
                <div
                  key={l.id}
                  style={{
                    padding: 14,
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: 15, color: '#172C46' }}>{getEmployeeName(l.employee_id)}</strong>
                      <span className="micro" style={{ marginLeft: 8, color: '#B45309', fontWeight: 700 }}>
                        {l.leave_type.toUpperCase()} ({l.days} {l.days === 1 ? 'day' : 'days'})
                      </span>
                      <div className="small" style={{ color: '#4B5563', marginTop: 4 }}>
                        📅 {l.start} &rarr; {l.ending}
                      </div>
                      <div className="micro muted" style={{ marginTop: 2 }}>
                        Reason: {l.note || 'None specified'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                    <button
                      className="btn small subtle"
                      onClick={() => handleRejectLeave(l.id)}
                      type="button"
                      style={{ color: '#DC2626' }}
                    >
                      Decline
                    </button>
                    <button
                      className="btn small primary"
                      onClick={() => handleApproveLeave(l.id)}
                      type="button"
                    >
                      ✓ Approve Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timesheet Reviews Queue */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Team Timesheet Reviews</h3>
              <p className="small muted" style={{ margin: '2px 0 0' }}>
                Weekly hours submitted for payroll approval
              </p>
            </div>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('time')}
              type="button"
            >
              Timesheet Matrix &rarr;
            </button>
          </div>

          {pendingTimesheets.length === 0 ? (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                background: '#F8FAFC',
                borderRadius: 8,
                border: '1px dashed #CBD5E1',
              }}
            >
              <div style={{ fontSize: 24 }}>✓</div>
              <strong style={{ display: 'block', color: '#172C46', marginTop: 6 }}>
                All weekly timesheets approved
              </strong>
              <span className="small muted">
                No unapproved time records pending for your cost centre.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingTimesheets.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: 14,
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: 14, color: '#1E3A8A' }}>{t.employee}</strong>
                      <div className="small muted" style={{ marginTop: 2 }}>
                        Week commencing: <strong>{t.week_start}</strong> &bull; Total: <strong>{t.hours} hrs</strong>
                      </div>
                    </div>
                    <button
                      className="btn small primary"
                      onClick={() => handleApproveTimesheet(t.id)}
                      type="button"
                    >
                      ✓ Approve Hours
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Direct Reports Establishment Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Direct Reports ({directReports.length} Staff)</h3>
          <button
            className="btn subtle small"
            onClick={() => onNavigate('reports')}
            type="button"
          >
            Workforce Insights &rarr;
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Role &amp; Grade</th>
                <th>Cost Centre</th>
                <th>FTE</th>
                <th>Leave Entitlement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {directReports.map((r) => {
                const reportLeaves = state.leave_requests.filter(
                  (l) => l.employee_id === r.id && l.status === 'Approved' && l.leave_type === 'Annual'
                );
                const usedDays = reportLeaves.reduce((acc, curr) => acc + curr.days, 0);
                const remaining = Math.max(0, (r.leave_total || 28) - usedDays);

                return (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.name}</strong>
                      <div className="micro muted">{r.email}</div>
                    </td>
                    <td>
                      <div>{r.job}</div>
                      <span className="micro" style={{ fontWeight: 700, color: '#005A36' }}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="mono">{r.cost_center}</td>
                    <td className="mono">{r.fte} FTE</td>
                    <td className="mono">
                      <strong>{remaining} days</strong> remaining
                      <div className="micro muted">({usedDays} used / {r.leave_total || 28} total)</div>
                    </td>
                    <td>
                      <button
                        className="btn small subtle"
                        onClick={() => onNavigate('leave')}
                        type="button"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
