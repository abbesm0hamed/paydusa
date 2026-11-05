import type { Block } from "payload";

export const Code: Block = {
  fields: [
    {
      defaultValue: "typescript",
      name: "language",
      options: [
        {
          label: "Typescript",
          value: "typescript",
        },
        {
          label: "Javascript",
          value: "javascript",
        },
        {
          label: "CSS",
          value: "css",
        },
      ],
      type: "select",
    },
    {
      label: false,
      name: "code",
      required: true,
      type: "code",
    },
  ],
  interfaceName: "CodeBlock",
  slug: "code",
};
