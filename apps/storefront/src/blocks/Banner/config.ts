import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: false,
      required: true,
    },
  ],
};
