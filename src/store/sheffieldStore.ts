import {
  User,
  Profile,
  LeaveRequest,
  Vacancy,
  Application,
  CandidateEvent,
  DocumentRecord,
  Task,
  Course,
  Enrolment,
  PayrollRun,
  PayrollItem,
  PayrollAnomaly,
  TimeEntry,
  Expense,
  HRCase,
  Integration,
  IntegrationEvent,
  Message,
  MessageRecipient,
  AuditEvent,
  CapabilityItem,
} from '../types';
import capabilitiesData from '../data/capabilities.json';

const STORAGE_KEY = 'sheffield_connect_data_v1';

export const ROLE_LABELS: Record<string, string> = {
  employee: 'Employee',
  manager: 'Hiring / team manager',
  hr: 'People Services',
  payroll: 'Payroll',
  learning: 'Learning administrator',
  service: 'Service manager',
  admin: 'System administrator',
  recruiter: 'Recruiter',
};

export function now(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isodays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function lastMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

export function fmt(n: number | null | undefined): string {
  return Number(n ?? 0).toLocaleString('en-GB', { maximumFractionDigits: 2 });
}

export function money(n: number | null | undefined): string {
  return 'GBP ' + Number(n ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ago(s?: string | null): string {
  if (!s) return '--';
  try {
    const d = new Date(s);
    return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return s;
  }
}

export function initials(name?: string | null): string {
  return (name || 'SC')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase();
}

export function getWeekdayCount(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export interface StoreState {
  users: User[];
  profiles: Record<number, Profile>;
  leave_requests: LeaveRequest[];
  vacancies: Vacancy[];
  applications: Application[];
  candidate_events: CandidateEvent[];
  documents: DocumentRecord[];
  tasks: Task[];
  courses: Course[];
  enrolments: Enrolment[];
  payroll_runs: PayrollRun[];
  payroll_items: PayrollItem[];
  time_entries: TimeEntry[];
  expenses: Expense[];
  hr_cases: HRCase[];
  integrations: Integration[];
  integration_events: IntegrationEvent[];
  messages: Message[];
  message_recipients: MessageRecipient[];
  audit: AuditEvent[];
  capabilities: CapabilityItem[];
}

export function getInitialState(): StoreState {
  const users: User[] = [
    { id: 1, name: 'Aisha Khan', email: 'aisha@demo.sheffield.local', role: 'employee', department: 'Adult Social Care', job: 'Social Worker', grade: 'G7', manager_id: 4, fte: 1.0, salary: 35800, cost_center: 'ASC-110', leave_total: 25, leave_carry: 3, leave_purchased: 2, leave_bank: 8, active: 1, created: now() },
    { id: 2, name: 'Daniel Price', email: 'daniel@demo.sheffield.local', role: 'employee', department: 'Adult Social Care', job: 'Support Officer', grade: 'G5', manager_id: 4, fte: 1.0, salary: 29500, cost_center: 'ASC-110', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 3, name: 'Megan Lewis', email: 'megan@demo.sheffield.local', role: 'employee', department: 'Public Health', job: 'Analyst', grade: 'G6', manager_id: 4, fte: 0.8, salary: 31000, cost_center: 'PH-200', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 4, name: 'Helen Walker', email: 'helen@demo.sheffield.local', role: 'manager', department: 'Adult Social Care', job: 'Service Manager', grade: 'G10', manager_id: 8, fte: 1.0, salary: 51500, cost_center: 'ASC-110', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 5, name: 'Priya Shah', email: 'priya@demo.sheffield.local', role: 'hr', department: 'People Services', job: 'HR Business Partner', grade: 'G10', manager_id: 8, fte: 1.0, salary: 51000, cost_center: 'HR-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 6, name: 'Oliver Reed', email: 'oliver@demo.sheffield.local', role: 'payroll', department: 'Payroll', job: 'Payroll Lead', grade: 'G9', manager_id: 8, fte: 1.0, salary: 47000, cost_center: 'PAY-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 7, name: 'Amira Yusuf', email: 'amira@demo.sheffield.local', role: 'learning', department: 'Learning & Development', job: 'Learning Lead', grade: 'G8', manager_id: 8, fte: 1.0, salary: 42000, cost_center: 'LD-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 8, name: 'Matthew Grant', email: 'matthew@demo.sheffield.local', role: 'service', department: 'Corporate Services', job: 'Service Director', grade: 'G13', manager_id: 9, fte: 1.0, salary: 77000, cost_center: 'CS-001', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 9, name: 'Sofia Bennett', email: 'sofia@demo.sheffield.local', role: 'admin', department: 'Digital Services', job: 'System Administrator', grade: 'G10', manager_id: null, fte: 1.0, salary: 55000, cost_center: 'IT-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 10, name: 'Grace Turner', email: 'grace@demo.sheffield.local', role: 'recruiter', department: 'People Services', job: 'Recruitment Lead', grade: 'G8', manager_id: 5, fte: 1.0, salary: 42000, cost_center: 'HR-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 11, name: 'Thomas White', email: 'thomas@demo.sheffield.local', role: 'employee', department: 'Adult Social Care', job: 'Care Coordinator', grade: 'G6', manager_id: 4, fte: 1.0, salary: 32200, cost_center: 'ASC-110', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 12, name: 'Nadia Patel', email: 'nadia@demo.sheffield.local', role: 'employee', department: 'Public Health', job: 'Public Health Officer', grade: 'G7', manager_id: 4, fte: 1.0, salary: 36000, cost_center: 'PH-200', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 13, name: 'Connor Mills', email: 'connor@demo.sheffield.local', role: 'employee', department: 'Communities', job: 'Community Officer', grade: 'G6', manager_id: 8, fte: 1.0, salary: 32600, cost_center: 'COM-300', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 14, name: 'Eva Clarke', email: 'eva@demo.sheffield.local', role: 'employee', department: 'Adult Social Care', job: 'Support Officer', grade: 'G5', manager_id: 4, fte: 0.5, salary: 18000, cost_center: 'ASC-110', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 15, name: 'Noah Hughes', email: 'noah@demo.sheffield.local', role: 'employee', department: 'Digital Services', job: 'Developer', grade: 'G8', manager_id: 9, fte: 1.0, salary: 44400, cost_center: 'IT-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
    { id: 16, name: 'Jade Robinson', email: 'jade@demo.sheffield.local', role: 'employee', department: 'Learning & Development', job: 'Learning Officer', grade: 'G6', manager_id: 7, fte: 1.0, salary: 34500, cost_center: 'LD-100', leave_total: 25, leave_carry: 0, leave_purchased: 0, leave_bank: 8, active: 1, created: now() },
  ];

  const profiles: Record<number, Profile> = {
    1: { phone: '0114 273 4567', address: '42 Peace Gardens, Sheffield, S1 2HH', emergency_contact: 'Tariq Khan (Spouse) - 07700 900123', updated: now() },
  };

  const vacancies: Vacancy[] = [
    {
      id: 1,
      title: 'Community Support Officer',
      department: 'Adult Social Care',
      location: 'Sheffield / hybrid',
      grade: 'G6',
      salary: 'GBP 30,000 - 34,000',
      summary: 'Support adults and neighbourhood teams with high-quality public services across Sheffield communities.',
      cover_required: true,
      status: 'Published',
      owner_id: 4,
      revision: 1,
      created: now(),
      closing: isodays(30),
    },
  ];

  const courses: Course[] = [
    { id: 1, title: 'Safeguarding Essentials', category: 'Compliance', hours: 3, seats: 100, description: 'Council safeguarding policies, vulnerability indicators and practical scenario response.' },
    { id: 2, title: 'Leading Inclusive Teams', category: 'Leadership', hours: 2, seats: 40, description: 'Practical inclusive leadership behaviours, equality objectives and collaborative management.' },
    { id: 3, title: 'Data Protection & GDPR', category: 'Compliance', hours: 2, seats: 100, description: 'Handling employee, resident and service-user personal information responsibly and compliantly.' },
    { id: 4, title: 'Digital Service Foundations', category: 'Digital', hours: 4, seats: 25, description: 'Modern digital service delivery standards, accessibility and digital collaboration tools.' },
  ];

  const integrations: Integration[] = [
    { id: 1, name: 'Microsoft Entra ID', method: 'SAML', description: 'Federation/MFA planned; not connected in this demonstrator', status: 'Ready' },
    { id: 2, name: 'Corporate Finance', method: 'REST/SFTP', description: 'Cost allocation and approved employee events', status: 'Ready' },
    { id: 3, name: 'Outlook Calendar', method: 'REST', description: 'Interview event delivery', status: 'Ready' },
    { id: 4, name: 'Corporate CRM', method: 'REST', description: 'Controlled contact and organisation exchange', status: 'Ready' },
    { id: 5, name: 'Payment Services', method: 'SFTP', description: 'Payroll payment instruction export', status: 'Ready' },
  ];

  const tasks: Task[] = [
    { id: 1, title: 'Review onboarding checklist', kind: 'HR Check', assigned_to: 5, employee_id: 1, status: 'Open', due: isodays(6), notes: 'Confirm checklist and signed declarations', created: now(), owner: 'Priya Shah' },
  ];

  const audit: AuditEvent[] = [
    { id: 1, actor_id: 9, actor: 'Sofia Bennett', action: 'seed', entity: 'system', entity_id: 0, detail: 'Synthetic demo dataset, not Sheffield workforce data', created: now() },
  ];

  const documents: DocumentRecord[] = [
    {
      id: 1,
      employee_id: 1,
      employee: 'Aisha Khan',
      name: 'Signed_Employment_Contract_Aisha_Khan.pdf',
      doc_type: 'Employment',
      classification: 'Employee confidential',
      stored_name: 'doc_1_Signed_Employment_Contract_Aisha_Khan.pdf',
      file_content: 'SHEFFIELD CITY COUNCIL - CONTRACT OF EMPLOYMENT\nEmployee: Aisha Khan\nPost: Social Worker (Grade 7)\nDepartment: Adult Social Care\nSalary: £35,800 per annum (1.0 FTE)\nHours: 37 hours per week\nTerms: National Joint Council for Local Government Services (Green Book)\nDate of Commencement: 01 September 2024\nSigned: Aisha Khan (Electronic Signature Verified)\nAuthorised: Helen Walker (Service Manager)',
      file_size: '48.2 KB',
      retention_until: '2034-09-01',
      archived: false,
      deleted: false,
      uploaded_by: 5,
      created: now(),
    },
    {
      id: 2,
      employee_id: 1,
      employee: 'Aisha Khan',
      name: 'Signed_Code_of_Conduct_Declaration_2026.txt',
      doc_type: 'Signed declaration',
      classification: 'Employee confidential',
      stored_name: 'doc_2_Signed_Code_of_Conduct_Declaration_2026.txt',
      file_content: 'SHEFFIELD CITY COUNCIL - CODE OF CONDUCT ANNUAL DECLARATION\nI confirm that I have read, understood and agree to comply with the Sheffield City Council Employee Code of Conduct, including standards of personal conduct, declaration of interests, safeguarding responsibilities, and information governance protocols.\nSigned: Aisha Khan\nDate: 15 January 2026',
      file_size: '14.5 KB',
      retention_until: '2033-12-31',
      archived: false,
      deleted: false,
      uploaded_by: 1,
      created: now(),
    },
    {
      id: 3,
      employee_id: 1,
      employee: 'Aisha Khan',
      name: 'Right_to_Work_Passport_Verification.pdf',
      doc_type: 'Identity verification',
      classification: 'Employee confidential',
      stored_name: 'doc_3_Right_to_Work_Passport_Verification.pdf',
      file_content: 'STATUTORY RIGHT TO WORK VERIFICATION RECORD\nCandidate / Employee: Aisha Khan\nEvidence Type: UK Passport (Verified via Home Office Share Code / Physical Inspection)\nInspected by: Priya Shah (People Services)\nOutcome: Positive Verification - Continuous Statutory Excuse Established\nInspection Date: 12 August 2024',
      file_size: '112.0 KB',
      retention_until: '2032-08-12',
      archived: false,
      deleted: false,
      uploaded_by: 5,
      created: now(),
    },
    {
      id: 4,
      employee_id: 1,
      employee: 'Aisha Khan',
      name: 'Legacy_Paper_File_Index_Pre2020.pdf',
      doc_type: 'Employment',
      classification: 'Employee confidential',
      stored_name: 'doc_4_Legacy_Paper_File_Index_Pre2020.pdf',
      file_content: 'LEGACY ARCHIVE INDEX NOTICE\nPaper document records scanned and transferred to digital store.\nStatus: Retention period elapsed under Council 6-year policy.\nEligible for automated purge upon administrator sign-off.',
      file_size: '22.0 KB',
      retention_until: isodays(365),
      archived: false,
      deleted: false,
      uploaded_by: 9,
      created: now(),
    },
    {
      id: 5,
      employee_id: 4,
      employee: 'Helen Walker',
      name: 'Service_Manager_Appointment_Notice.pdf',
      doc_type: 'Appointment',
      classification: 'Employee confidential',
      stored_name: 'doc_5_Service_Manager_Appointment_Notice.pdf',
      file_content: 'SHEFFIELD CITY COUNCIL - SERVICE MANAGER APPOINTMENT\nAppointee: Helen Walker\nService Area: Adult Social Care\nAuthorised by: Matthew Grant (Director)',
      file_size: '32.4 KB',
      retention_until: isodays(730),
      archived: false,
      deleted: false,
      uploaded_by: 5,
      created: now(),
    },
  ];

  const sampleToken = 'sc_app_maya_evans_demo';
  const applications: Application[] = [
    {
      id: 1,
      vacancy_id: 1,
      vacancy: 'Community Support Officer',
      location: 'Sheffield / hybrid',
      name: 'Maya Evans',
      email: 'maya.demo@example.com',
      statement: 'Experienced community support specialist committed to person-centred care, safeguarding best practices, and neighbourhood collaboration across Sheffield.',
      cover_letter: 'I am writing to express my strong enthusiasm for joining Sheffield City Council. My background in local frontline casework aligns directly with the Council’s public service objectives.',
      source: 'Council careers',
      access_token: sampleToken,
      stage: 'Shortlisted',
      interview_slot: `${isodays(5)}T10:00`,
      interview_type: 'Video',
      created: now(),
      updated: now(),
    },
  ];

  const candidate_events: CandidateEvent[] = [
    {
      id: 1,
      application_id: 1,
      title: 'Application received',
      body: 'Your application has been saved and is awaiting review.',
      event_kind: 'Status',
      created: now(),
    },
    {
      id: 2,
      application_id: 1,
      title: 'Shortlisted for interview',
      body: 'Congratulations! Your application has been shortlisted. Please select your preferred interview slot.',
      event_kind: 'Status',
      created: now(),
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      subject: 'Welcome to Sheffield Connect & Q4 Team Rotas',
      body: 'Welcome to our modernised council workplace platform. Please ensure your personal contact details are up to date and your weekly timesheets are submitted by Friday 17:00. Feel free to reach out if you have any questions.\n\nBest regards,\nHelen Walker (Service Manager)',
      sender_id: 4,
      sender: 'Helen Walker',
      force_notify: false,
      created: now(),
      recipients: [1, 2, 3],
    },
    {
      id: 2,
      subject: 'Annual Mandatory Safeguarding & GDPR Refresher',
      body: 'All staff across Adult Social Care and Communities are reminded to complete the Safeguarding Essentials and Data Protection refresher modules in the Learning Hub before month-end.\n\nPriya Shah\nPeople Services Lead',
      sender_id: 5,
      sender: 'Priya Shah',
      force_notify: false,
      created: now(),
      recipients: [1, 2],
    },
  ];

  const message_recipients: MessageRecipient[] = [
    { message_id: 1, recipient_id: 1, read_at: null },
    { message_id: 1, recipient_id: 2, read_at: null },
    { message_id: 1, recipient_id: 3, read_at: null },
    { message_id: 2, recipient_id: 1, read_at: null },
    { message_id: 2, recipient_id: 2, read_at: null },
  ];

  const time_entries: TimeEntry[] = [
    {
      id: 1,
      employee_id: 1,
      employee: 'Aisha Khan',
      week_start: lastMonday(),
      hours: 37.0,
      status: 'Approved',
      manager_id: 4,
    },
    {
      id: 2,
      employee_id: 2,
      employee: 'Daniel Price',
      week_start: lastMonday(),
      hours: 37.0,
      status: 'Submitted', // Awaiting manager approval - triggers pre-payroll anomaly
      manager_id: 4,
    },
  ];

  const integration_events: IntegrationEvent[] = [
    {
      id: 1,
      system: 'Microsoft Entra ID',
      event: 'identity-provision',
      entity_id: 1,
      payload: JSON.stringify({ email: 'aisha.khan@sheffield.gov.uk', role: 'employee' }),
      status: 'Queued',
      attempts: 0,
      error: null,
      created: now(),
      updated: now(),
    },
    {
      id: 2,
      system: 'Corporate Finance',
      event: 'general-ledger-journal',
      entity_id: 101,
      payload: JSON.stringify({ cost_center: 'ASC-110', period: '2026-10', amount: 35800 }),
      status: 'Queued',
      attempts: 0,
      error: null,
      created: now(),
      updated: now(),
    },
  ];

  return {
    users,
    profiles,
    leave_requests: [],
    vacancies,
    applications,
    candidate_events,
    documents,
    tasks,
    courses,
    enrolments: [],
    payroll_runs: [],
    payroll_items: [],
    time_entries,
    expenses: [],
    hr_cases: [],
    integrations,
    integration_events,
    messages,
    message_recipients,
    audit,
    capabilities: capabilitiesData as CapabilityItem[],
  };
}

class SheffieldStore {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();
  public currentUser: User | null = null;
  public candidateToken: string = typeof localStorage !== 'undefined' ? localStorage.getItem('sheffield_candidate_token') || '' : '';

  constructor() {
    this.state = this.loadState();
    // Default logged in user to Aisha Khan for smooth walkthrough
    this.currentUser = this.state.users.find((u) => u.id === 1) || null;
  }

  private loadState(): StoreState {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch {
      // Fallback
    }
    const fresh = getInitialState();
    this.saveState(fresh);
    return fresh;
  }

  private saveState(state: StoreState) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Ignore quota error
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveState(this.state);
    this.listeners.forEach((l) => l());
  }

  public getState(): StoreState {
    return this.state;
  }

  public addAudit(actorId: number | null, action: string, entity: string, entityId: number, detail: string = '') {
    const actorUser = actorId ? this.state.users.find((u) => u.id === actorId) : null;
    const actorName = actorUser ? actorUser.name : 'External / System';
    const newEntry: AuditEvent = {
      id: (this.state.audit.length ? Math.max(...this.state.audit.map((a) => a.id)) : 0) + 1,
      actor_id: actorId,
      actor: actorName,
      action,
      entity,
      entity_id: entityId,
      detail: detail.slice(0, 900),
      created: now(),
    };
    this.state.audit.unshift(newEntry);
  }

  public stageEvent(system: string, event: string, entityId: number, payload: any, actorId: number | null) {
    const exists = this.state.integration_events.some(
      (e) => e.system === system && e.event === event && e.entity_id === entityId
    );
    if (!exists) {
      const newEvent: IntegrationEvent = {
        id: (this.state.integration_events.length ? Math.max(...this.state.integration_events.map((e) => e.id)) : 0) + 1,
        system,
        event,
        entity_id: entityId,
        payload: JSON.stringify(payload),
        status: 'Queued',
        attempts: 0,
        error: null,
        created: now(),
        updated: now(),
      };
      this.state.integration_events.unshift(newEvent);
      this.addAudit(actorId, 'queue-integration', 'integration', entityId, `${system} / ${event}`);
    }
  }

  // Auth
  public login(userId: number, pin: string): User {
    if (pin !== 'sheffield-demo') {
      throw new Error('Incorrect demo access code. Default is: sheffield-demo');
    }
    const user = this.state.users.find((u) => u.id === userId && u.active === 1);
    if (!user) {
      throw new Error('User unavailable or inactive');
    }
    this.currentUser = user;
    this.addAudit(user.id, 'demo-login', 'user', user.id, 'Demo persona selected');
    this.notify();
    return user;
  }

  public logout() {
    this.currentUser = null;
    this.notify();
  }

  public setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.notify();
  }

  // Profile
  public getProfile(userId: number): Profile {
    return (
      this.state.profiles[userId] || {
        phone: '',
        address: '',
        emergency_contact: '',
      }
    );
  }

  public updateProfile(userId: number, phone: string, address: string, emergencyContact: string) {
    this.state.profiles[userId] = {
      phone: phone.slice(0, 50),
      address: address.slice(0, 280),
      emergency_contact: emergencyContact.slice(0, 140),
      updated: now(),
    };
    this.addAudit(userId, 'update', 'profile', userId, 'Employee updated contact details');
    this.notify();
  }

  // Leave & Absence
  public getLeaveRequests(user: User): {
    items: LeaveRequest[];
    balance: number;
    entitlement: { annual: number; carry_forward: number; purchased: number; bank_holidays: number };
  } {
    let list = this.state.leave_requests;
    if (user.role === 'admin' || user.role === 'hr') {
      // sees all
    } else if (user.role === 'manager') {
      list = list.filter((l) => l.employee_id === user.id || l.manager_id === user.id);
    } else {
      list = list.filter((l) => l.employee_id === user.id);
    }

    // Attach employee name
    const items = list.map((l) => {
      const emp = this.state.users.find((u) => u.id === l.employee_id);
      return { ...l, employee: emp ? emp.name : `User #${l.employee_id}` };
    });

    const used = this.state.leave_requests
      .filter((l) => l.employee_id === user.id && l.status === 'Approved' && l.leave_type === 'Annual')
      .reduce((sum, l) => sum + l.days, 0);

    const balance = Math.round((user.leave_total + user.leave_carry + user.leave_purchased - used) * 10) / 10;

    return {
      items: [...items].sort((a, b) => b.id - a.id),
      balance,
      entitlement: {
        annual: user.leave_total,
        carry_forward: user.leave_carry,
        purchased: user.leave_purchased,
        bank_holidays: user.leave_bank,
      },
    };
  }

  public createLeaveRequest(
    user: User,
    data: { leave_type: string; start: string; ending: string; note?: string }
  ): { id: number; days: number; status: string } {
    if (!data.start || !data.ending || !data.leave_type) {
      throw new Error('Please fill in start date, end date, and leave type');
    }
    const start = new Date(data.start);
    const ending = new Date(data.ending);
    if (ending < start) {
      throw new Error('End date must be on or after start date');
    }
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 15);
    if (start < minDate) {
      throw new Error('Please choose a current or future absence date');
    }
    const days = getWeekdayCount(data.start, data.ending);
    if (days < 1 || days > 80) {
      throw new Error('Absence must cover between 1 and 80 weekdays');
    }
    const kind = data.leave_type as LeaveRequest['leave_type'];
    if (!['Annual', 'Carer', 'Discretionary', 'Trade union', 'Sickness', 'Other'].includes(kind)) {
      throw new Error('Invalid absence type');
    }

    // Overlap check
    const overlap = this.state.leave_requests.some(
      (l) =>
        l.employee_id === user.id &&
        (l.status === 'Pending' || l.status === 'Approved') &&
        l.start <= data.ending &&
        l.ending >= data.start
    );
    if (overlap) {
      throw new Error('This absence overlaps an existing pending or approved request');
    }

    // Balance check
    if (kind === 'Annual') {
      const used = this.state.leave_requests
        .filter((l) => l.employee_id === user.id && (l.status === 'Pending' || l.status === 'Approved') && l.leave_type === 'Annual')
        .reduce((sum, l) => sum + l.days, 0);
      const available = user.leave_total + user.leave_carry + user.leave_purchased - used;
      if (days > available) {
        throw new Error(`Insufficient annual leave balance. Requested ${days} days, but only ${available} days available.`);
      }
    }

    const nextId = (this.state.leave_requests.length ? Math.max(...this.state.leave_requests.map((r) => r.id)) : 0) + 1;
    const managerId = user.manager_id || 4;

    const request: LeaveRequest = {
      id: nextId,
      employee_id: user.id,
      manager_id: managerId,
      leave_type: kind,
      start: data.start,
      ending: data.ending,
      days,
      note: (data.note || '').slice(0, 500),
      status: 'Pending',
      created: now(),
    };

    this.state.leave_requests.unshift(request);
    this.addAudit(user.id, 'request', 'leave', nextId, `${kind}: ${data.start} to ${data.ending}`);
    this.notify();
    return { id: nextId, days, status: 'Pending' };
  }

  public decideLeaveRequest(id: number, decision: 'Approved' | 'Rejected', actor: User) {
    if (!['manager', 'hr', 'admin'].includes(actor.role)) {
      throw new Error('Only managers and HR can decide leave requests');
    }
    const req = this.state.leave_requests.find((l) => l.id === id);
    if (!req) throw new Error('Leave request not found');
    if (req.status !== 'Pending') throw new Error('Request has already been decided');
    if (actor.role === 'manager' && req.manager_id !== actor.id) {
      throw new Error('Not a request for your team');
    }

    req.status = decision;
    req.decided_at = now();
    this.addAudit(actor.id, decision.toLowerCase(), 'leave', id, `Employee #${req.employee_id}: ${req.days} days`);
    this.notify();
  }

  public requestLeave(user: User, leaveType: string, start: string, ending: string, days?: number, note?: string) {
    return this.createLeaveRequest(user, { leave_type: leaveType, start, ending, note });
  }

  public decideLeave(id: number, decision: 'Approved' | 'Rejected', actor: User) {
    return this.decideLeaveRequest(id, decision, actor);
  }

  public getLeave(user: User) {
    const res = this.getLeaveRequests(user);
    return { ...res, remaining: res.balance };
  }

  // Organisation
  public getOrgHierarchy(user: User) {
    let people = [...this.state.users.filter((u) => u.active === 1)];
    if (user.role === 'employee') {
      people = people.filter((p) => p.id === user.id || p.id === user.manager_id);
    } else if (user.role === 'manager') {
      people = people.filter((p) => p.id === user.id || p.manager_id === user.id || p.id === user.manager_id);
    }

    // Rollups by department and cost_center
    const rollupsMap: Record<string, { department: string; cost_center: string; headcount: number; fte: number }> = {};
    for (const u of this.state.users.filter((x) => x.active === 1)) {
      const key = `${u.department}__${u.cost_center}`;
      if (!rollupsMap[key]) {
        rollupsMap[key] = { department: u.department, cost_center: u.cost_center, headcount: 0, fte: 0 };
      }
      rollupsMap[key].headcount += 1;
      rollupsMap[key].fte += u.fte;
    }
    const rollups = Object.values(rollupsMap).map((r) => ({
      ...r,
      fte: Math.round(r.fte * 100) / 100,
    }));

    return {
      people,
      rollups: ['admin', 'hr', 'service', 'manager'].includes(user.role) ? rollups : [],
    };
  }

  // Vacancies & Careers
  public getVacancies(user?: User | null): Vacancy[] {
    if (user && ['manager', 'hr', 'recruiter', 'admin'].includes(user.role)) {
      return [...this.state.vacancies].sort((a, b) => b.id - a.id);
    }
    return this.state.vacancies.filter((v) => v.status === 'Published').sort((a, b) => b.id - a.id);
  }

  public createVacancy(
    user: User,
    data: { title: string; department: string; location?: string; grade?: string; salary?: string; summary: string; closing: string; cover_required?: boolean }
  ): Vacancy {
    if (!['manager', 'hr', 'recruiter', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to create vacancy');
    }
    if (!data.title || !data.department || !data.summary || !data.closing) {
      throw new Error('Please provide title, department, summary, and closing date');
    }
    if (new Date(data.closing) < new Date(today())) {
      throw new Error('Closing date cannot be in the past');
    }

    const nextId = (this.state.vacancies.length ? Math.max(...this.state.vacancies.map((v) => v.id)) : 0) + 1;
    const vac: Vacancy = {
      id: nextId,
      title: data.title.slice(0, 120),
      department: data.department.slice(0, 90),
      location: (data.location || 'Sheffield / hybrid').slice(0, 90),
      grade: (data.grade || 'G6').slice(0, 20),
      salary: (data.salary || 'Grade dependent').slice(0, 70),
      summary: data.summary.slice(0, 1200),
      cover_required: !!data.cover_required,
      status: 'Draft',
      owner_id: user.id,
      revision: 1,
      created: now(),
      closing: data.closing,
    };

    this.state.vacancies.unshift(vac);
    this.addAudit(user.id, 'create', 'vacancy', nextId, data.title);
    this.notify();
    return vac;
  }

  public updateVacancy(
    id: number,
    user: User,
    data: { title?: string; summary?: string; closing?: string; grade?: string; salary?: string; cover_required?: boolean }
  ): Vacancy {
    const vac = this.state.vacancies.find((v) => v.id === id);
    if (!vac) throw new Error('Vacancy not found');
    if (user.role === 'manager' && vac.owner_id !== user.id) {
      throw new Error('You can update only your own vacancies');
    }

    if (data.title) vac.title = data.title.slice(0, 120);
    if (data.summary) vac.summary = data.summary.slice(0, 1200);
    if (data.closing) {
      if (new Date(data.closing) < new Date(today())) throw new Error('Closing date cannot be in the past');
      vac.closing = data.closing;
    }
    if (data.grade) vac.grade = data.grade.slice(0, 20);
    if (data.salary) vac.salary = data.salary.slice(0, 70);
    if (data.cover_required !== undefined) vac.cover_required = data.cover_required;

    vac.revision += 1;
    this.addAudit(user.id, 'revise', 'vacancy', id, `Post-publication edits versioned to v${vac.revision}`);
    this.notify();
    return vac;
  }

  public publishVacancy(id: number, user: User) {
    if (!['hr', 'recruiter', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to publish vacancy');
    }
    const vac = this.state.vacancies.find((v) => v.id === id);
    if (!vac) throw new Error('Vacancy not found');
    if (vac.status === 'Closed') throw new Error('Cannot publish a closed vacancy');

    vac.status = 'Published';
    this.addAudit(user.id, 'publish', 'vacancy', id, vac.title);
    this.notify();
  }

  public closeVacancy(id: number, user: User) {
    if (!['hr', 'recruiter', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to close vacancy');
    }
    const vac = this.state.vacancies.find((v) => v.id === id);
    if (!vac) throw new Error('Vacancy not found');

    vac.status = 'Closed';
    this.addAudit(user.id, 'close', 'vacancy', id, vac.title);
    this.notify();
  }

  // Applications & Candidate Journey
  public applyCandidate(
    vacancyId: number,
    data: { name: string; email: string; statement: string; cover_letter?: string; source?: string }
  ): Application {
    const vac = this.state.vacancies.find((v) => v.id === vacancyId);
    if (!vac || vac.status !== 'Published' || new Date(vac.closing) < new Date(today())) {
      throw new Error('Vacancy not accepting applications');
    }
    if (!data.name || !data.email || !data.statement) {
      throw new Error('Full name, email, and personal statement are required');
    }
    const email = data.email.trim().toLowerCase();
    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Enter a valid email address');
    }
    if (vac.cover_required && (!data.cover_letter || !data.cover_letter.trim())) {
      throw new Error('Cover letter is required for this vacancy');
    }

    const existing = this.state.applications.find(
      (a) => a.vacancy_id === vacancyId && a.email.toLowerCase() === email
    );
    if (existing) {
      throw new Error('An application for this vacancy already exists for this email');
    }

    const token = 'sc_app_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    const nextId = (this.state.applications.length ? Math.max(...this.state.applications.map((a) => a.id)) : 0) + 1;

    const app: Application = {
      id: nextId,
      vacancy_id: vacancyId,
      vacancy: vac.title,
      location: vac.location,
      name: data.name.trim().slice(0, 90),
      email,
      statement: data.statement.trim().slice(0, 2000),
      cover_letter: (data.cover_letter || '').trim().slice(0, 2000),
      source: (data.source || 'Council careers').slice(0, 60),
      access_token: token,
      stage: 'Applied',
      created: now(),
      updated: now(),
    };

    this.state.applications.unshift(app);

    // Initial event
    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    this.state.candidate_events.unshift({
      id: eventId,
      application_id: nextId,
      title: 'Application received',
      body: 'Your application has been saved and is awaiting review.',
      event_kind: 'Status',
      created: now(),
    });

    this.addAudit(null, 'candidate-apply', 'application', nextId, 'New applicant via career site');
    this.setCandidateToken(token);
    this.notify();
    return app;
  }

  public applyVacancy(
    vacancyId: number,
    name: string,
    email: string,
    statement: string,
    cover_letter?: string,
    source?: string
  ) {
    const app = this.applyCandidate(vacancyId, { name, email, statement, cover_letter, source });
    return { application: app, token: app.access_token };
  }

  public setCandidateToken(token: string) {
    this.candidateToken = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sheffield_candidate_token', token);
    }
    this.notify();
  }

  public getCandidateByToken(token: string): Application | null {
    return this.state.applications.find((a) => a.access_token === token) || null;
  }

  public getCandidateMessages(token: string): CandidateEvent[] {
    const app = this.getCandidateByToken(token);
    if (!app) return [];
    return this.state.candidate_events.filter(
      (e) => e.application_id === app.id && e.event_kind !== 'Internal'
    );
  }

  public candidateScheduleInterview(token: string, slot: string, type: 'Video' | 'In-person'): Application {
    const app = this.getCandidateByToken(token);
    if (!app) throw new Error('Application access code not found');
    if (!['Shortlisted', 'Interview Scheduled'].includes(app.stage)) {
      throw new Error('Interview scheduling is not available at this stage');
    }
    const dt = new Date(slot);
    if (isNaN(dt.getTime())) throw new Error('Invalid interview slot');

    app.stage = 'Interview Scheduled';
    app.interview_slot = slot;
    app.interview_type = type;
    app.updated = now();

    this.stageEvent('Outlook Calendar', 'interview-scheduled', app.id, { slot, type }, null);

    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    this.state.candidate_events.unshift({
      id: eventId,
      application_id: app.id,
      title: 'Interview preference saved',
      body: `Your ${type.toLowerCase()} interview is scheduled for ${slot}. You can reschedule until selection is completed.`,
      event_kind: 'Status',
      created: now(),
    });

    this.addAudit(null, 'candidate-schedule', 'application', app.id, slot);
    this.notify();
    return app;
  }

  public candidateWithdraw(token: string) {
    const app = this.getCandidateByToken(token);
    if (!app) throw new Error('Application access code not found');
    if (app.worker_id || app.stage === 'Withdrawn') {
      throw new Error('Cannot withdraw this application');
    }

    app.stage = 'Withdrawn';
    app.updated = now();

    this.stageEvent('Corporate Finance', 'candidate-withdrawal', app.id, { candidate: app.name }, null);

    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    this.state.candidate_events.unshift({
      id: eventId,
      application_id: app.id,
      title: 'Application withdrawn',
      body: 'Your withdrawal has been recorded.',
      event_kind: 'Status',
      created: now(),
    });

    this.addAudit(null, 'withdraw', 'application', app.id, 'Candidate self-withdrawal');
    this.notify();
  }

  public candidateAcceptOffer(token: string, signature: string): Application {
    const app = this.getCandidateByToken(token);
    if (!app) throw new Error('Application access code not found');
    if (app.stage !== 'Offered') {
      throw new Error('No formal offer is currently awaiting candidate acceptance');
    }
    if (!signature || !signature.trim()) {
      throw new Error('Please enter your full name as electronic signature to accept the offer');
    }

    app.stage = 'Offer Accepted';
    app.offer_status = 'Accepted';
    app.offer_accepted_at = now();
    app.offer_signature = signature.trim();
    app.updated = now();

    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    this.state.candidate_events.unshift({
      id: eventId,
      application_id: app.id,
      title: 'Offer accepted by candidate',
      body: `You accepted the appointment offer for ${app.vacancy} (Signed by: ${signature.trim()}). Pre-employment checks are now underway with People Services.`,
      event_kind: 'Status',
      created: now(),
    });

    this.stageEvent('Corporate Finance', 'offer-accepted', app.id, { candidate: app.name, vacancy: app.vacancy, signature: signature.trim() }, null);
    this.addAudit(null, 'candidate-accept-offer', 'application', app.id, `Candidate accepted offer: ${signature.trim()}`);
    this.notify();
    return app;
  }

  public candidateDeclineOffer(token: string, reason?: string): Application {
    const app = this.getCandidateByToken(token);
    if (!app) throw new Error('Application access code not found');
    if (app.stage !== 'Offered') {
      throw new Error('No formal offer is currently pending');
    }

    app.stage = 'Withdrawn';
    app.offer_status = 'Declined';
    app.updated = now();

    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    this.state.candidate_events.unshift({
      id: eventId,
      application_id: app.id,
      title: 'Offer declined',
      body: `You declined the appointment offer${reason ? ': ' + reason : '.'}`,
      event_kind: 'Status',
      created: now(),
    });

    this.addAudit(null, 'candidate-decline-offer', 'application', app.id, reason || 'Declined by candidate');
    this.notify();
    return app;
  }

  public getApplications(user: User): Application[] {
    if (!['hr', 'recruiter', 'manager', 'admin'].includes(user.role)) return [];
    if (user.role === 'manager') {
      const myVacancyIds = this.state.vacancies.filter((v) => v.owner_id === user.id).map((v) => v.id);
      return this.state.applications.filter((a) => myVacancyIds.includes(a.vacancy_id));
    }
    return [...this.state.applications];
  }

  public updateApplicationStage(
    id: number,
    newStage: Application['stage'],
    user: User,
    feedback?: string,
    score?: number | null
  ): Application {
    if (!['recruiter', 'hr', 'manager', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to advance application stage');
    }
    const app = this.state.applications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    const vac = this.state.vacancies.find((v) => v.id === app.vacancy_id);
    if (!vac) throw new Error('Associated vacancy not found');

    if (user.role === 'manager' && vac.owner_id !== user.id) {
      throw new Error('Not your vacancy');
    }
    if (['Rejected', 'Withdrawn', 'Onboarded'].includes(app.stage)) {
      throw new Error('Application is no longer active');
    }

    const allowed: Record<string, string[]> = {
      Applied: ['Shortlisted', 'Rejected'],
      Shortlisted: ['Rejected'],
      'Interview Scheduled': ['Interview Completed', 'Rejected'],
      'Interview Completed': ['Offered', 'Rejected'],
      Offered: ['Offer Accepted', 'Rejected'],
      'Offer Accepted': ['Checks Complete'],
      'Checks Complete': ['Onboarded'],
    };

    if (!allowed[app.stage]?.includes(newStage)) {
      throw new Error(`Cannot move from ${app.stage} to ${newStage}`);
    }

    if (newStage === 'Interview Completed') {
      if (!feedback || feedback.trim() === '' || score === undefined || score === null) {
        throw new Error('Interview score (0-5) and detailed panel feedback are required');
      }
      app.interview_score = Math.min(5, Math.max(0, Math.round(Number(score))));
      app.interview_feedback = feedback.trim().slice(0, 900);
    }

    if (newStage === 'Offered') {
      app.offer_status = 'Offered';
      app.offer_details = {
        salary: vac.salary,
        grade: vac.grade,
        start_date: isodays(28),
        terms_summary: `Formal conditional appointment offer for ${vac.title} (${vac.department}). Subject to satisfactory pre-employment right-to-work, reference, and identity checks.`,
      };
    }

    if (newStage === 'Offer Accepted') {
      app.offer_status = 'Accepted';
      if (!app.offer_accepted_at) {
        app.offer_accepted_at = now();
        app.offer_signature = feedback || `${app.name} (Verified)`;
      }
    }

    app.stage = newStage;
    app.updated = now();

    if (newStage === 'Onboarded') {
      // Check duplicate
      const duplicate = this.state.users.some((u) => u.email.toLowerCase() === app.email.toLowerCase());
      if (duplicate) {
        throw new Error('An employee with this email already exists. Review duplicate before onboarding.');
      }

      // Add to users table
      const nextUserId = Math.max(...this.state.users.map((u) => u.id)) + 1;
      const newUser: User = {
        id: nextUserId,
        name: app.name,
        email: app.email,
        role: 'employee',
        department: vac.department,
        job: vac.title,
        grade: vac.grade,
        manager_id: vac.owner_id,
        fte: 1.0,
        salary: 32500,
        cost_center: 'NEW-STARTER',
        leave_total: 25,
        leave_carry: 0,
        leave_purchased: 0,
        leave_bank: 8,
        active: 1,
        created: now(),
      };
      this.state.users.push(newUser);
      app.worker_id = nextUserId;

      // Spawn 3 onboarding tasks
      const starterTasks = [
        { title: 'Submit right-to-work evidence', kind: 'Onboarding', assigned_to: nextUserId },
        { title: 'Verify starter records', kind: 'HR Check', assigned_to: 5 }, // Priya
        { title: 'Assign safeguarding learning', kind: 'Learning', assigned_to: 7 }, // Amira
      ];

      for (const t of starterTasks) {
        const taskId = (this.state.tasks.length ? Math.max(...this.state.tasks.map((x) => x.id)) : 0) + 1;
        const owner = this.state.users.find((u) => u.id === t.assigned_to);
        this.state.tasks.unshift({
          id: taskId,
          title: t.title,
          kind: t.kind,
          assigned_to: t.assigned_to,
          owner: owner?.name,
          employee_id: nextUserId,
          status: 'Open',
          due: isodays(7),
          created: now(),
        });
      }

      // Staged events
      this.stageEvent('Corporate Finance', 'new-starter', nextUserId, { name: app.name, dept: vac.department }, user.id);
      this.stageEvent('Microsoft Entra ID', 'identity-provision', nextUserId, { email: app.email }, user.id);
    }

    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    let eventTitle = 'Application status: ' + newStage;
    let eventBody = 'Your application has moved to ' + newStage.toLowerCase() + '.';

    if (newStage === 'Offered') {
      eventTitle = 'Conditional Offer Received';
      eventBody = `Congratulations! You have received a formal conditional offer for ${app.vacancy} (${vac.salary}). Please review the terms and accept your appointment in the Candidate Portal.`;
    } else if (newStage === 'Offer Accepted') {
      eventTitle = 'Offer Accepted';
      eventBody = `You have accepted the offer for ${app.vacancy}. Pre-employment reference and background checks are in progress.`;
    } else if (newStage === 'Checks Complete') {
      eventTitle = 'Pre-Employment Checks Complete';
      eventBody = `All pre-employment verification and right-to-work checks have been successfully completed. Final onboarding is being prepared.`;
    } else if (newStage === 'Onboarded') {
      eventTitle = 'Welcome to Sheffield City Council!';
      eventBody = `Your employee profile has been created and your onboarding induction checklist has been activated. Welcome to the team!`;
    }

    this.state.candidate_events.unshift({
      id: eventId,
      application_id: app.id,
      title: eventTitle,
      body: eventBody,
      event_kind: 'Status',
      created: now(),
    });

    this.addAudit(user.id, newStage.toLowerCase(), 'application', app.id, feedback || app.name);
    this.notify();
    return app;
  }

  public recruiterSendMessage(applicationId: number, subject: string, body: string, user: User) {
    if (!['recruiter', 'hr', 'manager', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to message applicant');
    }
    const app = this.state.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const eventId = (this.state.candidate_events.length ? Math.max(...this.state.candidate_events.map((e) => e.id)) : 0) + 1;
    this.state.candidate_events.unshift({
      id: eventId,
      application_id: applicationId,
      title: subject.slice(0, 255),
      body: body.slice(0, 4000),
      event_kind: 'Recruiter message',
      created: now(),
    });

    this.addAudit(user.id, 'candidate-correspondence', 'application', applicationId, 'Portal inbox message; no real e-mail');
    this.notify();
  }

  // Documents
  public getDocuments(user: User): DocumentRecord[] {
    let list = this.state.documents.filter((d) => !d.deleted);
    if (['hr', 'admin'].includes(user.role)) {
      return [...list].sort((a, b) => b.id - a.id);
    }
    return list.filter((d) => d.employee_id === user.id).sort((a, b) => b.id - a.id);
  }

  public uploadDocument(
    user: User,
    employeeId: number,
    name: string,
    docType: string,
    retentionUntil: string,
    fileContent?: string
  ): DocumentRecord {
    if (user.role !== 'admin' && user.role !== 'hr' && employeeId !== user.id) {
      throw new Error('Upload forbidden for other employees');
    }
    const emp = this.state.users.find((u) => u.id === employeeId);
    if (!emp) throw new Error('Employee not found');
    if (new Date(retentionUntil) < new Date(today())) {
      throw new Error('Retention date must be in the future');
    }

    const nextId = (this.state.documents.length ? Math.max(...this.state.documents.map((d) => d.id)) : 0) + 1;
    const doc: DocumentRecord = {
      id: nextId,
      employee_id: employeeId,
      employee: emp.name,
      name: name.slice(0, 200),
      doc_type: docType.slice(0, 65),
      classification: 'Employee confidential',
      stored_name: `doc_${nextId}_${name}`,
      file_content: fileContent || 'Fictional demo document contents',
      retention_until: retentionUntil,
      archived: false,
      deleted: false,
      uploaded_by: user.id,
      created: now(),
    };

    this.state.documents.unshift(doc);
    this.addAudit(user.id, 'upload', 'document', nextId, name);
    this.notify();
    return doc;
  }

  public archiveDocument(id: number, user: User) {
    if (!['hr', 'admin'].includes(user.role)) {
      throw new Error('Only People Services / HR can archive documents');
    }
    const doc = this.state.documents.find((d) => d.id === id);
    if (!doc || doc.deleted) throw new Error('Document not found or already deleted');

    doc.archived = true;
    this.addAudit(user.id, 'archive', 'document', id, doc.name);
    this.notify();
  }

  public simulateDocumentExpiry(id: number, user: User) {
    if (user.role !== 'admin') {
      throw new Error('Administrator permission required to simulate expiry');
    }
    const doc = this.state.documents.find((d) => d.id === id);
    if (!doc || doc.deleted || !doc.archived) {
      throw new Error('Archive the document before simulating retention expiry');
    }

    doc.retention_until = isodays(-1);
    this.addAudit(user.id, 'demo-expiry', 'document', id, 'Artificially expired for purge walkthrough; demo only');
    this.notify();
  }

  public purgeDocuments(user: User): number {
    if (!['hr', 'admin'].includes(user.role)) {
      throw new Error('Only People Services / HR can execute purge');
    }
    const todayStr = today();
    const eligible = this.state.documents.filter(
      (d) => !d.deleted && d.archived && d.retention_until < todayStr
    );

    eligible.forEach((d) => {
      d.deleted = true;
      this.addAudit(user.id, 'purge', 'document', d.id, 'Expired retention and previously archived');
    });

    this.notify();
    return eligible.length;
  }

  public deleteDocument(id: number, user: User) {
    const doc = this.state.documents.find((d) => d.id === id);
    if (!doc || doc.deleted) throw new Error('Document not found or already deleted');
    if (!['hr', 'admin'].includes(user.role) && doc.employee_id !== user.id) {
      throw new Error('Permission denied to delete this document');
    }
    doc.deleted = true;
    this.addAudit(user.id, 'delete', 'document', id, doc.name);
    this.notify();
  }

  public getDocument(id: number, user: User): DocumentRecord {
    const doc = this.state.documents.find((d) => d.id === id);
    if (!doc || doc.deleted) throw new Error('Document not found or removed');
    if (!['hr', 'admin'].includes(user.role) && doc.employee_id !== user.id) {
      throw new Error('Access denied to confidential employee document');
    }
    this.addAudit(user.id, 'view', 'document', id, doc.name);
    return doc;
  }

  // Tasks
  public getTasks(user: User): Task[] {
    let list = this.state.tasks;
    if (['hr', 'admin'].includes(user.role)) {
      return [...list].sort((a, b) => b.id - a.id);
    }
    return list.filter((t) => t.assigned_to === user.id).sort((a, b) => b.id - a.id);
  }

  public assignTask(
    user: User,
    data: { title: string; kind?: string; assigned_to: number; employee_id?: number; due?: string; notes?: string }
  ): Task {
    if (!['hr', 'manager', 'learning', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to assign tasks');
    }
    if (!data.title || !data.assigned_to) {
      throw new Error('Title and Assignee are required');
    }
    const assignee = this.state.users.find((u) => u.id === data.assigned_to && u.active === 1);
    if (!assignee) throw new Error('Assignee not found');

    const nextId = (this.state.tasks.length ? Math.max(...this.state.tasks.map((t) => t.id)) : 0) + 1;
    const task: Task = {
      id: nextId,
      title: data.title.slice(0, 180),
      kind: (data.kind || 'HR Process').slice(0, 60),
      assigned_to: data.assigned_to,
      owner: assignee.name,
      employee_id: data.employee_id || data.assigned_to,
      status: 'Open',
      due: data.due || isodays(7),
      notes: (data.notes || '').slice(0, 700),
      created: now(),
    };

    this.state.tasks.unshift(task);
    this.addAudit(user.id, 'create', 'task', nextId, data.title);
    this.notify();
    return task;
  }

  public completeTask(id: number, user: User) {
    const task = this.state.tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    if (task.assigned_to !== user.id && !['hr', 'admin'].includes(user.role)) {
      throw new Error('Task is not assigned to you');
    }
    if (task.status !== 'Open') throw new Error('Task already completed');

    task.status = 'Completed';
    task.completed = now();
    this.addAudit(user.id, 'complete', 'task', id, task.title);
    this.notify();
  }

  public reassignTask(id: number, targetUserId: number, user: User) {
    if (!['hr', 'manager', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to reassign task');
    }
    const task = this.state.tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    if (task.status !== 'Open') throw new Error('Completed task cannot be reassigned');
    const targetUser = this.state.users.find((u) => u.id === targetUserId);
    if (!targetUser) throw new Error('Target assignee not found');

    task.assigned_to = targetUserId;
    task.owner = targetUser.name;
    this.addAudit(user.id, 'reassign', 'task', id, `Reassigned to ${targetUser.name}`);
    this.notify();
  }

  // Learning
  public getLearning(user: User) {
    const coursesWithBooked = this.state.courses.map((c) => {
      const booked = this.state.enrolments.filter(
        (e) => e.course_id === c.id && e.status !== 'Cancelled'
      ).length;
      return { ...c, booked };
    });

    let enrolments = this.state.enrolments;
    if (['learning', 'admin', 'hr'].includes(user.role)) {
      // see all
    } else if (user.role === 'manager') {
      const teamUserIds = this.state.users.filter((u) => u.manager_id === user.id).map((u) => u.id);
      enrolments = enrolments.filter((e) => e.employee_id === user.id || teamUserIds.includes(e.employee_id));
    } else {
      enrolments = enrolments.filter((e) => e.employee_id === user.id);
    }

    return {
      courses: coursesWithBooked,
      enrolments: [...enrolments].sort((a, b) => b.id - a.id),
    };
  }

  public enrolCourse(courseId: number, user: User) {
    const course = this.state.courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Course not found');

    const booked = this.state.enrolments.filter(
      (e) => e.course_id === courseId && e.status !== 'Cancelled'
    ).length;
    if (booked >= course.seats) throw new Error('Course is fully booked');

    const already = this.state.enrolments.some(
      (e) => e.course_id === courseId && e.employee_id === user.id && e.status !== 'Cancelled'
    );
    if (already) throw new Error('You are already enrolled on this course');

    const nextId = (this.state.enrolments.length ? Math.max(...this.state.enrolments.map((e) => e.id)) : 0) + 1;
    const enrolment: Enrolment = {
      id: nextId,
      course_id: courseId,
      course: course.title,
      employee_id: user.id,
      employee: user.name,
      status: 'Enrolled',
      created: now(),
    };

    this.state.enrolments.unshift(enrolment);
    this.addAudit(user.id, 'enrol', 'learning', nextId, course.title);
    this.notify();
    return enrolment;
  }

  public completeCourse(enrolmentId: number, user: User) {
    const enr = this.state.enrolments.find((e) => e.id === enrolmentId);
    if (!enr) throw new Error('Enrolment not found');
    if (enr.employee_id !== user.id && !['learning', 'admin', 'hr'].includes(user.role)) {
      throw new Error('Cannot change this record');
    }
    if (enr.status !== 'Enrolled') throw new Error('Learning already completed');

    enr.status = 'Completed';
    enr.completed = now();
    this.addAudit(user.id, 'complete', 'learning', enrolmentId, enr.course);
    this.notify();
  }

  // Payroll
  public getPayroll(user: User) {
    let runs: PayrollRun[] = [];
    if (['payroll', 'hr', 'admin'].includes(user.role)) {
      runs = [...this.state.payroll_runs].sort((a, b) => b.id - a.id);
    }

    const payslips = this.state.payroll_items
      .filter((i) => i.employee_id === user.id)
      .map((i) => {
        const run = this.state.payroll_runs.find((r) => r.id === i.run_id);
        return {
          ...i,
          period: run?.period || '',
          status: run?.status || 'Draft',
        };
      })
      .filter((i) => i.status === 'Finalised');

    return {
      runs,
      payslips,
      disclaimer: 'Illustrative gross and example 18% deductions only. Not certified HMRC, NI or LGPS/TPS calculations.',
    };
  }

  public createPayrollRun(period: string, user: User): PayrollRun {
    if (!['payroll', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to execute payroll run');
    }
    if (!period || !/^20\d{2}-(0[1-9]|1[0-2])$/.test(period)) {
      throw new Error('Period must be in YYYY-MM format');
    }
    if (this.state.payroll_runs.some((r) => r.period === period)) {
      throw new Error('Period has already been processed');
    }

    const activeUsers = this.state.users.filter((u) => u.active === 1);
    const nextRunId = (this.state.payroll_runs.length ? Math.max(...this.state.payroll_runs.map((r) => r.id)) : 0) + 1;

    // PRE-PAYROLL ANOMALY DETECTION ENGINE
    const anomalies: PayrollAnomaly[] = [];

    // 1. Detect unapproved submitted timesheets (BLOCKING anomaly)
    const unapprovedTimesheets = this.state.time_entries.filter((t) => t.status === 'Submitted');
    for (const ut of unapprovedTimesheets) {
      const emp = activeUsers.find((u) => u.id === ut.employee_id);
      if (emp) {
        anomalies.push({
          id: `anomaly_ts_${ut.id}`,
          severity: 'blocking',
          category: 'timesheet',
          employee_id: emp.id,
          employee_name: emp.name,
          issue: `Unapproved timesheet (${ut.hours} hrs for w/c ${ut.week_start}) awaiting manager sign-off.`,
          remediation: `Manager Helen Walker or Payroll Lead Oliver Reed must review and approve this timesheet or resolve with payroll note before finalisation.`,
          resolved: false,
        });
      }
    }

    // 2. Detect salary anomalies & missing cost centers
    for (const u of activeUsers) {
      if (!u.salary || u.salary <= 0) {
        anomalies.push({
          id: `anomaly_sal_${u.id}`,
          severity: 'blocking',
          category: 'salary',
          employee_id: u.id,
          employee_name: u.name,
          issue: `Establishment salary record missing or zero for ${u.job}.`,
          remediation: `People Services must assign a verified NJC spine point salary before payment execution.`,
          resolved: false,
        });
      } else if (u.salary < 18000) {
        anomalies.push({
          id: `anomaly_min_${u.id}`,
          severity: 'warning',
          category: 'salary',
          employee_id: u.id,
          employee_name: u.name,
          issue: `Annualised pay (£${fmt(u.salary)}) falls below full-time living wage threshold. Verify pro-rata FTE (${u.fte}).`,
          remediation: `Confirm FTE scaling (${u.fte} FTE) in establishment structure.`,
          resolved: false,
        });
      }

      if (!u.cost_center || u.cost_center === 'NEW-STARTER') {
        anomalies.push({
          id: `anomaly_cc_${u.id}`,
          severity: 'warning',
          category: 'starter',
          employee_id: u.id,
          employee_name: u.name,
          issue: `Provisional or temporary cost centre (${u.cost_center || 'None'}) allocated.`,
          remediation: `Corporate Finance cost allocation will default to Directorate suspense code if unverified.`,
          resolved: false,
        });
      }
    }

    let grossSum = 0;
    let deductSum = 0;
    let netSum = 0;

    for (const u of activeUsers) {
      const baseSalaryMonthly = Math.round((u.salary / 12) * 100) / 100;
      
      // Overtime addition if timesheets > 37
      const empTimesheets = this.state.time_entries.filter((t) => t.employee_id === u.id && t.status === 'Approved');
      const extraHours = empTimesheets.reduce((s, t) => s + Math.max(0, t.hours - 37), 0);
      const hourlyRate = Math.round((u.salary / (52 * 37)) * 100) / 100;
      const timesheetPay = Math.round(extraHours * hourlyRate * 1.5 * 100) / 100;

      const gross = Math.round((baseSalaryMonthly + timesheetPay) * 100) / 100;
      const pensionDeduction = Math.round(gross * 0.065 * 100) / 100;
      const taxDeduction = Math.round(gross * 0.115 * 100) / 100;
      const totalDeductions = Math.round((pensionDeduction + taxDeduction) * 100) / 100;
      const net = Math.round((gross - totalDeductions) * 100) / 100;

      const itemId = (this.state.payroll_items.length ? Math.max(...this.state.payroll_items.map((i) => i.id)) : 0) + 1;
      this.state.payroll_items.push({
        id: itemId,
        run_id: nextRunId,
        employee_id: u.id,
        base_salary: baseSalaryMonthly,
        timesheet_hours: extraHours > 0 ? extraHours : undefined,
        timesheet_pay: timesheetPay > 0 ? timesheetPay : undefined,
        gross,
        pension_deduction: pensionDeduction,
        tax_deduction: taxDeduction,
        deduction: totalDeductions,
        net,
      });

      grossSum += gross;
      deductSum += totalDeductions;
      netSum += net;
    }

    const blockingCount = anomalies.filter((a) => a.severity === 'blocking').length;

    const run: PayrollRun = {
      id: nextRunId,
      period,
      status: 'Draft',
      headcount: activeUsers.length,
      gross: Math.round(grossSum * 100) / 100,
      deduction: Math.round(deductSum * 100) / 100,
      net: Math.round(netSum * 100) / 100,
      anomalies,
      anomalies_resolved: blockingCount === 0,
      bacs_staged: false,
      created: now(),
    };

    this.state.payroll_runs.unshift(run);
    this.addAudit(
      user.id,
      'calculate',
      'payroll',
      nextRunId,
      `${period} run: ${anomalies.length} anomaly flags (${blockingCount} blocking finalisation)`
    );
    this.notify();
    return run;
  }

  public resolvePayrollAnomaly(runId: number, anomalyId: string, resolutionNote: string, user: User) {
    if (!['payroll', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to resolve pre-payroll anomalies');
    }
    const run = this.state.payroll_runs.find((r) => r.id === runId);
    if (!run) throw new Error('Payroll run not found');
    if (run.status !== 'Draft') throw new Error('Cannot modify finalised payroll period');

    const anomaly = run.anomalies.find((a) => a.id === anomalyId);
    if (!anomaly) throw new Error('Anomaly record not found');
    if (anomaly.resolved) throw new Error('Anomaly already marked as resolved');

    anomaly.resolved = true;
    anomaly.resolution_note = resolutionNote.slice(0, 300);
    anomaly.resolved_at = now();

    // If it was an unapproved timesheet anomaly, auto-approve the timesheet in store state
    if (anomaly.category === 'timesheet' && anomaly.id.startsWith('anomaly_ts_')) {
      const tsId = Number(anomaly.id.replace('anomaly_ts_', ''));
      const ts = this.state.time_entries.find((t) => t.id === tsId);
      if (ts && ts.status === 'Submitted') {
        ts.status = 'Approved';
        this.addAudit(user.id, 'approved', 'timesheet', ts.id, `Approved via payroll pre-validation: ${resolutionNote}`);
      }
    }

    const remainingBlocking = run.anomalies.filter((a) => a.severity === 'blocking' && !a.resolved).length;
    run.anomalies_resolved = remainingBlocking === 0;

    this.addAudit(
      user.id,
      'resolve-anomaly',
      'payroll',
      runId,
      `Resolved [${anomaly.category}] for ${anomaly.employee_name}: ${resolutionNote}`
    );
    this.notify();
  }

  public finalisePayrollRun(id: number, user: User) {
    if (!['payroll', 'admin'].includes(user.role)) {
      throw new Error('Permission denied to finalise payroll');
    }
    const run = this.state.payroll_runs.find((r) => r.id === id);
    if (!run) throw new Error('Payroll run not found');
    if (run.status !== 'Draft') throw new Error('Payroll already finalised');

    // BLOCKING VALIDATION: Check if any blocking anomalies remain unresolved!
    const unresolvedBlocking = run.anomalies.filter((a) => a.severity === 'blocking' && !a.resolved);
    if (unresolvedBlocking.length > 0) {
      throw new Error(
        `Finalisation blocked: ${unresolvedBlocking.length} critical pre-payroll anomaly must be corrected or resolved before BACS disbursement. Check: ${unresolvedBlocking[0].issue}`
      );
    }

    run.status = 'Finalised';
    run.completed = now();
    run.bacs_staged = true;

    this.stageEvent('Payment Services', 'bacs-disbursement-export', id, { period: run.period, net: run.net, count: run.headcount }, user.id);
    this.stageEvent('Corporate Finance', 'general-ledger-journal', id, { period: run.period, gross: run.gross, deduction: run.deduction }, user.id);
    this.addAudit(user.id, 'finalise', 'payroll', id, `${run.period} finalised - BACS file generated (£${fmt(run.net)})`);
    this.notify();
  }

  // Time & Attendance
  public getTimesheets(user: User): TimeEntry[] {
    let list = this.state.time_entries;
    if (['admin', 'hr', 'payroll'].includes(user.role)) {
      return [...list].sort((a, b) => b.id - a.id);
    }
    if (user.role === 'manager') {
      return list.filter((t) => t.employee_id === user.id || t.manager_id === user.id).sort((a, b) => b.id - a.id);
    }
    return list.filter((t) => t.employee_id === user.id).sort((a, b) => b.id - a.id);
  }

  public submitTimesheet(weekStart: string, hours: number, user: User): TimeEntry {
    if (!weekStart) throw new Error('Week start date required');
    const dt = new Date(weekStart + 'T12:00:00Z');
    if (dt.getUTCDay() !== 1) {
      throw new Error('Timesheet week must start on a Monday');
    }
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    if (dt > twoWeeks) {
      throw new Error('Cannot submit a timesheet more than two weeks in advance');
    }
    if (hours < 0.25 || hours > 65) {
      throw new Error('Hours worked must be between 0.25 and 65');
    }

    const existing = this.state.time_entries.find(
      (t) => t.employee_id === user.id && t.week_start === weekStart
    );
    if (existing) {
      throw new Error('Timesheet already exists for this week');
    }

    const nextId = (this.state.time_entries.length ? Math.max(...this.state.time_entries.map((t) => t.id)) : 0) + 1;
    const entry: TimeEntry = {
      id: nextId,
      employee_id: user.id,
      employee: user.name,
      week_start: weekStart,
      hours: Number(hours),
      status: 'Submitted',
      manager_id: user.manager_id || 4,
    };

    this.state.time_entries.unshift(entry);
    this.addAudit(user.id, 'submit', 'timesheet', nextId, weekStart);
    this.notify();
    return entry;
  }

  public decideTimesheet(id: number, decision: 'Approved' | 'Rejected', user: User) {
    if (!['manager', 'hr', 'admin'].includes(user.role)) {
      throw new Error('Only managers and HR can review timesheets');
    }
    const t = this.state.time_entries.find((x) => x.id === id);
    if (!t) throw new Error('Timesheet not found');
    if (t.status !== 'Submitted') throw new Error('Timesheet already decided');
    if (user.role === 'manager' && t.manager_id !== user.id) {
      throw new Error('Not your team');
    }

    t.status = decision;
    if (decision === 'Approved') {
      this.stageEvent('Corporate Finance', 'time-approved', id, { hours: t.hours, employee_id: t.employee_id }, user.id);
    }
    this.addAudit(user.id, decision.toLowerCase(), 'timesheet', id);
    this.notify();
  }

  // Expenses
  public getExpenses(user: User): Expense[] {
    let list = this.state.expenses;
    if (['admin', 'hr'].includes(user.role)) {
      return [...list].sort((a, b) => b.id - a.id);
    }
    if (user.role === 'manager') {
      return list.filter((e) => e.employee_id === user.id || e.manager_id === user.id).sort((a, b) => b.id - a.id);
    }
    return list.filter((e) => e.employee_id === user.id).sort((a, b) => b.id - a.id);
  }

  public submitExpense(category: string, amount: number, detail: string, user: User): Expense {
    if (!category || !amount || !detail) {
      throw new Error('Category, amount and detail are required');
    }
    const amt = Number(amount);
    if (isNaN(amt) || amt < 0.01 || amt > 5000) {
      throw new Error('Amount must be between GBP 0.01 and 5,000.00');
    }

    const nextId = (this.state.expenses.length ? Math.max(...this.state.expenses.map((e) => e.id)) : 0) + 1;
    const exp: Expense = {
      id: nextId,
      employee_id: user.id,
      employee: user.name,
      category: category.slice(0, 60),
      amount: amt,
      detail: detail.slice(0, 500),
      status: 'Submitted',
      manager_id: user.manager_id || 4,
      created: now(),
    };

    this.state.expenses.unshift(exp);
    this.addAudit(user.id, 'submit', 'expense', nextId, category);
    this.notify();
    return exp;
  }

  public decideExpense(id: number, decision: 'Approved' | 'Rejected', user: User) {
    if (!['manager', 'hr', 'admin'].includes(user.role)) {
      throw new Error('Only managers and HR can review expenses');
    }
    const exp = this.state.expenses.find((e) => e.id === id);
    if (!exp) throw new Error('Expense not found');
    if (exp.status !== 'Submitted') throw new Error('Already reviewed');
    if (user.role === 'manager' && exp.manager_id !== user.id) {
      throw new Error('Not your team');
    }

    exp.status = decision;
    this.addAudit(user.id, decision.toLowerCase(), 'expense', id);
    this.notify();
  }

  // HR Cases
  public getHRCases(user: User): HRCase[] {
    if (!['hr', 'admin'].includes(user.role)) return [];
    return [...this.state.hr_cases].sort((a, b) => b.id - a.id);
  }

  public createHRCase(employeeId: number, category: string, title: string, details: string, user: User): HRCase {
    if (!['hr', 'admin'].includes(user.role)) {
      throw new Error('People Services access required to open HR cases');
    }
    const emp = this.state.users.find((u) => u.id === employeeId);
    if (!emp) throw new Error('Employee not found');

    const nextId = (this.state.hr_cases.length ? Math.max(...this.state.hr_cases.map((h) => h.id)) : 0) + 1;
    const c: HRCase = {
      id: nextId,
      employee_id: employeeId,
      employee: emp.name,
      category: (category || 'People Services').slice(0, 60),
      title: title.slice(0, 150),
      details: details.slice(0, 1800),
      status: 'Open',
      owner_id: user.id,
      created: now(),
    };

    this.state.hr_cases.unshift(c);
    this.addAudit(user.id, 'create', 'case', nextId, 'Optional HR casework demonstrator');
    this.notify();
    return c;
  }

  public closeHRCase(id: number, user: User) {
    if (!['hr', 'admin'].includes(user.role)) {
      throw new Error('People Services access required to close HR cases');
    }
    const c = this.state.hr_cases.find((h) => h.id === id);
    if (!c) throw new Error('Case not found');
    if (c.status === 'Closed') throw new Error('Already closed');

    c.status = 'Closed';
    this.addAudit(user.id, 'close', 'case', id);
    this.notify();
  }

  // Integrations
  public getIntegrations(user: User) {
    return {
      systems: this.state.integrations,
      events: [...this.state.integration_events].sort((a, b) => b.id - a.id),
    };
  }

  public processIntegration(id: number, simulateFail: boolean, user: User) {
    if (user.role !== 'admin') {
      throw new Error('System Administrator role required');
    }
    const ev = this.state.integration_events.find((e) => e.id === id);
    if (!ev) throw new Error('Integration event not found');
    if (ev.status === 'Delivered') throw new Error('Already delivered');

    ev.attempts += 1;
    ev.status = simulateFail ? 'Failed' : 'Delivered';
    ev.error = simulateFail ? 'Simulated remote timeout' : null;
    ev.updated = now();

    this.addAudit(user.id, simulateFail ? 'mock-failure' : 'mock-send', 'integration', id, ev.status);
    this.notify();
    return ev;
  }

  public retryIntegration(id: number, user: User) {
    if (!['admin', 'hr'].includes(user.role)) {
      throw new Error('Only administrator or People Services can retry integration events');
    }
    const ev = this.state.integration_events.find((e) => e.id === id);
    if (!ev) throw new Error('Integration event not found');
    ev.attempts += 1;
    ev.status = 'Delivered';
    ev.error = null;
    ev.updated = now();
    this.addAudit(user.id, 'retry', 'integration', id, 'Recovered from staging buffer');
    this.notify();
    return ev;
  }

  public triggerTestIntegration(system: string, user: User) {
    if (!['admin', 'hr'].includes(user.role)) {
      throw new Error('Only administrator or People Services can trigger integration tests');
    }
    const nextId = (this.state.integration_events.length ? Math.max(...this.state.integration_events.map((e) => e.id)) : 0) + 1;
    this.stageEvent(system, 'health-verification-ping', nextId, { ping: 'ok', triggered_by: user.name, timestamp: now() }, user.id);
    this.notify();
  }

  // Reports
  public getReport(group: 'department' | 'cost_center' | 'grade', metric: 'headcount' | 'fte' | 'salary', filter: string, user: User) {
    if (metric === 'salary' && !['admin', 'hr', 'payroll', 'service'].includes(user.role)) {
      throw new Error('Pay figures restricted');
    }

    let active = this.state.users.filter((u) => u.active === 1);
    if (user.role === 'manager') {
      active = active.filter((u) => u.id === user.id || u.manager_id === user.id);
    }
    if (filter) {
      const q = filter.toLowerCase().trim();
      active = active.filter(
        (u) =>
          u.department.toLowerCase().includes(q) ||
          u.cost_center.toLowerCase().includes(q) ||
          u.grade.toLowerCase().includes(q)
      );
    }

    const groups: Record<string, number> = {};
    for (const u of active) {
      const label = u[group] || 'Unassigned';
      if (!groups[label]) groups[label] = 0;
      if (metric === 'headcount') {
        groups[label] += 1;
      } else if (metric === 'fte') {
        groups[label] += u.fte;
      } else if (metric === 'salary') {
        groups[label] += u.salary;
      }
    }

    const items = Object.entries(groups)
      .map(([label, val]) => ({
        label,
        value: Math.round(val * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value);

    const total = Math.round(items.reduce((s, i) => s + i.value, 0) * 100) / 100;
    this.addAudit(user.id, 'run', 'report', 0, `${group}/${metric}`);

    return { group, metric, items, total };
  }

  // Private Messages (BCC)
  public getMessages(user: User): Message[] {
    const received = this.state.message_recipients
      .filter((mr) => mr.recipient_id === user.id)
      .map((mr) => {
        const msg = this.state.messages.find((m) => m.id === mr.message_id);
        const sender = this.state.users.find((u) => u.id === msg?.sender_id);
        return msg
          ? {
              ...msg,
              sender: sender?.name || 'System',
              read_at: mr.read_at,
            }
          : null;
      })
      .filter(Boolean) as Message[];

    return received.sort((a, b) => b.id - a.id);
  }

  public sendMessage(subject: string, body: string, recipientIds: number[], forceNotify: boolean, user: User) {
    if (!['admin', 'hr', 'manager', 'service', 'recruiter', 'learning'].includes(user.role)) {
      throw new Error('Permission denied to compose messages');
    }
    if (!subject || !body || !recipientIds.length) {
      throw new Error('Subject, body, and at least one recipient are required');
    }
    if (subject.length > 255) {
      throw new Error('Subject exceeds maximum 255 characters');
    }
    if (body.length > 4000) {
      throw new Error('Message body exceeds maximum 4,000 characters');
    }
    if (recipientIds.length > 100) throw new Error('Maximum 100 recipients allowed');

    const nextId = (this.state.messages.length ? Math.max(...this.state.messages.map((m) => m.id)) : 0) + 1;
    const msg: Message = {
      id: nextId,
      subject,
      body,
      sender_id: user.id,
      sender: user.name,
      force_notify: !!forceNotify,
      created: now(),
      recipients: recipientIds,
    };

    this.state.messages.unshift(msg);

    for (const rId of recipientIds) {
      this.state.message_recipients.push({
        message_id: nextId,
        recipient_id: rId,
        read_at: null,
      });
    }

    this.addAudit(user.id, 'send', 'message', nextId, 'BCC-style private recipients; notifications are locally queued only');
    this.notify();
    return { id: nextId, recipient_count: recipientIds.length };
  }

  public markMessageRead(messageId: number, user: User) {
    const mr = this.state.message_recipients.find(
      (r) => r.message_id === messageId && r.recipient_id === user.id
    );
    if (!mr) throw new Error('Not your message');
    mr.read_at = now();
    this.notify();
  }

  // Dashboard Stats
  public getDashboardStats(user: User) {
    const role = user.role;
    const own = user.id;
    const people = this.state.users.filter((u) => u.active === 1).length;

    let pendingLeave = 0;
    if (['admin', 'hr'].includes(role)) {
      pendingLeave = this.state.leave_requests.filter((l) => l.status === 'Pending').length;
    } else if (role === 'manager') {
      pendingLeave = this.state.leave_requests.filter((l) => l.manager_id === own && l.status === 'Pending').length;
    } else {
      pendingLeave = this.state.leave_requests.filter((l) => l.employee_id === own && l.status === 'Pending').length;
    }

    const openTasks = this.state.tasks.filter((t) => t.status === 'Open' && (t.assigned_to === own || role === 'admin')).length;
    const apps = this.state.applications.length;
    const courses = this.state.courses.length;
    const hires = this.state.applications.filter((a) => a.worker_id !== null && a.worker_id !== undefined).length;
    const pendingInt = this.state.integration_events.filter((e) => e.status !== 'Delivered').length;

    const unreadMessages = this.state.message_recipients.filter(
      (mr) => mr.recipient_id === own && !mr.read_at
    ).length;

    const activity = (['admin', 'hr', 'payroll', 'recruiter', 'service'].includes(role)
      ? this.state.audit
      : this.state.audit.filter((a) => a.actor_id === own)
    ).slice(0, 9);

    return {
      headcount: people,
      target_population: 8000,
      pending_leave: pendingLeave,
      open_tasks: openTasks,
      applications: apps,
      courses,
      new_hires: hires,
      pending_integrations: pendingInt,
      activity,
      unread_messages: unreadMessages,
      note: 'Illustrative people records; 8,000 is opportunity pricing baseline, not loaded demo records.',
    };
  }

  // Audit
  public getAudit(user: User): AuditEvent[] {
    if (!['hr', 'payroll', 'service', 'admin'].includes(user.role)) return [];
    return this.state.audit.slice(0, 250);
  }

  // Reset
  public resetDemo(phrase: string, user: User) {
    if (user.role !== 'admin') {
      throw new Error('Only System Administrator (Sofia Bennett) can reset the demo.');
    }
    if (phrase !== 'RESET DEMO') {
      throw new Error('Type RESET DEMO to confirm');
    }

    const fresh = getInitialState();
    this.state = fresh;
    this.setCandidateToken('sc_app_maya_evans_demo');
    this.addAudit(user.id, 'reset', 'system', 0, 'Demonstration dataset restored to clean baseline');
    this.notify();
  }
}

export const store = new SheffieldStore();
