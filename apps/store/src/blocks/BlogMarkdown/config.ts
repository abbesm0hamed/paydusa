import type { Block } from "payload";

export const BlogMarkdown: Block = {
  fields: [
    {
      admin: {
        components: {
          Field: "@/blocks/BlogMarkdown/Field#BlogMarkdownField",
        },
      },
      name: "markdown",
      required: true,
      type: "text",
    },
  ],
  graphQL: {
    singularName: "BlogMarkdown",
  },
  interfaceName: "BlogMarkdownBlock",
  labels: {
    plural: "Markdown Blocks",
    singular: "Markdown",
  },
  slug: "blogMarkdown",
};
