import type { Block } from 'payload';
import { link } from '@/fields/link';

export const HoverHighlights: Block = {
  slug: 'hoverHighlights',
  interfaceName: 'HoverHighlightsBlock',
  fields: [
    {
      name: 'beforeText',
      type: 'textarea',
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'media',
          type: 'group',
          admin: {
            hideGutter: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'top',
                  type: 'upload',
                  admin: {
                    width: '50%',
                  },
                  relationTo: 'media',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bottom',
                  type: 'upload',
                  admin: {
                    width: '50%',
                  },
                  relationTo: 'media',
                },
              ],
            },
          ],
          label: 'Media',
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
    },
    {
      name: 'afterText',
      type: 'textarea',
    },
    link({
      appearances: false,
    }),
  ],
  graphQL: {
    singularName: 'HoverHighlights',
  },
  labels: {
    plural: 'Hover Highlights Blocks',
    singular: 'Hover Highlights Block',
  },
};
