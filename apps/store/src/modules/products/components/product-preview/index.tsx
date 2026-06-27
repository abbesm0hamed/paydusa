import { listProducts } from "@lib/data/products";
import { getProductPrice } from "@lib/util/get-product-price";
import { HttpTypes } from "@medusajs/types";
import { Text } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

import {
  getProductImages,
  getProductThumbnail,
} from "../../../../lib/util/payload-images";
import { StoreProductWithPayload } from "../../../../types/global";
import Thumbnail from "../thumbnail";
import PreviewPrice from "./price";

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: StoreProductWithPayload;
  isFeatured?: boolean;
  region: HttpTypes.StoreRegion;
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  });

  const productImages = getProductImages(product);
  const thumbnailData = getProductThumbnail(product);

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={thumbnailData?.url || product.thumbnail}
          images={productImages}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.payload_product?.title || product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
