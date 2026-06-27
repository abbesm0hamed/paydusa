import type { CollectionConfig } from "payload";

import { Banner } from "@/blocks/Banner/config";

import { isAdmin } from "../access/isAdmin";

export const ReusableContent: CollectionConfig = {
  slug: "reusable-content",
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "layout",
      type: "blocks",
      blocks: [],
      required: true,
    },
  ],
  labels: {
    plural: "Reusable Contents",
    singular: "Reusable Content",
  },
};
