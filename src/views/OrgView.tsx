import React from 'react';
import { User } from '../types';
import { store, fmt } from '../store/sheffieldStore';
import { PageHead, StatusBadge } from '../components/CommonUI';

interface OrgViewProps {
  user: User;
}

export const OrgView: React.FC<OrgViewProps> = ({ user }) => {
  const { people, rollups } = store.getOrgHierarchy(user);
  const allUsers = store.getState().users;

  return (
    <div>
      <PageHead
        title="Organisation & position hierarchy"
        kicker="USE CASE 02 / ESTABLISHMENT"
        desc="Review the management structure and post attributes, with live headcount and FTE roll-ups."
      />

      <div className="card">
        <div className="section-top">
          <h2>Reporting lines</h2>
          <span>{people.length} visible positions under your security profile</span>
        </div>

        <div className="org-row">
          {people.map((p) => {
            const mgr = allUsers.find((u) => u.id === p.manager_id);
            return (
              <div key={p.id} className="org-node">
                <strong>{p.name}</strong>
                <small>
                  {p.job} / {p.grade}
                </small>
                <div className="row space" style={{ marginTop: 12 }}>
                  <span className="micro muted">{p.department}</span>
                  <StatusBadge value={`FTE ${fmt(p.fte)}`} />
                </div>
                <small>Cost centre {p.cost_center}</small>
                <small>
                  Reports to: {mgr ? mgr.name : 'Protected / top of hierarchy'}
                </small>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: 19 }}>
        <div className="section-top">
          <h2>Establishment summary</h2>
          <span>Aggregates update when a candidate becomes a worker</span>
        </div>

        {rollups.length > 0 ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Directorate / service</th>
                  <th>Cost centre</th>
                  <th>Headcount</th>
                  <th>Total FTE</th>
                </tr>
              </thead>
              <tbody>
                {rollups.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{r.department}</strong>
                    </td>
                    <td>{r.cost_center}</td>
                    <td>{fmt(r.headcount)}</td>
                    <td>{fmt(r.fte)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="note">Detailed cost-centre roll-ups require manager, service or HR permissions.</div>
        )}
      </div>
    </div>
  );
};
