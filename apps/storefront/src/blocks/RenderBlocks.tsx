import React, { Fragment } from 'react';

import type { Page } from '@/payload-types';
import type { TypedLocale } from 'payload';

import { MediaContentAccordion } from '@/blocks/MediaContentAccordion/config';
import { HoverHighlights } from '@/blocks/HoverHighlights/Component';
import { CallToActionBlock } from '@/blocks/CallToAction/Component';
import { RelatedPosts } from '@/blocks/RelatedPosts/Component';
import { MediaContent } from '@/blocks/MediaContent/Component';
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component';
import { ContentGrid } from '@/blocks/ContentGrid/Component';
import { BlogContent } from '@/blocks/BlogContent/Component';
import { HoverCards } from '@/blocks/HoverCards/Component';
import { MediaBlock } from '@/blocks/MediaBlock/Component';
import { ContentBlock } from '@/blocks/Content/Component';
import { CardGrid } from '@/blocks/CardGrid/Component';
import { LinkGrid } from '@/blocks/LinkGrid/Component';
import { LogoGrid } from '@/blocks/LogoGrid/Component';
import { Callout } from '@/blocks/Callout/Component';
import { FormBlock } from '@/blocks/Form/Component';
import { Banner } from '@/blocks/Banner/Component';

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  mediaContentAccordion: MediaContentAccordion,
  mediaContent: MediaContent,
  relatedPosts: RelatedPosts,
  blogContent: BlogContent,
  callout: Callout,
  banner: Banner,
  contentGrid: ContentGrid,
  cardGrid: CardGrid,
  linkGrid: LinkGrid,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  logoGrid: LogoGrid,
};

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][];
  locale: TypedLocale;
}> = (props) => {
  const { blocks, locale } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...block} disableInnerContainer locale={locale} />
                </div>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
