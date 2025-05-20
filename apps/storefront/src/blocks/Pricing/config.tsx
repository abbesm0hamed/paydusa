import type { Block } from 'payload';
import { link } from '@/fields/link';

export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  fields: [
    {
      name: 'plans',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'hasPrice',
          type: 'checkbox',
        },
        {
          name: 'createPayload',
          type: 'checkbox', // shortened from enableCreatePayload
        },
        {
          name: 'price',
          type: 'text',
          admin: {
            condition: (_, { hasPrice }) => Boolean(hasPrice),
          },
          label: 'Price per month',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            condition: (_, { hasPrice }) => !hasPrice,
          },
          label: 'Title',
          required: true,
        },
        {
          name: 'desc', // shortened from description
          type: 'textarea',
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
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'icon',
              type: 'radio',
              options: [
                {
                  label: 'Check',
                  value: 'check',
                },
                {
                  label: 'X',
                  value: 'x',
                },
              ],
            },
            {
              name: 'text', // shortened from feature
              type: 'text',
              label: false,
            },
          ],
        },
      ],
      maxRows: 4,
      minRows: 1,
    },
    {
      name: 'disclaimer',
      type: 'text',
    },
  ],
  graphQL: {
    singularName: 'Pricing',
  },
  labels: {
    plural: 'Pricing Blocks',
    singular: 'Pricing Block',
  },
};
