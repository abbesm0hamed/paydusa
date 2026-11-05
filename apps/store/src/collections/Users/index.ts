import type { CollectionConfig } from "payload";

import { isAdmin, isAdminFieldLevel } from "@/access/isAdmin";
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from "@/access/isAdminOrSelf";

import { authenticated } from "../../access/authenticated";

export const Users: CollectionConfig = {
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdminOrSelf,
    read: authenticated,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "name",
  },
  auth: {
    useAPIKey: true,
  },
  authorship: false,
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: ["public"],
      hasMany: true,
      name: "roles",
      options: ["admin", "public"],
      required: true,
      type: "select",
    },
  ],
  slug: "users",
  timestamps: true,
  versions: false,
};
