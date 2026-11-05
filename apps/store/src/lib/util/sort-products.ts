import type { HttpTypes } from "@medusajs/types";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";

interface MinPricedProduct extends HttpTypes.StoreProduct {
  _minPrice?: number;
}

const getMinPrice = (product: HttpTypes.StoreProduct): number => {
  if (product.variants && product.variants.length > 0) {
    return Math.min(
      ...product.variants.map(
        (variant) => variant?.calculated_price?.calculated_amount || 0
      )
    );
  }
  return Infinity;
};

export const filterProductsByPrice = (
  products: HttpTypes.StoreProduct[],
  priceFrom?: number,
  priceTo?: number
): HttpTypes.StoreProduct[] => {
  if (priceFrom === undefined && priceTo === undefined) {
    return products;
  }

  return products.filter((product) => {
    const minPrice = getMinPrice(product);
    if (minPrice === Infinity) {
      return false;
    }
    if (priceFrom !== undefined && minPrice < priceFrom) {
      return false;
    }
    if (priceTo !== undefined && minPrice > priceTo) {
      return false;
    }
    return true;
  });
};

const getCreatedAtTimestamp = (product: HttpTypes.StoreProduct): number => {
  const date = product.created_at === null ? 0 : product.created_at;
  if (date === undefined) {
    return Number.NaN;
  }
  return new Date(date).getTime();
};

export const sortProducts = (
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] => {
  const sortedProducts = products as MinPricedProduct[];

  if (["price_asc", "price_desc"].includes(sortBy)) {
    for (const product of sortedProducts) {
      product._minPrice = getMinPrice(product);
    }

    sortedProducts.sort((a, b) => {
      const diff =
        (a._minPrice ?? getMinPrice(a)) - (b._minPrice ?? getMinPrice(b));
      return sortBy === "price_asc" ? diff : -diff;
    });
  }

  if (sortBy === "created_at") {
    sortedProducts.sort(
      (a, b) => getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a)
    );
  }

  return sortedProducts;
};
