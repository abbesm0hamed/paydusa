import type { Block } from 'payload';
import { linkGroup } from '@/fields/linkGroup';

export const LinkGrid: Block = {
  slug: 'linkGrid',
  interfaceName: 'LinkGridBlock',
  fields: [
    linkGroup({
      appearances: false,
    }),
  ],
  graphQL: {
    singularName: 'LinkGrid',
  },
  labels: {
    plural: 'Link Grids',
    singular: 'Link Grid',
  },
};
