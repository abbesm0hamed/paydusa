import type { Field } from "payload";

export const searchFields: Field[] = [
  {
    admin: {
      readOnly: true,
    },
    index: true,
    name: "slug",
    type: "text",
  },
  {
    admin: {
      readOnly: true,
    },
    fields: [
      {
        label: "Title",
        name: "title",
        type: "text",
      },
      {
        label: "Description",
        name: "description",
        type: "text",
      },
      {
        label: "Image",
        name: "image",
        relationTo: "media",
        type: "upload",
      },
    ],
    index: true,
    label: "Meta",
    name: "meta",
    type: "group",
  },
  {
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: "relationTo",
        type: "text",
      },
      {
        name: "id",
        type: "text",
      },
      {
        name: "title",
        type: "text",
      },
    ],
    label: "Categories",
    name: "categories",
    type: "array",
  },
];
