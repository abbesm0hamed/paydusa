import type { Block } from 'payload';
import { link } from '@/fields/link';
import richText from '@/fields/richText';

export const HoverCards: Block = {
  slug: 'hoverCards',
  interfaceName: 'HoverCardsBlock',
  fields: [
    {
      name: 'hideBackground',
      type: 'checkbox',
      label: 'Hide Background',
    },
    richText({
      name: 'content',
    }),
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'desc', // shortened from description
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
      maxRows: 8,
      minRows: 1,
    },
  ],
  graphQL: {
    singularName: 'HoverCards',
  },
  labels: {
    plural: 'Hover Cards Blocks',
    singular: 'Hover Cards Block',
  },
};
