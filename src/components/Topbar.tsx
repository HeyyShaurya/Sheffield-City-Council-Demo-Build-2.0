import React from 'react';
import { User } from '../types';
import { initials, ROLE_LABELS } from '../store/sheffieldStore';
import { NAV_ITEMS, NAV_DEMO_ITEMS } from './Sidebar';

interface TopbarProps {
  user: User | null;
  isPublicMode: boolean;
  currentPage: string;
  onToggleMobileMenu: () => void;
  onRefresh: () => void;
  onSwitchPersona?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  isPublicMode,
  currentPage,
  onToggleMobileMenu,
  onRefresh,
  onSwitchPersona,
  onOpenAiAssistant,
}) => {
  const getPageTitle = () => {
    if (isPublicMode) return 'Public careers';
    const all = [...NAV_ITEMS, ...NAV_DEMO_ITEMS];
    const match = all.find((item) => item.key === currentPage);
    return match ? match.title : 'Workspace';
  };

  const displayName = isPublicMode ? 'Public careers' : user?.name || 'Guest';
  const displayRole = isPublicMode ? 'Candidate portal' : user ? ROLE_LABELS[user.role] || user.role : '';
  const displayInitials = isPublicMode ? 'CP' : initials(user?.name);

  return (
    <header className="topbar">
      <div className="top-left">
        {!isPublicMode && (
          <button
            className="iconbtn mobile-menu"
            onClick={onToggleMobileMenu}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>
        )}
        <div className="crumb">
          SHEFFIELD / <span>{getPageTitle()}</span>
        </div>
      </div>

      <div className="top-right">
        {/* Sandbox Demo badge completely removed as requested */}

        {!isPublicMode && onOpenAiAssistant && (
          <button
            className="btn small light"
            onClick={onOpenAiAssistant}
            type="button"
            title="Open Conversational AI Agent"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, borderRadius: 8 }}
          >
            <span style={{ fontSize: 14 }}>✦</span>
            <span>Sheffield AI</span>
          </button>
        )}

        <button
          className="iconbtn"
          onClick={onRefresh}
          title="Refresh current page"
          type="button"
        >
          ↻
        </button>

        <div
          className="avatar-name"
          onClick={onSwitchPersona}
          style={{ cursor: onSwitchPersona ? 'pointer' : 'default' }}
          title={onSwitchPersona ? 'Click to change persona' : undefined}
        >
          <div className="avatar">{displayInitials}</div>
          <div className="user-label">
            <strong>{displayName}</strong>
            <small>{displayRole}</small>
          </div>
        </div>
      </div>
    </header>
  );
};
