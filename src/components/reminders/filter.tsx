import { Filter, FILTERS } from "@/data/reminders";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface PropTypes {
  value: Filter;
  onChange: (value: Filter) => void;
}

export function ReminderFilter({ onChange, value }: PropTypes) {
  const entries = Object.entries(FILTERS);
  return (
    <div className="p-1">
      <ToggleGroup type="single" onValueChange={onChange} defaultValue={value}>
        <ToggleGroupItem value="">All</ToggleGroupItem>
        {entries.map(([name, value]) => (
          <ToggleGroupItem key={value} value={value}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
