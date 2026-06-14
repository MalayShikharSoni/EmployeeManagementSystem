// src/types/socketTypes.ts

// Basic interface matching what the client expects
export interface ClientTask {
  id: number;
  title: string;
  description: string;
  category: string;
  due_date: string;
  priority: string;
  is_overdue: boolean;
  status: string;
  created_at: string;
  attachment_count: number;
  // Join fields
  employee_name?: string;
  admin_name?: string;
}

export interface ClientInvitation {
  id: number;
  status: string;
  created_at: string;
  admin_id?: number;
  admin_name?: string;
  admin_email?: string;
  employee_id?: number;
  first_name?: string;
  email?: string;
}

export interface ClientNotification {
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

export interface ServerToClientEvents {
  'task:assigned': (task: ClientTask) => void;
  'task:statusChanged': (update: { taskId: number; status: string }) => void;
  'invitation:received': (invitation: ClientInvitation) => void;
  'invitation:responded': (response: { invitationId: number; status: string }) => void;
  'notification:new': (notification: ClientNotification) => void;
  'comment:new': (comment: any) => void; // for feature 6
}

export interface ClientToServerEvents {
  'join:room': (roomId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: number;
  role: string;
}
