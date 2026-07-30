"use client";

import { Checkbox } from "@ecommerce/ui/components/checkbox";
import { cn } from "@ecommerce/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";

type FilterCheckboxGroupProps = {
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
};

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
          "flex items-center justify-between w-full text-left group",
          collapsible && "cursor-pointer"
        )}
        onClick={() => collapsible && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">{title}</span>
        {collapsible && (
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200 text-muted-foreground",
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
                className="flex items-center gap-x-2 group/option"
              >
                <Checkbox
                  id={option.value}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="flex-1 flex items-center gap-2 text-sm text-muted-foreground hover:cursor-pointer hover:text-foreground transition-colors"
                >
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground ml-auto tabular-nums">
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
