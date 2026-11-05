"use server";

import { sdk } from "@lib/config";
import type { HttpTypes } from "@medusajs/types";

import { getCacheOptions } from "./cookies";

export const listProductTypes = async () => {
  const next = {
    ...(await getCacheOptions("product-types")),
  };

  return sdk.client
    .fetch<{ product_types: HttpTypes.StoreProductType[] }>(
      "/store/product-types",
      {
        cache: "force-cache",
        next,
        query: { limit: 100 },
      }
    )
    .then(({ product_types }) => product_types);
};
