import { store, fmt, isodays, today, lastMonday } from './sheffieldStore';
import { User, LeaveRequest } from '../types';

export interface AgentExecutionResult {
  success: boolean;
  message: string;
  actionType: string;
  targetPage?: string;
  highlightId?: string | number;
}

export class AiAgentService {
  /**
   * Main entry point: process voice or text query in fluent, natural English with warm,
   * courteous, human-like executive assistance.
   */
  public static executeCommand(query: string, currentUser: User): AgentExecutionResult {
    const q = query.trim().toLowerCase();
    const firstName = currentUser.name.split(' ')[0];

    // 1. GREETINGS & SMALL TALK
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q.startsWith('good morning') ||
      q.startsWith('good afternoon') ||
      q.startsWith('good evening') ||
      q.includes('how are you') ||
      q === 'help' ||
      q.includes('what can you do')
    ) {
      if (q.includes('how are you')) {
        return {
          success: true,
          actionType: 'smalltalk',
          message: `I'm doing wonderfully, thank you for asking, ${firstName}! I'm ready to assist you with anything across your council workspace. What can I do for you today?`,
        };
      }
      return {
        success: true,
        actionType: 'greeting',
        message: `Hello ${firstName}! It's a pleasure to assist you today. I can help you book leave, submit or review timesheets, post job vacancies, check your payslips, calculate payroll, or navigate anywhere across the platform. Just let me know what you need!`,
      };
    }

    if (q.includes('thank you') || q.includes('thanks') || q.includes('appreciate it')) {
      return {
        success: true,
        actionType: 'gratitude',
        message: `You're very welcome, ${firstName}! Always happy to help. Let me know if there's anything else you'd like me to take care of.`,
      };
    }

