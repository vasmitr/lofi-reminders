import { proxy, subscribe } from "valtio";

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

export const remindersSlice = proxy({
  reminders: defaultState,
  addReminder(input: Reminder) {
    remindersSlice.reminders.push(input);
  },
  deleteReminder(id: string) {
    remindersSlice.reminders = remindersSlice.reminders.filter(
      (r: Reminder) => r.id !== id
    );
  },
  toggleIsDone(id: string) {
    const reminder = remindersSlice.reminders.find((r) => r.id === id);

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    reminder.isDone = !reminder?.isDone;
  },
});

subscribe(remindersSlice, async () => console.log(remindersSlice));
