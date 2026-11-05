import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Field } from "payload";

import { linkGroup } from "@/fields/linkGroup";

export const hero: Field = {
  fields: [
    {
      defaultValue: "flickeringImpact",
      label: "Type",
      localized: true,
      name: "type",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Flickering Impact",
          value: "flickeringImpact",
        },
        {
          label: "High Impact",
          value: "highImpact",
        },
        {
          label: "Medium Impact",
          value: "mediumImpact",
        },
        {
          label: "Low Impact",
          value: "lowImpact",
        },
      ],
      required: true,
      type: "select",
    },
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
      localized: true,
      name: "richText",
      type: "richText",
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      admin: {
        condition: (_, { type } = {}) =>
          ["highImpact", "mediumImpact"].includes(type),
      },
      name: "media",
      relationTo: "media",
      required: true,
      type: "upload",
    },
  ],
  label: false,
  name: "hero",
  type: "group",
};
