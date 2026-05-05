// ── User / Auth ──
export type UserRole = 'admin' | 'employee';

export interface User {
  id: number;
  email: string;
  firstName: string;
  first_name?: string;
  role: UserRole;
  created_at?: string;
}

export interface UserData {
  role: UserRole;
  data: User;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// ── Tasks ──
export type TaskStatus = 'new' | 'active' | 'completed' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  due_date: string;
  priority: TaskPriority;
  is_overdue: boolean;
  status: TaskStatus;
  created_by: number;
  assigned_to: number;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  assignee_name?: string;
  assignee_email?: string;
}

export interface TaskCounts {
  active: number;
  new_task: number;
  completed: number;
  failed: number;
}

export interface GroupedEmployeeTasks {
  user_id: number;
  first_name: string;
  email: string;
  tasks: Task[];
  active_count: number;
  new_task_count: number;
  completed_count: number;
  failed_count: number;
}

// ── Invitations ──
export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export interface Invitation {
  id: number;
  status: InvitationStatus;
  created_at: string;
  admin_id: number;
  admin_name: string;
  admin_email: string;
}

export interface PendingInvitation {
  id: number;
  status: InvitationStatus;
  created_at: string;
  employee_id: number;
  first_name: string;
  email: string;
}

export interface TeamMember {
  id: number;
  first_name: string;
  email: string;
  joined_at?: string;
}

export interface Employee {
  id: number;
  first_name: string;
  email: string;
}

// ── API Response wrapper ──
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
