import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';
import { revalidateFooter } from './hooks/revalidateFooter';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'navItems',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/globals/Footer/RowLabel#RowLabel',
            },
          },
        },
      ],
      maxRows: 4,
      minRows: 1,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
};
