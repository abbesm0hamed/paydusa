import type { CollectionConfig } from "payload";

import { Banner } from "@/blocks/Banner/config";

import { isAdmin } from "../access/isAdmin";

export const ReusableContent: CollectionConfig = {
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
  authorship: false,
  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      blocks: [],
      name: "layout",
      required: true,
      type: "blocks",
    },
  ],
  labels: {
    plural: "Reusable Contents",
    singular: "Reusable Content",
  },
  slug: "reusable-content",
  versions: false,
};
