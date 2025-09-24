import { CollectionConfig } from "payload"

const prefix = 'cms/media';

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
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
    pasteURL: {
      allowList: [
        {
          protocol: "http",
          hostname: "localhost",
        },
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
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        console.log('afterChange hook triggered:', { doc, operation });
        
        if (doc.sizes && operation === 'create') {
          const updateData: any = {};
          
          Object.keys(doc.sizes).forEach((sizeName) => {
            const size = doc.sizes[sizeName];
            if (size && size.filename) {
              const sizeUrl = `${process.env.S3_FILE_URL}/${prefix}/${size.filename}`;
              updateData[`sizes_${sizeName}_url`] = sizeUrl;
            }
          });
          
          if (doc.sizes.thumbnail && doc.sizes.thumbnail.filename) {
            const thumbnailUrl = `${process.env.S3_FILE_URL}/${prefix}/${doc.sizes.thumbnail.filename}`;
            updateData.thumbnailURL = thumbnailUrl;
          }
          
          if (Object.keys(updateData).length > 0) {
            setTimeout(async () => {
              try {
                await req.payload.update({
                  collection: 'media',
                  id: doc.id,
                  data: updateData,
                });
              } catch (error) {
                console.error('Error updating URLs:', error);
              }
            }, 100);
          }
        }
        
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
      required: false,
    },
  ],
}
