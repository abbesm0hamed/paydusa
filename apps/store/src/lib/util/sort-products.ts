import { HttpTypes } from "@medusajs/types";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

interface MinPricedProduct extends HttpTypes.StoreProduct {
  _minPrice?: number;
}

function getMinPrice(product: HttpTypes.StoreProduct): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(
      ...product.variants.map(
        (variant) => variant?.calculated_price?.calculated_amount || 0
      )
    );
  }
  return Infinity;
}

export function filterProductsByPrice(
  products: HttpTypes.StoreProduct[],
  priceFrom?: number,
  priceTo?: number
): HttpTypes.StoreProduct[] {
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
}

export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  let sortedProducts = products as MinPricedProduct[];

  if (["price_asc", "price_desc"].includes(sortBy)) {
    sortedProducts.forEach((product) => {
      product._minPrice = getMinPrice(product);
    });

    sortedProducts.sort((a, b) => {
      const diff = a._minPrice! - b._minPrice!;
      return sortBy === "price_asc" ? diff : -diff;
    });
  }

  if (sortBy === "created_at") {
    sortedProducts.sort((a, b) => {
      return (
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );
    });
  }

  return sortedProducts;
}
