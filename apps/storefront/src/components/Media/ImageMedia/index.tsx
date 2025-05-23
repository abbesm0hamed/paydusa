'use client';

import type { StaticImageData } from 'next/image';

import { cn } from '@/utilities/ui';
import NextImage from 'next/image';
import React from 'react';

import type { Props as MediaProps } from '../types';

import { cssVariables } from '@/cssVariables';
import { getClientSideURL } from '@/utilities/getURL';
import { placeholderBlur } from '@/utilities/constants';

const { breakpoints } = cssVariables;

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props;

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || '';

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource;

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource || '';

    const cacheTag = resource.updatedAt;

    src = `${getClientSideURL()}${url}?${cacheTag}`;
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined);

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ');

  return (
    <picture>
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        blurDataURL={placeholderBlur}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  );
};
