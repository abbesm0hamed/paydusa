import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    disableLocalStorage: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
    pasteURL: {
      allowList: [
        { protocol: "http", hostname: "localhost" },
        {
          protocol: "https",
          hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        },
        {
          protocol: "https",
          hostname: "medusa-server-testing.s3.amazonaws.com",
        },
        {
          protocol: "https",
          hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
        },
      ],
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
    },
  ],
};
