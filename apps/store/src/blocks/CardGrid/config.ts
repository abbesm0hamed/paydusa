import type { Block } from "payload";

import { link } from "@/fields/link";
import { linkGroup } from "@/fields/linkGroup";
import richText from "@/fields/richText";

export const CardGrid: Block = {
  fields: [
    richText({
      name: "content",
    }),
    linkGroup({
      appearances: false,
      overrides: {
        admin: {
          description:
            "These links will be placed above the card grid as calls-to-action.",
        },
      },
    }),
    {
      label: "Reveal descriptions on hover?",
      name: "revealOnHover",
      type: "checkbox",
    },
    {
      fields: [
        {
          name: "title",
          required: true,
          type: "text",
        },
        {
          name: "desc",
          type: "textarea",
        },
        {
          name: "hasLink",
          type: "checkbox",
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            admin: {
              condition: (_, { hasLink }) => hasLink,
            },
          },
        }),
      ],
      name: "cards",
      type: "array",
    },
  ],
  graphQL: {
    singularName: "CardGrid",
  },
  interfaceName: "CardGridBlock",
  labels: {
    plural: "Card Grids",
    singular: "Card Grid",
  },
  slug: "cardGrid",
};
