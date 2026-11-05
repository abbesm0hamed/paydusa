"use server";

import { sdk } from "@lib/config";
import { filterProductsByPrice, sortProducts } from "@lib/util/sort-products";
import type { HttpTypes } from "@medusajs/types";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";

import { getAuthHeaders } from "./cookies";
import { getRegion, retrieveRegion } from "./regions";

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  countryCode?: string;
  regionId?: string;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required");
  }

  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null;

  if (countryCode) {
    region = await getRegion(countryCode);
  } else {
    region = await retrieveRegion(regionId!);
  }

  if (!region) {
    return {
      nextPage: null,
      response: { count: 0, products: [] },
    };
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  try {
    const { products, count } = await sdk.store.product.list(
      {
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        limit,
        offset,
        region_id: region.id,
        ...queryParams,
      },
      headers
    );

    return {
      nextPage: count > offset + limit ? pageParam + 1 : null,
      queryParams,
      response: { count, products },
    };
  } catch {
    return {
      nextPage: null,
      queryParams,
      response: { count: 0, products: [] },
    };
  }
};

export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  priceFrom,
  priceTo,
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode: string;
  priceFrom?: number;
  priceTo?: number;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 12;

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
  });

  const priceFiltered = filterProductsByPrice(products, priceFrom, priceTo);

  const sortedProducts = sortProducts(priceFiltered, sortBy);

  const pageParam = (page - 1) * limit;

  const nextPage =
    sortedProducts.length > pageParam + limit ? sortedProducts.length : null;

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit);

  return {
    nextPage,
    queryParams,
    response: {
      count: priceFiltered.length,
      products: paginatedProducts,
    },
  };
};
