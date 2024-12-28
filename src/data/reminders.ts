import { addDays, isSameDay, isAfter, isBefore, subDays } from "date-fns";
import { proxy, subscribe } from "valtio";
import { derive } from "derive-valtio";

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

export type Filter = keyof typeof FILTERS;

let defaultState: Reminder[] = [];
if (import.meta.env.VITE_USE_MOCK) {
  defaultState = (await import("../../mock_reminders.json"))
    .default as unknown as Reminder[];
}

export const state = proxy({
  reminders: defaultState,
  filter: FILTERS.All as Filter,
  currentEdit: "",
  addReminder(input: Pick<Reminder, "title" | "notes" | "dueDate">) {
    const reminder: Reminder = {
      ...input,
      id: crypto.randomUUID(),
      isDone: false,
      tags: [],
      created: new Date().toDateString(),
      updated: new Date().toDateString(),
    };
    state.reminders.push(reminder);
  },
  deleteReminder(id: string) {
    state.reminders = state.reminders.filter((r: Reminder) => r.id !== id);
  },
  toggleIsDone(id: string) {
    state.reminders = state.reminders.map((r) => {
      if (r.id === id) {
        r.isDone = !r?.isDone;
      }
      return r;
    });
  },
  setFilter(filter: Filter) {
    state.filter = filter;
    state.currentEdit = "";
  },
  setCurrentEdit(id: string) {
    state.currentEdit = id;
  },
  updateReminder(input: Partial<Reminder>) {
    state.reminders = state.reminders.map((r) => {
      if (r.id === input.id) {
        r = { ...r, ...input, updated: new Date().toDateString() };
      }
      return r;
    });
  },
});

function getFilterPredicate<T extends Reminder>(
  filter: Filter
): (r: T) => boolean {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = subDays(today, 1);

  switch (filter) {
    case FILTERS.Today:
      return (r: T) => isSameDay(new Date(r.dueDate), today) && !r.isDone;
    case FILTERS.Tomorrow:
      return (r: T) => isSameDay(new Date(r.dueDate), tomorrow) && !r.isDone;
    case FILTERS.Upcomming:
      return (r: T) => isAfter(new Date(r.dueDate), today) && !r.isDone;
    case FILTERS.Overdue:
      return (r: T) => isBefore(new Date(r.dueDate), yesterday) && !r.isDone;
    case FILTERS.Completed:
      return (r: T) => !!r.isDone;
    case FILTERS.All:
    default:
      return () => true;
  }
}

subscribe(state, async () => console.log(state));

export default state;

export const filteredRemindersState = derive({
  filteredReminders: (get) => {
    const { reminders, filter } = get(state);

    const predicate = getFilterPredicate(filter);
    return reminders.filter(predicate);
  },
});
