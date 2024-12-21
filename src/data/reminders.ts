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

let defaultState: Reminder[] = [];
if (import.meta.env.VITE_USE_MOCK) {
  defaultState = (await import("../../mock_reminders.json"))
    .default as unknown as Reminder[];
}

export const remindersSlice = {
  reminders: defaultState,
  addReminder(input: Reminder) {
    remindersSlice.reminders.push(input);
  },
  deleteReminder(id: string) {
    remindersSlice.reminders = remindersSlice.reminders.filter(
      (r: Reminder) => r.id !== id
    );
  },
};
