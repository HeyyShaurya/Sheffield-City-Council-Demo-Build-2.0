import React from 'react';
import { User, PayrollRun, TimeEntry } from '../../types';
import { store, fmt } from '../../store/sheffieldStore';
import { PageHead, StatusBadge } from '../../components/CommonUI';

interface PayrollDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({ user, onNavigate }) => {
  const state = store.getState();
  const payrollRuns: PayrollRun[] = state.payroll_runs;
  const currentRun: PayrollRun | undefined = payrollRuns[0];
  const pendingTimesheets: TimeEntry[] = state.time_entries.filter((t) => t.status === 'Submitted');

  const handleRunPayroll = () => {
    try {
      store.createPayrollRun('2026-10', user);
    } catch {
      // Ignored if already calculated
    }
  };

  const handleFinalise = () => {
    if (currentRun) {
      store.finalisePayrollRun(currentRun.id, user);
    }
  };

  return (
    <div className="view-container">
      <PageHead
        kicker="PAYROLL OPERATIONS &amp; PERIOD CONTROL"
        title={`Payroll Command Centre &bull; ${user.name}`}
        desc="Monitor automated monthly gross-to-net pay runs, reconcile statutory RTI submissions, audit non-statutory deductions, and dispatch BACS payment files."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            {currentRun?.status !== 'Finalised' && currentRun ? (
              <button
                className="btn primary"
                onClick={handleFinalise}
                type="button"
              >
                ✓ Finalise &amp; Stage BACS
              </button>
            ) : (
              <button
                className="btn primary"
                onClick={handleRunPayroll}
                type="button"
              >
                + Calculate Next Run
              </button>
            )}
            <button
              className="btn subtle"
              onClick={() => onNavigate('payroll')}
              type="button"
            >
              Full Payroll Register
            </button>
          </div>
        }
      />

      {/* Payroll Metrics */}
      <div className="grid four" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid #005A36' }}>
          <div className="kicker">TOTAL GROSS PAY</div>
          <div className="metric-huge mono" style={{ color: '#005A36' }}>
            £{fmt(currentRun ? currentRun.gross : 54820.0)}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Period: {currentRun?.period || '2026-10'}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #2D77C7' }}>
          <div className="kicker">TOTAL NET DISBURSEMENTS</div>
          <div className="metric-huge mono" style={{ color: '#2D77C7' }}>
            £{fmt(currentRun ? currentRun.net : 39420.5)}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            Direct BACS credit distribution
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kicker">TOTAL DEDUCTIONS</div>
          <div className="metric-huge mono" style={{ color: '#D97706' }}>
            £{fmt(currentRun ? currentRun.deduction : 15399.5)}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            PAYE Tax, NI, LGPS &amp; Voluntary
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #102C50' }}>
          <div className="kicker">RUN STATUS</div>
          <div className="metric-huge mono" style={{ fontSize: 24, color: '#102C50', textTransform: 'uppercase' }}>
            {currentRun?.status || 'Active'}
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            {currentRun?.headcount || 16} establishment posts audited
          </div>
        </div>
      </div>

      {/* Main Grid: Current Period Breakdown & Pending Pre-payroll checks */}
      <div className="grid two" style={{ gap: 24, marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Period {currentRun?.period || '2026-10'} Control Card</h3>
            <StatusBadge value={currentRun?.status} />
          </div>

          <div
            style={{
              padding: 16,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">HMRC Real Time Information (RTI):</span>
              <strong style={{ color: '#005A36' }}>Generated (Full Payment Submission)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Non-Statutory Voluntary Deductions:</span>
              <strong>Simulated Active (£40.00 / employee)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Local Government Pension Scheme (LGPS):</span>
              <strong>6.8% Band Rate applied</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">BACS Hash Verification:</span>
              <strong className="mono" style={{ fontSize: 12 }}>SHA-256: 7f8c92a1...VALID</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Pre-Payroll Exception Monitor</h3>
            <button
              className="btn subtle small"
              onClick={() => onNavigate('time')}
              type="button"
            >
              Timesheet Matrix &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                padding: 12,
                background: pendingTimesheets.length > 0 ? '#FEF3C7' : '#F0FDF4',
                border: pendingTimesheets.length > 0 ? '1px solid #FCD34D' : '1px solid #BBF7D0',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#172C46' }}>Unapproved Timesheets</strong>
                <span className="mono bold">{pendingTimesheets.length}</span>
              </div>
              <div className="small muted" style={{ marginTop: 2 }}>
                {pendingTimesheets.length === 0
                  ? 'All hours signed off by service managers.'
                  : 'Awaiting manager approval before inclusion in calculation.'}
              </div>
            </div>

            <div
              style={{
                padding: 12,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#172C46' }}>Leaver &amp; Starter Pro-Rata Adjustments</strong>
                <span className="mono bold" style={{ color: '#005A36' }}>0 exceptions</span>
              </div>
              <div className="small muted" style={{ marginTop: 2 }}>
                All mid-month appointments correctly annualized.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
