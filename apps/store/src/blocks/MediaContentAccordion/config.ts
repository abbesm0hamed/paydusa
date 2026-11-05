import type { Block } from "payload";

import { link } from "@/fields/link";

export const MediaContentAccordion: Block = {
  fields: [
    {
      admin: {
        description: "Choose how to align the content for this block.",
      },
      defaultValue: "contentMedia",
      name: "alignment",
      options: [
        {
          label: "Content + Media",
          value: "contentMedia",
        },
        {
          label: "Media + Content",
          value: "mediaContent",
        },
      ],
      type: "select",
    },
    {
      fields: [
        {
          admin: {
            width: "50%",
          },
          name: "leader",
          type: "text",
        },
        {
          admin: {
            width: "50%",
          },
          name: "heading",
          type: "text",
        },
      ],
      type: "row",
    },
    {
      fields: [
        {
          fields: [
            {
              admin: {
                description: "Choose how to position the media itself.",
                width: "50%",
              },
              defaultValue: "normal",
              name: "position",
              options: [
                {
                  label: "Normal",
                  value: "normal",
                },
                {
                  label: "Inset",
                  value: "inset",
                },
                {
                  label: "Wide",
                  value: "wide",
                },
              ],
              type: "select",
            },
            {
              admin: {
                description:
                  "Select the background you want to sit behind the media.",
                width: "50%",
              },
              defaultValue: "none",
              name: "bg", // shortened from background
              options: [
                {
                  label: "None",
                  value: "none",
                },
                {
                  label: "Gradient",
                  value: "gradient",
                },
                {
                  label: "Scanlines",
                  value: "scanlines",
                },
              ],
              type: "select",
            },
          ],
          type: "row",
        },
        {
          name: "label", // shortened from mediaLabel
          required: true,
          type: "text",
        },
        {
          name: "desc", // shortened from mediaDescription
          required: true,
          type: "richText",
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
          name: "media",
          relationTo: "media",
          required: true,
          type: "upload",
        },
      ],
      maxRows: 4,
      minRows: 1,
      name: "items", // shortened from accordion
      type: "array",
    },
  ],
  graphQL: {
    singularName: "MediaAccordion",
  },
  interfaceName: "MediaContentAccordionBlock",
  labels: {
    plural: "Media Accordion Blocks",
    singular: "Media Accordion Block",
  },
  slug: "mediaContentAccordion",
};
