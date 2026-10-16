import React, { useState } from 'react';
import { User, PayrollRun, PayrollAnomaly } from '../types';
import { store, money, fmt, ago } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface PayrollViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ user, onToast }) => {
  const { runs, payslips, disclaimer } = store.getPayroll(user);
  const canRunPayroll = ['payroll', 'admin'].includes(user.role);
  const allUsers = store.getState().users;
  const payrollItems = store.getState().payroll_items;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));

  // Anomaly resolution modal
  const [resolvingAnomaly, setResolvingAnomaly] = useState<{ runId: number; anomaly: PayrollAnomaly } | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Selected run for detailed inspection
  const [selectedRunId, setSelectedRunId] = useState<number | null>(runs.length ? runs[0].id : null);

  const activeRun = runs.find((r) => r.id === (selectedRunId || runs[0]?.id)) || runs[0];

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = store.createPayrollRun(period, user);
      onToast(`Draft payroll calculated: ${res.headcount} posts. ${res.anomalies.length} anomaly flags detected.`);
      setIsModalOpen(false);
      setSelectedRunId(res.id);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleOpenResolve = (runId: number, anomaly: PayrollAnomaly) => {
    setResolvingAnomaly({ runId, anomaly });
    if (anomaly.category === 'timesheet') {
      setResolutionNote('Verified with Service Manager; timesheet approved for payroll period.');
    } else {
      setResolutionNote('Reviewed and verified against establishment NJC grading schedule.');
    }
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingAnomaly) return;
    try {
      store.resolvePayrollAnomaly(resolvingAnomaly.runId, resolvingAnomaly.anomaly.id, resolutionNote, user);
      onToast('Anomaly exception resolved. Validation state updated.');
      setResolvingAnomaly(null);
      setResolutionNote('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleFinalise = (id: number) => {
    if (!window.confirm('Finalise this payroll run, lock period records, generate BACS file and publish employee payslips?')) return;
    try {
      store.finalisePayrollRun(id, user);
      onToast('Payroll finalised! BACS payment disbursement file staged and payslips published.');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleDownloadBACS = (run: PayrollRun) => {
    const items = payrollItems.filter((i) => i.run_id === run.id);
    const header = `VOL1_SCC_BACS_PAYMENTS_${run.period}_HEADCOUNT_${run.headcount}_GROSS_${run.gross}_NET_${run.net}\n`;
    const lines = items.map((i) => {
      const emp = allUsers.find((u) => u.id === i.employee_id);
      return `BACS_CR:${i.employee_id.toString().padStart(6, '0')}:${emp?.name.padEnd(20, ' ')}:BANK_SORT:40-41-12:ACC:81726354:NET:£${i.net.toFixed(2)}`;
    });
    const fileData = header + lines.join('\n');

    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SHEFFIELD_BACS_PAYMENT_${run.period}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast(`BACS instruction file downloaded for period ${run.period}`);
  };

  const activeRunItems = activeRun ? payrollItems.filter((i) => i.run_id === activeRun.id) : [];
  const blockingAnomalies = activeRun?.anomalies?.filter((a) => a.severity === 'blocking' && !a.resolved) || [];
  const warningAnomalies = activeRun?.anomalies?.filter((a) => a.severity === 'warning') || [];
  const resolvedAnomalies = activeRun?.anomalies?.filter((a) => a.resolved) || [];

  return (
    <div>
      <PageHead
        title="Payroll & employee payslips"
        kicker="UK PAYROLL / EXPLAINABLE SIMULATOR & AUDIT"
        desc="Pre-payroll anomaly detection, validation, correction, finalisation blocking, and employee payslip access."
        actions={
          canRunPayroll && (
            <button className="btn primary" onClick={() => setIsModalOpen(true)} type="button">
              + Calculate payroll run
            </button>
          )
        }
      />

      <div className="note attention">
        <strong>Non-statutory payroll simulation:</strong> {disclaimer}
      </div>

      {/* Payroll Run Overview Card */}
      {runs.length > 0 && canRunPayroll && (
        <div className="card" style={{ marginTop: 17 }}>
          <div className="section-top">
            <h3>Payroll Period Control Centre</h3>
            <span>{runs.length} calculation cycles on record</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Establishment Headcount</th>
                  <th>Gross Pay</th>
                  <th>Deductions</th>
                  <th>Net Disbursements</th>
                  <th>Pre-Payroll Validations</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => {
                  const unresBlock = r.anomalies?.filter((a) => a.severity === 'blocking' && !a.resolved).length || 0;
                  const isCurrent = activeRun?.id === r.id;

                  return (
                    <tr key={r.id} style={isCurrent ? { background: '#F8FAFC' } : undefined}>
                      <td>
                        <strong>{r.period}</strong>
                        {isCurrent && <span className="micro" style={{ color: '#2D77C7', display: 'block' }}>Selected for audit</span>}
                      </td>
                      <td>{r.headcount} posts</td>
                      <td>{money(r.gross)}</td>
                      <td>{money(r.deduction)}</td>
                      <td>{money(r.net)}</td>
                      <td>
                        {r.status === 'Draft' ? (
                          unresBlock > 0 ? (
                            <span className="badge bad" title="Blocking finalisation">
                              ⚠️ {unresBlock} Critical Anomaly
                            </span>
                          ) : (
                            <span className="badge good">✓ Validated</span>
                          )
                        ) : (
                          <span className="badge good">Reconciled</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge value={r.status} />
                      </td>
                      <td>
                        <span className="inline-actions">
                          {r.status === 'Draft' ? (
                            <button
                              className={`btn small ${unresBlock > 0 ? 'ghost' : 'light'}`}
                              onClick={() => handleFinalise(r.id)}
                              type="button"
                              disabled={unresBlock > 0}
                              title={unresBlock > 0 ? `Cannot finalise: resolve ${unresBlock} blocking anomalies first` : 'Finalise and publish payslips'}
                              style={unresBlock > 0 ? { opacity: 0.5, cursor: 'not-allowed' } : { fontWeight: 700 }}
                            >
                              Finalise
                            </button>
                          ) : (
                            <button
                              className="btn subtle small"
                              onClick={() => handleDownloadBACS(r)}
                              type="button"
                              title="Download BACS payment file"
                            >
                              BACS File &darr;
                            </button>
                          )}
                          <button
                            className="btn ghost small"
                            onClick={() => setSelectedRunId(r.id)}
                            type="button"
                          >
                            Inspect
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pre-Payroll Anomaly Detection & Reconciliation Panel (Requirement 4) */}
      {activeRun && canRunPayroll && (
        <div className="card" style={{ marginTop: 20, borderLeft: blockingAnomalies.length > 0 ? '5px solid #DC2626' : '5px solid #16A34A' }}>
          <div className="section-top">
            <div>
              <h2 style={{ fontSize: 18 }}>
                Pre-Payroll Anomaly Detection &amp; Audit &bull; Period {activeRun.period}
              </h2>
              <p className="small muted" style={{ margin: '3px 0 0' }}>
                Automated validation scanning for unapproved timesheets, zero salaries, and missing establishment records prior to BACS generation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {blockingAnomalies.length > 0 ? (
                <span className="badge bad" style={{ fontSize: 12, padding: '6px 12px' }}>
                  🚫 Finalisation BLOCKED ({blockingAnomalies.length} Critical Issues)
                </span>
              ) : (
                <span className="badge good" style={{ fontSize: 12, padding: '6px 12px' }}>
                  ✓ All Blocking Checks Cleared
                </span>
              )}
            </div>
          </div>

          {/* Anomaly Counters */}
          <div className="grid three" style={{ gap: 12, margin: '16px 0' }}>
            <div style={{ background: blockingAnomalies.length > 0 ? '#FEF2F2' : '#F8FAFC', border: '1px solid #FECACA', borderRadius: 8, padding: 12 }}>
              <div className="micro muted" style={{ fontWeight: 800, color: '#991B1B' }}>BLOCKING EXCEPTIONS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
                {blockingAnomalies.length}
              </div>
              <div className="small muted">Must be resolved before finalising run</div>
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: 12 }}>
              <div className="micro muted" style={{ fontWeight: 800, color: '#92400E' }}>ADVISORY WARNINGS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
                {warningAnomalies.length}
              </div>
              <div className="small muted">Informational establishment checks</div>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: 12 }}>
              <div className="micro muted" style={{ fontWeight: 800, color: '#166534' }}>RESOLVED / OVERRIDDEN</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#16A34A', marginTop: 4 }}>
                {resolvedAnomalies.length}
              </div>
              <div className="small muted">Audited and acknowledged exceptions</div>
            </div>
          </div>

          {/* Anomaly Table */}
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Category</th>
                  <th>Employee / Post</th>
                  <th>Detected Issue</th>
                  <th>Remediation Requirement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeRun.anomalies?.length ? (
                  activeRun.anomalies.map((anom) => (
                    <tr key={anom.id} style={anom.resolved ? { opacity: 0.7 } : undefined}>
                      <td>
                        {anom.severity === 'blocking' ? (
                          <span className="badge bad">CRITICAL BLOCKER</span>
                        ) : (
                          <span className="badge warn">WARNING</span>
                        )}
                      </td>
                      <td>
                        <strong style={{ textTransform: 'capitalize' }}>{anom.category}</strong>
                      </td>
                      <td>
                        <strong>{anom.employee_name}</strong>
                        <div className="micro muted">ID #{anom.employee_id}</div>
                      </td>
                      <td>
                        <span style={{ color: '#1E293B', fontWeight: 600 }}>{anom.issue}</span>
                      </td>
                      <td>
                        <span className="small muted">{anom.remediation}</span>
                        {anom.resolved && anom.resolution_note && (
                          <div className="small" style={{ color: '#166534', marginTop: 4, fontWeight: 600 }}>
                            ✓ Resolved: {anom.resolution_note} ({ago(anom.resolved_at)})
                          </div>
                        )}
                      </td>
                      <td>
                        {anom.resolved ? (
                          <span className="badge good">Resolved</span>
                        ) : activeRun.status === 'Draft' ? (
                          <button
                            className="btn primary small"
                            onClick={() => handleOpenResolve(activeRun.id, anom)}
                            type="button"
                          >
                            Resolve Exception
                          </button>
                        ) : (
                          '--'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="small muted" style={{ padding: 12, textAlign: 'center' }}>
                        No anomalies detected in this cycle. All establishment records match baseline validation rules.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Individual Employee Pay Register Table */}
      {activeRun && canRunPayroll && activeRunItems.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-top">
            <h3>Disbursement Breakdown by Employee &bull; Period {activeRun.period}</h3>
            <span>{activeRunItems.length} posts reconciled</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department / Grade</th>
                  <th>Base Gross</th>
                  <th>Overtime Addition</th>
                  <th>Gross Pay</th>
                  <th>LGPS Pension (6.5%)</th>
                  <th>PAYE / NI (11.5%)</th>
                  <th>Total Deductions</th>
                  <th>Net Disbursement</th>
                </tr>
              </thead>
              <tbody>
                {activeRunItems.map((item) => {
                  const emp = allUsers.find((u) => u.id === item.employee_id);
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{emp?.name}</strong>
                      </td>
                      <td>
                        {emp?.department} &bull; <span className="micro" style={{ fontWeight: 700 }}>{emp?.grade}</span>
                      </td>
                      <td>£{fmt(item.base_salary)}</td>
                      <td>
                        {item.timesheet_pay ? (
                          <span style={{ color: '#005A36', fontWeight: 700 }}>
                            +£{fmt(item.timesheet_pay)} <span className="micro">({item.timesheet_hours}h OT)</span>
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td>
                        <strong>£{fmt(item.gross)}</strong>
                      </td>
                      <td>£{fmt(item.pension_deduction)}</td>
                      <td>£{fmt(item.tax_deduction)}</td>
                      <td style={{ color: '#D97706' }}>-£{fmt(item.deduction)}</td>
                      <td>
                        <strong style={{ color: '#005A36', fontSize: 13 }}>£{fmt(item.net)}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Payslips Card */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-top">
          <div>
            <h3 style={{ margin: 0 }}>My Personal Payslips &bull; {user.name}</h3>
            <p className="card-sub" style={{ margin: '4px 0 0' }}>
              Official council payslips are published once the monthly payroll lead finalises period reconciliation.
            </p>
          </div>
          {payslips.length > 0 && (
            <span className="badge good">{payslips.length} Payslip Available</span>
          )}
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Gross Pay</th>
                <th>Pension Contribution</th>
                <th>Tax &amp; NI Deductions</th>
                <th>Net Pay</th>
                <th>Disbursement Status</th>
              </tr>
            </thead>
            <tbody>
              {payslips.length ? (
                payslips.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.period}</strong>
                    </td>
                    <td>{money(r.gross)}</td>
                    <td>{money(r.pension_deduction || r.deduction * 0.36)}</td>
                    <td>{money(r.tax_deduction || r.deduction * 0.64)}</td>
                    <td>
                      <strong style={{ color: '#005A36', fontSize: 14 }}>{money(r.net)}</strong>
                    </td>
                    <td>
                      <StatusBadge value={r.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="No finalised payslips for your account yet. Switch to Oliver Reed (Payroll Lead) to calculate and finalise a run." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Resolution Modal */}
      {resolvingAnomaly && (
        <Modal
          isOpen={!!resolvingAnomaly}
          onClose={() => setResolvingAnomaly(null)}
          title="Resolve Pre-Payroll Anomaly"
          intro={`Period ${activeRun.period} • ${resolvingAnomaly.anomaly.employee_name}`}
        >
          <form onSubmit={handleConfirmResolve} className="form-stack">
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 14 }}>
              <strong style={{ color: '#991B1B', display: 'block', marginBottom: 4 }}>
                Exception: {resolvingAnomaly.anomaly.issue}
              </strong>
              <div className="small muted">
                Remediation: {resolvingAnomaly.anomaly.remediation}
              </div>
            </div>

            <label>
              Resolution Justification &amp; Sign-off Note
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter audit rationale for overriding or verifying this anomaly..."
                required
                rows={3}
              />
            </label>

            <div className="note" style={{ fontSize: 11 }}>
              Resolving this exception updates the validation matrix and records an immutable audit entry in the council compliance log. If resolving an unapproved timesheet, the timesheet will be approved.
            </div>

            <div className="form-actions">
              <button className="btn ghost" type="button" onClick={() => setResolvingAnomaly(null)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                ✓ Confirm Anomaly Resolution
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Run Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Execute Pre-Payroll Calculation"
        intro="Calculates gross-to-net pay across establishment records and triggers pre-payroll anomaly scanning."
      >
        <form onSubmit={handleCreateRun} className="form-stack">
          <label>
            Payroll period (YYYY-MM)
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
            />
          </label>

          <div className="note attention">
            Calculation scans all 16 establishment posts, verifies submitted timesheets, applies LGPS &amp; PAYE simulations, and flags blocking discrepancies.
          </div>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Run Pre-Payroll Validation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
