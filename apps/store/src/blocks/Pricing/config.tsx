import type { Block } from "payload";

import { link } from "@/fields/link";

export const Pricing: Block = {
  fields: [
    {
      fields: [
        {
          name: "name",
          required: true,
          type: "text",
        },
        {
          name: "hasPrice",
          type: "checkbox",
        },
        {
          name: "createPayload",
          type: "checkbox", // shortened from enableCreatePayload
        },
        {
          admin: {
            condition: (_, { hasPrice }) => Boolean(hasPrice),
          },
          label: "Price per month",
          name: "price",
          required: true,
          type: "text",
        },
        {
          admin: {
            condition: (_, { hasPrice }) => !hasPrice,
          },
          label: "Title",
          name: "title",
          required: true,
          type: "text",
        },
        {
          name: "desc", // shortened from description
          type: "textarea",
        },
        {
          name: "hasLink", // shortened from enableLink
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
              name: "icon",
              options: [
                {
                  label: "Check",
                  value: "check",
                },
                {
                  label: "X",
                  value: "x",
                },
              ],
              type: "radio",
            },
            {
              label: false,
              name: "text", // shortened from feature
              type: "text",
            },
          ],
          name: "features",
          type: "array",
        },
      ],
      maxRows: 4,
      minRows: 1,
      name: "plans",
      type: "array",
    },
    {
      name: "disclaimer",
      type: "text",
    },
  ],
  graphQL: {
    singularName: "Pricing",
  },
  interfaceName: "PricingBlock",
  labels: {
    plural: "Pricing Blocks",
    singular: "Pricing Block",
  },
  slug: "pricing",
};
