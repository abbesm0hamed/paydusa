import type { CollectionConfig } from 'payload';

import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin';
import { authenticated } from '../../access/authenticated';
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '@/access/isAdminOrSelf';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdminOrSelf,
    read: authenticated,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: ['public'],
      hasMany: true,
      options: ['admin', 'public'],
      required: true,
    },
  ],
  timestamps: true,
};
