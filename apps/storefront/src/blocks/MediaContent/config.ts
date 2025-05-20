import type { Block } from 'payload';
import { link } from '@/fields/link';
import richText from '@/fields/richText';

export const MediaContent: Block = {
  slug: 'mediaContent',
  interfaceName: 'MediaContentBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          admin: {
            description: 'Choose how to align the content for this block.',
            width: '50%',
          },
          defaultValue: 'contentMedia',
          options: [
            {
              label: 'Content + Media',
              value: 'contentMedia',
            },
            {
              label: 'Media + Content',
              value: 'mediaContent',
            },
          ],
        },
        {
          name: 'mediaWidth',
          type: 'select',
          admin: {
            description: 'Choose how wide the media should be.',
            width: '50%',
          },
          defaultValue: 'stretch',
          options: [
            {
              label: 'Stretch To Edge',
              value: 'stretch',
            },
            {
              label: 'Fit to Margin',
              value: 'fit',
            },
          ],
        },
      ],
    },
    richText({
      name: 'content',
    }),
    {
      name: 'hasLink', // shortened from enableLink
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
      name: 'imgs', // shortened from images
      type: 'array',
      fields: [
        {
          name: 'img', // shortened from image
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'MediaContent',
  },
  labels: {
    plural: 'Media Content Blocks',
    singular: 'Media Content Block',
  },
};
