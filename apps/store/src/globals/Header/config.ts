import type { GlobalConfig } from "payload";

import { link } from "@/fields/link";

import { revalidateHeader } from "./hooks/revalidateHeader";

export const Header: GlobalConfig = {
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
      admin: {
        components: {
          RowLabel: "@/globals/Header/RowLabel#RowLabel",
        },
        initCollapsed: true,
      },
      fields: [
        {
          admin: {
            layout: "horizontal",
          },
          defaultValue: "link",
          name: "type",
          options: [
            {
              label: "Single Link",
              value: "link",
            },
            {
              label: "Group",
              value: "group",
            },
          ],
          type: "radio",
        },
        // Fields for single link type
        {
          admin: {
            condition: (_, siblingData) => siblingData?.type === "link",
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
          name: "linkFields",
          type: "group",
        },
        // Fields for group type
        {
          admin: {
            condition: (_, siblingData) => siblingData?.type === "group",
          },
          fields: [
            {
              admin: {
                description: "The label for this dropdown group",
              },
              name: "label",
              required: true,
              type: "text",
            },
            {
              fields: [
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Optional: Title for this group of links",
                  },
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description: "Optional: Image for this group",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Optional: Description for this group",
                  },
                },
                {
                  name: "links",
                  type: "array",
                  required: true,
                  minRows: 1,
                  fields: [
                    link({
                      appearances: false,
                    }),
                    {
                      name: "description",
                      type: "textarea",
                      admin: {
                        description: "Optional: Description for this link",
                      },
                    },
                  ],
                },
              ],
              name: "groups",
              type: "array",
            },
          ],
          name: "groupFields",
          type: "group",
        },
      ],
      localized: true,
      maxRows: 6,
      name: "navItems",
      type: "array",
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
  slug: "header",
  versions: false,
};
