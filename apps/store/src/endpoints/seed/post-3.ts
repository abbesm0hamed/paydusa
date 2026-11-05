import type { RequiredDataFromCollectionSlug } from "payload";

import type { PostArgs } from "./post-1";

export const post3: (
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
                        text: "Disclaimer: ",
                        type: "text",
                        version: 1,
                      },
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "This content is fabricated and for demonstration purposes only. To edit this post, ",
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
              text: "Money isn't just currency; ",
              type: "text",
              version: 1,
            },
            {
              detail: 0,
              format: 2,
              mode: "normal",
              style: "",
              text: "it's a language. ",
              type: "text",
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "Dive deep into its nuances, where strategy meets intuition in the vast sea of finance.",
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
              text: "Money, in its essence, transcends the mere concept of coins and paper notes; it becomes a profound language that speaks of value, trust, and societal structures. Like any language, it possesses intricate nuances and subtleties that require a discerning understanding. It's in these depths where the calculated world of financial strategy collides with the raw, instinctive nature of human intuition. Just as a seasoned linguist might dissect the syntax and semantics of a sentence, a financial expert navigates the vast and tumultuous ocean of finance, guided not only by logic and data but also by gut feelings and foresight. Every transaction, investment, and financial decision becomes a dialogue in this expansive lexicon of commerce and value.",
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
              text: "Stock Market Dynamics: Bulls, Bears, and the Uncertain Middle",
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
              text: "The stock market is a realm of vast opportunity but also poses risks. Discover the forces that drive market trends and the strategies employed by top traders to navigate this complex ecosystem. From market analysis to understanding investor psychology, get a comprehensive insight into the world of stocks.",
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
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "The stock market, often visualized as a bustling arena of numbers and ticker tapes, is as much about human behavior as it is about economics. It's a place where optimism, represented by the bullish rally, meets the caution of bearish downturns, with each vying to dictate the market's direction. But between these two extremes lies an uncertain middle ground, a zone populated by traders and investors who constantly weigh hope against fear. Successful navigation requires more than just financial acumen; it demands an understanding of collective sentiments and the ability to predict not just market movements, but also the reactions of other market participants. In this intricate dance of numbers and nerves, the most astute players are those who master both the hard data and the soft nuances of human behavior.",
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
    description: `Money isn't just currency; it's a language. Dive deep into its nuances, where strategy meets intuition in the vast sea of finance.`,
    image: heroImage.id,
    title: "Dollar and Sense: The Financial Forecast",
  },
  // this is populated by the seed script
  relatedPosts: [],
  slug: "dollar-and-sense-the-financial-forecast",
  title: "Dollar and Sense: The Financial Forecast",
});
