"use server";

import { sdk } from "@lib/config";
import type { HttpTypes } from "@medusajs/types";

import { getAuthHeaders, getCacheOptions } from "./cookies";

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("payment_providers")),
  };

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        cache: "force-cache",
        headers,
        method: "GET",
        next,
        query: { region_id: regionId },
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => (a.id > b.id ? 1 : -1))
    )
    .catch(() => null);
};
