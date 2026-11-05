"use client";

import { Checkbox } from "@paydusa/design-system/components/checkbox";
import { cn } from "@paydusa/design-system/lib/utils";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";

interface FilterCheckboxGroupProps {
  title: string;
  options: {
    value: string;
    label: string;
    count?: number;
  }[];
  selected: string[];
  onChange: (values: string[]) => void;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const FilterCheckboxGroup = ({
  title,
  options,
  selected,
  onChange,
  collapsible = true,
  defaultOpen = true,
}: FilterCheckboxGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = useCallback(
    (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(next);
    },
    [selected, onChange]
  );

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-3">
      <button
        type="button"
        className={cn(
          "group flex w-full items-center justify-between text-left",
          collapsible && "cursor-pointer"
        )}
        onClick={() => collapsible && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">{title}</span>
        {collapsible && (
          <ChevronDown
            className={cn(
              "text-muted-foreground size-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-y-2">
          {options.map((option) => {
            const isChecked = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className="group/option flex items-center gap-x-2"
              >
                <Checkbox
                  id={option.value}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="text-muted-foreground hover:text-foreground flex flex-1 items-center gap-2 text-sm transition-colors hover:cursor-pointer"
                >
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                      {option.count}
                    </span>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterCheckboxGroup;
