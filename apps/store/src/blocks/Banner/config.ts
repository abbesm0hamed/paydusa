import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const Banner: Block = {
  fields: [
    {
      defaultValue: "info",
      name: "style",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
        { label: "Success", value: "success" },
      ],
      required: true,
      type: "select",
    },
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
      name: "content",
      required: true,
      type: "richText",
    },
  ],
  interfaceName: "BannerBlock",
  slug: "banner",
};
