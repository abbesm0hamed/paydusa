'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@repo/design-system/components/ui/button';
import RichText from '@/components/RichText';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export type ContentGridBlockType = {
  blockName?: string | null;
  blockType: 'contentGrid';
  style?: 'gridBelow' | 'sideBySide';
  showNumbers?: boolean | null;
  mainContent?: DefaultTypedEditorState | null;
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
  cells?:
    | {
        cellContent: DefaultTypedEditorState;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
};

export const ContentGrid: React.FC<ContentGridBlockType> = (props) => {
  const {
    style = 'gridBelow',
    showNumbers = false,
    mainContent,
    links,
    cells,
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

  // Determine grid columns based on number of cells
  const getGridCols = (cellCount: number) => {
    if (cellCount === 1) return 'grid-cols-1';
    if (cellCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (cellCount === 3) return 'grid-cols-1 md:grid-cols-3';
    if (cellCount === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    if (cellCount <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  const hasCells = cells && cells.length > 0;
  const cellCount = cells?.length || 0;

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="content-container">
        {style === 'gridBelow' ? (
          <>
            {/* Header with content and links */}
            <div className="mb-12">
              {mainContent && (
                <div className="max-w-3xl mb-8">
                  <RichText data={mainContent} enableGutter={false} />
                </div>
              )}

              {links && links.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {links.map((item, i) => {
                    const linkUrl = getLinkUrl(item.link);
                    if (!linkUrl || !item.link.label) return null;

                    const linkProps = item.link.newTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {};

                    return (
                      <Link key={item.id || i} href={linkUrl} {...linkProps}>
                        <Button variant={i === 0 ? 'default' : 'outline'}>
                          {item.link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid cells */}
            {hasCells && (
              <div className={`grid ${getGridCols(cellCount)} gap-6 md:gap-8`}>
                {cells.map((cell, i) => (
                  <div
                    key={cell.id || i}
                    className="p-6 border border-border rounded-lg"
                  >
                    {showNumbers && (
                      <div className="text-3xl font-bold text-primary mb-4">
                        {i + 1}
                      </div>
                    )}
                    <RichText data={cell.cellContent} enableGutter={false} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Side by Side layout
          <div
            className={`grid grid-cols-1 ${hasCells ? 'lg:grid-cols-2' : ''} gap-10`}
          >
            {/* Main content column */}
            <div className="max-w-3xl">
              {mainContent && (
                <div className="mb-8">
                  <RichText data={mainContent} enableGutter={false} />
                </div>
              )}

              {links && links.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {links.map((item, i) => {
                    const linkUrl = getLinkUrl(item.link);
                    if (!linkUrl || !item.link.label) return null;

                    const linkProps = item.link.newTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {};

                    return (
                      <Link key={item.id || i} href={linkUrl} {...linkProps}>
                        <Button variant={i === 0 ? 'default' : 'outline'}>
                          {item.link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid cells column */}
            {hasCells && (
              <div
                className={`grid grid-cols-1 ${cellCount > 1 ? 'md:grid-cols-2' : ''} gap-6`}
              >
                {cells.map((cell, i) => (
                  <div
                    key={cell.id || i}
                    className="p-6 border border-border rounded-lg"
                  >
                    {showNumbers && (
                      <div className="text-3xl font-bold text-primary mb-4">
                        {i + 1}
                      </div>
                    )}
                    <RichText data={cell.cellContent} enableGutter={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
