import config from "@payload-config";
import type { Config } from "@payload-types";
import { cacheTag } from "next/cache";
import { getPayload, type TypedLocale } from "payload";

type Global = keyof Config["globals"];

export async function getCachedGlobal(
  slug: Global,
  depth = 0,
  locale: TypedLocale
) {
  "use cache";
  cacheTag(`global_${slug}`);

  const payload = await getPayload({ config });

  return payload.findGlobal({
    slug,
    depth,
    locale,
  });
}
