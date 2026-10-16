import React, { useState, useEffect } from 'react';
import { store, ROLE_LABELS } from './store/sheffieldStore';
import { canAccess, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
import { Modal } from './components/Modal';
import { AiAssistantWidget } from './components/AiAssistantWidget';

// Views
import { LoginView } from './views/LoginView';
import { OverviewView } from './views/OverviewView';
import { ProfileView } from './views/ProfileView';
import { LeaveView } from './views/LeaveView';
import { TimesheetsView } from './views/TimesheetsView';
import { OrgView } from './views/OrgView';
import { RecruitView } from './views/RecruitView';
import { CandidatePortalView } from './views/CandidatePortalView';
import { DocumentsView } from './views/DocumentsView';
import { TasksView } from './views/TasksView';
import { LearningView } from './views/LearningView';
import { PayrollView } from './views/PayrollView';
import { ReportsView } from './views/ReportsView';
import { OptionalView } from './views/OptionalView';
import { IntegrationsView } from './views/IntegrationsView';
import { MessagesView } from './views/MessagesView';
import { GuideView } from './views/GuideView';
import { MatrixView } from './views/MatrixView';
import { AuditView } from './views/AuditView';

export const App: React.FC = () => {
  const [, setTick] = useState(0);
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [isPublicMode, setIsPublicMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsError, setToastIsError] = useState<boolean>(false);
  const [isSwitchPersonaModalOpen, setIsSwitchPersonaModalOpen] = useState<boolean>(false);

  // Subscribe to store updates
  useEffect(() => {
    return store.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  const user = store.currentUser;
  const allUsers = store.getState().users;
  const personas = allUsers.slice(0, 10);

  const showToast = (msg: string, isError: boolean = false) => {
    setToastMessage(msg);
    setToastIsError(isError);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  const handleNavigate = (page: string) => {
    if (user && !canAccess(page, user.role)) {
      showToast('This work area is restricted for your demo persona.', true);
      return;
    }
    setIsPublicMode(false);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userId: number, pin: string) => {
    store.login(userId, pin);
    setIsPublicMode(false);
    setCurrentPage('overview');
    showToast(`Signed in as ${store.currentUser?.name} (${ROLE_LABELS[store.currentUser?.role || 'employee']})`);
  };

  const handleSelectPersona = (userId: number) => {
    const selected = allUsers.find((u) => u.id === userId);
    if (selected) {
      store.setCurrentUser(selected);
      showToast(`Switched persona to ${selected.name} (${ROLE_LABELS[selected.role] || selected.role})`);
      setIsSwitchPersonaModalOpen(false);
      // Automatically redirect to the persona's role dashboard on overview
      setCurrentPage('overview');
    }
  };

  const handleExploreCareers = () => {
    setIsPublicMode(true);
    setCurrentPage('recruit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitPublic = () => {
    if (user) {
      setIsPublicMode(false);
      setCurrentPage('recruit');
    } else {
      setIsPublicMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Not signed in and not exploring public candidate portal
  if (!user && !isPublicMode) {
    return (
      <>
        <LoginView
          users={allUsers}
          onLogin={handleLogin}
          onExploreCareers={handleExploreCareers}
        />
        <Toast message={toastMessage} isError={toastIsError} />
      </>
    );
  }

  const renderCurrentView = () => {
    if (isPublicMode) {
      return (
        <CandidatePortalView
          user={user}
          onExitPublic={handleExitPublic}
          onToast={showToast}
        />
      );
    }

    if (!user) return null;

    switch (currentPage) {
      case 'overview':
        return <OverviewView user={user} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileView user={user} onToast={showToast} />;
      case 'leave':
        return <LeaveView user={user} onToast={showToast} />;
      case 'time':
        return <TimesheetsView user={user} onToast={showToast} />;
      case 'org':
        return <OrgView user={user} />;
      case 'recruit':
        return (
          <RecruitView
            user={user}
            onNavigatePublic={handleExploreCareers}
            onToast={showToast}
          />
        );
      case 'documents':
        return <DocumentsView user={user} onToast={showToast} />;
      case 'tasks':
        return <TasksView user={user} onNavigate={handleNavigate} onToast={showToast} />;
      case 'learning':
        return <LearningView user={user} onToast={showToast} />;
      case 'payroll':
        return <PayrollView user={user} onToast={showToast} />;
      case 'reports':
        return <ReportsView user={user} onToast={showToast} />;
      case 'optional':
        return <OptionalView user={user} onNavigate={handleNavigate} onToast={showToast} />;
      case 'integrations':
        return <IntegrationsView user={user} onToast={showToast} />;
      case 'messages':
        return <MessagesView user={user} onToast={showToast} />;
      case 'guide':
        return <GuideView user={user} onNavigate={handleNavigate} onToast={showToast} />;
      case 'matrix':
        return <MatrixView />;
      case 'audit':
        return <AuditView user={user} />;
      default:
        return <OverviewView user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-shell">
      {!isPublicMode && user && (
        <Sidebar
          user={user}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSwitchPersona={() => setIsSwitchPersonaModalOpen(true)}
          isOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className="main-area"
        style={isPublicMode ? { marginLeft: 0, width: '100%' } : undefined}
      >
        <Topbar
          user={user}
          isPublicMode={isPublicMode}
          currentPage={currentPage}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onRefresh={() => setTick((t) => t + 1)}
          onSwitchPersona={() => setIsSwitchPersonaModalOpen(true)}
          onOpenAiAssistant={() => window.dispatchEvent(new CustomEvent('open-sheffield-ai'))}
        />

        <main className="content" tabIndex={-1}>
          {renderCurrentView()}
        </main>

        <footer className="main-footer">
          Sheffield City Council &bull; Sheffield Connect Connected People Platform &bull; Staff &amp; Leadership Portal &bull; <span>{todayFormatted}</span>
        </footer>
      </div>

      {/* Floating AI Voice & Action Agent Widget */}
      {!isPublicMode && (
        <AiAssistantWidget
          user={user}
          onNavigate={handleNavigate}
          onToast={showToast}
        />
      )}

      {/* Switch Persona Modal */}
      <Modal
        isOpen={isSwitchPersonaModalOpen}
        onClose={() => setIsSwitchPersonaModalOpen(false)}
        title="Switch Sheffield Council Persona"
        intro="Select an active corporate role to experience their tailored landing view, permissions, and handoff workflows."
      >
        <div className="grid two" style={{ gap: 12 }}>
          {personas.map((p) => {
            const isCurrent = user?.id === p.id;
            return (
              <button
                key={p.id}
                className={`card tight ${isCurrent ? 'hero-strip' : ''}`}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: isCurrent ? '2px solid #005A36' : '1px solid var(--border)',
                  color: isCurrent ? '#fff' : 'inherit',
                  padding: 14,
                  borderRadius: 10,
                }}
                onClick={() => handleSelectPersona(p.id)}
                type="button"
              >
                <strong>{p.name}</strong>
                <div className="small" style={{ opacity: 0.9, marginTop: 4 }}>
                  {ROLE_LABELS[p.role] || p.role}
                </div>
                <div className="micro" style={{ opacity: 0.8, marginTop: 2 }}>
                  {p.department} &bull; {p.job} ({p.grade})
                </div>
              </button>
            );
          })}
        </div>
        <div className="form-actions" style={{ marginTop: 20 }}>
          <button
            className="btn ghost"
            onClick={() => {
              store.logout();
              setIsSwitchPersonaModalOpen(false);
            }}
            type="button"
          >
            Sign out to Sheffield SSO
          </button>
          <button
            className="btn primary"
            onClick={() => setIsSwitchPersonaModalOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>
      </Modal>

      <Toast message={toastMessage} isError={toastIsError} />
    </div>
  );
};
