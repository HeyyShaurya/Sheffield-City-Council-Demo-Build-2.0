import React, { useState } from 'react';
import { User } from '../types';
import { store, fmt, lastMonday } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface TimesheetsViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const TimesheetsView: React.FC<TimesheetsViewProps> = ({ user, onToast }) => {
  const timesheets = store.getTimesheets(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekStart, setWeekStart] = useState(lastMonday());
  const [hours, setHours] = useState('37.5');

  const isHR = ['hr', 'admin'].includes(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      store.submitTimesheet(weekStart, Number(hours), user);
      onToast('Timesheet submitted for approval');
      setIsModalOpen(false);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleDecision = (id: number, decision: 'Approved' | 'Rejected') => {
    try {
      store.decideTimesheet(id, decision, user);
      onToast(`Timesheet ${decision.toLowerCase()}`);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Time & attendance"
        kicker="STANDARD SCOPE / WEEKLY TIMESHEETS"
        desc="Submit hours, review team timesheets and approve time to the mock finance interface."
        actions={
          <button className="btn primary" onClick={() => setIsModalOpen(true)} type="button">
            + Submit timesheet
          </button>
        }
      />

      <div className="card">
        <div className="section-top">
          <h2>Weekly submissions</h2>
          <span>One entry per employee/week; all decisions audited</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Week commencing</th>
                <th>Hours</th>
                <th>State</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length ? (
                timesheets.map((a) => {
                  const canDecide =
                    a.status === 'Submitted' &&
                    ((user.role === 'manager' && a.manager_id === user.id) || isHR);

                  return (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.employee}</strong>
                      </td>
                      <td>{a.week_start}</td>
                      <td>{fmt(a.hours)}</td>
                      <td>
                        <StatusBadge value={a.status} />
                      </td>
                      <td>
                        {canDecide ? (
                          <span className="inline-actions">
                            <button
                              className="btn light small"
                              onClick={() => handleDecision(a.id, 'Approved')}
                              type="button"
                            >
                              Approve
                            </button>
                            <button
                              className="btn ghost small"
                              onClick={() => handleDecision(a.id, 'Rejected')}
                              type="button"
                            >
                              Reject
                            </button>
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState message="No timesheet entries yet. Submit a timesheet with '+ Submit timesheet' above." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="note" style={{ marginTop: 18 }}>
        This demonstrates approval workflow, not a licensed statutory time/payroll engine. Specific Sheffield overtime
        and shift rules will need separate configuration and validation.
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit a weekly timesheet"
        intro="A manager reviews submitted hours; approved records enter the mock finance queue."
      >
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Week commencing (Monday)
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              required
            />
          </label>

          <label>
            Total hours worked
            <input
              type="number"
              min="0.25"
              max="65"
              step="0.25"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
          </label>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Submit hours
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
