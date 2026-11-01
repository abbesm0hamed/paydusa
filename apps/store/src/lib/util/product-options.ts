import type { HttpTypes } from "@medusajs/types";

export function getVariantOptions(
  variantOptions: HttpTypes.StoreProductVariant["options"]
): Record<string, string> {
  const options: Record<string, string> = {};

  for (const option of variantOptions ?? []) {
    if (option.option_id) {
      options[option.option_id] = option.value;
    }
  }

  return options;
}
