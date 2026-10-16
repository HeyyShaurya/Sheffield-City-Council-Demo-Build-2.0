import React, { useState } from 'react';
import { User } from '../types';
import { store, ago } from '../store/sheffieldStore';
import { PageHead, StatusBadge, EmptyState } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface MessagesViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ user, onToast }) => {
  const messages = store.getMessages(user);
  const allUsers = store.getState().users;

  const canCompose = ['admin', 'hr', 'manager', 'service', 'recruiter', 'learning'].includes(user.role);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [forceNotify, setForceNotify] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const handleToggleRecipient = (id: number) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpenMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.read_at) {
      try {
        store.markMessageRead(msg.id, user);
      } catch {
        // Ignored
      }
    }
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipients.length) {
      onToast('Please select at least one recipient', true);
      return;
    }
    if (subject.length > 255) {
      onToast('Subject exceeds maximum 255 characters', true);
      return;
    }
    if (body.length > 4000) {
      onToast('Message body exceeds maximum 4,000 characters', true);
      return;
    }
    try {
      const res = store.sendMessage(subject, body, selectedRecipients, forceNotify, user);
      onToast(`Message queued privately for ${res.recipient_count} recipients; no emails sent`);
      setIsComposeOpen(false);
      setSelectedRecipients([]);
      setSubject('');
      setBody('');
      setForceNotify(false);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  const handleMarkRead = (messageId: number) => {
    try {
      store.markMessageRead(messageId, user);
      onToast('Message marked read');
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="Private message centre"
        kicker="INTERNAL COMMUNICATION / BCC-STYLE"
        desc="Recipients are private to each other, with optional forced notification recorded for local demo only."
        actions={
          canCompose && (
            <button className="btn primary" onClick={() => setIsComposeOpen(true)} type="button">
              + Compose message
            </button>
          )
        }
      />

      <div className="grid two">
        <div className="card">
          <div className="eyebrow">PRIVACY BY DESIGN</div>
          <h3>Private recipient list</h3>
          <p className="small muted">
            To behaves like BCC: recipients receive a message but cannot view other recipient identities.
          </p>
        </div>

        <div className="card">
          <div className="eyebrow">COMMUNICATION CONTROLS</div>
          <h3>255 / 4,000-character limits</h3>
          <p className="small muted">
            Subject is limited to 255 characters, message to 4,000. Notification override is queued, not emailed.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>My inbox</h3>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>From</th>
                <th>Received</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.length ? (
                messages.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <button
                        className="btn subtle small"
                        style={{ padding: 0, fontWeight: 800, textAlign: 'left', color: '#1B4D89' }}
                        onClick={() => handleOpenMessage(x)}
                        type="button"
                        title="Click to read full message"
                      >
                        ✉ {x.subject}
                      </button>
                      <div className="small muted">
                        {x.body.slice(0, 110)}
                        {x.body.length > 110 ? '...' : ''}
                      </div>
                    </td>
                    <td>{x.sender}</td>
                    <td>{ago(x.created)}</td>
                    <td>
                      <StatusBadge value={x.read_at ? 'Read' : 'Unread'} />
                    </td>
                    <td>
                      <span className="inline-actions">
                        <button
                          className="btn ghost small"
                          onClick={() => handleOpenMessage(x)}
                          type="button"
                        >
                          Read
                        </button>
                        {!x.read_at && (
                          <button
                            className="btn light small"
                            onClick={() => handleMarkRead(x.id)}
                            type="button"
                          >
                            Mark read
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState message="No messages in your inbox. Switch personas to compose and send messages." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose private message"
        intro="To is BCC-style; all recipient identities remain hidden from other recipients."
      >
        <form onSubmit={handleSendSubmit} className="form-stack">
          <label>
            To - private recipients
            <span className="small muted">Select recipients below</span>
            <span className="checkgrid">
              {allUsers
                .filter((u) => u.id !== user.id)
                .map((u) => (
                  <label key={u.id}>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(u.id)}
                      onChange={() => handleToggleRecipient(u.id)}
                    />
                    {u.name} ({u.job})
                  </label>
                ))}
            </span>
          </label>

          <label>
            Subject (maximum 255 characters)
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={255}
              placeholder="Private team communication"
              required
            />
          </label>

          <label>
            Message (maximum 4,000 characters)
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={4000}
              rows={7}
              placeholder="Enter message body..."
              required
            />
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={forceNotify}
              onChange={(e) => setForceNotify(e.target.checked)}
            />
            Send notification irrespective of recipient preference (mock queue only)
          </label>

          <div className="note">
            Draft long messages outside the app before pasting. Live email delivery is not configured.
          </div>

          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Send private message
            </button>
          </div>
        </form>
      </Modal>

      {/* View Message Modal */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={selectedMessage.subject}
          intro={`From: ${selectedMessage.sender} • Received: ${ago(selectedMessage.created)}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12, fontSize: 12 }}>
              <div><strong>Sender:</strong> {selectedMessage.sender}</div>
              <div><strong>Sent:</strong> {selectedMessage.created}</div>
              <div style={{ color: '#005A36', marginTop: 4, fontWeight: 700 }}>
                🔒 Privacy: Message received via private BCC delivery. Other recipient identities are withheld.
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block' }}>
                Message Content
              </label>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 13,
                  lineHeight: 1.6,
                  maxHeight: 320,
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  color: '#1E293B',
                }}
              >
                {selectedMessage.body}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn primary" onClick={() => setSelectedMessage(null)} type="button">
                Close Message
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
