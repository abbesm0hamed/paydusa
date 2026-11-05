import type { Block } from "payload";

import { linkGroup } from "@/fields/linkGroup";
import richText from "@/fields/richText";

export const ContentGrid: Block = {
  fields: [
    {
      fields: [
        {
          defaultValue: "gridBelow",
          label: "Style",
          name: "style",
          options: [
            { label: "Grid Below", value: "gridBelow" },
            { label: "Side by Side", value: "sideBySide" },
          ],
          type: "select",
        },
        {
          name: "showNumbers",
          type: "checkbox",
        },
      ],
      type: "row",
    },
    richText({
      label: "Content",
      name: "mainContent",
      required: false,
    }),
    linkGroup({
      appearances: false,
      overrides: {},
    }),
    {
      fields: [
        {
          name: "cellContent",
          required: true,
          type: "richText",
        },
      ],
      maxRows: 8,
      minRows: 1,
      name: "cells",
      type: "array",
    },
  ],
  graphQL: {
    singularName: "ContentGrid",
  },
  interfaceName: "ContentGridBlock",
  labels: {
    plural: "Content Grid Blocks",
    singular: "Content Grid Block",
  },
  slug: "contentGrid",
};
