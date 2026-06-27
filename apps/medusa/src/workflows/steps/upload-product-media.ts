import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { MedusaError } from "@medusajs/framework/utils";

import { PAYLOAD_MODULE } from "../../modules/payload";
import type PayloadModuleService from "../../modules/payload/service";

type ProductImageData = {
  id: string;
  thumbnail?: string | null;
  images?: Array<{ id: string; url: string }>;
};

type StepInput = {
  products: ProductImageData[];
};

type MediaUpload = {
  productId: string;
  thumbnailId: number | null;
  imageIds: number[];
};

export const uploadProductMediaStep = createStep(
  "upload-product-media",
  async ({ products }: StepInput, { container }) => {
    const payloadService: PayloadModuleService =
      container.resolve(PAYLOAD_MODULE);
    const allMediaIds: number[] = [];
    const results: MediaUpload[] = [];

    for (const product of products) {
      const productImages = product.images || [];
      let thumbnailId: number | null = null;
      const imageIds: number[] = [];

      const uploadResults = await Promise.allSettled(
        productImages.map(async (image) => {
          const result = await payloadService.uploadFile(image.url);
          const mediaId = result.doc.id;
          return { url: image.url, mediaId };
        })
      );

      for (const upload of uploadResults) {
        if (upload.status === "rejected") {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            `Failed to upload image for product ${product.id}: ${upload.reason}`
          );
        }
        const { url, mediaId } = upload.value;
        allMediaIds.push(mediaId);
        imageIds.push(mediaId);

        if (product.thumbnail && url === product.thumbnail) {
          thumbnailId = mediaId;
        }
      }

      if (product.thumbnail && !thumbnailId) {
        const result = await payloadService.uploadFile(product.thumbnail);
        thumbnailId = result.doc.id;
        allMediaIds.push(thumbnailId);
      }

      results.push({ productId: product.id, thumbnailId, imageIds });
    }

    return new StepResponse(results, { allMediaIds });
  },
  async (compensateData, { container }) => {
    if (!compensateData) return;

    const { allMediaIds } = compensateData;

    if (allMediaIds.length === 0) return;

    const payloadService: PayloadModuleService =
      container.resolve(PAYLOAD_MODULE);

    await payloadService.delete("media", {
      where: {
        id: {
          in: allMediaIds.join(","),
        },
      },
    });
  }
);
