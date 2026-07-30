import type { OptionValueGroup } from "@lib/data/product-options";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import RefinementList from "@modules/store/components/refinement-list";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import { Suspense } from "react";

import type { FilterOption } from "../../../types/filters";
import PaginatedProducts from "./paginated-products";

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  categories,
  collections,
  types,
  tags,
  optionValues,
  typeId,
  tagId,
  collectionId,
  priceFrom,
  priceTo,
}: {
  sortBy?: SortOptions;
  page?: string;
  countryCode: string;
  categories?: FilterOption[];
  collections?: FilterOption[];
  types?: FilterOption[];
  tags?: FilterOption[];
  optionValues?: Record<string, OptionValueGroup>;
  typeId?: string[];
  tagId?: string[];
  collectionId?: string[];
  priceFrom?: string;
  priceTo?: string;
}) => {
  const pageNumber = page ? parseInt(page) : 1;
  const sort = sortBy || "created_at";

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList
        sortBy={sort}
        categories={categories}
        collections={collections}
        types={types}
        tags={tags}
        optionValues={optionValues}
      />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collectionId}
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
};

export default StoreTemplate;
