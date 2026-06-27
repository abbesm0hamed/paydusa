import config from "@payload-config";
import { cacheTag } from "next/cache";
import { getPayload } from "payload";

export async function getCachedRedirects(depth = 1) {
  "use cache";
  cacheTag("redirects");

  const payload = await getPayload({ config });

  const { docs: redirects } = await payload.find({
    collection: "redirects",
    depth,
    limit: 0,
    pagination: false,
  });

  return redirects;
}
