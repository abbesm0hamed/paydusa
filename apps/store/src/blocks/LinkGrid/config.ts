import type { Block } from "payload";

import { linkGroup } from "@/fields/linkGroup";

export const LinkGrid: Block = {
  fields: [
    linkGroup({
      appearances: false,
    }),
  ],
  graphQL: {
    singularName: "LinkGrid",
  },
  interfaceName: "LinkGridBlock",
  labels: {
    plural: "Link Grids",
    singular: "Link Grid",
  },
  slug: "linkGrid",
};
