export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  creatorId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  assignedTo?: User;
}

export interface DashboardData {
  assignedTasks: Task[];
  createdTasks: Task[];
  overdueTasks: Task[];
  stats: {
    assigned: {
      total: number;
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
    };
    created: {
      total: number;
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
    };
  };
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}