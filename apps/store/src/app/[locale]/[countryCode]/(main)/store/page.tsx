import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { listProductFilterOptions } from "@lib/data/product-options";
import { listProductTags } from "@lib/data/product-tags";
import { listProductTypes } from "@lib/data/product-types";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  description: "Explore all of our products.",
  title: "Store",
};

interface Params {
  searchParams: Promise<{
    sortBy?: SortOptions;
    page?: string;
    type_id?: string | string[];
    tag_id?: string | string[];
    collection_id?: string | string[];
    price_from?: string;
    price_to?: string;
  }>;
  params: Promise<{
    countryCode: string;
  }>;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

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
  searchParams: Promise<{
    sortBy?: SortOptions;
    page?: string;
    type_id?: string | string[];
    tag_id?: string | string[];
    collection_id?: string | string[];
    price_from?: string;
    price_to?: string;
  }>;
  countryCode: string;
}) {
  const { sortBy, page, type_id, tag_id, collection_id, price_from, price_to } =
    await searchParams;

  const typeId = toArray(type_id);
  const tagId = toArray(tag_id);
  const collectionId = toArray(collection_id);

  const [types, tags, categories, { collections }, optionValues] =
    await Promise.all([
      listProductTypes(),
      listProductTags(),
      listCategories(),
      listCollections(),
      listProductFilterOptions(),
    ]);

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      categories={categories.map((c) => ({
        label: c.name,
        value: c.id,
      }))}
      collections={collections.map((c) => ({
        label: c.title,
        value: c.id,
      }))}
      types={types.map((t) => ({
        label: t.value,
        value: t.id,
      }))}
      tags={tags.map((t) => ({
        label: t.value,
        value: t.id,
      }))}
      optionValues={optionValues.option_values}
      typeId={typeId}
      tagId={tagId}
      collectionId={collectionId}
      priceFrom={price_from}
      priceTo={price_to}
    />
  );
}
