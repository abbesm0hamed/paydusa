import type { OptionValueGroup } from "@lib/data/product-options";
import type { HttpTypes } from "@medusajs/types";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import RefinementList from "@modules/store/components/refinement-list";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import PaginatedProducts from "@modules/store/templates/paginated-products";
import { Suspense } from "react";

import type { FilterOption } from "../../../types/filters";

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  categories,
  types,
  tags,
  optionValues,
  typeId,
  tagId,
  priceFrom,
  priceTo,
}: {
  sortBy?: SortOptions;
  collection: HttpTypes.StoreCollection;
  page?: string;
  countryCode: string;
  categories?: FilterOption[];
  types?: FilterOption[];
  tags?: FilterOption[];
  optionValues?: Record<string, OptionValueGroup>;
  typeId?: string[];
  tagId?: string[];
  priceFrom?: string;
  priceTo?: string;
}) {
  const pageNumber = page ? Number.parseInt(page) : 1;
  const sort = sortBy || "created_at";

  return (
    <div className="small:flex-row small:items-start content-container flex flex-col py-6">
      <RefinementList
        sortBy={sort}
        categories={categories}
        types={types}
        tags={tags}
        optionValues={optionValues}
      />
      <div className="w-full">
        <div className="text-2xl-semi mb-8">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            typeId={typeId}
            tagId={tagId}
            priceFrom={priceFrom}
            priceTo={priceTo}
          />
        </Suspense>
      </div>
    </div>
  );
}
