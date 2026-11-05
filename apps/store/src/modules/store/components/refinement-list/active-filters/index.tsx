"use client";

import { X } from "lucide-react";

interface ActiveFilter {
  key: string;
  value: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string, value?: string) => void;
  onClear: () => void;
}

const ActiveFilters = ({ filters, onRemove, onClear }: ActiveFiltersProps) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          type="button"
          onClick={() => onRemove(filter.key, filter.value)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
        >
          {filter.label}
          <X className="size-3" />
        </button>
      ))}
    </div>
  );
};

export default ActiveFilters;
