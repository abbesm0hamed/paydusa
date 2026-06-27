import {
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

import {
  PayloadCollectionItem,
  PayloadUpsertData,
} from "../modules/payload/types";
import { updatePayloadItemsStep } from "./steps/update-payload-items";
import { uploadProductMediaStep } from "./steps/upload-product-media";

type WorkflowInput = {
  product_ids: string[];
};

export const updatePayloadProductsWorkflow = createWorkflow(
  "update-payload-products",
  ({ product_ids }: WorkflowInput) => {
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle",
        "description",
        "status",
        "created_at",
        "updated_at",
        "thumbnail",
        "images.*",
        "payload_product.*",
      ],
      filters: {
        id: product_ids,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    });

    const mediaMappings = uploadProductMediaStep({
      products,
    });

    const updateData = transform(
      { products, mediaMappings },
      (data) => {
        const mediaMap = new Map(
          data.mediaMappings.map((m) => [m.productId, m])
        );
        const items: PayloadUpsertData[] = [];

        data.products.forEach((product) => {
          // @ts-expect-error
          const payloadProduct =
            product.payload_product as PayloadCollectionItem;
          if (!payloadProduct) return;

          const media = mediaMap.get(product.id);
          const update: PayloadUpsertData = {
            id: payloadProduct.id,
            title: product.title,
            subtitle: product.subtitle || "",
            description: product.description || "",
            status: product.status,
            updatedAt: product.updated_at as string,
          };

          if (media?.thumbnailId) {
            update.thumbnail = media.thumbnailId;
          }

          if (media?.imageIds?.length) {
            update.images = media.imageIds.map((id) => ({ image: id }));
          }

          items.push(update);
        });

        return {
          collection: "products",
          items,
        };
      }
    );

    const result = when(
      { updateData },
      (data) => data.updateData.items.length > 0
    ).then(() => {
      return updatePayloadItemsStep(updateData);
    });

    const items = transform({ result }, (data) => data.result?.items || []);

    return new WorkflowResponse({
      items,
    });
  }
);
