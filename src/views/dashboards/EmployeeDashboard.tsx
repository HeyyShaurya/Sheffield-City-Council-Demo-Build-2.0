import React from 'react';
import { User, LeaveRequest, TimeEntry, Enrolment, Task, PayrollItem, PayrollRun } from '../../types';
import { store, fmt } from '../../store/sheffieldStore';
import { PageHead, StatusBadge } from '../../components/CommonUI';

interface EmployeeDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const myLeaves: LeaveRequest[] = state.leave_requests.filter((r) => r.employee_id === user.id);
  const myTimesheets: TimeEntry[] = state.time_entries.filter((t) => t.employee_id === user.id);
  const myEnrolments: Enrolment[] = state.enrolments.filter((e) => e.employee_id === user.id);
  const myTasks: Task[] = state.tasks.filter((t) => t.assigned_to === user.id && t.status === 'Open');

  // Latest payslip calculation
  const latestRun: PayrollRun | undefined = state.payroll_runs[0];
  const myPayslipItem: PayrollItem | undefined = state.payroll_items.find(
    (i) => i.employee_id === user.id && (!latestRun || i.run_id === latestRun.id)
  );

  // Leave balance calculations
  const totalDays = user.leave_total || 28;
  const takenDays = myLeaves
    .filter((l) => l.status === 'Approved' && l.leave_type === 'Annual')
    .reduce((acc: number, curr: LeaveRequest) => acc + curr.days, 0);
  const pendingDays = myLeaves
    .filter((l) => l.status === 'Pending')
    .reduce((acc: number, curr: LeaveRequest) => acc + curr.days, 0);
  const remainingDays = Math.max(0, totalDays + user.leave_carry + user.leave_purchased - takenDays);

  return (
    <div className="view-container">
      <PageHead
        kicker="EMPLOYEE SELF-SERVICE HUB / SHEFFIELD CONNECT"
        title={`Welcome back, ${user.name}`}
        desc="Your personalised Sheffield City Council portal. View your leave entitlement, log weekly hours, track compliance courses, and access verified payslips."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn primary"
              onClick={() => onNavigate('leave')}
              type="button"
            >
              + Request Leave
            </button>
            <button
              className="btn subtle"
              onClick={() => onNavigate('time')}
              type="button"
            >
              Submit Timesheet
            </button>
          </div>
        }
      />

      {/* Hero Profile & Role Context Banner */}
      <div
        className="card hero-strip"
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #0A2F1F 0%, #005A36 60%, #172C46 100%)',
          border: '1px solid #1E7B50',
          color: '#FFFFFF',
          padding: 24,
          borderRadius: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="caps" style={{ color: '#A3D9BE', fontSize: 11, fontWeight: 800 }}>
              ESTABLISHMENT POST &bull; {user.department.toUpperCase()}
            </div>
            <h2 style={{ color: '#FFFFFF', fontSize: 24, marginTop: 4, fontWeight: 800 }}>
              {user.job} &nbsp;<span style={{ fontSize: 16, color: '#A3D9BE' }}>({user.grade})</span>
            </h2>
            <p style={{ color: '#D1EAE0', margin: '4px 0 0', fontSize: 13 }}>
              Reporting to <strong>Helen Walker</strong> &bull; Cost Centre: <strong>{user.cost_center}</strong> &bull; Contract: <strong>{user.fte} FTE (Permanent)</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn small light"
              onClick={() => onNavigate('profile')}
              type="button"
              style={{ fontWeight: 700 }}
            >
              View My Profile
            </button>
            <button
              className="btn small light"
              onClick={() => onNavigate('messages')}
              type="button"
              style={{ fontWeight: 700 }}
            >
              Support Messages
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="kicker">ANNUAL LEAVE REMAINING</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            {remainingDays} <span style={{ fontSize: 16, color: '#64748B' }}>/ {totalDays} days</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {takenDays} days taken &bull; {pendingDays} days pending approval
          </div>
        </div>

        <div className="card">
          <div className="kicker">LATEST NET PAYSLIP</div>
          <div className="metric-huge mono" style={{ color: '#172C46' }}>
            £{fmt(myPayslipItem ? myPayslipItem.net : 2145.8)}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Period {latestRun?.period || '2026-10'} &bull; Direct BACS credit
          </div>
        </div>

        <div className="card">
          <div className="kicker">WEEKLY ATTENDANCE</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            {myTimesheets.length > 0 ? `${myTimesheets[0].hours}h` : '37.0h'}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Status:{' '}
            <span style={{ fontWeight: 700, color: '#188C67' }}>
              {myTimesheets[0]?.status ? myTimesheets[0].status.toUpperCase() : 'SUBMITTED'}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="kicker">MANDATORY LEARNING</div>
          <div className="metric-huge mono" style={{ color: '#D97706' }}>
            {myEnrolments.length} <span style={{ fontSize: 16, color: '#64748B' }}>Modules</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {myEnrolments.filter((e) => e.status === 'Completed').length} completed &bull; 100% target
          </div>
        </div>
      </div>

      {/* Two Column Layout: Leave Activity & Timesheets */}
      <div className="grid two" style={{ gap: 24, marginBottom: 24 }}>
        {/* Absence Requests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Upcoming Absence &amp; Leave</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('leave')}
              type="button"
            >
              Full Calendar &rarr;
            </button>
          </div>

          {myLeaves.length === 0 ? (
            <p className="muted">No absence records found. Book holiday using the button above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myLeaves.slice(0, 4).map((l) => (
                <div
                  key={l.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#F8FAFC',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#172C46' }}>
                      {l.leave_type.toUpperCase()} LEAVE &bull; {l.days} {l.days === 1 ? 'day' : 'days'}
                    </div>
                    <div className="small muted" style={{ marginTop: 2 }}>
                      {l.start} to {l.ending} {l.note ? `\u2022 ${l.note}` : ''}
                    </div>
                  </div>
                  <StatusBadge value={l.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payslips & Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Payslip Summary &amp; My Tasks</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('payroll')}
              type="button"
            >
              View Payslip &rarr;
            </button>
          </div>

          <div
            style={{
              padding: 16,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="micro" style={{ color: '#166534', fontWeight: 800 }}>
                  OCTOBER 2026 OFFICIAL PAYROLL
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#14532D', marginTop: 2 }}>
                  Net Take-Home: £{fmt(myPayslipItem ? myPayslipItem.net : 2145.8)}
                </div>
                <div className="small" style={{ color: '#15803D', marginTop: 2 }}>
                  Gross: £{fmt(myPayslipItem ? myPayslipItem.gross : 2850.0)} &bull; Tax/NI/LGPS Pension Deductions applied
                </div>
              </div>
              <button
                className="btn small primary"
                onClick={() => onNavigate('payroll')}
                type="button"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Pending Onboarding & Compliance Tasks */}
          <h4 style={{ margin: '14px 0 8px', color: '#475569' }}>Assigned Action Items</h4>
          {myTasks.length === 0 ? (
            <div className="small muted">All personal onboarding and compliance tasks are complete.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: '#FEF9C3',
                    border: '1px solid #FDE047',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#713F12' }}>{t.title}</span>
                  <button
                    className="btn small subtle"
                    onClick={() => onNavigate('tasks')}
                    type="button"
                  >
                    Complete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
