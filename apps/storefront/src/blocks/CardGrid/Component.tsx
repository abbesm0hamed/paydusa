'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utilities/ui';
import RichText from '@/components/RichText';
import { CMSLink } from '@/components/Link';
import type { CardGridBlock as CardGridBlockProps } from '@/payload-types';

export const CardGrid: React.FC<CardGridBlockProps> = ({
  content,
  links,
  revealOnHover = false,
  cards = [],
}) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Function to resolve link URL
  const getLinkUrl = (link: CardGridBlockProps['cards'][0]['link']) => {
    if (!link) return undefined;
    if (link.type === 'custom' && link.url) {
      return link.url;
    }
    if (link.type === 'reference' && link.reference) {
      const ref = link.reference;
      const value = ref.value;
      // If value is an object with slug property
      if (typeof value !== 'number') {
        if ('slug' in value && typeof value.slug === 'string') {
          return ref.relationTo === 'pages'
            ? `/${value.slug}`
            : `/posts/${value.slug}`;
        }
      }
    }
    return undefined;
  };

  return (
    <section className="py-12">
      <div className="container">
        {/* Content Section */}
        {content && (
          <div className="mb-8">
            <RichText data={content} />
          </div>
        )}

        {/* Links / CTAs Section */}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {links.map((linkItem, i) => (
              <CMSLink key={linkItem.id || `link-${i}`} {...linkItem.link} />
            ))}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards &&
            cards.map((card, index) => {
              const linkUrl = card.hasLink ? getLinkUrl(card.link) : undefined;

              const CardContent = () => (
                <>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  {card.desc && (
                    <p
                      className={cn(
                        'text-sm',
                        revealOnHover
                          ? activeCard === index
                            ? 'block'
                            : 'hidden md:block md:opacity-0 transition-opacity duration-300'
                          : 'block'
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
                    'p-6 rounded-lg border transition-all duration-300',
                    activeCard === index && revealOnHover
                      ? 'shadow-lg border-primary/20'
                      : 'border-border hover:shadow-md'
                  )}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  {linkUrl ? (
                    <Link
                      href={linkUrl}
                      target={card.link?.newTab ? '_blank' : undefined}
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
}) => {
  return <CardGrid {...data} />;
};
