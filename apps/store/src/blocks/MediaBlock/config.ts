import type { Block } from "payload";

export const MediaBlock: Block = {
  fields: [
    {
      name: "media",
      relationTo: "media",
      required: true,
      type: "upload",
    },
  ],
  interfaceName: "MediaBlock",
  slug: "mediaBlock",
};
