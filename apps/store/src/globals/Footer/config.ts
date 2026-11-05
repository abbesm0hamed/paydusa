import type { GlobalConfig } from "payload";

import { link } from "@/fields/link";

import { revalidateFooter } from "./hooks/revalidateFooter";

export const Footer: GlobalConfig = {
  access: {
    read: () => true,
  },
  authorship: false,
  fields: [
    {
      name: "logo",
      relationTo: "media",
      type: "upload",
    },
    {
      fields: [
        {
          localized: true,
          name: "label",
          required: true,
          type: "text",
        },
        {
          admin: {
            components: {
              RowLabel: "@/globals/Footer/RowLabel#RowLabel",
            },
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
          name: "navItems",
          type: "array",
        },
      ],
      maxRows: 4,
      minRows: 1,
      name: "columns",
      type: "array",
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  slug: "footer",
  versions: false,
};
