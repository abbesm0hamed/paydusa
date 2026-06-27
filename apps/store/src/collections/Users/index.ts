import type { CollectionConfig } from "payload";

import { isAdmin, isAdminFieldLevel } from "@/access/isAdmin";
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from "@/access/isAdminOrSelf";

import { authenticated } from "../../access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
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
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: ["public"],
      hasMany: true,
      options: ["admin", "public"],
      required: true,
    },
  ],
  timestamps: true,
};
