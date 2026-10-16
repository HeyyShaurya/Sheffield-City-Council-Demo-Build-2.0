import React, { useState } from 'react';
import { User } from '../types';
import { store, money } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface OptionalViewProps {
  user: User;
  onNavigate: (page: string) => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const OptionalView: React.FC<OptionalViewProps> = ({ user, onNavigate, onToast }) => {
  const expenses = store.getExpenses(user);
  const cases = store.getHRCases(user);
  const allUsers = store.getState().users;

  const isHR = ['hr', 'admin'].includes(user.role);
  const isManager = ['manager', 'hr', 'admin'].includes(user.role);

  // Expense modal
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expCategory, setExpCategory] = useState('Travel');
  const [expAmount, setExpAmount] = useState('42.50');
  const [expDetail, setExpDetail] = useState('');

  // Case modal
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [caseEmpId, setCaseEmpId] = useState<number>(allUsers[0]?.id || 1);
  const [caseCategory, setCaseCategory] = useState('Attendance');
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDetails, setCaseDetails] = useState('');

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const exp = store.submitExpense(expCategory, Number(expAmount), expDetail, user);
      onToast(`Expense claim #${exp.id} submitted`);
      setIsExpenseOpen(false);
      setExpDetail('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleExpenseDecision = (id: number, decision: 'Approved' | 'Rejected') => {
    try {
      store.decideExpense(id, decision, user);
      onToast(`Expense ${decision.toLowerCase()}`);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const c = store.createHRCase(caseEmpId, caseCategory, caseTitle, caseDetails, user);
      onToast(`HR case #${c.id} created`);
      setIsCaseOpen(false);
      setCaseTitle('');
      setCaseDetails('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleCloseCase = (id: number) => {
    try {
      store.closeHRCase(id, user);
      onToast('HR case closed');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Additional-cost capabilities"
        kicker="OPTIONAL / NOT IN BASE SOFTWARE ARR"
        desc="These are working prototype extensions and remain separately scoped/licensed in the Sheffield response."
      />

      <div className="grid three">
        <div className="card">
          <span className="badge warn">Additional cost</span>
          <h3 style={{ marginTop: 13 }}>Claims &amp; expenses</h3>
          <p className="small muted">Submit and review expense claims from employee to manager.</p>
          <button
            style={{ marginTop: 16 }}
            className="btn light small"
            onClick={() => setIsExpenseOpen(true)}
            type="button"
          >
            + Submit claim
          </button>
        </div>

        <div className="card">
          <span className="badge warn">Additional cost</span>
          <h3 style={{ marginTop: 13 }}>HR case management</h3>
          <p className="small muted">Controlled People Services case tracking with assigned owner and closure.</p>
          {isHR ? (
            <button
              style={{ marginTop: 16 }}
              className="btn light small"
              onClick={() => setIsCaseOpen(true)}
              type="button"
            >
              + Open HR case
            </button>
          ) : (
            <div className="micro muted" style={{ marginTop: 19 }}>
              HR access only
            </div>
          )}
        </div>

        <div className="card">
          <span className="badge warn">Additional cost</span>
          <h3 style={{ marginTop: 13 }}>Advanced insights</h3>
          <p className="small muted">Custom analytics extensions, modelled above the baseline reporting features.</p>
          <button
            style={{ marginTop: 16 }}
            className="btn light small"
            onClick={() => onNavigate('reports')}
            type="button"
          >
            Explore reporting
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Expense claims</h3>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Detail</th>
                <th>State</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length ? (
                expenses.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <strong>{x.employee}</strong>
                    </td>
                    <td>{x.category}</td>
                    <td>{money(x.amount)}</td>
                    <td>{x.detail}</td>
                    <td>
                      <StatusBadge value={x.status} />
                    </td>
                    <td>
                      {x.status === 'Submitted' && isManager ? (
                        <div className="inline-actions">
                          <button
                            className="btn light small"
                            onClick={() => handleExpenseDecision(x.id, 'Approved')}
                            type="button"
                          >
                            Approve
                          </button>
                          <button
                            className="btn danger small"
                            onClick={() => handleExpenseDecision(x.id, 'Rejected')}
                            type="button"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        '--'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="No expense claims submitted yet." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isHR && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Optional HR case register</h3>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.length ? (
                  cases.map((x) => (
                    <tr key={x.id}>
                      <td>
                        <strong>{x.title}</strong>
                        <div className="micro muted">{x.details}</div>
                      </td>
                      <td>{x.employee}</td>
                      <td>{x.category}</td>
                      <td>
                        <StatusBadge value={x.status} />
                      </td>
                      <td>
                        {x.status === 'Open' ? (
                          <button
                            className="btn small light"
                            onClick={() => handleCloseCase(x.id)}
                            type="button"
                          >
                            Close case
                          </button>
                        ) : (
                          '--'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState message="No HR cases opened yet." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        title="Submit an expense claim"
        intro="Optional module, separately scoped from the Sheffield baseline."
      >
        <form onSubmit={handleExpenseSubmit} className="form-stack">
          <label>
            Category
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value)}
            >
              <option value="Travel">Travel</option>
              <option value="Training">Training</option>
              <option value="Subsistence">Subsistence</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Claim amount (GBP)
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="5000"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              required
            />
          </label>

          <label>
            Business reason
            <textarea
              value={expDetail}
              onChange={(e) => setExpDetail(e.target.value)}
              maxLength={500}
              placeholder="Explain business justification for expense"
              required
            />
          </label>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsExpenseOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Submit claim
            </button>
          </div>
        </form>
      </Modal>

      {/* HR Case Modal */}
      <Modal
        isOpen={isCaseOpen}
        onClose={() => setIsCaseOpen(false)}
        title="Open People Services case"
        intro="Optional case-management capability, not included in the base software subscription."
      >
        <form onSubmit={handleCaseSubmit} className="form-stack">
          <label>
            Employee
            <select
              value={caseEmpId}
              onChange={(e) => setCaseEmpId(Number(e.target.value))}
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.job})
                </option>
              ))}
            </select>
          </label>

          <label>
            Case category
            <select
              value={caseCategory}
              onChange={(e) => setCaseCategory(e.target.value)}
            >
              <option value="Attendance">Attendance</option>
              <option value="Employee relations">Employee relations</option>
              <option value="Disciplinary">Disciplinary</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Case title
            <input
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              placeholder="Restricted HR record"
              required
            />
          </label>

          <label>
            Case details
            <textarea
              value={caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
              maxLength={1800}
              placeholder="Provide sensitive casework notes"
              required
            />
          </label>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsCaseOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Create restricted case
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
