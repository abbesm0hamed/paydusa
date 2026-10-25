import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Categories: CollectionConfig = {
  slug: "categories",
  versions: false,
  authorship: false,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    ...slugField(),
  ],
};
