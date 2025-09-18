'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@repo/design-system/components/ui/button';
import { HoverHighlightsBlock as HoverHighlightsBlockProps } from '@/payload-types';

export const HoverHighlights: React.FC<HoverHighlightsBlockProps> = (props) => {
  const { beforeText, highlights, afterText, link } = props;
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  const getMediaUrl = (media: any): string | null => {
    if (!media) return null;
    if (typeof media === 'object' && 'url' in media) {
      return media.url;
    }
    return null;
  };

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

  const mainLinkUrl = link ? getLinkUrl(link) : null;
  const mainLinkProps = link?.newTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="content-container">
        <div className="">
          {/* Before Text */}
          {beforeText && (
            <div className="mb-10 md:mb-12 max-w-prose">
              {beforeText.split('\n').map((line, i) => (
                <p key={i} className="text-lg mb-4 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="relative">
            {/* Media Display Area */}
            {highlights && highlights.length > 0 && (
              <div className="mb-12 aspect-[16/9] md:aspect-[21/9] relative rounded-xl overflow-hidden bg-gray-100">
                {highlights.map((highlight) => {
                  const topMediaUrl = highlight.media?.top
                    ? getMediaUrl(highlight.media.top)
                    : null;
                  const bottomMediaUrl = highlight.media?.bottom
                    ? getMediaUrl(highlight.media.bottom)
                    : null;

                  return (
                    <div
                      key={highlight.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${activeHighlight === highlight.id ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                        {topMediaUrl && (
                          <div className="relative h-full">
                            <Image
                              src={topMediaUrl}
                              alt={highlight.text}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        {bottomMediaUrl && (
                          <div className="relative h-full">
                            <Image
                              src={bottomMediaUrl}
                              alt={`${highlight.text} secondary`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Default state when no highlight is active */}
                {activeHighlight === null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                    <p className="text-center px-4">
                      Hover over options below to explore
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Highlight Text Items */}
            {highlights && highlights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {highlights.map((highlight) => {
                  const highlightLinkUrl = highlight.link
                    ? getLinkUrl(highlight.link)
                    : null;
                  const itemContent = (
                    <div
                      className="p-4 border border-transparent rounded-lg hover:border-primary hover:bg-gray-50 transition-all cursor-pointer"
                      onMouseEnter={() =>
                        setActiveHighlight(highlight.id || null)
                      }
                      onMouseLeave={() => setActiveHighlight(null)}
                      onFocus={() => setActiveHighlight(highlight.id || null)}
                      onBlur={() => setActiveHighlight(null)}
                    >
                      <h3 className="text-xl font-medium mb-2">
                        {highlight.text}
                      </h3>
                    </div>
                  );

                  return (
                    <div key={highlight.id}>
                      {highlightLinkUrl ? (
                        <Link
                          href={highlightLinkUrl}
                          {...(highlight.link?.newTab
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {itemContent}
                        </Link>
                      ) : (
                        itemContent
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* After Text */}
            {afterText && (
              <div className="mb-10 md:mb-12 max-w-prose mx-auto">
                {afterText.split('\n').map((line, i) => (
                  <p key={i} className="text-lg mb-4 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Main CTA Link */}
            {link && link.label && mainLinkUrl && (
              <div className="mt-8 text-center">
                <Link href={mainLinkUrl} {...mainLinkProps}>
                  <Button variant="default" size="lg">
                    {link.label}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
