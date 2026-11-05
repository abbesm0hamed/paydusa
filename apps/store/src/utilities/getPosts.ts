import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";

export async function getCachedPosts(page = 1) {
  "use cache";
  cacheLife({ expire: 3600, revalidate: 600, stale: 600 });
  cacheTag("posts");

  const payload = await getPayload({ config });
  return payload.find({
    collection: "posts",
    depth: 1,
    limit: 12,
    overrideAccess: false,
    page,
    select: {
      categories: true,
      meta: true,
      slug: true,
      title: true,
    },
  });
}
