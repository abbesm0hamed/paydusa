import type { Block } from 'payload';
import { link } from '@/fields/link';

export const MediaContentAccordion: Block = {
  slug: 'mediaContentAccordion',
  interfaceName: 'MediaContentAccordionBlock',
  fields: [
    {
      name: 'alignment',
      type: 'select',
      admin: {
        description: 'Choose how to align the content for this block.',
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
      type: 'row',
      fields: [
        {
          name: 'leader',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'items', // shortened from accordion
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'position',
              type: 'select',
              admin: {
                description: 'Choose how to position the media itself.',
                width: '50%',
              },
              defaultValue: 'normal',
              options: [
                {
                  label: 'Normal',
                  value: 'normal',
                },
                {
                  label: 'Inset',
                  value: 'inset',
                },
                {
                  label: 'Wide',
                  value: 'wide',
                },
              ],
            },
            {
              name: 'bg', // shortened from background
              type: 'select',
              admin: {
                description:
                  'Select the background you want to sit behind the media.',
                width: '50%',
              },
              defaultValue: 'none',
              options: [
                {
                  label: 'None',
                  value: 'none',
                },
                {
                  label: 'Gradient',
                  value: 'gradient',
                },
                {
                  label: 'Scanlines',
                  value: 'scanlines',
                },
              ],
            },
          ],
        },
        {
          name: 'label', // shortened from mediaLabel
          type: 'text',
          required: true,
        },
        {
          name: 'desc', // shortened from mediaDescription
          type: 'richText',
          required: true,
        },
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
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      maxRows: 4,
      minRows: 1,
    },
  ],
  graphQL: {
    singularName: 'MediaAccordion',
  },
  labels: {
    plural: 'Media Accordion Blocks',
    singular: 'Media Accordion Block',
  },
};
