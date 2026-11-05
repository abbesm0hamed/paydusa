import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const FormBlock: Block = {
  fields: [
    // {
    //   name: 'form',
    //   type: 'relationship',
    //   relationTo: 'forms',
    //   required: true,
    // },
    {
      label: "Enable Intro Content",
      name: "enableIntro",
      type: "checkbox",
    },
    {
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: "Intro Content",
      localized: true,
      name: "introContent",
      type: "richText",
    },
  ],
  graphQL: {
    singularName: "FormBlock",
  },
  interfaceName: "FormBlock",
  labels: {
    plural: "Form Blocks",
    singular: "Form Block",
  },
  slug: "formBlock",
};
