import React, { useState } from 'react';
import { User } from '../types';
import { store } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface DocumentsViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ user, onToast }) => {
  const docs = store.getDocuments(user);
  const allUsers = store.getState().users;
  const isHR = ['hr', 'admin'].includes(user.role);
  const isAdmin = user.role === 'admin';

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [targetEmpId, setTargetEmpId] = useState<number>(user.id);
  const [docType, setDocType] = useState('Signed declaration');
  const [retentionUntil, setRetentionUntil] = useState('2033-12-31');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      onToast('Please select a file to upload', true);
      return;
    }
    try {
      store.uploadDocument(user, targetEmpId, fileName, docType, retentionUntil, fileContent);
      onToast('Document saved with retention rules');
      setIsUploadOpen(false);
      setFileName('');
      setFileContent('');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const [viewingDoc, setViewingDoc] = useState<any | null>(null);

  const handleOpenView = (doc: any) => {
    try {
      const auditedDoc = store.getDocument(doc.id, user);
      setViewingDoc(auditedDoc);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Permanently remove document record "${name}" from active governance registry?`)) return;
    try {
      store.deleteDocument(id, user);
      onToast(`Document record "${name}" deleted`);
      if (viewingDoc?.id === id) setViewingDoc(null);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleArchive = (id: number) => {
    if (!window.confirm('Archive this document?')) return;
    try {
      store.archiveDocument(id, user);
      onToast('Document archived');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleSimulateExpiry = (id: number) => {
    if (
      !window.confirm(
        'Set this ARCHIVED demo record retention to yesterday for retention-purge demonstration? No production retention rules will be changed.'
      )
    )
      return;
    try {
      store.simulateDocumentExpiry(id, user);
      onToast('Demo retention expiry simulated; run eligible purge');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handlePurge = () => {
    if (!window.confirm('Purge archived documents whose retention dates have passed?')) return;
    try {
      const count = store.purgeDocuments(user);
      onToast(`${count} eligible documents purged`);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleDownload = (doc: any) => {
    const content = doc.file_content || 'Sheffield City Council - Confidential Document Record';
    const blob = new Blob([content], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast(`Downloaded: ${doc.name}`);
  };

  const selectableEmployees = isHR ? allUsers : allUsers.filter((u) => u.id === user.id);

  return (
    <div>
      <PageHead
        title="Employee document records"
        kicker="USE CASE 04 / DOCUMENT GOVERNANCE"
        desc="Controlled upload, classified records, employee visibility, retention and scheduled archive/purge."
        actions={
          <button className="btn primary" onClick={() => setIsUploadOpen(true)} type="button">
            + Upload document
          </button>
        }
      />

      <div className="grid two">
        <div className="card">
          <div className="eyebrow">SAFE RECORD STORAGE</div>
          <h3>Confidential employee files</h3>
          <p className="small muted">
            Only employees and authorised People Services can access documents. Every view, download and upload is audited.
          </p>
        </div>

        <div className="card">
          <div className="eyebrow">RETENTION CONTROL</div>
          <h3>Archive before eligible purge</h3>
          <p className="small muted">
            Purge requires both expiry of the retention date and archive status, with an immutable audit log entry.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-top">
          <h2>Document register ({docs.length} active records)</h2>
          {isHR && (
            <button className="btn small ghost" onClick={handlePurge} type="button">
              Run eligible purge
            </button>
          )}
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>File / employee</th>
                <th>Classification</th>
                <th>Retention until</th>
                <th>Record state</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length ? (
                docs.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <button
                        className="btn subtle small"
                        style={{ padding: 0, fontWeight: 800, textAlign: 'left', color: '#1B4D89' }}
                        onClick={() => handleOpenView(a)}
                        type="button"
                        title="Click to preview document contents"
                      >
                        📄 {a.name}
                      </button>
                      <div className="micro muted">{a.employee} &bull; {a.file_size || '32.0 KB'}</div>
                    </td>
                    <td>
                      <span className="badge blue">{a.doc_type}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace' }}>{a.retention_until}</span>
                    </td>
                    <td>
                      <StatusBadge value={a.archived ? 'Archived' : 'Active'} />
                    </td>
                    <td>
                      <span className="inline-actions">
                        <button
                          className="btn ghost small"
                          onClick={() => handleOpenView(a)}
                          type="button"
                          title="Preview document"
                        >
                          View
                        </button>
                        <button
                          className="btn light small"
                          onClick={() => handleDownload(a)}
                          type="button"
                          title="Download document file"
                        >
                          Download
                        </button>
                        {isHR && !a.archived && (
                          <button
                            className="btn ghost small"
                            onClick={() => handleArchive(a.id)}
                            type="button"
                          >
                            Archive
                          </button>
                        )}
                        {isAdmin && a.archived && (
                          <button
                            className="btn light small"
                            onClick={() => handleSimulateExpiry(a.id)}
                            type="button"
                          >
                            Simulate expiry
                          </button>
                        )}
                        {(isHR || a.employee_id === user.id) && (
                          <button
                            className="btn danger small"
                            onClick={() => handleDelete(a.id, a.name)}
                            type="button"
                            title="Delete document"
                          >
                            Delete
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState message="No documents stored yet. Upload a sample document with '+ Upload document'." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="note" style={{ marginTop: 15 }}>
        This prototype enforces role-based file access and retention transitions locally. Formal GDPR compliance,
        legal holds, production encryption, and retention policy validation require a deployed implementation.
      </div>

      {/* Document View Preview Modal */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={`Document Preview: ${viewingDoc.name}`}
          intro={`Classification: ${viewingDoc.doc_type} • Employee: ${viewingDoc.employee}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12 }}>
                <div><strong>Employee:</strong> {viewingDoc.employee} (ID #{viewingDoc.employee_id})</div>
                <div><strong>Classification:</strong> {viewingDoc.doc_type}</div>
                <div><strong>Retention Schedule:</strong> Until {viewingDoc.retention_until}</div>
                <div><strong>Governance State:</strong> {viewingDoc.archived ? 'Archived' : 'Active'}</div>
                <div><strong>Storage Name:</strong> <code style={{ fontSize: 11 }}>{viewingDoc.stored_name}</code></div>
                <div><strong>Uploaded:</strong> {viewingDoc.created}</div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block' }}>
                Document Content Preview
              </label>
              <pre
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: 16,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  lineHeight: 1.6,
                  maxHeight: 280,
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  color: '#1E293B',
                }}
              >
                {viewingDoc.file_content || 'No text content available.'}
              </pre>
            </div>

            <div className="form-actions" style={{ justifyContent: 'space-between' }}>
              <div>
                {(isHR || viewingDoc.employee_id === user.id) && (
                  <button
                    className="btn danger small"
                    onClick={() => handleDelete(viewingDoc.id, viewingDoc.name)}
                    type="button"
                  >
                    Delete document
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn light" onClick={() => handleDownload(viewingDoc)} type="button">
                  Download file
                </button>
                <button className="btn ghost" onClick={() => setViewingDoc(null)} type="button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload employee document"
        intro="Files are private, classified and governed by a retention date. Maximum 5 MB."
      >
        <form onSubmit={handleUploadSubmit} className="form-stack">
          <label>
            Employee
            <select
              value={targetEmpId}
              onChange={(e) => setTargetEmpId(Number(e.target.value))}
            >
              {selectableEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.job})
                </option>
              ))}
            </select>
          </label>

          <label>
            Document classification
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="Employment">Employment</option>
              <option value="Signed declaration">Signed declaration</option>
              <option value="Identity verification">Identity verification</option>
              <option value="Learning certificate">Learning certificate</option>
              <option value="Payroll document">Payroll document</option>
            </select>
          </label>

          <label>
            Retention until
            <input
              type="date"
              value={retentionUntil}
              onChange={(e) => setRetentionUntil(e.target.value)}
              required
            />
          </label>

          <label>
            File (PDF, DOCX, TXT, PNG, JPEG)
            <input
              type="file"
              accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </label>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Upload document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
