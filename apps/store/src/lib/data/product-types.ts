"use server";

import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";

import { getCacheOptions } from "./cookies";

export const listProductTypes = async () => {
  const next = {
    ...(await getCacheOptions("product-types")),
  };

  return sdk.client
    .fetch<{ product_types: HttpTypes.StoreProductType[] }>(
      "/store/product-types",
      {
        query: { limit: 100 },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_types }) => product_types);
};
