import React, { useState } from 'react';
import { User } from '../types';
import { store, isodays } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface TasksViewProps {
  user: User;
  onNavigate: (page: string) => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ user, onNavigate, onToast }) => {
  const tasks = store.getTasks(user);
  const allUsers = store.getState().users;

  const canAssign = ['manager', 'learning', 'hr', 'admin'].includes(user.role);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskKind, setTaskKind] = useState('HR Process');
  const [assignedTo, setAssignedTo] = useState<number>(user.id);
  const [dueDate, setDueDate] = useState(isodays(7));
  const [taskNotes, setTaskNotes] = useState('');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const task = store.assignTask(user, {
        title: taskTitle,
        kind: taskKind,
        assigned_to: assignedTo,
        due: dueDate,
        notes: taskNotes,
      });
      onToast(`Task #${task.id} assigned`);
      setIsAssignOpen(false);
      setTaskTitle('');
      setTaskNotes('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleComplete = (id: number) => {
    try {
      store.completeTask(id, user);
      onToast('Task completed and audited');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const openCount = tasks.filter((x) => x.status === 'Open').length;

  return (
    <div>
      <PageHead
        title="HR journeys & task control"
        kicker="USE CASE 05 / PEOPLE SERVICES"
        desc="Clearly owned work, manager/employee actions, HR checks and permanent audit history."
        actions={
          canAssign && (
            <button className="btn primary" onClick={() => setIsAssignOpen(true)} type="button">
              + Assign task
            </button>
          )
        }
      />

      <div className="grid two">
        <div className="card">
          <h3>Actionable task queue</h3>
          <p className="card-sub">Role-assigned actions appear automatically after hiring and during HR processes.</p>
          <strong style={{ fontSize: 38, fontFamily: 'Manrope, sans-serif' }}>{openCount}</strong>
          <div className="small muted">Open tasks in this view</div>
        </div>

        <div className="card">
          <h3>Connected hand-off</h3>
          <p className="card-sub">
            An onboarded candidate creates tasks for employee, People Services and Learning, without re-entering a separate
            employee identity.
          </p>
          <button
            className="btn small light"
            onClick={() => onNavigate('recruit')}
            type="button"
          >
            See recruiting journey &rarr;
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Workstream</th>
                <th>Owner</th>
                <th>Deadline</th>
                <th>State</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length ? (
                tasks.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <strong>{x.title}</strong>
                      {x.notes && <div className="micro muted">{x.notes}</div>}
                    </td>
                    <td>{x.kind}</td>
                    <td>{x.owner || 'Unassigned'}</td>
                    <td>{x.due}</td>
                    <td>
                      <StatusBadge value={x.status} />
                    </td>
                    <td>
                      {x.status === 'Open' ? (
                        <button
                          className="btn small light"
                          onClick={() => handleComplete(x.id)}
                          type="button"
                        >
                          Complete
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
                    <EmptyState message="No tasks currently assigned." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Assign a guided HR task"
        intro="The assignee receives an actionable work item and completion is logged."
      >
        <form onSubmit={handleAssignSubmit} className="form-stack">
          <div className="field-grid">
            <label>
              Task title
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Verify signed declaration"
                required
              />
            </label>

            <label>
              Task type
              <select value={taskKind} onChange={(e) => setTaskKind(e.target.value)}>
                <option value="HR Process">HR Process</option>
                <option value="HR Check">HR Check</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Learning">Learning</option>
              </select>
            </label>

            <label>
              Assigned to
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(Number(e.target.value))}
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.job})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Deadline
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </label>

            <label className="wide">
              Instructions
              <textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                maxLength={700}
                placeholder="Provide guidance or checklist instructions"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsAssignOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Assign task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
