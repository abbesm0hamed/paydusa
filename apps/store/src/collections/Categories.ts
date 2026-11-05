import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Categories: CollectionConfig = {
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  authorship: false,
  fields: [
    {
      localized: true,
      name: "title",
      required: true,
      type: "text",
    },
    ...slugField(),
  ],
  slug: "categories",
  versions: false,
};
