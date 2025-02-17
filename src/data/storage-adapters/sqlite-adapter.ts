import { SQLocalKysely } from "sqlocal/kysely";
import { Kysely, sql } from "kysely";
import { Filter, Reminder } from "@/data/types";
import { BaseStoreAdapter } from "@/data/storage-adapters/base-adapter";

const { dialect } = new SQLocalKysely("database.sqlite3");

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

export class SQLStoreAdapter implements BaseStoreAdapter {
  async getReminders() {
    return await db.selectFrom("reminders").selectAll().execute();
  }

  async addReminder(input: Reminder) {
    await db.insertInto("reminders").values(input).execute();
  }

  async editReminder(input: Partial<Reminder>) {
    await db
      .updateTable("reminders")
      .set(input)
      .where("id", "=", input.id as string)
      .execute();
  }

  async deleteReminder(id: string) {
    db.deleteFrom("reminders").where("id", "=", id).execute();
  }

  async getFilter() {
    const res = await db
      .selectFrom("filter")
      .select("filter")
      .executeTakeFirst();
    return res?.filter || "";
  }

  async setFilter(filter: Filter) {
    await db.updateTable("filter").set({ filter }).executeTakeFirst();
  }

  async getCurrentEdit() {
    const res = await db
      .selectFrom("currentEdit")
      .select("currentEdit")
      .executeTakeFirst();

    return res?.currentEdit || "";
  }

  async setCurrentEdit(currentEdit: string) {
    await db.updateTable("currentEdit").set({ currentEdit }).executeTakeFirst();
  }
}
