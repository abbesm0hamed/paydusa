import type { Block } from 'payload';

export const BlogMarkdown: Block = {
  slug: 'blogMarkdown',
  interfaceName: 'BlogMarkdownBlock',
  fields: [
    {
      name: 'markdown',
      type: 'text',
      admin: {
        components: {
          Field: '@/blocks/BlogMarkdown/Field#BlogMarkdownField',
        },
      },
      required: true,
    },
  ],
  graphQL: {
    singularName: 'BlogMarkdown',
  },
  labels: {
    plural: 'Markdown Blocks',
    singular: 'Markdown',
  },
};
