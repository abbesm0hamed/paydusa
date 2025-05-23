'use client';
import type { Media } from '@/payload-types';

// Helper function to get URL from Media or number type
export const getMediaUrl = (
  media: number | Media | null | undefined
): string | undefined => {
  if (!media) return undefined;

  // If media is a Media object with url property
  if (typeof media === 'object' && 'url' in media && media.url) {
    return media.url as string;
  }

  // If it's a number or any other case, return undefined
  return undefined;
};

// Helper function to convert Media object or number to GroupProps image format
export const convertToGroupImage = (
  media: number | Media | null | undefined
): { url: string; alt?: string } | undefined => {
  if (!media) return undefined;

  // If media is a Media object with url property
  if (typeof media === 'object' && 'url' in media && media.url) {
    return {
      url: media.url as string,
      alt: 'alt' in media ? (media.alt as string) : undefined,
    };
  }

  // If it's a number or any other case, return undefined
  return undefined;
};
