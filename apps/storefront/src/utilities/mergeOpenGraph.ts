import type { Metadata } from 'next';
import { getServerSideURL } from './getURL';

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Ecommerce app',
  images: [
    {
      url: `${getServerSideURL()}/public-logo.png`,
    },
  ],
  siteName: 'Ecommerce app',
  title: 'Ecommerce',
};

export const mergeOpenGraph = (
  og?: Metadata['openGraph']
): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  };
};
