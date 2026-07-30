"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const FILTER_KEYS = [
  "type_id",
  "tag_id",
  "collection_id",
  "category_id",
  "option_value_id",
  "price_from",
  "price_to",
] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];

export function useFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const result: Record<string, string | string[]> = {};

    for (const key of FILTER_KEYS) {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        result[key] = values.length === 1 ? values[0] : values;
      }
    }

    return result;
  }, [searchParams]);

  const activeCount = useMemo(() => {
    let count = 0;
    for (const key of FILTER_KEYS) {
      const values = searchParams.getAll(key);
      if (key === "price_from" || key === "price_to") {
        if (values.some((v) => v && v.length > 0)) {
          count++;
        }
      } else if (values.length > 0) {
        count++;
      }
    }
    return count;
  }, [searchParams]);

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

  return {
    filters,
    activeCount,
    setFilter,
    removeFilter,
    clearFilters,
  };
}
