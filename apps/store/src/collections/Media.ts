import type { CollectionConfig } from "payload";

import { getMediaThumbnailURL } from "../utilities/mediaURLs";

export const Media: CollectionConfig = {
  authorship: false,
  fields: [
    {
      label: "Alt Text",
      name: "alt",
      type: "text",
    },
  ],
  slug: "media",
  upload: {
    disableLocalStorage: true,
    // A callback makes Payload select the storage metadata needed by grid thumbnails.
    adminThumbnail: ({ doc }) => getMediaThumbnailURL(doc),
    mimeTypes: ["image/*"],
    pasteURL: {
      allowList: [
        { hostname: "localhost", protocol: "http" },
        {
          hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
          protocol: "https",
        },
        {
          hostname: "medusa-server-testing.s3.amazonaws.com",
          protocol: "https",
        },
        {
          hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
          protocol: "https",
        },
      ],
    },
  },
  versions: false,
};
