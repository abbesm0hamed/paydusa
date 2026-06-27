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
        .filter((page) => Boolean(page?.slug))
        .map((page) => {
          return {
            loc:
              page?.slug === "home"
                ? `${SITE_URL}/`
                : `${SITE_URL}/${page?.slug}`,
            lastmod: page.updatedAt,
          };
        })
    : [];

  return sitemap;
}

const defaultSitemapUrls = [{ loc: "/search" }, { loc: "/posts" }];

export async function GET() {
  const sitemap = await getPagesSitemap();
  const dateFallback = new Date().toISOString();

  return getServerSideSitemap([
    ...defaultSitemapUrls.map((entry) => ({
      loc: `${process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "https://example.com"}${entry.loc}`,
      lastmod: dateFallback,
    })),
    ...sitemap.map((entry) => ({
      ...entry,
      lastmod: entry.lastmod || dateFallback,
    })),
  ]);
}
