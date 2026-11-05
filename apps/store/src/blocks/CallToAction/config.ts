import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

import { linkGroup } from "../../fields/linkGroup";

export const CallToAction: Block = {
  fields: [
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
      name: "richText",
      type: "richText",
    },
    linkGroup({
      appearances: ["default", "outline"],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  interfaceName: "CallToActionBlock",
  labels: {
    plural: "Calls to Action",
    singular: "Call to Action",
  },
  slug: "cta",
};
