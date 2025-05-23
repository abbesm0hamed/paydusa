import type { Media } from '@/payload-types';

export const imageHero1: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'ecommerce flickering bg',
};
