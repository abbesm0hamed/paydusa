import type { Block } from 'payload';
import { link } from '@/fields/link';
import { linkGroup } from '@/fields/linkGroup';
import richText from '@/fields/richText';

export const CardGrid: Block = {
  slug: 'cardGrid',
  interfaceName: 'CardGridBlock',
  graphQL: {
    singularName: 'CardGrid',
  },
  labels: {
    plural: 'Card Grids',
    singular: 'Card Grid',
  },
  fields: [
    richText({
      name: 'content',
    }),
    linkGroup({
      appearances: false,
      overrides: {
        admin: {
          description:
            'These links will be placed above the card grid as calls-to-action.',
        },
      },
    }),
    {
      name: 'revealOnHover',
      type: 'checkbox',
      label: 'Reveal descriptions on hover?',
    },
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
          name: 'desc',
          type: 'textarea',
        },
        {
          name: 'hasLink',
          type: 'checkbox',
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            admin: {
              condition: (_, { hasLink }) => hasLink,
            },
          },
        }),
      ],
    },
  ],
};
