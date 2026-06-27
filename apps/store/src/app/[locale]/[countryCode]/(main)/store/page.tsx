import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
};

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions;
    page?: string;
  }>;
  params: Promise<{
    countryCode: string;
  }>;
};

export default async function StorePage(props: Params) {
  const { countryCode } = await props.params;

  return (
    <Suspense fallback={<SkeletonProductGrid />}>
      <StoreContent
        searchParams={props.searchParams}
        countryCode={countryCode}
      />
    </Suspense>
  );
}

async function StoreContent({
  searchParams,
  countryCode,
}: {
  searchParams: Promise<{ sortBy?: SortOptions; page?: string }>;
  countryCode: string;
}) {
  const { sortBy, page } = await searchParams;

  return (
    <StoreTemplate sortBy={sortBy} page={page} countryCode={countryCode} />
  );
}
