import { Filter, FILTERS } from "@/data/types";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface PropTypes {
  value: Filter;
  onChange: (value: Filter) => void;
}

export function ReminderFilter({ onChange, value }: PropTypes) {
  const entries = Object.entries(FILTERS);

  const handleChange = (value: Filter) => {
    onChange(value || FILTERS.All);
  };
  return (
    <div className="p-1 bg-slate-50">
      <ToggleGroup
        className="flex xs:flex-wrap sm:flex-nowrap"
        type="single"
        onValueChange={handleChange}
        value={value}
      >
        {entries.map(([name, value]) => (
          <ToggleGroupItem className="rounded-none" key={value} value={value}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
