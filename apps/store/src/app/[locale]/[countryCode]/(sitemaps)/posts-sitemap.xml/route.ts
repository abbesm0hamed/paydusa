import config from "@payload-config";
import { getServerSideSitemap } from "next-sitemap";
import { cacheTag } from "next/cache";
import { getPayload } from "payload";

async function getPostsSitemap() {
  "use cache";
  cacheTag("posts-sitemap");

  const payload = await getPayload({ config });
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://example.com";

  const results = await payload.find({
    collection: "posts",
    depth: 0,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      updatedAt: true,
    },
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  const sitemap = results.docs
    ? results.docs
        .filter((post) => Boolean(post?.slug))
        .map((post) => ({
          lastmod: post.updatedAt,
          loc: `${SITE_URL}/posts/${post?.slug}`,
        }))
    : [];

  return sitemap;
}

export async function GET() {
  const sitemap = await getPostsSitemap();
  const dateFallback = new Date().toISOString();

  return getServerSideSitemap(
    sitemap.map((entry) => ({
      ...entry,
      lastmod: entry.lastmod || dateFallback,
    }))
  );
}
