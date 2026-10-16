import React from 'react';
import { User, Role } from '../types';
import { SheffieldLogo } from './SheffieldLogo';

export const NAV_ITEMS = [
  { key: 'overview', title: 'Dashboard', icon: '▦' },
  { key: 'profile', title: 'My profile', icon: '👤' },
  { key: 'leave', title: 'Absence & leave', icon: '◔' },
  { key: 'time', title: 'Time & attendance', icon: '⏱' },
  { key: 'org', title: 'Organisation', icon: '☵' },
  { key: 'recruit', title: 'Recruitment & talent', icon: '▷' },
  { key: 'documents', title: 'Document records', icon: '▨' },
  { key: 'tasks', title: 'HR journeys & tasks', icon: '☑' },
  { key: 'learning', title: 'Learning hub', icon: '☆' },
  { key: 'payroll', title: 'Payroll & payslips', icon: '£' },
  { key: 'reports', title: 'Workforce insights', icon: '◕' },
  { key: 'optional', title: 'Modernisations & claims', icon: '⚙' },
  { key: 'integrations', title: 'Integration control', icon: '⇄' },
  { key: 'audit', title: 'Audit & governance', icon: '≡' },
  { key: 'messages', title: 'Private messaging', icon: '✉' },
  { key: 'guide', title: 'Demo Run-of-Show (6 Use Cases)', icon: '📖' },
  { key: 'matrix', title: 'Requirements Matrix (47 Processes)', icon: '📋' },
];

export const NAV_DEMO_ITEMS: { key: string; title: string; icon: string }[] = [];

// Strict role-based permissions to guarantee tailored experience per persona
const ALL_ROLES: Role[] = ['employee', 'manager', 'hr', 'payroll', 'learning', 'service', 'admin', 'recruiter'];

const PERMISSIONS: Record<string, Role[]> = {
  overview: ALL_ROLES,
  profile: ALL_ROLES,
  leave: ALL_ROLES,
  time: ALL_ROLES,
  org: ALL_ROLES,
  recruit: ['recruiter', 'manager', 'hr', 'service', 'admin'],
  documents: ALL_ROLES,
  tasks: ALL_ROLES,
  learning: ALL_ROLES,
  payroll: ALL_ROLES, // Payroll runs it; employees view own payslips; admin/hr inspect
  reports: ['manager', 'service', 'hr', 'payroll', 'recruiter', 'admin'],
  optional: ALL_ROLES, // Expenses & Casework
  integrations: ['admin', 'hr'],
  audit: ['admin', 'hr', 'service', 'payroll'],
  messages: ALL_ROLES,
  guide: ALL_ROLES,
  matrix: ALL_ROLES,
};

export function canAccess(page: string, role?: Role): boolean {
  if (!role) return false;
  if (role === 'admin') return true; // Administrator has full system oversight across all views
  const allowed = PERMISSIONS[page];
  return !allowed || allowed.includes(role);
}

interface SidebarProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onSwitchPersona: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentPage,
  onNavigate,
  onSwitchPersona,
  isOpen,
  onCloseMobile,
}) => {
  const handleItemClick = (page: string) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="brand" style={{ padding: '24px 20px 20px' }}>
        <SheffieldLogo size="md" variant="white" subText="Sheffield Connect" />
      </div>

      <div className="workspace-tag" style={{ margin: '0 16px 20px', background: '#0B3322', borderColor: '#17593B' }}>
        <span className="pulse" style={{ background: '#55E59C' }}></span> Connected People Platform
      </div>

      <div className="navscroll">
        <div className="nav-group-label">WORKSPACE &bull; {user.role.toUpperCase()}</div>
        <nav aria-label="Main navigation">
          {NAV_ITEMS.filter((item) => canAccess(item.key, user.role)).map((item) => (
            <button
              key={item.key}
              type="button"
              className={`navlink ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => handleItemClick(item.key)}
            >
              <span className="nav-symbol">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="foot-card" style={{ background: '#0D3826', borderColor: '#17593B' }}>
          <div>Sheffield City Council</div>
          <strong>HR, Payroll &amp; Learning</strong>
          <small>Municipal Workplace Services</small>
        </div>
        <button
          className="sidebar-switch"
          onClick={onSwitchPersona}
          type="button"
        >
          ⇄ &nbsp; Change persona
        </button>
      </div>
    </aside>
  );
};
