import type { Block } from 'payload';
import richText from '@/fields/richText';

export const BlogContent: Block = {
  slug: 'blogContent',
  interfaceName: 'BlogContentBlock',
  fields: [
    richText({
      name: 'content',
    }),
  ],
  graphQL: {
    singularName: 'BlogContent',
  },
  labels: {
    plural: 'Blog Content Blocks',
    singular: 'Blog Content Block',
  },
};
