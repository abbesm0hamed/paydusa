import type { Block } from "payload";

import { link } from "@/fields/link";
import richText from "@/fields/richText";

export const MediaContent: Block = {
  fields: [
    {
      fields: [
        {
          admin: {
            description: "Choose how to align the content for this block.",
            width: "50%",
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
          admin: {
            description: "Choose how wide the media should be.",
            width: "50%",
          },
          defaultValue: "stretch",
          name: "mediaWidth",
          options: [
            {
              label: "Stretch To Edge",
              value: "stretch",
            },
            {
              label: "Fit to Margin",
              value: "fit",
            },
          ],
          type: "select",
        },
      ],
      type: "row",
    },
    richText({
      name: "content",
    }),
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
          name: "img", // shortened from image
          relationTo: "media",
          required: true,
          type: "upload",
        },
      ],
      name: "imgs", // shortened from images
      type: "array",
    },
  ],
  graphQL: {
    singularName: "MediaContent",
  },
  interfaceName: "MediaContentBlock",
  labels: {
    plural: "Media Content Blocks",
    singular: "Media Content Block",
  },
  slug: "mediaContent",
};
