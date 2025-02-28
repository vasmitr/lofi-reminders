import { get, set, update } from "idb-keyval";
import { Filter, Reminder } from "../types";
import { BaseStoreAdapter } from "../storage-adapters/base-adapter";

export class IDBStoreAdapter implements BaseStoreAdapter {
  async getReminders() {
    const res = await get<Reminder[]>("reminders");

    return res || [];
  }

  async addReminder(input: Reminder) {
    await update<Reminder[]>("reminders", (reminders = []) => {
      return [input, ...reminders];
    });
  }

  async editReminder(input: Partial<Reminder>) {
    await update<Reminder[]>("reminders", (reminders = []) => {
      return reminders?.map((reminder) => {
        if (reminder.id === input.id) {
          return {
            ...reminder,
            ...input,
          };
        }
        return reminder;
      });
    });
  }

  async deleteReminder(id: string) {
    return await update<Reminder[]>("reminders", (reminders = []) => {
      return reminders.filter((reminder) => reminder.id !== id);
    });
  }

  async getFilter() {
    const res = await get<Filter>("filter");
    return res || "";
  }

  async setFilter(filter: Filter) {
    await set("filter", filter);
  }

  async getCurrentEdit() {
    const res = await get<string>("currentEdit");
    return res || "";
  }

  async setCurrentEdit(currentEdit: string) {
    return await set("currentEdit", currentEdit);
  }
}
