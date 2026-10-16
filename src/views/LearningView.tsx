import React from 'react';
import { User } from '../types';
import { store, fmt, ago } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';

interface LearningViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({ user, onToast }) => {
  const { courses, enrolments } = store.getLearning(user);

  const handleEnrol = (courseId: number) => {
    try {
      store.enrolCourse(courseId, user);
      onToast('Course booking confirmed');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleComplete = (enrolmentId: number) => {
    try {
      store.completeCourse(enrolmentId, user);
      onToast('Completion entered in learning record');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Learning & development"
        kicker="LEARNING / CONNECTED EMPLOYEE RECORD"
        desc="Search available courses, enrol, record completion, and view team learning activity."
      />

      <div className="grid two">
        {courses.map((c) => {
          const isEnrolled = enrolments.some(
            (e) => e.course_id === c.id && e.employee_id === user.id && e.status !== 'Cancelled'
          );

          return (
            <div key={c.id} className="card">
              <div className="row space">
                <span className="badge blue">{c.category}</span>
                <span className="small muted">{fmt(c.hours)} learning hours</span>
              </div>
              <h3 style={{ marginTop: 15 }}>{c.title}</h3>
              <p className="small muted">{c.description}</p>
              <div className="row space" style={{ marginTop: 20 }}>
                <span className="small muted">
                  {c.booked} / {c.seats} enrolled
                </span>
                <button
                  className="btn light small"
                  disabled={isEnrolled}
                  onClick={() => handleEnrol(c.id)}
                  type="button"
                >
                  {isEnrolled ? 'Already enrolled' : 'Book course'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-top">
          <h2>Learning records</h2>
          <span>Self and permitted team activity</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Course</th>
                <th>Booked</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolments.length ? (
                enrolments.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.employee}</strong>
                    </td>
                    <td>{e.course}</td>
                    <td>{ago(e.created)}</td>
                    <td>
                      <StatusBadge value={e.status} />
                    </td>
                    <td>
                      {e.status === 'Enrolled' ? (
                        <button
                          className="btn light small"
                          onClick={() => handleComplete(e.id)}
                          type="button"
                        >
                          Record completion
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
                    <EmptyState message="No learning activity recorded yet. Book a course from the catalogue above." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
