import config from "@payload-config";
import type { Config } from "@payload-types";
import { cacheTag } from "next/cache";
import { getPayload } from "payload";

type Collection = keyof Config["collections"];

export async function getCachedDocument(
  collection: Collection,
  slug: string,
  depth = 0
) {
  "use cache";
  cacheTag(`${collection}_${slug}`);

  const payload = await getPayload({ config });

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return page.docs[0];
}
