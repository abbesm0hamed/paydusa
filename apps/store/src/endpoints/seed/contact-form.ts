import type { RequiredDataFromCollectionSlug } from "payload";

export const contactForm: RequiredDataFromCollectionSlug<"forms"> = {
  confirmationMessage: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "The contact form has been submitted successfully.",
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
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  },
  confirmationType: "message",
  createdAt: "2023-01-12T21:47:41.374Z",
  emails: [
    {
      emailFrom: '"Payload" \u003Cdemo@payloadcms.com\u003E',
      emailTo: "{{email}}",
      message: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Your contact form submission was successfully received.",
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
      subject: "You've received a new message.",
    },
  ],
  fields: [
    {
      blockName: "full-name",
      blockType: "text",
      label: "Full Name",
      name: "full-name",
      required: true,
      width: 100,
    },
    {
      blockName: "email",
      blockType: "email",
      label: "Email",
      name: "email",
      required: true,
      width: 100,
    },
    {
      blockName: "phone",
      blockType: "number",
      label: "Phone",
      name: "phone",
      required: false,
      width: 100,
    },
    {
      blockName: "message",
      blockType: "textarea",
      label: "Message",
      name: "message",
      required: true,
      width: 100,
    },
  ],
  redirect: undefined,
  submitButtonLabel: "Submit",
  title: "Contact Form",
  updatedAt: "2023-01-12T21:47:41.374Z",
};
