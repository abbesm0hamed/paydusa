import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query");

  const categoryId = req.query.category_id as string | undefined;
  const collectionId = req.query.collection_id as string | undefined;

  const filters: Record<string, unknown> = {
    status: "published",
  };

  if (categoryId) {
    filters.categories = { id: categoryId };
  }

  if (collectionId) {
    filters.collection_id = collectionId;
  }

  let products: Record<string, unknown>[] = [];

  try {
    const result = await query.graph({
      entity: "product",
      fields: [
        "id",
        "options.id",
        "options.title",
        "options.values.id",
        "options.values.value",
      ],
      filters,
      pagination: {
        take: 100,
      },
    });
    products = result.data;
  } catch {
    res.json({ option_values: {} });
    return;
  }

  const optionGroups: Record<
    string,
    {
      option_id: string;
      option_title: string;
      valueMap: Map<string, { id: string; value: string; count: number }>;
    }
  > = {};

  for (const product of products) {
    if (!product.options) {
      continue;
    }

    for (const option of product.options as {
      id: string;
      title: string;
      values?: { id: string; value: string }[];
    }[]) {
      if (!option.values) {
        continue;
      }

      if (!optionGroups[option.title]) {
        optionGroups[option.title] = {
          option_id: option.id,
          option_title: option.title,
          valueMap: new Map(),
        };
      }

      const seenValues = new Set<string>();

      for (const val of option.values) {
        if (seenValues.has(val.value)) {
          continue;
        }
        seenValues.add(val.value);

        const group = optionGroups[option.title];
        const existing = group.valueMap.get(val.value);
        if (existing) {
          existing.count++;
        } else {
          group.valueMap.set(val.value, {
            id: val.id,
            value: val.value,
            count: 1,
          });
        }
      }
    }
  }

  const option_values: Record<
    string,
    {
      option_id: string;
      option_title: string;
      values: { id: string; value: string; count: number }[];
    }
  > = {};

  for (const [title, group] of Object.entries(optionGroups)) {
    option_values[title] = {
      option_id: group.option_id,
      option_title: group.option_title,
      values: Array.from(group.valueMap.values()),
    };
  }

  res.json({ option_values });
}
