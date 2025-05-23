import type { Block } from 'payload';
import richText from '@/fields/richText';

export const Callout: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  fields: [
    richText({
      name: 'content',
    }),
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'text',
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
    {
      name: 'imgs',
      type: 'array',
      fields: [
        {
          name: 'img',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'Callout',
  },
  labels: {
    plural: 'Callout Blocks',
    singular: 'Callout Block',
  },
};
