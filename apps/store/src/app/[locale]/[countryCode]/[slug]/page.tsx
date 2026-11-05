import config from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import type { RequiredDataFromCollectionSlug, TypedLocale } from "payload";

import { RenderBlocks } from "@/blocks/RenderBlocks";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { RenderHero } from "@/heros/RenderHero";
import { generateMeta } from "@/utilities/generateMeta";

import PageClient from "./page.client";

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise });
//   const pages = await payload.find({
//     collection: 'pages',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   });
//
//   const params = pages.docs
//     ?.filter((doc) => {
//       return doc.slug !== 'home';
//     })
//     .map(({ slug }) => {
//       return { slug };
//     });
//
//   return params;
// }

interface Args {
  params: Promise<{
    slug?: string;
    locale: TypedLocale;
  }>;
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "home", locale = "en" } = await paramsPromise;
  const url = `/${slug}`;

  let page: RequiredDataFromCollectionSlug<"pages"> | null;

  page = await queryPageBySlug({
    draft,
    locale,
    slug,
  });

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { hero, layout } = page;

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = "home", locale = "en" } = await paramsPromise;
  const page = await queryPageBySlug({
    draft: false,
    locale,
    slug,
  });

  return generateMeta({ doc: page });
}

async function queryPageBySlug({
  locale,
  slug,
  draft,
}: {
  locale: TypedLocale;
  slug: string;
  draft: boolean;
}) {
  "use cache";

  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
}
