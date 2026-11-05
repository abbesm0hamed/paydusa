import type { RequiredDataFromCollectionSlug } from "payload";

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<"pages"> = {
  _status: "published",
  hero: {
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
                text: "ecommerce app",
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
                version: 2,
              },
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: " to make your account and seed content for your website.",
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
    type: "lowImpact",
  },
  layout: [],
  meta: {
    description: "Ecommerce",
    title: "Ecommerce app",
  },
  slug: "home",
  title: "Home",
};
