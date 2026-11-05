import type { Block } from "payload";

import richText from "@/fields/richText";

export const Callout: Block = {
  fields: [
    richText({
      name: "content",
    }),
    {
      name: "logo",
      relationTo: "media",
      required: true,
      type: "upload",
    },
    {
      fields: [
        {
          name: "author",
          type: "text",
        },
        {
          name: "role",
          type: "text",
        },
      ],
      type: "row",
    },
    {
      fields: [
        {
          name: "img",
          relationTo: "media",
          required: true,
          type: "upload",
        },
      ],
      name: "imgs",
      type: "array",
    },
  ],
  graphQL: {
    singularName: "Callout",
  },
  interfaceName: "CalloutBlock",
  labels: {
    plural: "Callout Blocks",
    singular: "Callout Block",
  },
  slug: "callout",
};
