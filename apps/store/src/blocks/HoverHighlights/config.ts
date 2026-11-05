import type { Block } from "payload";

import { link } from "@/fields/link";

export const HoverHighlights: Block = {
  fields: [
    {
      name: "beforeText",
      type: "textarea",
    },
    {
      fields: [
        {
          name: "text",
          required: true,
          type: "text",
        },
        {
          admin: {
            hideGutter: true,
          },
          fields: [
            {
              fields: [
                {
                  name: "top",
                  type: "upload",
                  admin: {
                    width: "50%",
                  },
                  relationTo: "media",
                },
              ],
              type: "row",
            },
            {
              fields: [
                {
                  name: "bottom",
                  type: "upload",
                  admin: {
                    width: "50%",
                  },
                  relationTo: "media",
                },
              ],
              type: "row",
            },
          ],
          label: "Media",
          name: "media",
          type: "group",
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
      name: "highlights",
      type: "array",
    },
    {
      name: "afterText",
      type: "textarea",
    },
    link({
      appearances: false,
    }),
  ],
  graphQL: {
    singularName: "HoverHighlights",
  },
  interfaceName: "HoverHighlightsBlock",
  labels: {
    plural: "Hover Highlights Blocks",
    singular: "Hover Highlights Block",
  },
  slug: "hoverHighlights",
};
