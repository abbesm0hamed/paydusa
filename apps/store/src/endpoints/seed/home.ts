import type { RequiredDataFromCollectionSlug } from "payload";

import type { Media } from "@/payload-types";

interface HomeArgs {
  heroImage: Media;
  metaImage: Media;
  // Add array of logo images for the LogoGrid
  logoImages: Media[];
}

export const home: (
  args: HomeArgs
) => RequiredDataFromCollectionSlug<"pages"> = ({
  heroImage,
  metaImage,
  logoImages,
}) => ({
  _status: "published",
  hero: {
    links: [
      {
        link: {
          appearance: "default",
          label: "All posts",
          type: "custom",
          url: "/posts",
        },
      },
      {
        link: {
          appearance: "outline",
          label: "Contact",
          type: "custom",
          url: "/contact",
        },
      },
    ],
    richText: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Ecommerce app",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            tag: "h1",
            type: "heading",
            version: 1,
          },
          {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: "Visit the admin dashboard",
                    type: "text",
                    version: 1,
                  },
                ],
                direction: "ltr",
                fields: {
                  linkType: "custom",
                  newTab: false,
                  url: "/admin",
                },
                format: "",
                indent: 0,
                type: "link",
                version: 3,
              },
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: " to begin managing this site's content. The code for this template is completely open-source and can be found ",
                type: "text",
                version: 1,
              },
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: "on our Github",
                    type: "text",
                    version: 1,
                  },
                ],
                direction: "ltr",
                fields: {
                  linkType: "custom",
                  newTab: true,
                  url: "https://github.com/payloadcms/payload/tree/main/templates/website",
                },
                format: "",
                indent: 0,
                type: "link",
                version: 3,
              },
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: ". ",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            textFormat: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    },
    type: "flickeringImpact",
  },
  layout: [
    {
      blockName: "Content Block",
      blockType: "content",
      columns: [
        {
          enableLink: false,
          richText: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Dark Mode",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  tag: "h3",
                  type: "heading",
                  version: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Users will experience this site in their preferred color scheme and each block can be inverted.",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  textFormat: 0,
                  type: "paragraph",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1,
            },
          },
          size: "oneThird",
        },
      ],
    },
    {
      blockType: "mediaBlock",
      documental: "Media Block",
      media: metaImage.id,
    },
    // Add LogoGrid block here
    {
      blockName: "Logo Grid",
      blockType: "logoGrid",
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Our Partners",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              tag: "h3",
              type: "heading",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      hasLink: true,
      link: {
        label: "View All Partners",
        type: "custom",
        url: "/partners",
      },
      logos: logoImages.map((logo) => ({
        logo: logo.id,
      })),
    },
    {
      blockName: "Archive Block",
      blockType: "archive",
      categories: [],
      introContent: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Recent posts",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              tag: "h3",
              type: "heading",
              version: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: 'The posts below are displayed in an "Archive" layout building block which is an extremely powerful way to display documents on a page. It can be auto-populated by collection or by category, or posts can be individually selected. Pagination controls will automatically appear if the number of results exceeds the number of items per page.',
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              textFormat: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      populateBy: "collection",
      relationTo: "posts",
    },
  ],
  meta: {
    description: "Ecommerce",
    image: heroImage.id,
    title: "Ecommerce app",
  },
  slug: "home",
  title: "Home",
});
