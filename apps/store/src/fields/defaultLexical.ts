import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
} from "@payloadcms/richtext-lexical";
import type { LinkFields } from "@payloadcms/richtext-lexical";
import type { TextFieldSingleValidation } from "payload";

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ["pages", "posts"],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ("name" in field && field.name === "url") {
            return false;
          }
          return true;
        });

        return [
          ...defaultFieldsWithoutUrl,
          {
            admin: {
              condition: (_data, siblingData) =>
                siblingData?.linkType !== "internal",
            },
            label: ({ t }) => t("fields:enterURL"),
            name: "url",
            required: true,
            type: "text",
            validate: ((value, options) => {
              if (
                (options?.siblingData as LinkFields)?.linkType === "internal"
              ) {
                return true; // no validation needed, as no url should exist for internal links
              }
              return value ? true : "URL is required";
            }) as TextFieldSingleValidation,
          },
        ];
      },
    }),
  ],
});
