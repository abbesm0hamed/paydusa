'use client';
import RichText from '@/components/RichText';
import type { HoverCardsBlock as HoverCardsBlockProps } from '@/payload-types';
import { cn } from '@/utilities/ui';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';

export const HoverCards: React.FC<HoverCardsBlockProps> = ({
  hideBackground = false,
  content,
  cards = [],
}) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Function to resolve link URL
  const getLinkUrl = (link: HoverCardsBlockProps['cards'][0]['link']) => {
    if (!link) return undefined;

    if (link.type === 'custom' && link.url) {
      return link.url;
    }

    if (link.type === 'reference' && link.reference) {
      const ref = link.reference;
      const value = ref.value;

      // If value is an object with slug property
      if (
        typeof value !== 'number' &&
        'slug' in value &&
        typeof value.slug === 'string'
      ) {
        return ref.relationTo === 'pages'
          ? `/${value.slug}`
          : `/posts/${value.slug}`;
      }
    }

    return undefined;
  };

  // Function to get image URL from card media
  const getImageUrl = (card: HoverCardsBlockProps['cards'][0]) => {
    // Assuming the card has a media/image field
    // Adjust this based on your actual payload structure
    if (card.media && typeof card.media === 'object' && 'url' in card.media) {
      return card.media.url as string;
    }

    // Fallback for different payload structures
    if (card.image && typeof card.image === 'object' && 'url' in card.image) {
      return card.image.url as string;
    }

    return null;
  };

  // Group cards into pairs for the alternating layout
  const cardPairs = [];
  for (let i = 0; i < cards.length; i += 2) {
    if (i + 1 < cards.length) {
      cardPairs.push([cards[i], cards[i + 1]]);
    } else {
      // Handle odd number of cards
      cardPairs.push([cards[i]]);
    }
  }

  // Define the repeating pattern for a 6-column grid
  const getColSpanClass = (rowIndex: number, colIndex: number) => {
    // Use modulo 3 to repeat the pattern every 3 rows
    const rowPattern = rowIndex % 3;

    if (rowPattern === 0) {
      // First row: 4/2
      return colIndex === 0 ? 'md:col-span-4' : 'md:col-span-2';
    } else if (rowPattern === 1) {
      // Second row: 3/3
      return 'md:col-span-3';
    } else {
      // Third row: 2/4
      return colIndex === 0 ? 'md:col-span-2' : 'md:col-span-4';
    }
  };

  return (
    <div className={cn('py-12')}>
      <div className="container">
        {/* Content Section */}
        {content && (
          <div className="mb-8">
            <RichText data={content} />
          </div>
        )}

        {/* Cards Section with specific repeating pattern */}
        <div className="overflow-hidden border border-border">
          {cardPairs.map((pair, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={cn(
                'grid grid-cols-1 md:grid-cols-6',
                rowIndex !== cardPairs.length - 1 && 'border-border border-b'
              )}
            >
              {pair.map((card, colIndex) => {
                const linkUrl = getLinkUrl(card.link);
                const colSpanClass = getColSpanClass(rowIndex, colIndex);
                const imageUrl = getImageUrl(card);
                const cardIndex = rowIndex * 2 + colIndex;
                const isActive = activeCard === cardIndex;

                // Last column in the row?
                const isLastInRow = colIndex === pair.length - 1;

                const CardContent = () => (
                  <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                    <h3 className="mb-2 font-bold text-white text-xl drop-shadow-md">
                      {card.title}
                    </h3>
                    {card.desc && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-white drop-shadow-md"
                      >
                        {card.desc}
                      </motion.p>
                    )}
                  </div>
                );

                return (
                  <div
                    key={card.id || `card-${rowIndex}-${colIndex}`}
                    className={cn(
                      'group relative overflow-hidden p-8 transition-all duration-500',
                      colSpanClass,
                      !isLastInRow && 'border-border md:border-r',
                      'flex min-h-[200px] items-start'
                    )}
                    onMouseEnter={() => setActiveCard(cardIndex)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    {/* Background Image with Overlay */}
                    {imageUrl && (
                      <>
                        <div className="absolute inset-0 h-full w-full">
                          <div
                            className={cn(
                              'absolute inset-0 z-[1] bg-gradient-to-t from-black/80 to-black/30 transition-opacity duration-500',
                              'opacity-90'
                            )}
                          />
                          <div className="absolute inset-0 h-full w-full">
                            <Image
                              src={imageUrl || '/placeholder.svg'}
                              alt={card.title || 'Card background'}
                              fill
                              className={cn(
                                'object-cover transition-all duration-700',
                                isActive ? 'scale-110 blur-[2px]' : 'scale-100'
                              )}
                            />
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div
                          className={cn(
                            '-mr-12 -mb-12 absolute right-0 bottom-0 h-24 w-24 rounded-full bg-gradient-radial from-white/20 to-transparent transition-all duration-500',
                            isActive
                              ? 'scale-125 opacity-100'
                              : 'scale-75 opacity-0'
                          )}
                        />

                        <div
                          className={cn(
                            '-ml-8 -mt-8 absolute top-0 left-0 h-16 w-16 rounded-full border border-white/10 transition-all duration-500',
                            isActive ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </>
                    )}

                    {/* Card Content */}
                    <div className="relative z-10 w-full">
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
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// For use with Payload blocks renderer
export const HoverCardsBlock: React.FC<{ data: HoverCardsBlockProps }> = ({
  data,
}) => {
  return <HoverCards {...data} />;
};
