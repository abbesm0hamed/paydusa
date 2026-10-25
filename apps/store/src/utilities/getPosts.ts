import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

export async function getCachedPosts(page = 1) {
  "use cache";
  cacheLife({ stale: 600, revalidate: 600, expire: 3600 });
  cacheTag("posts");

  const payload = await getPayload({ config });
  return payload.find({
    collection: "posts",
    depth: 1,
    limit: 12,
    page,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  });
}
