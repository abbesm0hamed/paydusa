"use client";

import { Input } from "@ecommerce/design-system/components/input";
import { cn } from "@ecommerce/design-system/lib/utils";
import { useDebounce } from "@lib/hooks/use-debounce";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

type FilterPriceRangeProps = {
  priceFrom?: string;
  priceTo?: string;
  onChange: (key: string, value: string | null) => void;
};

const FilterPriceRange = ({
  priceFrom: initialFrom,
  priceTo: initialTo,
  onChange,
}: FilterPriceRangeProps) => {
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");
  const [isOpen, setIsOpen] = useState(true);
  const debouncedFrom = useDebounce(from, DEBOUNCE_MS);
  const debouncedTo = useDebounce(to, DEBOUNCE_MS);
  const onChangeRef = useRef(onChange);
  const hasMounted = useRef(false);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (hasMounted.current) {
      onChangeRef.current("price_from", debouncedFrom || null);
    }
  }, [debouncedFrom]);

  useEffect(() => {
    if (hasMounted.current) {
      onChangeRef.current("price_to", debouncedTo || null);
    }
  }, [debouncedTo]);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const handleFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        setFrom(value);
      }
    },
    []
  );

  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        setTo(value);
      }
    },
    []
  );

  const handleClear = useCallback(() => {
    setFrom("");
    setTo("");
  }, []);

  const hasValue = from.length > 0 || to.length > 0;

  return (
    <div className="flex flex-col gap-y-3">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">Price range</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200 text-muted-foreground",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div>
          <div className="flex items-center gap-x-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Min"
                value={from}
                onChange={handleFromChange}
                className="pl-6 h-9 text-sm"
                aria-label="Minimum price"
              />
            </div>
            <span className="text-muted-foreground text-sm">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Max"
                value={to}
                onChange={handleToChange}
                className="pl-6 h-9 text-sm"
                aria-label="Maximum price"
              />
            </div>
          </div>
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear price
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPriceRange;
