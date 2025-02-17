import { addDays, isSameDay, isAfter, isBefore, subDays } from "date-fns";
import { v4 as uuid } from "uuid";
import { computed, signal } from "@preact/signals-react";

import { SQLocalKysely } from "sqlocal/kysely";
import { Kysely, sql } from "kysely";

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

// Initialize SQLocalKysely and pass the dialect to Kysely
const { dialect } = new SQLocalKysely("database.sqlite3");

// Define your schema
// (passed to the Kysely generic above)
type DB = {
  reminders: Reminder;
  filter: {
    filter: Filter;
  };
  currentEdit: {
    currentEdit: string;
  };
};

const db = new Kysely<DB>({ dialect });

await sql`
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  title TEXT,
  dueDate TEXT,
  isDone BOOLEAN,
  notes TEXT,
  tags TEXT[],
  created TEXT,
  updated TEXT
);
CREATE TABLE IF NOT EXISTS filter (
  filter TEXT
);
CREATE TABLE IF NOT EXISTS currentEdit (
  currentEdit TEXT
);

INSERT INTO "currentEdit" ("currentEdit")
SELECT ''
WHERE NOT EXISTS (
    SELECT 1 FROM "currentEdit"
);

INSERT INTO "filter" ("filter")
SELECT 'all'
WHERE NOT EXISTS (
    SELECT 1 FROM "filter"
);
  `.execute(db);

export default db;

export function createRemindersStore() {
  const reminders = signal<Reminder[]>([]);
  const filter = signal<Filter>(FILTERS.All);
  const currentEdit = signal<string | null>(null);

  const selectedReminder = computed(() => {
    return reminders.value.find(({ id }) => id === currentEdit.value);
  });
  const filteredReminders = computed(() => {
    const predicate = getFilterPredicate(filter.value);
    return reminders.value.filter(predicate);
  });

  async function init() {
    await loadReminders();
    await loadFilter();
    await loadCurrentEdit();
  }

  async function loadReminders() {
    const _reminders = await db.selectFrom("reminders").selectAll().execute();
    reminders.value = _reminders;
  }

  async function loadFilter() {
    const _filter = await db
      .selectFrom("filter")
      .select("filter")
      .executeTakeFirst();
    filter.value = _filter?.filter || FILTERS.All;
  }

  async function loadCurrentEdit() {
    const _currentEdit = await db
      .selectFrom("currentEdit")
      .select("currentEdit")
      .executeTakeFirst();

    currentEdit.value = _currentEdit?.currentEdit || "";
  }

  async function addReminder(input: Partial<Reminder>) {
    await db
      .insertInto("reminders")
      .values({
        id: uuid(),
        ...input,
        created: new Date().toISOString(),
        isDone: false,
        updated: new Date().toISOString(),
      } as Reminder)
      .execute();
    await loadReminders();
  }

  async function editReminder(input: Partial<Reminder>) {
    await db
      .updateTable("reminders")
      .set({ ...input, updated: new Date().toISOString() })
      .where("id", "=", input.id as string)
      .execute();

    await loadReminders();
  }

  async function deleteReminder(id: string) {
    db.deleteFrom("reminders").where("id", "=", id).execute();
    await loadReminders();
  }

  async function setCurrentEdit(_currentEdit: string) {
    await db
      .updateTable("currentEdit")
      .set({ currentEdit: _currentEdit })
      .executeTakeFirst();
    await loadCurrentEdit();
  }

  async function setFilter(_filter: Filter) {
    await db.updateTable("filter").set({ filter: _filter }).executeTakeFirst();
    await loadFilter();
  }

  return {
    reminders,
    filteredReminders,
    filter,
    currentEdit,
    selectedReminder,
    init,
    addReminder,
    editReminder,
    deleteReminder,
    setCurrentEdit,
    setFilter,
  };
}

export const RemindersStore = createRemindersStore();

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
