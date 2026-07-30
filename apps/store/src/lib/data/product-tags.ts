"use server";

import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";

import { getCacheOptions } from "./cookies";

export const listProductTags = async () => {
  const next = {
    ...(await getCacheOptions("product-tags")),
  };

  return sdk.client
    .fetch<{ product_tags: HttpTypes.StoreProductTag[] }>(
      "/store/product-tags",
      {
        query: { limit: 100 },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_tags }) => product_tags);
};
