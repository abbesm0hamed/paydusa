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
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: "published",
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const sitemap = results.docs
    ? results.docs
        .filter((post) => Boolean(post?.slug))
        .map((post) => ({
          loc: `${SITE_URL}/posts/${post?.slug}`,
          lastmod: post.updatedAt,
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
