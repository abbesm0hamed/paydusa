import type { Media } from "../payload-types";

export function getMediaFileURL({
  filename,
  prefix,
}: {
  filename: string;
  prefix?: string;
}): string {
  const encodedFilename = encodeURIComponent(filename);
  const key = prefix ? `${prefix}/${encodedFilename}` : encodedFilename;
  return `${process.env.R2_PUBLIC_URL?.replace(/\/+$/, "")}/${key}`;
}

export function getMediaThumbnailURL(doc: Partial<Media>): string | null {
  const thumbnail = doc.variants?.thumbnail;
  const file = thumbnail?.filename ? thumbnail : doc;

  if (!file.filename) {
    return null;
  }

  // Legacy variants share their document's storage metadata; v4 variants own it.
  const isLegacyThumbnail = file === thumbnail && !doc.original?.filename;
  const prefix = file.prefix ?? (isLegacyThumbnail ? doc.prefix : undefined);
  const objectKey =
    file._objectKey ?? (isLegacyThumbnail ? doc._objectKey : undefined);

  return getMediaFileURL({
    filename: file.filename,
    prefix: [prefix, objectKey].filter(Boolean).join("/"),
  });
}
