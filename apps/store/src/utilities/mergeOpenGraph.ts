import type { Metadata } from "next";

import { getServerSideURL } from "./getURL";

const defaultOpenGraph: Metadata["openGraph"] = {
  description: "Ecommerce app",
  images: [
    {
      url: `${getServerSideURL()}/public-logo.png`,
    },
  ],
  siteName: "Ecommerce app",
  title: "Ecommerce",
  type: "website",
};

export const mergeOpenGraph = (
  og?: Metadata["openGraph"]
): Metadata["openGraph"] => ({
  ...defaultOpenGraph,
  ...og,
  images: og?.images ? og.images : defaultOpenGraph.images,
});
