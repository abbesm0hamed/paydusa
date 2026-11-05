import type { Block } from "payload";

import { link } from "@/fields/link";
import richText from "@/fields/richText";

export const LogoGrid: Block = {
  fields: [
    richText({
      localized: true,
      name: "content",
    }),
    {
      name: "hasLink",
      type: "checkbox",
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
      fields: [
        {
          name: "logo", // shortened from logoMedia
          relationTo: "media",
          required: true,
          type: "upload",
        },
      ],
      name: "logos",
      type: "array",
    },
  ],
  graphQL: {
    singularName: "LogoGrid",
  },
  interfaceName: "LogoGridBlock",
  labels: {
    plural: "Logo Grid Blocks",
    singular: "Logo Grid Block",
  },
  slug: "logoGrid",
};
