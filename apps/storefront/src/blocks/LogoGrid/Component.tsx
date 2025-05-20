'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@repo/design-system/components/ui/button';
import RichText from '@/components/RichText';
import { Media } from '@/payload-types';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export type LogoGridBlockType = {
  blockName?: string | null;
  blockType: 'logoGrid';
  content?: DefaultTypedEditorState | null;
  hasLink?: boolean | null;
  link?: {
    type?: ('reference' | 'custom') | null;
    newTab?: boolean | null;
    reference?: {
      relationTo: 'pages' | 'posts';
      value: number | { id: number; slug?: string };
    } | null;
    url?: string | null;
    label: string;
  } | null;
  logos?:
    | {
        logo: number | Media;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
};

export const LogoGrid: React.FC<LogoGridBlockType> = (props) => {
  const { content, hasLink, link, logos } = props;

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

  const linkUrl = hasLink && link ? getLinkUrl(link) : null;
  const linkProps = link?.newTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto">
        {content && (
          <div className="mb-8 md:mb-12 text-center">
            <RichText data={content} />
          </div>
        )}

        {logos && logos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {logos.map((item) => {
              const logoMedia =
                typeof item.logo === 'object' ? item.logo : null;

              if (!logoMedia || !logoMedia.url) return null;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-center p-4"
                >
                  <div className="relative h-16 w-full">
                    <Image
                      src={logoMedia.url}
                      alt={logoMedia.alt || 'Logo'}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasLink && link && link.label && linkUrl && (
          <div className="mt-8 md:mt-12 text-center">
            <Link href={linkUrl} {...linkProps}>
              <Button variant="default">{link.label}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
