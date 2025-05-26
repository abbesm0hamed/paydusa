import { Metadata } from 'next';

import { headers as getHeaders } from 'next/headers.js';
import FeaturedProducts from '@modules/home/components/featured-products';
import Hero from '@modules/home/components/hero';
import { listCollections } from '@lib/data/collections';
import { getRegion } from '@lib/data/regions';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const metadata: Metadata = {
  title: 'Medusa Next.js Starter Template',
  description:
    'A performant frontend ecommerce starter template with Next.js 15 and Medusa.',
};

export default async function Home(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });
  console.log('user ', user);

  const params = await props.params;

  const { countryCode } = params;

  const region = await getRegion(countryCode);

  const { collections } = await listCollections({
    fields: 'id, handle, title',
  });

  if (!collections || !region) {
    return null;
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  );
}
