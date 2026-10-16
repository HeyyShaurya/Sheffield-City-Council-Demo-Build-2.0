import React, { useState } from 'react';
import { store } from '../store/sheffieldStore';
import { PageHead, StatusBadge } from '../components/CommonUI';

export const MatrixView: React.FC = () => {
  const capabilities = store.getState().capabilities;
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const areas = ['All', ...Array.from(new Set(capabilities.map((c) => c.area)))];

  const filtered = capabilities.filter((c) => {
    const matchesArea = selectedArea === 'All' || c.area === selectedArea;
    const matchesSearch =
      !search ||
      c.process.toLowerCase().includes(search.toLowerCase()) ||
      c.area.toLowerCase().includes(search.toLowerCase()) ||
      c.demo_note.toLowerCase().includes(search.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Requirements coverage"
        kicker="SOURCE TRACEABILITY / RESPONSE TABLE 1"
        desc="All 47 Sheffield processes are captured using the submitted commercial classification. Demo-depth notes identify prototype boundaries."
      />

      <div className="grid three">
        <div className="card stat">
          <div className="stat-label">Submitted requirement processes</div>
          <div className="stat-num">{capabilities.length}</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Proposed baseline</div>
          <div className="stat-num">
            {capabilities.filter((c) => c.proposal === 'Standard Offer').length}
          </div>
        </div>
        <div className="card stat">
          <div className="stat-label">Additional-cost scope</div>
          <div className="stat-num">
            {capabilities.filter((c) => c.proposal === 'Additional Cost').length}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="row wrap space" style={{ marginBottom: 16 }}>
          <div className="cap-filter">
            {areas.map((a) => (
              <button
                key={a}
                className={`btn small ${selectedArea === a ? 'primary' : 'ghost'}`}
                onClick={() => setSelectedArea(a)}
                type="button"
              >
                {a}
              </button>
            ))}
          </div>

          <input
            style={{ maxWidth: 260 }}
            placeholder="Search processes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Capability area</th>
                <th>Requirement</th>
                <th>PCL proposal</th>
                <th>Demo evidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.area}</td>
                  <td>
                    <strong>{a.process}</strong>
                  </td>
                  <td>
                    <StatusBadge value={a.proposal} />
                  </td>
                  <td>
                    <span className="micro muted">{a.demo_depth}</span>
                    <div className="micro muted">{a.demo_note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
