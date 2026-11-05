import type { OptionValueGroup } from "@lib/data/product-options";
import type { HttpTypes } from "@medusajs/types";
import InteractiveLink from "@modules/common/components/interactive-link";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import RefinementList from "@modules/store/components/refinement-list";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import PaginatedProducts from "@modules/store/templates/paginated-products";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import type { FilterOption } from "../../../types/filters";

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  subcategories,
  types,
  tags,
  optionValues,
  typeId,
  tagId,
  priceFrom,
  priceTo,
}: {
  category: HttpTypes.StoreProductCategory;
  sortBy?: SortOptions;
  page?: string;
  countryCode: string;
  subcategories?: FilterOption[];
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

  if (!category || !countryCode) {
    notFound();
  }

  const parents = [] as HttpTypes.StoreProductCategory[];

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category);
      getParents(category.parent_category);
    }
  };

  getParents(category);

  return (
    <div
      className="small:flex-row small:items-start content-container flex flex-col py-6"
      data-testid="category-container"
    >
      <RefinementList
        sortBy={sort}
        categories={subcategories}
        types={types}
        tags={tags}
        optionValues={optionValues}
      />
      <div className="w-full">
        <div className="text-2xl-semi mb-8 flex flex-row gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="text-base-regular mb-8">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="text-base-large mb-8">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
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