    // 2. SWITCH PERSONA
    if (
      q.includes('switch to') ||
      q.includes('login as') ||
      q.includes('become') ||
      q.includes('change user') ||
      q.includes('change persona') ||
      q.includes('switch user') ||
      q.includes('switch persona')
    ) {
      const allUsers = store.getState().users;
      let matchedUser: User | undefined;

      if (q.includes('helen') || q.includes('manager')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('helen') || u.role === 'manager');
      } else if (q.includes('aisha') || q.includes('employee')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('aisha') || u.id === 1);
      } else if (q.includes('grace') || q.includes('recruiter')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('grace') || u.role === 'recruiter');
      } else if (q.includes('priya') || q.includes('hr') || q.includes('people services')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('priya') || u.role === 'hr');
      } else if (q.includes('oliver') || q.includes('payroll')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('oliver') || u.role === 'payroll');
      } else if (q.includes('matthew') || q.includes('director') || q.includes('service')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('matthew') || u.role === 'service');
      } else if (q.includes('sofia') || q.includes('admin') || q.includes('system')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('sofia') || u.role === 'admin');
      } else if (q.includes('daniel')) {
        matchedUser = allUsers.find((u) => u.name.toLowerCase().includes('daniel'));
      }

      if (matchedUser) {
        store.setCurrentUser(matchedUser);
        return {
          success: true,
          actionType: 'switch_persona',
          message: `Certainly! I've switched your workspace session to ${matchedUser.name} (${matchedUser.job}). Your dashboard and permissions have automatically adapted.`,
          targetPage: 'overview',
        };
      }
    }

    // 3. BOOK LEAVE / ABSENCE
    if (
      (q.includes('leave') || q.includes('holiday') || q.includes('absence') || q.includes('vacation')) &&
      (q.includes('book') || q.includes('apply') || q.includes('request') || q.includes('take') || q.includes('schedule'))
    ) {
      const daysMatch = q.match(/(\d+)\s*(days?)/);
      const daysCount = daysMatch ? parseInt(daysMatch[1], 10) : 3;

      let leaveType: LeaveRequest['leave_type'] = 'Annual';
      if (q.includes('sick')) leaveType = 'Sickness';
      else if (q.includes('carer') || q.includes('family')) leaveType = 'Carer';
      else if (q.includes('trade union') || q.includes('union')) leaveType = 'Trade union';
      else if (q.includes('discretionary')) leaveType = 'Discretionary';

      const start = isodays(3);
      const ending = isodays(3 + daysCount - 1);
      const note = `Leave booked with assistance from Sheffield Assistant (${daysCount} days ${leaveType})`;

      try {
        const res = store.createLeaveRequest(currentUser, {
          leave_type: leaveType,
          start,
          ending,
          note,
        });

        return {
          success: true,
          actionType: 'book_leave',
          message: `I've taken care of that for you, ${firstName}! Your request for ${res.days} days of ${leaveType} leave (from ${start} to ${ending}) has been submitted to your line manager for approval. Have a restful time off!`,
          targetPage: 'leave',
          highlightId: res.id,
        };
      } catch (err: any) {
        return {
          success: false,
          actionType: 'book_leave',
          message: `I wasn't able to complete that leave booking: ${err.message}. Please feel free to check your leave balance or select different dates.`,
          targetPage: 'leave',
        };
      }
    }

    // 4. APPROVE LEAVE
    if (
      (q.includes('leave') || q.includes('absence') || q.includes('holiday')) &&
      (q.includes('approve') || q.includes('accept') || q.includes('sign off') || q.includes('confirm'))
    ) {
      const leaves = store.getState().leave_requests.filter((r) => r.status === 'Pending');

      if (leaves.length === 0) {
        return {
          success: true,
          actionType: 'approve_leave',
          message: `Good news, ${firstName}! All team leave requests are currently up to date. There are no pending absence requests waiting for your approval right now.`,
          targetPage: 'leave',
        };
      }

      let targetReq = leaves[0];
      const allUsers = store.getState().users;
      for (const l of leaves) {
        const emp = allUsers.find((u) => u.id === l.employee_id);
        if (emp && q.includes(emp.name.toLowerCase())) {
          targetReq = l;
          break;
        }
      }

      const empName = allUsers.find((u) => u.id === targetReq.employee_id)?.name || `Employee #${targetReq.employee_id}`;

      try {
        store.decideLeaveRequest(targetReq.id, 'Approved', currentUser);
        return {
          success: true,
          actionType: 'approve_leave',
          message: `Done! I've approved ${empName}'s ${targetReq.days}-day ${targetReq.leave_type.toLowerCase()} leave request (${targetReq.start} to ${targetReq.ending}). Their leave balance has been updated accordingly.`,
          targetPage: 'leave',
          highlightId: targetReq.id,
        };
      } catch (err: any) {
        return {
          success: false,
          actionType: 'approve_leave',
          message: `I couldn't approve that leave request: ${err.message}. Please switch to a manager persona such as Helen Walker to sign off team absences.`,
          targetPage: 'leave',
        };
      }
    }

    // 5. SUBMIT TIMESHEET
    if (
      (q.includes('timesheet') || q.includes('hours') || q.includes('attendance')) &&
      (q.includes('submit') || q.includes('enter') || q.includes('log') || q.includes('send'))
    ) {
      const hoursMatch = q.match(/(\d+(\.\d+)?)\s*(hours?|hrs)/);
      const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 37.0;
      const weekStart = lastMonday();

      try {
        const entry = store.submitTimesheet(weekStart, hours, currentUser);
        return {
          success: true,
          actionType: 'submit_timesheet',
          message: `All set, ${firstName}! I've submitted your timesheet of ${hours} hours for the week commencing ${weekStart}. It is now with your manager for review.`,
          targetPage: 'time',
          highlightId: entry.id,
        };
      } catch (err: any) {
        return {
          success: true,
          actionType: 'submit_timesheet',
          message: `Your timesheet status: ${err.message}. You can view your current time entries on screen.`,
          targetPage: 'time',
        };
      }
    }

    // 6. APPROVE TIMESHEET
    if (
      (q.includes('timesheet') || q.includes('hours')) &&
      (q.includes('approve') || q.includes('accept') || q.includes('sign off'))
    ) {
      const pendingTimesheets = store.getState().time_entries.filter((t) => t.status === 'Submitted');

      if (pendingTimesheets.length === 0) {
        return {
          success: true,
          actionType: 'approve_timesheet',
          message: `Everything is in order! There are no unapproved timesheets waiting for your sign-off at the moment.`,
          targetPage: 'time',
        };
      }

      const target = pendingTimesheets[0];
      try {
        store.decideTimesheet(target.id, 'Approved', currentUser);
        return {
          success: true,
          actionType: 'approve_timesheet',
          message: `Successfully approved! I've signed off ${target.employee}'s weekly timesheet for ${target.hours} hours. It is now cleared for the upcoming payroll run.`,
          targetPage: 'time',
          highlightId: target.id,
        };
      } catch (err: any) {
        return {
          success: false,
          actionType: 'approve_timesheet',
          message: `Unable to approve timesheet: ${err.message}. Please ensure you are logged in with managerial or payroll permissions.`,
          targetPage: 'time',
        };
      }
    }

    // 7. CREATE VACANCY / REQUISITION
    if (
      (q.includes('vacancy') || q.includes('job') || q.includes('requisition') || q.includes('post')) &&
      (q.includes('create') || q.includes('post') || q.includes('add') || q.includes('new') || q.includes('draft'))
    ) {
      let title = 'Care Coordinator';
      if (q.includes('social worker')) title = 'Senior Social Worker';
      else if (q.includes('revenues') || q.includes('tax')) title = 'Revenues & Benefits Officer';
      else if (q.includes('project manager') || q.includes('lead')) title = 'Modernisation Project Lead';
      else if (q.includes('engineer') || q.includes('it')) title = 'Cloud Integration Engineer';

      let grade = 'Grade 7';
      if (q.includes('g8') || q.includes('grade 8')) grade = 'Grade 8';
      else if (q.includes('g9') || q.includes('grade 9')) grade = 'Grade 9';
      else if (q.includes('g6') || q.includes('grade 6')) grade = 'Grade 6';

      const department = 'Adult Health & Social Care';
      const closing = isodays(28);

      try {
        const vac = store.createVacancy(currentUser, {
          title,
          department,
          grade,
          closing,
          salary: '£36,922 - £40,221',
          summary: `Sheffield City Council opportunity for an ambitious ${title} to join our connected modernisation programme.`,
        });

        return {
          success: true,
          actionType: 'create_vacancy',
          message: `Requisition created! I've drafted the vacancy for "${vac.title}" (${vac.grade}) under ${vac.department}, with applications closing on ${vac.closing}. You can review and publish it right here on your recruitment dashboard.`,
          targetPage: 'recruit',
          highlightId: vac.id,
        };
      } catch (err: any) {
        return {
          success: false,
          actionType: 'create_vacancy',
          message: `I couldn't create that vacancy: ${err.message}. Please switch to a recruitment or manager profile such as Grace Turner or Helen Walker.`,
          targetPage: 'recruit',
        };
      }
    }

    // 8. RUN OR FINALISE PAYROLL
    if (q.includes('payroll') || q.includes('payslip') || q.includes('salary')) {
      if (q.includes('finalise') || q.includes('export') || q.includes('bacs') || q.includes('finish') || q.includes('publish')) {
        const runs = store.getState().payroll_runs;
        const targetRun = runs[0];

        if (targetRun) {
          try {
            store.finalisePayrollRun(targetRun.id, currentUser);
            return {
              success: true,
              actionType: 'finalise_payroll',
              message: `All done, ${firstName}! The payroll run for period ${targetRun.period} has been finalised. BACS payment disbursement files are ready and payslips are published to staff.`,
              targetPage: 'payroll',
              highlightId: targetRun.id,
            };
          } catch (err: any) {
            return {
              success: false,
              actionType: 'finalise_payroll',
              message: `Unable to finalise payroll: ${err.message}. Please sign in as Oliver Reed (Senior Payroll Officer).`,
              targetPage: 'payroll',
            };
          }
        }
      }

      if (q.includes('run') || q.includes('calculate') || q.includes('compute') || q.includes('start')) {
        const period = '2026-10';
        try {
          const run = store.createPayrollRun(period, currentUser);
          return {
            success: true,
            actionType: 'run_payroll',
            message: `I've calculated the ${period} monthly payroll run for you! It covers ${run.headcount} establishment posts with a total gross of £${fmt(run.gross)} and net disbursement of £${fmt(run.net)}. Everything has reconciled cleanly.`,
            targetPage: 'payroll',
            highlightId: run.id,
          };
        } catch (err: any) {
          return {
            success: true,
            actionType: 'run_payroll',
            message: `Payroll status: ${err.message}. You can inspect current cycle details on the payroll screen.`,
            targetPage: 'payroll',
          };
        }
      }
    }

    // 9. ENROL IN LEARNING
    if (q.includes('course') || q.includes('learning') || q.includes('training')) {
      if (q.includes('enrol') || q.includes('join') || q.includes('start') || q.includes('book') || q.includes('take')) {
        const courses = store.getState().courses;
        let targetCourse = courses[0];

        if (q.includes('cyber') || q.includes('security')) {
          targetCourse = courses.find((c) => c.title.toLowerCase().includes('cyber')) || targetCourse;
        } else if (q.includes('fire') || q.includes('safety')) {
          targetCourse = courses.find((c) => c.title.toLowerCase().includes('fire')) || targetCourse;
        } else if (q.includes('gdpr') || q.includes('data')) {
          targetCourse = courses.find((c) => c.title.toLowerCase().includes('gdpr')) || targetCourse;
        } else if (q.includes('equality') || q.includes('diversity')) {
          targetCourse = courses.find((c) => c.title.toLowerCase().includes('equality')) || targetCourse;
        }

        try {
          const enr = store.enrolCourse(targetCourse.id, currentUser);
          return {
            success: true,
            actionType: 'enrol_course',
            message: `You're all registered! I've enrolled you in "${targetCourse.title}". You can access your course materials and progress tracker anytime in the Learning Hub.`,
            targetPage: 'learning',
            highlightId: enr.id,
          };
        } catch (err: any) {
          return {
            success: true,
            actionType: 'enrol_course',
            message: `Course enrolment note: ${err.message}.`,
            targetPage: 'learning',
          };
        }
      }
    }

    // 10. EXPENSE CLAIM
    if (q.includes('expense') || q.includes('claim')) {
      const amountMatch = q.match(/(£|\$)?\s*(\d+(\.\d+)?)/);
      const amount = amountMatch ? parseFloat(amountMatch[2]) : 42.5;

      let category = 'Travel & Mileage';
      if (q.includes('equipment') || q.includes('monitor') || q.includes('laptop')) category = 'Equipment';
      else if (q.includes('home') || q.includes('broadband')) category = 'Home Working';
      else if (q.includes('food') || q.includes('subsistence') || q.includes('meal')) category = 'Subsistence';

      try {
        const exp = store.submitExpense(
          category,
          amount,
          `Claim submitted via Sheffield Assistant: ${category} (£${amount.toFixed(2)})`,
          currentUser
        );

        return {
          success: true,
          actionType: 'submit_expense',
          message: `I've submitted your ${category} expense claim for £${amount.toFixed(2)}. It has been routed to your line manager for review.`,
          targetPage: 'optional',
          highlightId: exp.id,
        };
      } catch (err: any) {
        return {
          success: false,
          actionType: 'submit_expense',
          message: `Couldn't submit expense claim: ${err.message}.`,
          targetPage: 'optional',
        };
      }
    }

    // 11. COMPLETE TASK
    if (q.includes('task') || q.includes('checklist')) {
      if (q.includes('complete') || q.includes('finish') || q.includes('done')) {
        const tasks = store.getState().tasks.filter((t) => t.status === 'Open');

        if (tasks.length === 0) {
          return {
            success: true,
            actionType: 'complete_task',
            message: `Great news! You have no outstanding tasks pending completion right now.`,
            targetPage: 'tasks',
          };
        }

        const t = tasks[0];
        store.completeTask(t.id, currentUser);
        return {
          success: true,
          actionType: 'complete_task',
          message: `Task completed! I've marked "${t.title}" as complete and updated your compliance record.`,
          targetPage: 'tasks',
          highlightId: t.id,
        };
      }
    }

    // 12. NAVIGATION INTENTS
    const navMap: Record<string, { page: string; title: string }> = {
      overview: { page: 'overview', title: 'Dashboard' },
      dashboard: { page: 'overview', title: 'Dashboard' },
      home: { page: 'overview', title: 'Dashboard' },
      profile: { page: 'profile', title: 'Profile' },
      contact: { page: 'profile', title: 'Contact Information' },
      leave: { page: 'leave', title: 'Absence & Leave' },
      absence: { page: 'leave', title: 'Absence & Leave' },
      holiday: { page: 'leave', title: 'Absence & Leave' },
      time: { page: 'time', title: 'Time & Attendance' },
      timesheet: { page: 'time', title: 'Time & Attendance' },
      attendance: { page: 'time', title: 'Time & Attendance' },
      org: { page: 'org', title: 'Organisation Hierarchy' },
      hierarchy: { page: 'org', title: 'Organisation Hierarchy' },
      establishment: { page: 'org', title: 'Organisation Structure' },
      recruit: { page: 'recruit', title: 'Recruitment & Talent' },
      recruitment: { page: 'recruit', title: 'Recruitment & Talent' },
      candidates: { page: 'recruit', title: 'Recruitment Pipeline' },
      vacancy: { page: 'recruit', title: 'Vacancies' },
      document: { page: 'documents', title: 'Document Records' },
      documents: { page: 'documents', title: 'Document Records' },
      task: { page: 'tasks', title: 'Tasks & Journeys' },
      tasks: { page: 'tasks', title: 'Tasks & Journeys' },
      learning: { page: 'learning', title: 'Learning Hub' },
      course: { page: 'learning', title: 'Learning Hub' },
      courses: { page: 'learning', title: 'Learning Hub' },
      payroll: { page: 'payroll', title: 'Payroll & Payslips' },
      payslip: { page: 'payroll', title: 'Payslips' },
      payslips: { page: 'payroll', title: 'Payslips' },
      report: { page: 'reports', title: 'Workforce Insights' },
      reports: { page: 'reports', title: 'Workforce Insights' },
      analytics: { page: 'reports', title: 'Workforce Insights' },
      insights: { page: 'reports', title: 'Workforce Insights' },
      optional: { page: 'optional', title: 'Claims & Casework' },
      expense: { page: 'optional', title: 'Expense Claims' },
      integration: { page: 'integrations', title: 'Integration Control' },
      integrations: { page: 'integrations', title: 'Integration Control' },
      message: { page: 'messages', title: 'Messages' },
      messages: { page: 'messages', title: 'Messages' },
    };

    for (const [trigger, item] of Object.entries(navMap)) {
      if (q.includes(trigger)) {
        return {
          success: true,
          actionType: 'navigate',
          message: `Opening the ${item.title} section for you right away!`,
          targetPage: item.page,
        };
      }
    }

    // Default friendly assistant fallback
    return {
      success: true,
      actionType: 'chat_assistance',
      message: `I'm here to help, ${firstName}! You can ask me in natural English to book holidays, submit your weekly timesheet, approve team leave requests, post new vacancies, calculate monthly payroll, or switch personas. What would you like me to take care of?`,
    };
  }
}
