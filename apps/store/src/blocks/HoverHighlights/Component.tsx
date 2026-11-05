"use client";

import { Button } from "@paydusa/design-system/components/button";
import type {
  HoverHighlightsBlock as HoverHighlightsBlockProps,
  Media,
} from "@payload-types";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const getMediaUrl = (
  media: Media | number | null | undefined
): string | null | undefined => {
  if (!media) {
    return null;
  }
  if (typeof media === "object" && "url" in media) {
    return media.url;
  }
  return null;
};

const getLinkUrl = (
  linkData:
    | Pick<
        NonNullable<HoverHighlightsBlockProps["link"]>,
        "type" | "url" | "reference"
      >
    | null
    | undefined
): string | null => {
  if (!linkData) {
    return null;
  }

  if (linkData.type === "custom" && linkData.url) {
    return linkData.url;
  }

  if (linkData.type === "reference" && linkData.reference) {
    const { relationTo, value } = linkData.reference;

    if (typeof value === "object" && value !== null && "slug" in value) {
      return `/${relationTo}/${value.slug}`;
    }

    return `/${relationTo}/${value}`;
  }

  return null;
};

export const HoverHighlights: React.FC<HoverHighlightsBlockProps> = (props) => {
  const { beforeText, highlights, afterText, link } = props;
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  const mainLinkUrl = link ? getLinkUrl(link) : null;
  const mainLinkProps = link?.newTab
    ? { rel: "noopener noreferrer", target: "_blank" }
    : {};

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="content-container">
        <div className="">
          {/* Before Text */}
          {beforeText && (
            <div className="mb-10 max-w-prose md:mb-12">
              {beforeText.split("\n").map((line, i) => (
                <p key={i} className="mb-4 text-lg last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="relative">
            {/* Media Display Area */}
            {highlights && highlights.length > 0 && (
              <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 md:aspect-[21/9]">
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
                      className={`absolute inset-0 transition-opacity duration-500 ${activeHighlight === highlight.id ? "opacity-100" : "opacity-0"}`}
                    >
                      <div className="grid h-full grid-cols-1 gap-0 md:grid-cols-2">
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
                    <p className="px-4 text-center">
                      Hover over options below to explore
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Highlight Text Items */}
            {highlights && highlights.length > 0 && (
              <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {highlights.map((highlight) => {
                  const highlightLinkUrl = highlight.link
                    ? getLinkUrl(highlight.link)
                    : null;
                  const itemContent = (
                    <div
                      className="hover:border-primary cursor-pointer rounded-lg border border-transparent p-4 transition-all hover:bg-gray-50"
                      onMouseEnter={() =>
                        setActiveHighlight(highlight.id || null)
                      }
                      onMouseLeave={() => setActiveHighlight(null)}
                      onFocus={() => setActiveHighlight(highlight.id || null)}
                      onBlur={() => setActiveHighlight(null)}
                    >
                      <h3 className="mb-2 text-xl font-medium">
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
                            ? { rel: "noopener noreferrer", target: "_blank" }
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
              <div className="mx-auto mb-10 max-w-prose md:mb-12">
                {afterText.split("\n").map((line, i) => (
                  <p key={i} className="mb-4 text-lg last:mb-0">
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
