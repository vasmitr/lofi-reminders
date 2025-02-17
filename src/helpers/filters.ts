import { addDays, isSameDay, isAfter, isBefore, subDays } from "date-fns";
import { Filter, FILTERS, Reminder } from "../data/types";

export function getFilterPredicate<T extends Reminder>(
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
