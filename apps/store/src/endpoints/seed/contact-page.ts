import type { RequiredDataFromCollectionSlug } from "payload";

import type { Form } from "@/payload-types";

interface ContactArgs {
  contactForm: Form;
}

export const contact: (
  args: ContactArgs
) => RequiredDataFromCollectionSlug<"pages"> = ({ contactForm }) => ({
  _status: "published",
  hero: {
    type: "none",
  },
  layout: [
    {
      blockType: "formBlock",
      enableIntro: true,
      form: contactForm,
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
                  text: "Example contact form:",
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
    },
  ],
  slug: "contact",
  title: "Contact",
});
