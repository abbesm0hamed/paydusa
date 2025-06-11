import type { Metadata } from 'next';

import { PayloadRedirects } from '@/components/PayloadRedirects';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import {
  type RequiredDataFromCollectionSlug,
  type TypedLocale,
  getPayload,
} from 'payload';
import { cache } from 'react';

import { RenderBlocks } from '@/blocks/RenderBlocks';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { RenderHero } from '@/heros/RenderHero';
import { generateMeta } from '@/utilities/generateMeta';
import PageClient from './page.client';

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

export const dynamic = 'force-dynamic';

type Args = {
  params: Promise<{
    slug?: string;
    locale: TypedLocale;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = 'home', locale = 'en' } = await paramsPromise;
  const url = '/' + slug;

  let page: RequiredDataFromCollectionSlug<'pages'> | null;

  page = await queryPageBySlug({
    slug,
    locale,
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

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = 'home', locale = 'en' } = await paramsPromise;
  const page = await queryPageBySlug({
    slug,
    locale,
  });

  return generateMeta({ doc: page });
}

const queryPageBySlug = cache(
  async ({ locale, slug }: { locale: TypedLocale; slug: string }) => {
    const { isEnabled: draft } = await draftMode();

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      locale: locale,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    return result.docs?.[0] || null;
  }
);
