import { Filter, Reminder } from "../types";

export abstract class BaseStoreAdapter {
  abstract getReminders(): Promise<Reminder[]>;

  abstract addReminder(input: Partial<Reminder>): Promise<void>;

  abstract editReminder(input: Partial<Reminder>): Promise<void>;

  abstract deleteReminder(id: string): Promise<void>;

  abstract getFilter(): Promise<string>;

  abstract setFilter(filter: Filter): Promise<void>;

  abstract getCurrentEdit(): Promise<string>;

  abstract setCurrentEdit(currentEdit: string): Promise<void>;
}
