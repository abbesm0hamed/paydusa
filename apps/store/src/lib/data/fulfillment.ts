"use server";

import { sdk } from "@lib/config";
import type { HttpTypes } from "@medusajs/types";

import { getAuthHeaders, getCacheOptions } from "./cookies";

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("fulfillment")),
  };

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        cache: "force-cache",
        headers,
        method: "GET",
        next,
        query: {
          cart_id: cartId,
          fields:
            "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
        },
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => null);
};

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("fulfillment")),
  };

  const body = { cart_id: cartId, data };

  if (data) {
    body.data = data;
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        body,
        headers,
        method: "POST",
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((error) => null);
};
