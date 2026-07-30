"use server";

import { sdk } from "@lib/config";

export type OptionValueGroup = {
  option_id: string;
  option_title: string;
  values: {
    id: string;
    value: string;
    count: number;
  }[];
};

export type ProductFiltersResponse = {
  option_values: Record<string, OptionValueGroup>;
};

export const listProductFilterOptions = async ({
  category_id,
  collection_id,
}: {
  category_id?: string;
  collection_id?: string;
} = {}): Promise<ProductFiltersResponse> => {
  const query: Record<string, string> = {};

  if (category_id) {
    query.category_id = category_id;
  }

  if (collection_id) {
    query.collection_id = collection_id;
  }

  return sdk.client
    .fetch<ProductFiltersResponse>("/store/product-filters", {
      query,
    })
    .catch(() => ({ option_values: {} }));
};
