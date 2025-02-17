export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  isDone?: boolean;
  notes?: string;
  tags?: string[];

  created: string;
  updated: string;
}

export const FILTERS = {
  All: "all",
  Today: "today",
  Tomorrow: "tomorrow",
  Upcomming: "upcomming",
  Completed: "completed",
  Overdue: "overdue",
};

export type Filter = (typeof FILTERS)[keyof typeof FILTERS];
