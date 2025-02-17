import { v4 as uuid } from "uuid";
import { computed, signal } from "@preact/signals-react";
import { BaseStoreAdapter } from "./storage-adapters/base-adapter";
import { SQLStoreAdapter } from "./storage-adapters/sqlite-adapter";
import { Filter, FILTERS, Reminder } from "./types";
import { getFilterPredicate } from "../helpers/filters";

class RemindersStoreClass {
  StoreAdapter: BaseStoreAdapter;

  // Signals
  reminders = signal<Reminder[]>([]);
  filter = signal<Filter>(FILTERS.All);
  currentEdit = signal<string | null>(null);

  // Computed
  selectedReminder = computed(() => {
    return this.reminders.value.find(({ id }) => id === this.currentEdit.value);
  });
  filteredReminders = computed(() => {
    const predicate = getFilterPredicate(this.filter.value);
    return this.reminders.value.filter(predicate);
  });

  constructor(storeAdapter: BaseStoreAdapter) {
    this.StoreAdapter = storeAdapter;

    this.init = this.init.bind(this);
    this.addReminder = this.addReminder.bind(this);
    this.editReminder = this.editReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.setCurrentEdit = this.setCurrentEdit.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  async init() {
    const _reminders = await this.StoreAdapter.getReminders();
    const _filter = await this.StoreAdapter.getFilter();
    const _currentEdit = await this.StoreAdapter.getCurrentEdit();

    this.reminders.value = _reminders;
    this.filter.value = _filter;
    this.currentEdit.value = _currentEdit;
  }

  async addReminder(input: Partial<Reminder>) {
    const newReminder = {
      id: uuid(),
      ...input,
      created: new Date().toISOString(),
      isDone: false,
      updated: new Date().toISOString(),
    } as Reminder;

    this.reminders.value = [...this.reminders.peek(), newReminder];

    await this.StoreAdapter.addReminder(newReminder);
  }

  async editReminder(input: Partial<Reminder>) {
    const update = { ...input, updated: new Date().toISOString() };

    this.reminders.value = this.reminders.peek().map((reminder) => {
      if (reminder.id === input.id) {
        return {
          ...reminder,
          ...update,
        };
      }

      return reminder;
    });

    await this.StoreAdapter.editReminder(update);
  }

  async deleteReminder(id: string) {
    this.reminders.value = this.reminders
      .peek()
      .filter(({ id: _id }) => id !== _id);

    await this.StoreAdapter.deleteReminder(id);
  }

  async setFilter(filter: Filter) {
    this.filter.value = filter;

    await this.StoreAdapter.setFilter(filter);
  }

  async setCurrentEdit(currentEdit: string) {
    this.currentEdit.value = currentEdit;

    await this.StoreAdapter.setCurrentEdit(currentEdit);
  }
}

function remindersStoreFactory(storeAdapter: BaseStoreAdapter) {
  let instance: RemindersStoreClass | null = null;

  if (instance) {
    return instance;
  }

  instance = new RemindersStoreClass(storeAdapter);
  return instance;
}

export const RemindersStore = remindersStoreFactory(new SQLStoreAdapter());
