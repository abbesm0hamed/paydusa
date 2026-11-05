import type { Block } from "payload";

import richText from "@/fields/richText";

export const BlogContent: Block = {
  fields: [
    richText({
      name: "content",
    }),
  ],
  graphQL: {
    singularName: "BlogContent",
  },
  interfaceName: "BlogContentBlock",
  labels: {
    plural: "Blog Content Blocks",
    singular: "Blog Content Block",
  },
  slug: "blogContent",
};
