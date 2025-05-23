'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@repo/design-system/components/ui/button';

export type LinkGridBlockType = {
  blockName?: string | null;
  blockType: 'linkGrid';
  links?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages' | 'posts';
            value: number | { id: number; slug?: string };
          } | null;
          url?: string | null;
          label: string;
        };
        id?: string | null;
      }[]
    | null;
  id?: string | null;
};

export const LinkGrid: React.FC<LinkGridBlockType> = (props) => {
  const { links } = props;

  const hasLinks = links && links.length > 0;

  if (!hasLinks) return null;

  const getLinkUrl = (linkData: any): string | null => {
    if (!linkData) return null;

    if (linkData.type === 'custom' && linkData.url) {
      return linkData.url;
    }

    if (linkData.type === 'reference' && linkData.reference) {
      const { relationTo, value } = linkData.reference;

      if (typeof value === 'object' && value !== null && 'slug' in value) {
        return `/${relationTo}/${value.slug}`;
      }

      return `/${relationTo}/${value}`;
    }

    return null;
  };

  // Determine grid columns based on number of links
  const getGridCols = (count: number) => {
    if (count <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <section className="py-10 md:py-12">
      <div className="container">
        <div className={`grid ${getGridCols(links.length)} gap-4 md:gap-6`}>
          {links.map((item, i) => {
            const linkUrl = getLinkUrl(item.link);
            if (!linkUrl || !item.link.label) return null;

            const linkProps = item.link.newTab
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Link
                key={item.id || i}
                href={linkUrl}
                {...linkProps}
                className="block h-full"
              >
                <div className="h-full p-6 border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all flex items-center justify-center text-center">
                  <span className="text-lg font-medium">{item.link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
