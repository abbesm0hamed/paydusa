import type { Block } from "payload";

import { link } from "@/fields/link";
import richText from "@/fields/richText";

export const HoverCards: Block = {
  fields: [
    {
      label: "Hide Background",
      name: "hideBackground",
      type: "checkbox",
    },
    richText({
      name: "content",
    }),
    {
      fields: [
        {
          name: "title",
          required: true,
          type: "text",
        },
        {
          name: "desc", // shortened from description
          type: "textarea",
        },
        {
          name: "image",
          relationTo: "media",
          type: "upload",
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
      maxRows: 8,
      minRows: 1,
      name: "cards",
      type: "array",
    },
  ],
  graphQL: {
    singularName: "HoverCards",
  },
  interfaceName: "HoverCardsBlock",
  labels: {
    plural: "Hover Cards Blocks",
    singular: "Hover Cards Block",
  },
  slug: "hoverCards",
};
