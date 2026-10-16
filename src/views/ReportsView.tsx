import React, { useState } from 'react';
import { User } from '../types';
import { store, fmt } from '../store/sheffieldStore';
import { PageHead } from '../components/CommonUI';

interface ReportsViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ user, onToast }) => {
  const [group, setGroup] = useState<'department' | 'cost_center' | 'grade'>('department');
  const [metric, setMetric] = useState<'headcount' | 'fte' | 'salary'>('headcount');
  const [filterText, setFilterText] = useState('');

  const report = store.getReport(group, metric, filterText, user);
  const maxVal = Math.max(1, ...report.items.map((i) => i.value));
  const canViewSalary = ['admin', 'hr', 'payroll', 'service'].includes(user.role);

  const handleExportCSV = () => {
    try {
      const rows = [
        ['Group', `Value (${report.metric})`],
        ...report.items.map((item) => [item.label, String(item.value)]),
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `sheffield-${report.group}-${report.metric}-report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onToast('CSV export downloaded');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Workforce insights"
        kicker="USE CASE 06 / MANAGEMENT INFORMATION"
        desc="Build your own summary using safe filters, drill into service aggregates and export the result."
        actions={
          <button className="btn ghost" onClick={handleExportCSV} type="button">
            Export CSV &darr;
          </button>
        }
      />

      <div className="card">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="field-grid"
          style={{ gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end' }}
        >
          <label>
            Group by
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as any)}
            >
              <option value="department">Service / department</option>
              <option value="cost_center">Cost centre</option>
              <option value="grade">Pay grade</option>
            </select>
          </label>

          <label>
            Measure
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as any)}
            >
              <option value="headcount">Headcount</option>
              <option value="fte">FTE</option>
              {canViewSalary && <option value="salary">Annual pay (restricted)</option>}
            </select>
          </label>

          <label>
            Find / filter
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="e.g. Social Care"
            />
          </label>

          <button
            className="btn primary"
            type="button"
            onClick={() => onToast('Filters applied')}
          >
            Apply filters
          </button>
        </form>
      </div>

      <div className="grid two" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-top">
            <h2>Live workforce distribution</h2>
            <span>{report.items.length} groups</span>
          </div>

          <div className="report-bars">
            {report.items.length ? (
              report.items.map((a, i) => (
                <div key={i} className="report-bar">
                  <span className="ellipsis" title={a.label}>
                    {a.label}
                  </span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${Math.max(2, (a.value / maxVal) * 100)}%` }}
                    ></div>
                  </div>
                  <strong>{fmt(a.value)}</strong>
                </div>
              ))
            ) : (
              <div className="small muted">No records matching this filter</div>
            )}
          </div>

          <div style={{ marginTop: 20 }} className="note">
            <strong>What is changing?</strong> Approving leave changes absence status; onboarding a candidate adds a
            worker record and updates FTE/headcount rollups automatically.
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Combined {report.metric}</div>
          <div className="stat-num" style={{ fontSize: 36, margin: '12px 0', fontFamily: 'Manrope, sans-serif' }}>
            {fmt(report.total)}
          </div>
          <div className="note">Current permitted sample data, computed directly from the application database.</div>

          <div style={{ marginTop: 22 }}>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items.map((a, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{a.label}</strong>
                      </td>
                      <td>{fmt(a.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
