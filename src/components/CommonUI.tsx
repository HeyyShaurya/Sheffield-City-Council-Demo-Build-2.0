import React from 'react';

export const StatusBadge: React.FC<{ value?: string | null }> = ({ value }) => {
  const t = String(value ?? '');
  const good = /approved|complete|onboarded|finalised|published|delivered|accepted|booked/i.test(t);
  const bad = /reject|withdraw|failed|closed/i.test(t);
  const warn = /pending|draft|queued|submitted|offered/i.test(t);
  const variant = good ? 'good' : bad ? 'bad' : warn ? 'warn' : 'blue';

  return <span className={`badge ${variant}`}>{t}</span>;
};

export const PageHead: React.FC<{
  title: string;
  kicker: string;
  desc: string;
  actions?: React.ReactNode;
}> = ({ title, kicker, desc, actions }) => {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{kicker}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {actions && <div className="head-actions">{actions}</div>}
    </div>
  );
};

export const EmptyState: React.FC<{ message?: string; icon?: string }> = ({
  message = 'No records yet. Try completing a transaction to see connected data here.',
  icon = '○',
}) => {
  return (
    <div className="blank-state">
      <span className="empty-icon">{icon}</span>
      <strong>No records yet</strong>
      <div>{message}</div>
    </div>
  );
};
