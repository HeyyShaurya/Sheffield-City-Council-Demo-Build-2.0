import React from 'react';
import { User } from '../types';
import { store, ago } from '../store/sheffieldStore';
import { PageHead, EmptyState } from '../components/CommonUI';

interface AuditViewProps {
  user: User;
}

export const AuditView: React.FC<AuditViewProps> = ({ user }) => {
  const auditList = store.getAudit(user);

  return (
    <div>
      <PageHead
        title="Audit evidence"
        kicker="GOVERNANCE / ACTION TRACEABILITY"
        desc="Every significant mutation captures actor, operation, entity and UTC timestamp."
      />

      <div className="card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Record</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {auditList.length ? (
                auditList.map((r) => (
                  <tr key={r.id}>
                    <td>{ago(r.created)}</td>
                    <td>
                      <strong>{r.actor}</strong>
                    </td>
                    <td>{r.action}</td>
                    <td>
                      {r.entity} #{r.entity_id}
                    </td>
                    <td>{r.detail || '--'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState message="No audit records available under your current security role." />
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
