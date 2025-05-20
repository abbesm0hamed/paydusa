import type { Block } from 'payload';
import { link } from '@/fields/link';
import richText from '@/fields/richText';

export const LogoGrid: Block = {
  slug: 'logoGrid',
  interfaceName: 'LogoGridBlock',
  fields: [
    richText({
      name: 'content',
      localized: true,
    }),
    {
      name: 'hasLink',
      type: 'checkbox',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, { hasLink }) => hasLink,
        },
      },
    }),
    {
      name: 'logos',
      type: 'array',
      fields: [
        {
          name: 'logo', // shortened from logoMedia
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'LogoGrid',
  },
  labels: {
    plural: 'Logo Grid Blocks',
    singular: 'Logo Grid Block',
  },
};
