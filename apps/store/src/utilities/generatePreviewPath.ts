import type { PayloadRequest, CollectionSlug } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: "",
  posts: "/posts",
};

interface Props {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  req: PayloadRequest;
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  const encodedParams = new URLSearchParams({
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || "",
    slug,
  });

  const url = `/next/preview?${encodedParams.toString()}`;

  return url;
};
