import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

import type { SyncProductsStepInput } from "./steps/sync-products";
import { syncProductsStep } from "./steps/sync-products";

interface SyncProductsWorkflowInput {
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

export const syncProductsWorkflow = createWorkflow(
  "sync-products",
  ({ filters, limit, offset }: SyncProductsWorkflowInput) => {
    const { data, metadata } = useQueryGraphStep({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "images.*",
        "categories.*",
        "tags.*",
      ],
      filters: {
        status: "published",
        ...filters,
      },
      pagination: {
        skip: offset,
        take: limit,
      },
    });

    syncProductsStep({
      products: data,
    } as SyncProductsStepInput);

    return new WorkflowResponse({
      metadata,
      products: data,
    });
  }
);
