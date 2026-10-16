export type Role =
  | 'employee'
  | 'manager'
  | 'hr'
  | 'payroll'
  | 'learning'
  | 'service'
  | 'admin'
  | 'recruiter';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  job: string;
  grade: string;
  manager_id: number | null;
  fte: number;
  salary: number;
  cost_center: string;
  leave_total: number;
  leave_carry: number;
  leave_purchased: number;
  leave_bank: number;
  active: number;
  created: string;
}

export interface Profile {
  phone: string;
  address: string;
  emergency_contact: string;
  updated?: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  manager_id: number;
  leave_type: 'Annual' | 'Carer' | 'Discretionary' | 'Trade union' | 'Sickness' | 'Other';
  start: string;
  ending: string;
  days: number;
  note: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decided_at?: string;
  created: string;
  employee?: string;
}

export interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  grade: string;
  salary: string;
  summary: string;
  cover_required: boolean;
  status: 'Draft' | 'Published' | 'Closed';
  owner_id: number;
  revision: number;
  created: string;
  closing: string;
}

export type ApplicationStage =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Offered'
  | 'Offer Accepted'
  | 'Checks Complete'
  | 'Onboarded'
  | 'Rejected'
  | 'Withdrawn';

export interface Application {
  id: number;
  vacancy_id: number;
  vacancy: string;
  location?: string;
  name: string;
  email: string;
  statement: string;
  cover_letter?: string;
  source: string;
  access_token: string;
  stage: ApplicationStage;
  interview_slot?: string;
  interview_type?: 'Video' | 'In-person';
  interview_feedback?: string;
  interview_score?: number | null;
  offer_status?: string;
  offer_details?: {
    salary: string;
    grade: string;
    start_date: string;
    terms_summary: string;
  };
  offer_accepted_at?: string;
  offer_signature?: string;
  worker_id?: number | null;
  created: string;
  updated: string;
}

export interface CandidateEvent {
  id: number;
  application_id: number;
  title: string;
  body: string;
  event_kind: string;
  created: string;
}

export interface DocumentRecord {
  id: number;
  employee_id: number;
  employee: string;
  name: string;
  doc_type: string;
  classification: string;
  stored_name: string;
  file_content?: string;
  file_size?: string;
  retention_until: string;
  archived: boolean;
  deleted: boolean;
  uploaded_by: number;
  created: string;
}

export interface Task {
  id: number;
  title: string;
  kind: string;
  assigned_to: number;
  owner?: string;
  employee_id: number;
  status: 'Open' | 'Completed';
  due: string;
  notes?: string;
  created: string;
  completed?: string;
}

export interface Course {
  id: number;
  title: string;
  category: string;
  hours: number;
  seats: number;
  description: string;
  booked?: number;
}

export interface Enrolment {
  id: number;
  course_id: number;
  course: string;
  employee_id: number;
  employee: string;
  status: 'Enrolled' | 'Completed' | 'Cancelled';
  created: string;
  completed?: string;
}

export interface PayrollAnomaly {
  id: string;
  severity: 'blocking' | 'warning';
  category: 'timesheet' | 'salary' | 'absence' | 'starter';
  employee_id: number;
  employee_name: string;
  issue: string;
  remediation: string;
  resolved: boolean;
  resolution_note?: string;
  resolved_at?: string;
}

export interface PayrollRun {
  id: number;
  period: string;
  status: 'Draft' | 'Finalised';
  headcount: number;
  gross: number;
  net: number;
  deduction: number;
  anomalies: PayrollAnomaly[];
  anomalies_resolved: boolean;
  bacs_staged: boolean;
  created: string;
  completed?: string;
}

export interface PayrollItem {
  id: number;
  run_id: number;
  employee_id: number;
  period?: string;
  status?: string;
  base_salary: number;
  timesheet_hours?: number;
  timesheet_pay?: number;
  gross: number;
  pension_deduction: number;
  tax_deduction: number;
  deduction: number;
  net: number;
  anomaly_flag?: string;
}

export interface TimeEntry {
  id: number;
  employee_id: number;
  employee: string;
  week_start: string;
  hours: number;
  status: 'Submitted' | 'Approved' | 'Rejected';
  manager_id: number;
}

export interface Expense {
  id: number;
  employee_id: number;
  employee: string;
  category: string;
  amount: number;
  detail: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
  manager_id: number;
  created: string;
}

export interface HRCase {
  id: number;
  employee_id: number;
  employee: string;
  category: string;
  title: string;
  details: string;
  status: 'Open' | 'Closed';
  owner_id: number;
  created: string;
}

export interface Integration {
  id: number;
  name: string;
  method: string;
  description: string;
  status: string;
}

export interface IntegrationEvent {
  id: number;
  system: string;
  event: string;
  entity_id: number;
  payload: string;
  status: 'Queued' | 'Delivered' | 'Failed';
  attempts: number;
  error?: string | null;
  created: string;
  updated: string;
}

export interface Message {
  id: number;
  subject: string;
  body: string;
  sender_id: number;
  sender: string;
  force_notify: boolean;
  created: string;
  recipients?: number[];
  read_at?: string | null;
}

export interface MessageRecipient {
  message_id: number;
  recipient_id: number;
  read_at?: string | null;
}

export interface AuditEvent {
  id: number;
  actor_id: number | null;
  actor: string;
  action: string;
  entity: string;
  entity_id: number;
  detail: string;
  created: string;
}

export interface CapabilityItem {
  id: number;
  area: string;
  process: string;
  proposal: string;
  demo_note: string;
  demo_depth: string;
}
