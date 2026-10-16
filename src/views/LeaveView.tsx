import React, { useState } from 'react';
import { User } from '../types';
import { store, fmt, isodays } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface LeaveViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({ user, onToast }) => {
  const { items, balance, entitlement } = store.getLeaveRequests(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState(isodays(10));
  const [endDate, setEndDate] = useState(isodays(11));
  const [note, setNote] = useState('');

  const isHR = ['hr', 'admin'].includes(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = store.createLeaveRequest(user, {
        leave_type: leaveType,
        start: startDate,
        ending: endDate,
        note,
      });
      onToast(`Leave request #${res.id} submitted (${res.days} weekdays)`);
      setIsModalOpen(false);
      setNote('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleDecision = (id: number, decision: 'Approved' | 'Rejected') => {
    try {
      store.decideLeaveRequest(id, decision, user);
      onToast(`Leave request ${decision.toLowerCase()}`);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Leave & absence"
        kicker="USE CASE 01 / EMPLOYEE SELF-SERVICE"
        desc="View entitlement components, submit an absence and watch a manager decision update the same record."
        actions={
          <button className="btn primary" onClick={() => setIsModalOpen(true)} type="button">
            + Request leave
          </button>
        }
      />

      <div className="grid four">
        <div className="card stat">
          <div className="stat-label">Available annual leave</div>
          <div className="stat-num">
            {fmt(balance)} <small style={{ fontSize: 14 }}>days</small>
          </div>
          <div className="stat-foot">Approved requests reduce your balance</div>
        </div>

        <div className="card stat">
          <div className="stat-label">Annual entitlement</div>
          <div className="stat-num">{fmt(entitlement.annual)}</div>
          <div className="stat-foot">Council policy demo setting</div>
        </div>

        <div className="card stat">
          <div className="stat-label">Carry forward + purchased</div>
          <div className="stat-num">{fmt(entitlement.carry_forward + entitlement.purchased)}</div>
          <div className="stat-foot">Council policy demo setting</div>
        </div>

        <div className="card stat">
          <div className="stat-label">Bank holiday allocation</div>
          <div className="stat-num">{fmt(entitlement.bank_holidays)}</div>
          <div className="stat-foot">Council policy demo setting</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-top">
          <h2>Requests &amp; decisions</h2>
          <span>History is live and audit-backed</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((a) => {
                  const canDecide =
                    a.status === 'Pending' &&
                    ((user.role === 'manager' && a.manager_id === user.id) || isHR);

                  return (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.employee}</strong>
                      </td>
                      <td>{a.leave_type}</td>
                      <td>
                        {a.start} to {a.ending}
                      </td>
                      <td>{fmt(a.days)}</td>
                      <td>
                        <StatusBadge value={a.status} />
                      </td>
                      <td className="actions">
                        {canDecide ? (
                          <span className="inline-actions">
                            <button
                              className="btn small light"
                              onClick={() => handleDecision(a.id, 'Approved')}
                              type="button"
                            >
                              Approve
                            </button>
                            <button
                              className="btn small ghost"
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
                  <td colSpan={6}>
                    <EmptyState message="No leave requests yet. Submit a request using '+ Request leave' above." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="note" style={{ marginTop: 17 }}>
        Switch from <strong>Aisha Khan</strong> to <strong>Helen Walker</strong> using Change persona after submitting
        leave to approve or reject it. Overlapping leave requests and insufficient entitlement are blocked.
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request an absence"
        intro="Annual leave is calculated using weekdays; approved time updates your balance."
      >
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field-grid">
            <label>
              Absence type
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="Annual">Annual</option>
                <option value="Carer">Carer</option>
                <option value="Discretionary">Discretionary</option>
                <option value="Trade union">Trade union</option>
                <option value="Sickness">Sickness</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>

            <label className="wide">
              Reason / notes
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional reason"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Submit for approval
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
