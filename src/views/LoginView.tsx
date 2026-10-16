import React, { useState } from 'react';
import { User } from '../types';
import { ROLE_LABELS, initials } from '../store/sheffieldStore';
import { SheffieldLogo } from '../components/SheffieldLogo';

interface LoginViewProps {
  users: User[];
  onLogin: (userId: number, pin: string) => void;
  onExploreCareers: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onExploreCareers }) => {
  // First 10 users are primary personas
  const personas = users.slice(0, 10);
  const [selectedUserId, setSelectedUserId] = useState<number>(personas[0]?.id || 1);
  const [pin, setPin] = useState<string>('sheffield-demo');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personas' | 'credentials'>('personas');

  const selectedUser = users.find((u) => u.id === selectedUserId) || personas[0];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      onLogin(Number(selectedUserId), pin);
    } catch (err: any) {
      setError(err.message || 'Single Sign-On authentication failed');
    }
  };

  const handleQuickSignIn = (userId: number) => {
    setSelectedUserId(userId);
    setError(null);
    try {
      onLogin(userId, 'sheffield-demo');
    } catch (err: any) {
      setError(err.message || 'Single Sign-On authentication failed');
    }
  };

  return (
    <div className="login-page">
      {/* Left Council Brand Hero */}
      <div
        className="login-art"
        style={{
          background: 'radial-gradient(ellipse at 85% 25%, rgba(0, 150, 90, 0.38), transparent 50%), linear-gradient(155deg, #071F14 0%, #005A36 45%, #0B2545 100%)',
          color: '#FFFFFF',
          padding: '60px 8%',
        }}
      >
        <div className="login-art-content" style={{ maxWidth: 580 }}>
          <div style={{ marginBottom: 28 }}>
            <SheffieldLogo size="lg" variant="white" subText="Connected People Platform" />
          </div>

          <div className="caps" style={{ color: '#A3D9BE', letterSpacing: '0.15em' }}>
            SHEFFIELD CITY COUNCIL &bull; ENTERPRISE SSO
          </div>

          <h1
            className="hero-big"
            style={{
              fontSize: 'clamp(36px, 3.8vw, 62px)',
              margin: '20px 0',
              lineHeight: 1.15,
              fontWeight: 800,
            }}
          >
            One Connected
            <br />
            <em style={{ color: '#55E59C', fontStyle: 'normal' }}>Workplace Journey.</em>
          </h1>

          <p style={{ color: '#D2ECE0', fontSize: 15, lineHeight: 1.7, maxWidth: 500 }}>
            Unified human resources, talent acquisition, payroll calculations, and compliance learning built around Sheffield City Council&apos;s priority modernisation flows.
          </p>

          <div
            className="orbit-cards"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              margin: '36px 0 28px',
            }}
          >
            {['Recruit', 'Onboard', 'Self-Service', 'Timesheets', 'Pay', 'Learn', 'Audit'].map((tag) => (
              <span
                key={tag}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 20,
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#FFFFFF',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 12,
              color: '#A3D9BE',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: 18,
            }}
          >
            <span style={{ fontSize: 16 }}>🛡</span>
            <span>
              Microsoft Entra ID &bull; Secure Enterprise Single Sign-On
            </span>
          </div>
        </div>
      </div>

      {/* Right Single Sign-On Portal */}
      <div className="login-form-wrap" style={{ padding: '36px 8%', background: '#F8FAFC' }}>
        <div className="login-form" style={{ maxWidth: 460, width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <SheffieldLogo size="md" variant="dark" subText="Identity Platform" />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#E6F4EA',
                color: '#005A36',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <span>●</span> Microsoft Entra ID
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#102C50', margin: 0 }}>
              Staff &amp; Partner Sign In
            </h2>
            <p className="muted" style={{ margin: '6px 0 0', fontSize: 13 }}>
              Access your role-permitted workspace via Sheffield City Council Single Sign-On.
            </p>
          </div>

          {error && (
            <div className="note error" style={{ marginBottom: 16, borderRadius: 8 }}>
              {error}
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#E2E8F0',
              padding: 3,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('personas')}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                background: activeTab === 'personas' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'personas' ? '#005A36' : '#64748B',
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: activeTab === 'personas' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              One-Click Persona SSO
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                background: activeTab === 'credentials' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'credentials' ? '#005A36' : '#64748B',
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: activeTab === 'credentials' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              Corporate Email Login
            </button>
          </div>

          {activeTab === 'personas' ? (
            /* Quick One-Click Persona SSO Selector */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="small muted" style={{ marginBottom: 4 }}>
                Choose a pre-configured Sheffield persona to experience their tailored landing view:
              </div>

              <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
                {personas.slice(0, 7).map((p) => {
                  const roleBadgeColor =
                    p.role === 'employee'
                      ? '#005A36'
                      : p.role === 'manager'
                      ? '#D97706'
                      : p.role === 'recruiter'
                      ? '#7C3AED'
                      : p.role === 'hr'
                      ? '#2563EB'
                      : p.role === 'payroll'
                      ? '#0D9488'
                      : '#1F2937';

                  return (
                    <button
                      key={p.id}
                      onClick={() => handleQuickSignIn(p.id)}
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#FFFFFF',
                        border: '1px solid #D5E1EC',
                        borderRadius: 10,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border 0.15s, transform 0.12s, box-shadow 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#005A36';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,90,54,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#D5E1EC';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: roleBadgeColor,
                            color: '#FFFFFF',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 13,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {initials(p.name)}
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: '#172C46', fontSize: 14 }}>
                            {p.name}
                          </strong>
                          <span style={{ fontSize: 11, color: '#64748B' }}>
                            {p.job} &bull; <strong style={{ color: roleBadgeColor }}>{ROLE_LABELS[p.role] || p.role}</strong>
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#005A36',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        Sign In &rarr;
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Traditional Microsoft Entra ID Form */
            <form onSubmit={handleSubmit} className="form-stack">
              <label>
                Staff Persona Profile
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  required
                >
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} &mdash; {ROLE_LABELS[p.role] || p.role} ({p.job})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Council Corporate Email
                <input
                  type="email"
                  value={selectedUser.email}
                  readOnly
                  style={{ background: '#F1F5F9', color: '#475569' }}
                />
              </label>

              <label>
                Entra ID Demo MFA Code
                <input
                  type="password"
                  autoComplete="off"
                  placeholder="Enter MFA code"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </label>

              <button
                className="btn full"
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #005A36, #0D3826)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  padding: 12,
                  marginTop: 6,
                }}
              >
                Sign in with Sheffield Entra ID &rarr;
              </button>
            </form>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              onClick={onExploreCareers}
              className="btn subtle full"
              type="button"
              style={{
                borderColor: '#D5E1EC',
                color: '#1E3A5F',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Public Careers Portal (No sign-in required)
            </button>
          </div>

          <div
            className="login-note"
            style={{
              marginTop: 24,
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              padding: 14,
              fontSize: 11,
              color: '#64748B',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: '#005A36', display: 'block', marginBottom: 2 }}>
              🔒 Protected by Sheffield City Council Identity Federation
            </strong>
            Official municipal identity gateway for Sheffield City Council staff and authorised partners. Access is governed by council cyber governance policies.
          </div>
        </div>
      </div>
    </div>
  );
};
