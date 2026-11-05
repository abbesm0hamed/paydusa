"use client";
import type { CardGridBlock as CardGridBlockProps } from "@payload-types";
import Link from "next/link";
import React, { useState } from "react";

import { CMSLink } from "@/components/Link";
import RichText from "@/components/RichText";
import { cn } from "@/utilities/ui";

export const CardGrid: React.FC<CardGridBlockProps> = ({
  content,
  links,
  revealOnHover = false,
  cards = [],
}) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  type CardLink = NonNullable<
    NonNullable<CardGridBlockProps["cards"]>[number]
  >["link"];

  const getLinkUrl = (link: CardLink) => {
    if (!link) {
      return;
    }
    if (link.type === "custom" && link.url) {
      return link.url;
    }
    if (link.type === "reference" && link.reference) {
      const ref = link.reference;
      const { value } = ref;
      if (typeof value !== "number") {
        if ("slug" in value && typeof value.slug === "string") {
          return ref.relationTo === "pages"
            ? `/${value.slug}`
            : `/posts/${value.slug}`;
        }
      }
    }
    return;
  };

  return (
    <section className="py-12">
      <div className="content-container">
        {/* Content Section */}
        {content && (
          <div className="mb-8">
            <RichText data={content} />
          </div>
        )}

        {/* Links / CTAs Section */}
        {links && links.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4">
            {links.map((linkItem, i) => (
              <CMSLink key={linkItem.id || `link-${i}`} {...linkItem.link} />
            ))}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards &&
            cards.map((card, index) => {
              const linkUrl = card.hasLink ? getLinkUrl(card.link) : undefined;

              const CardContent = () => (
                <>
                  <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                  {card.desc && (
                    <p
                      className={cn(
                        "text-sm",
                        revealOnHover
                          ? activeCard === index
                            ? "block"
                            : "hidden transition-opacity duration-300 md:block md:opacity-0"
                          : "block"
                      )}
                    >
                      {card.desc}
                    </p>
                  )}
                </>
              );

              return (
                <div
                  key={card.id || `card-${index}`}
                  className={cn(
                    "rounded-lg border p-6 transition-all duration-300",
                    activeCard === index && revealOnHover
                      ? "border-primary/20 shadow-lg"
                      : "border-border hover:shadow-md"
                  )}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  {linkUrl ? (
                    <Link
                      href={linkUrl}
                      target={card.link?.newTab ? "_blank" : undefined}
                      className="block h-full no-underline"
                    >
                      <CardContent />
                    </Link>
                  ) : (
                    <CardContent />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

// For use with Payload blocks renderer
export const CardGridBlock: React.FC<{ data: CardGridBlockProps }> = ({
  data,
}) => <CardGrid {...data} />;
