'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@repo/design-system/components/ui/button';
import RichText from '@/components/RichText';
import { Media } from '@/payload-types';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export type MediaContentBlockType = {
  blockName?: string | null;
  blockType: 'mediaContent';
  alignment?: 'contentMedia' | 'mediaContent';
  mediaWidth?: 'stretch' | 'fit';
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
  imgs?:
    | {
        img: number | Media;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
};

export const MediaContent: React.FC<MediaContentBlockType> = (props) => {
  const {
    alignment = 'contentMedia',
    mediaWidth = 'stretch',
    content,
    hasLink,
    link,
    imgs,
  } = props;

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

  // Determine if we have valid images to show
  const hasImages = imgs && imgs.length > 0;

  // Determine the layout classes based on configuration
  const containerClasses =
    mediaWidth === 'stretch' ? 'container-fluid px-0' : 'container';

  const gridClasses =
    'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center';

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className={containerClasses}>
        <div className={gridClasses}>
          {/* Content Section */}
          <div
            className={`${alignment === 'mediaContent' ? 'md:order-2' : 'md:order-1'} p-4 md:p-6`}
          >
            <div className="max-w-xl mx-auto md:mx-0">
              {content && (
                <div className="prose dark:prose-invert">
                  <RichText data={content} enableGutter={false} />
                </div>
              )}

              {hasLink && link && link.label && linkUrl && (
                <div className="mt-8">
                  <Link href={linkUrl} {...linkProps}>
                    <Button variant="default">{link.label}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Media Section */}
          <div
            className={`${alignment === 'mediaContent' ? 'md:order-1' : 'md:order-2'}`}
          >
            {hasImages && (
              <div
                className={`${imgs.length > 1 ? 'grid grid-cols-2 gap-4' : ''}`}
              >
                {imgs.map((imageItem, index) => {
                  const imageMedia =
                    typeof imageItem.img === 'object' ? imageItem.img : null;

                  if (!imageMedia || !imageMedia.url) return null;

                  return (
                    <div
                      key={imageItem.id || index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={imageMedia.url}
                        alt={imageMedia.alt || `Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
