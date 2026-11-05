import type { HttpTypes } from "@medusajs/types";

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean =>
  product.options?.length === 1 && product.options[0].values?.length === 1;
