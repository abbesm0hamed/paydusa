import type { GlobalConfig } from 'payload';
import { link } from '@/fields/link';
import { revalidateHeader } from './hooks/revalidateHeader';

export const Header: GlobalConfig = {
  slug: 'header',
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
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            {
              label: 'Single Link',
              value: 'link',
            },
            {
              label: 'Group',
              value: 'group',
            },
          ],
          defaultValue: 'link',
          admin: {
            layout: 'horizontal',
          },
        },
        // Fields for single link type
        {
          name: 'linkFields',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
        // Fields for group type
        {
          name: 'groupFields',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'group',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'The label for this dropdown group',
              },
            },
            {
              name: 'groups',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Optional: Title for this group of links',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional: Image for this group',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Optional: Description for this group',
                  },
                },
                {
                  name: 'links',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  fields: [
                    link({
                      appearances: false,
                    }),
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'Optional: Description for this link',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/globals/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
};
