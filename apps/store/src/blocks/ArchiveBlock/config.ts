import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const Archive: Block = {
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
      label: "Intro Content",
      name: "introContent",
      type: "richText",
    },
    {
      defaultValue: "collection",
      name: "populateBy",
      options: [
        {
          label: "Collection",
          value: "collection",
        },
        {
          label: "Individual Selection",
          value: "selection",
        },
      ],
      type: "select",
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
      },
      defaultValue: "posts",
      label: "Collections To Show",
      name: "relationTo",
      options: [
        {
          label: "Posts",
          value: "posts",
        },
      ],
      type: "select",
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
      },
      hasMany: true,
      label: "Categories To Show",
      name: "categories",
      relationTo: "categories",
      type: "relationship",
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "collection",
        step: 1,
      },
      defaultValue: 10,
      label: "Limit",
      name: "limit",
      type: "number",
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === "selection",
      },
      hasMany: true,
      label: "Selection",
      name: "selectedDocs",
      relationTo: ["posts"],
      type: "relationship",
    },
  ],
  interfaceName: "ArchiveBlock",
  labels: {
    plural: "Archives",
    singular: "Archive",
  },
  slug: "archive",
};
