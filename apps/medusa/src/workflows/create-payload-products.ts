import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  updateProductsWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";

import { createPayloadItemsStep } from "./steps/create-payload-items";
import { uploadProductMediaStep } from "./steps/upload-product-media";

type WorkflowInput = {
  product_ids: string[];
};

export const createPayloadProductsWorkflow = createWorkflow(
  "create-payload-products",
  (input: WorkflowInput) => {
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle",
        "description",
        "created_at",
        "updated_at",
        "options.*",
        "variants.*",
        "variants.options.*",
        "thumbnail",
        "images.*",
      ],
      filters: {
        id: input.product_ids,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    });

    const mediaMappings = uploadProductMediaStep({
      products,
    });

    const createData = transform(
      { products, mediaMappings },
      (data) => {
        const mediaMap = new Map(
          data.mediaMappings.map((m) => [m.productId, m])
        );

        return {
          collection: "products",
          items: data.products.map((product) => {
            const media = mediaMap.get(product.id);

            return {
              medusa_id: product.id,
              createdAt: product.created_at as string,
              updatedAt: product.updated_at as string,
              title: product.title,
              subtitle: product.subtitle,
              description: product.description || "",
              thumbnail: media?.thumbnailId || undefined,
              images:
                media?.imageIds?.length
                  ? media.imageIds.map((id) => ({ image: id }))
                  : undefined,
              options: product.options.map((option) => ({
                title: option.title,
                medusa_id: option.id,
              })),
              variants: product.variants.map((variant) => ({
                title: variant.title,
                medusa_id: variant.id,
                option_values: variant.options.map((option) => ({
                  medusa_id: option.id,
                  medusa_option_id: option.option?.id,
                  value: option.value,
                })),
              })),
            };
          }),
        };
      }
    );

    const { items } = createPayloadItemsStep(createData);

    const updateData = transform(
      {
        items,
      },
      (data) => {
        return data.items.map((item) => ({
          id: item.medusa_id,
          metadata: {
            payload_id: item.id,
          },
        }));
      }
    );

    updateProductsWorkflow.runAsStep({
      input: {
        products: updateData,
      },
    });

    return new WorkflowResponse({
      items,
    });
  }
);
