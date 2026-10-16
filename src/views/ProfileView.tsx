import React, { useState } from 'react';
import { User } from '../types';
import { store, fmt, initials } from '../store/sheffieldStore';
import { PageHead } from '../components/CommonUI';
import { Modal } from '../components/Modal';

interface ProfileViewProps {
  user: User;
  onToast: (msg: string, isError?: boolean) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onToast }) => {
  const profile = store.getProfile(user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');
  const [emergencyContact, setEmergencyContact] = useState(profile.emergency_contact || '');

  const handleOpenEdit = () => {
    setPhone(profile.phone || '');
    setAddress(profile.address || '');
    setEmergencyContact(profile.emergency_contact || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      store.updateProfile(user.id, phone, address, emergencyContact);
      onToast('Personal details updated');
      setIsModalOpen(false);
    } catch (err: any) {
      onToast(err.message, true);
    }
  };

  return (
    <div>
      <PageHead
        title="My employee profile"
        kicker="EMPLOYEE SELF-SERVICE / PERSONAL INFORMATION"
        desc="Review your position and update your own contact details, with an audit record."
        actions={
          <button className="btn primary" onClick={handleOpenEdit} type="button">
            Edit contact details
          </button>
        }
      />

      <div className="grid two">
        <div className="card">
          <div className="eyebrow">CURRENT POSITION</div>
          <div className="row" style={{ marginBottom: 22 }}>
            <div className="avatar" style={{ height: 56, width: 56, fontSize: 20 }}>
              {initials(user.name)}
            </div>
            <div>
              <h2>{user.name}</h2>
              <div className="small muted">{user.job}</div>
            </div>
          </div>

          {[
            ['Department', user.department],
            ['Grade', user.grade],
            ['Cost centre', user.cost_center],
            ['Full-time equivalent', fmt(user.fte)],
            ['Email', user.email],
          ].map(([label, val]) => (
            <div
              key={label}
              className="row space"
              style={{ padding: '12px 0', borderBottom: '1px solid #eaf0f5' }}
            >
              <span className="muted">{label}</span>
              <strong className="small">{val}</strong>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="eyebrow">CONTACT DETAILS</div>
          <h3>Your personal information</h3>
          <p className="card-sub">Changes are persisted to the same employee identity used across the demo.</p>

          {[
            ['Telephone', profile.phone || 'Not provided'],
            ['Address', profile.address || 'Not provided'],
            ['Emergency contact', profile.emergency_contact || 'Not provided'],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{ padding: '16px 0', borderBottom: '1px solid #eaf0f5' }}
            >
              <div className="micro muted">{label}</div>
              <strong>{val}</strong>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update personal details"
        intro="Your changes are recorded against your own employee record."
      >
        <form onSubmit={handleSave} className="form-stack">
          <label>
            Contact telephone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={50}
              placeholder="e.g. 0114 273 4567"
            />
          </label>
          <label>
            Postal address
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={280}
              placeholder="e.g. 42 Peace Gardens, Sheffield, S1 2HH"
            />
          </label>
          <label>
            Emergency contact
            <input
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              maxLength={140}
              placeholder="e.g. Tariq Khan (Spouse) - 07700 900123"
            />
          </label>
          <div className="form-actions">
            <button className="btn ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save contact details
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
