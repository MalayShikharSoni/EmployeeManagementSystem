// ── User / Auth ──
export type UserRole = 'admin' | 'employee';

export interface User {
  id: number;
  email: string;
  firstName: string;
  first_name?: string;
  role: UserRole;
  bio?: string;
  phone?: string;
  designation?: string;
  department?: string;
  linkedin_url?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface EmployeeStats {
  employee: User;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  activeTasks: number;
  newTasks: number;
  completionRate: number;
  onTimeRate: number;
  tasksThisMonth: number;
  monthlyTrend: { month: string; count: number }[];
  priorityBreakdown: { priority: string; count: number }[];
  currentTasks: { id: number; title: string; status: string; due_date: string; priority: string; is_overdue: boolean; comment_count?: number }[];
}

export interface LeaderboardEntry {
  employee_id: number;
  first_name: string;
  email: string;
  avatar_url?: string;
  department?: string;
  designation?: string;
  score: number;
  tasks_completed_this_month: number;
  on_time_completions: number;
  high_priority_completions: number;
  urgent_priority_completions: number;
  overdue_tasks: number;
  completion_rate: number;
}

export interface EomRecord {
  id: number;
  admin_id: number;
  employee_id: number;
  month: string;
  score: number;
  snapshot_stats: LeaderboardEntry;
  created_at: string;
  first_name?: string;
  email?: string;
  avatar_url?: string;
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
  attachment_count?: number;
  comment_count?: number;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  uploaded_by: number;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
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
  avatar_url?: string;
  designation?: string;
  department?: string;
  joined_at?: string;
}

export interface Employee {
  id: number;
  first_name: string;
  email: string;
  avatar_url?: string;
}

// ── API Response wrapper ──
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ── Notifications ──
export interface AppNotification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  entity_id: string | null;
  entity_type: string | null;
  is_read: boolean;
  created_at: string;
}

// ── Comments ──
export interface TaskComment {
  id: number;
  task_id: number;
  author_id: number;
  content: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

// ── Project Groups ──
export interface ProjectGroup {
  id: number;
  name: string;
  description: string | null;
  admin_id: number;
  github_repo_url: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  member_count?: number;
  task_count?: number;
  completed_task_count?: number;
  members?: ProjectGroupMember[];
}

export interface ProjectGroupMember {
  id: number;
  group_id: number;
  employee_id: number;
  role_in_group: string | null;
  joined_at: string;
  first_name?: string;
  email?: string;
  avatar_url?: string;
  designation?: string;
}

export interface ProjectTask {
  id: number;
  group_id: number;
  assigned_to: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
  assignee_name?: string;
  assignee_email?: string;
  assignee_avatar?: string;
}

export interface MemberProgress {
  employee_id: number;
  first_name: string;
  email: string;
  avatar_url: string | null;
  total_tasks: number;
  completed_tasks: number;
  active_tasks: number;
  new_tasks: number;
  failed_tasks: number;
  completion_rate: number;
}

export interface GitHubContributor {
  username: string;
  avatar_url: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface CommitTimelineEntry {
  date: string;
  commits: number;
}

export interface GitHubStatsResult {
  contributors: GitHubContributor[];
  commitTimeline: CommitTimelineEntry[];
  totalCommits: number;
  lastFetched: string;
  repoUrl: string;
}

export interface EmployeeGroupTasks {
  group_name: string;
  group_id: number;
  tasks: ProjectTask[];
}

// ── Admin Analytics ──
export interface AdminAnalytics {
  totalTeamMembers: number;
  tasksAssignedThisMonth: number;
  totalTasks: number;
  completionRate: number;
  overdueCount: number;
  avgCompletionDays: number;
  tasksByStatus: {
    new: number;
    active: number;
    completed: number;
    failed: number;
  };
  tasksByPriority: { priority: string; count: number }[];
  mostActiveEmployee: {
    id: number;
    first_name: string;
    email: string;
    avatar_url?: string;
    completed_count: number;
  } | null;
  completionsPerDay: { date: string; count: number }[];
  perEmployeeStats: {
    first_name: string;
    email: string;
    avatar_url?: string;
    total_tasks: number;
    completed: number;
  }[];
}
