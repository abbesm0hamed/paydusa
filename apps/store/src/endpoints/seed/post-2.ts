import type { RequiredDataFromCollectionSlug } from "payload";

import type { PostArgs } from "./post-1";

export const post2: (
  args: PostArgs
) => RequiredDataFromCollectionSlug<"posts"> = ({
  heroImage,
  blockImage,
  author,
}) => ({
  _status: "published",
  authors: [author],
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
              text: "Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          tag: "h2",
          type: "heading",
          version: 1,
        },
        {
          fields: {
            blockName: "Disclaimer",
            blockType: "banner",
            content: {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 1,
                        mode: "normal",
                        style: "",
                        text: "Disclaimer:",
                        type: "text",
                        version: 1,
                      },
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: " This content is fabricated and for demonstration purposes only. To edit this post, ",
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
                            text: "navigate to the admin dashboard.",
                            type: "text",
                            version: 1,
                          },
                        ],
                        direction: "ltr",
                        fields: {
                          linkType: "custom",
                          newTab: true,
                          url: "/admin",
                        },
                        format: "",
                        indent: 0,
                        type: "link",
                        version: 3,
                      },
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    textFormat: 1,
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
            style: "info",
          },
          format: "",
          type: "block",
          version: 2,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "The Power of Resilience: Stories of Recovery and Hope",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          tag: "h2",
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
              text: "Throughout history, regions across the globe have faced the devastating impact of natural disasters, the turbulence of political unrest, and the challenging ripples of economic downturns. In these moments of profound crisis, an often-underestimated force emerges: the indomitable resilience of the human spirit. These aren't just tales of mere survival, but stories of communities forging bonds, uniting with a collective purpose, and demonstrating an innate ability to overcome.",
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
        {
          fields: {
            blockName: "",
            blockType: "mediaBlock",
            media: blockImage.id,
          },
          format: "",
          type: "block",
          version: 2,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "From neighbors forming makeshift rescue teams during floods to entire cities rallying to rebuild after economic collapse, the essence of humanity is most evident in these acts of solidarity. As we delve into these narratives, we witness the transformative power of community spirit, where adversity becomes a catalyst for growth, unity, and a brighter, rebuilt future.",
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
        {
          fields: {
            blockName: "Dynamic components",
            blockType: "banner",
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
                        text: "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
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
            style: "info",
          },
          format: "",
          type: "block",
          version: 2,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  },
  heroImage: heroImage.id,
  meta: {
    description:
      "Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.",
    image: heroImage.id,
    title: "Global Gaze: Beyond the Headlines",
  },
  // this is populated by the seed script
  relatedPosts: [],
  slug: "global-gaze",
  title: "Global Gaze: Beyond the Headlines",
});
