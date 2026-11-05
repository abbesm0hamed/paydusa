"use server";

import { sdk } from "@lib/config";
import type { HttpTypes } from "@medusajs/types";

import { getCacheOptions } from "./cookies";

export const listProductTags = async () => {
  const next = {
    ...(await getCacheOptions("product-tags")),
  };

  return sdk.client
    .fetch<{ product_tags: HttpTypes.StoreProductTag[] }>(
      "/store/product-tags",
      {
        cache: "force-cache",
        next,
        query: { limit: 100 },
      }
    )
    .then(({ product_tags }) => product_tags);
};
