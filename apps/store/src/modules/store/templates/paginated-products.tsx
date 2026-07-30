import { listProductsWithSort } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import ProductPreview from "@modules/products/components/product-preview";
import { Pagination } from "@modules/store/components/pagination";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

const PRODUCT_LIMIT = 12;

type PaginatedProductsParams = {
  limit: number;
  collection_id?: string[];
  category_id?: string[];
  id?: string[];
  order?: string;
  type_id?: string[];
  tag_id?: string[];
  option_value_id?: string[];
};

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  typeId,
  tagId,
  optionValueId,
  priceFrom,
  priceTo,
}: {
  sortBy?: SortOptions;
  page: number;
  collectionId?: string | string[];
  categoryId?: string;
  productsIds?: string[];
  countryCode: string;
  typeId?: string[];
  tagId?: string[];
  optionValueId?: string[];
  priceFrom?: string;
  priceTo?: string;
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  };

  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId];
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId];
  }

  if (productsIds) {
    queryParams["id"] = productsIds;
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at";
  }

  if (typeId && typeId.length > 0) {
    queryParams["type_id"] = typeId;
  }

  if (tagId && tagId.length > 0) {
    queryParams["tag_id"] = tagId;
  }

  if (optionValueId && optionValueId.length > 0) {
    queryParams["option_value_id"] = optionValueId;
  }

  const region = await getRegion(countryCode);

  if (!region) {
    return null;
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    priceFrom: priceFrom ? Number(priceFrom) : undefined,
    priceTo: priceTo ? Number(priceTo) : undefined,
  });

  const totalPages = Math.ceil(count / PRODUCT_LIMIT);

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          );
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
