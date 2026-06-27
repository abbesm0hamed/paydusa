import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";

import FeaturedProducts from ".";

export async function FeaturedProductsSection({
  countryCode,
}: {
  countryCode: string;
}) {
  const region = await getRegion(countryCode);
  const { collections } = await listCollections({
    fields: "id, handle, title",
  });

  if (!collections || !region) {
    return null;
  }

  return <FeaturedProducts collections={collections} region={region} />;
}
