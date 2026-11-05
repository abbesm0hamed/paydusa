import type { HttpTypes } from "@medusajs/types";

export const getShippingAddressFormData = (
  address?: HttpTypes.StoreCartAddress | null
): Record<string, string> => {
  const {
    address_1,
    city,
    company,
    country_code,
    first_name,
    last_name,
    phone,
    postal_code,
    province,
  } = address ?? {};

  return {
    "shipping_address.address_1": address_1 || "",
    "shipping_address.city": city || "",
    "shipping_address.company": company || "",
    "shipping_address.country_code": country_code || "",
    "shipping_address.first_name": first_name || "",
    "shipping_address.last_name": last_name || "",
    "shipping_address.phone": phone || "",
    "shipping_address.postal_code": postal_code || "",
    "shipping_address.province": province || "",
  };
};
