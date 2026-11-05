import config from "@payload-config";
import { getServerSideSitemap } from "next-sitemap";
import { cacheTag } from "next/cache";
import { getPayload } from "payload";

async function getPagesSitemap() {
  "use cache";
  cacheTag("pages-sitemap");

  const payload = await getPayload({ config });
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://example.com";

  const results = await payload.find({
    collection: "pages",
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
        .filter((page) => Boolean(page?.slug))
        .map((page) => ({
          lastmod: page.updatedAt,
          loc:
            page?.slug === "home"
              ? `${SITE_URL}/`
              : `${SITE_URL}/${page?.slug}`,
        }))
    : [];

  return sitemap;
}

const defaultSitemapUrls = [{ loc: "/search" }, { loc: "/posts" }];

export async function GET() {
  const sitemap = await getPagesSitemap();
  const dateFallback = new Date().toISOString();

  return getServerSideSitemap([
    ...defaultSitemapUrls.map((entry) => ({
      lastmod: dateFallback,
      loc: `${process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "https://example.com"}${entry.loc}`,
    })),
    ...sitemap.map((entry) => ({
      ...entry,
      lastmod: entry.lastmod || dateFallback,
    })),
  ]);
}
