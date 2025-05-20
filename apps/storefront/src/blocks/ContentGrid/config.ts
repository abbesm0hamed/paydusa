import type { Block } from 'payload';
import { linkGroup } from '@/fields/linkGroup';
import richText from '@/fields/richText';

export const ContentGrid: Block = {
  slug: 'contentGrid',
  interfaceName: 'ContentGridBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'gridBelow',
          label: 'Style',
          options: [
            { label: 'Grid Below', value: 'gridBelow' },
            { label: 'Side by Side', value: 'sideBySide' },
          ],
        },
        {
          name: 'showNumbers',
          type: 'checkbox',
        },
      ],
    },
    richText({
      name: 'mainContent',
      label: 'Content',
      required: false,
    }),
    linkGroup({
      appearances: false,
      overrides: {},
    }),
    {
      name: 'cells',
      type: 'array',
      fields: [
        {
          name: 'cellContent',
          type: 'richText',
          required: true,
        },
      ],
      maxRows: 8,
      minRows: 1,
    },
  ],
  graphQL: {
    singularName: 'ContentGrid',
  },
  labels: {
    plural: 'Content Grid Blocks',
    singular: 'Content Grid Block',
  },
};
