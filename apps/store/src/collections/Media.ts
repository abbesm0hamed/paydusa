import type { CollectionConfig } from "payload";

import { getMediaThumbnailURL } from "../utilities/mediaURLs";

export const Media: CollectionConfig = {
  slug: "media",
  versions: false,
  authorship: false,
  upload: {
    disableLocalStorage: true,
    // A callback makes Payload select the storage metadata needed by grid thumbnails.
    adminThumbnail: ({ doc }) => getMediaThumbnailURL(doc),
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
