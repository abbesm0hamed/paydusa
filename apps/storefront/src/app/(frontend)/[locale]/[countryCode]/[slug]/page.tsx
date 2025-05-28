import type { Metadata } from 'next';
import { PayloadRedirects } from '@/components/PayloadRedirects';
import configPromise from '@payload-config';
import {
  getPayload,
  type TypedLocale,
  type RequiredDataFromCollectionSlug,
} from 'payload';
import { draftMode } from 'next/headers';
import { cache } from 'react';
import { homeStatic } from '@/endpoints/seed/home-static';
import { RenderBlocks } from '@/blocks/RenderBlocks';
import { RenderHero } from '@/heros/RenderHero';
import { generateMeta } from '@/utilities/generateMeta';
import PageClient from './page.client';
import { LivePreviewListener } from '@/components/LivePreviewListener';

// export async function generateStaticParams() {
//   console.log('🔍 generateStaticParams called for [slug] page');
//
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
//   console.log(
//     '📄 Found pages:',
//     pages.docs?.map((doc) => doc.slug)
//   );
//
//   const params = pages.docs
//     ?.filter((doc) => {
//       return doc.slug !== 'home';
//     })
//     .map(({ slug }) => {
//       return { slug };
//     });
//
//   console.log('🎯 Generated static params:', params);
//   return params;
// }

type Args = {
  params: Promise<{
    slug?: string;
    locale: TypedLocale;
    countryCode: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = 'home', locale = 'en', countryCode } = await paramsPromise;

  console.log('🚀 Page component called with:', {
    slug,
    locale,
    countryCode,
    draft,
  });

  const url = '/' + slug;
  let page: RequiredDataFromCollectionSlug<'pages'> | null;

  page = await queryPageBySlug({
    slug,
    locale,
  });

  console.log('📖 Page found from Payload:', !!page, page?.slug);

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    console.log('🏠 Using homeStatic fallback');
    page = homeStatic;
  }

  if (!page) {
    console.log('❌ No page found, showing PayloadRedirects for:', url);
    return <PayloadRedirects url={url} />;
  }

  console.log('✅ Rendering page:', page.slug);
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
    console.log('🔎 Querying page by slug:', { slug, locale });

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

    console.log('🔍 Query result:', {
      found: result.docs?.length || 0,
      firstDoc: result.docs?.[0]?.slug,
      draft,
      locale,
    });

    return result.docs?.[0] || null;
  }
);
