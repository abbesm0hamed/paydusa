"use client";

import type { OptionValueGroup } from "@lib/data/product-options";
import { Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FilterOption } from "../../../../types/filters";
import ActiveFilters from "./active-filters";
import FilterCheckboxGroup from "./filter-checkbox-group";
import FilterPriceRange from "./filter-price-range";
import { SortOptions } from "./sort-products";
import SortProducts from "./sort-products";

type RefinementListProps = {
  sortBy: SortOptions;
  categories?: FilterOption[];
  collections?: FilterOption[];
  types?: FilterOption[];
  tags?: FilterOption[];
  optionValues?: Record<string, OptionValueGroup>;
};

const FILTER_KEYS = [
  "type_id",
  "tag_id",
  "collection_id",
  "category_id",
  "option_value_id",
  "price_from",
  "price_to",
] as const;

const RefinementList = ({
  sortBy,
  categories = [],
  collections = [],
  types = [],
  tags = [],
  optionValues,
}: RefinementListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileDrawerOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileDrawerOpen]);

  const filters = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        result[key] = values;
      }
    }
    return result;
  }, [searchParams]);

  const activeCount = useMemo(
    () =>
      Object.entries(filters).filter(([, values]) =>
        values.some((v) => v.length > 0)
      ).length,
    [filters]
  );

  const buildUrl = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          for (const v of value) {
            params.append(key, v);
          }
        } else {
          params.set(key, value);
        }
      }
      const query = params.toString();
      return `${pathname}${query ? `?${query}` : ""}`;
    },
    [pathname, searchParams]
  );

  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      router.push(buildUrl({ [key]: value }), { scroll: false });
    },
    [router, buildUrl]
  );

  const removeFilter = useCallback(
    (key: string, value?: string) => {
      if (value) {
        const current = searchParams.getAll(key);
        const next = current.filter((v) => v !== value);
        router.push(buildUrl({ [key]: next.length > 0 ? next : null }), {
          scroll: false,
        });
      } else {
        router.push(buildUrl({ [key]: null }), { scroll: false });
      }
    },
    [router, buildUrl, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    for (const key of FILTER_KEYS) {
      params.delete(key);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const setQueryParams = useCallback(
    (name: string, value: string) => {
      router.push(buildUrl({ [name]: value }), { scroll: false });
    },
    [router, buildUrl]
  );

  const resolveLabel = useCallback(
    (key: string, value: string): string => {
      const optionMap: Record<string, FilterOption[]> = {
        type_id: types,
        tag_id: tags,
        collection_id: collections,
        category_id: categories,
      };

      const options = optionMap[key];
      if (options) {
        const match = options.find((o) => o.value === value);
        if (match) {
          return match.label;
        }
      }

      if (key === "option_value_id" && optionValues) {
        for (const group of Object.values(optionValues)) {
          const match = group.values.find((v) => v.id === value);
          if (match) {
            return `${group.option_title}: ${match.value}`;
          }
        }
      }

      return value;
    },
    [types, tags, collections, categories, optionValues]
  );

  const activeFilters = useMemo(() => {
    const result: {
      key: string;
      value: string;
      label: string;
    }[] = [];

    for (const [key, values] of Object.entries(filters)) {
      if (key === "price_from") {
        result.push({
          key: "price_from",
          value: values[0],
          label: `From $${values[0]}`,
        });
        continue;
      }
      if (key === "price_to") {
        result.push({
          key: "price_to",
          value: values[0],
          label: `Up to $${values[0]}`,
        });
        continue;
      }
      for (const v of values) {
        result.push({ key, value: v, label: resolveLabel(key, v) });
      }
    }

    return result;
  }, [filters, resolveLabel]);

  const handlePriceChange = useCallback(
    (key: string, value: string | null) => {
      router.push(buildUrl({ [key]: value }), { scroll: false });
    },
    [router, buildUrl]
  );

  const filterContent = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4" />
          <span className="text-sm font-medium">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <ActiveFilters
          filters={activeFilters}
          onRemove={removeFilter}
          onClear={clearFilters}
        />
      )}

      <div className="border-t border-border" />

      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid="sort-by-container"
      />

      <div className="border-t border-border" />

      {categories.length > 0 && (
        <>
          <FilterCheckboxGroup
            title="Categories"
            options={categories}
            selected={filters.category_id ?? []}
            onChange={(values) => setFilter("category_id", values)}
          />
          <div className="border-t border-border" />
        </>
      )}

      {collections.length > 0 && (
        <>
          <FilterCheckboxGroup
            title="Collections"
            options={collections}
            selected={filters.collection_id ?? []}
            onChange={(values) => setFilter("collection_id", values)}
          />
          <div className="border-t border-border" />
        </>
      )}

      {types.length > 0 && (
        <>
          <FilterCheckboxGroup
            title="Product Type"
            options={types}
            selected={filters.type_id ?? []}
            onChange={(values) => setFilter("type_id", values)}
          />
          <div className="border-t border-border" />
        </>
      )}

      {tags.length > 0 && (
        <>
          <FilterCheckboxGroup
            title="Tags"
            options={tags}
            selected={filters.tag_id ?? []}
            onChange={(values) => setFilter("tag_id", values)}
          />
          <div className="border-t border-border" />
        </>
      )}

      {optionValues && Object.entries(optionValues).length > 0 && (
        <>
          {Object.entries(optionValues).map(([optionTitle, group]) => (
            <div key={group.option_id}>
              <FilterCheckboxGroup
                title={optionTitle}
                options={group.values.map((v) => ({
                  value: v.id,
                  label: v.value,
                  count: v.count,
                }))}
                selected={filters.option_value_id ?? []}
                onChange={(values) => setFilter("option_value_id", values)}
              />
            </div>
          ))}
          <div className="border-t border-border" />
        </>
      )}

      <FilterPriceRange
        priceFrom={filters.price_from?.[0]}
        priceTo={filters.price_to?.[0]}
        onChange={handlePriceChange}
      />
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden small:block small:w-[260px] small:min-w-[260px] small:mr-6">
        <div className="sticky top-6 space-y-5 bg-card border border-border rounded-xl p-5">
          {filterContent}
        </div>
      </div>

      {/* Mobile bar */}
      <div className="small:hidden w-full mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            <Filter className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {activeCount}
              </span>
            )}
          </button>
          <div className="flex-1">
            <SortProducts
              sortBy={sortBy}
              setQueryParams={setQueryParams}
              data-testid="sort-by-container"
            />
          </div>
        </div>
        {activeCount > 0 && (
          <div className="mt-3">
            <ActiveFilters
              filters={activeFilters}
              onRemove={removeFilter}
              onClear={clearFilters}
            />
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 small:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div
            ref={drawerRef}
            className="fixed inset-y-0 left-0 w-[85vw] max-w-[360px] bg-background shadow-xl z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter className="size-4" />
                <span className="text-sm font-medium">Filters</span>
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 hover:bg-accent rounded-md transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 space-y-5">{filterContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default RefinementList;
