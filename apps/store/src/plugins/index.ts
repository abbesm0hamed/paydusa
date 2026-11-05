import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { searchPlugin } from "@payloadcms/plugin-search";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Plugin } from "payload";

import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import type { Page, Post } from "@/payload-types";
import { beforeSyncWithSearch } from "@/search/beforeSync";
import { searchFields } from "@/search/fieldOverrides";
import { getServerSideURL } from "@/utilities/getURL";

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) =>
  doc?.title
    ? `${doc.title} | Ecommerce for poweful digital solutions`
    : "Ecommerce for poweful digital solutions";

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ["pages", "posts"],
    overrides: {
      versions: false,
      authorship: false,
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) =>
        defaultFields.map((field) => {
          if ("name" in field && field.name === "from") {
            return {
              ...field,
              admin: {
                description:
                  "You will need to rebuild the website when changing this field.",
              },
            };
          }
          return field;
        }),
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ["categories"],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      authorship: false,
      fields: ({ defaultFields }) =>
        defaultFields.map((field) => {
          if ("name" in field && field.name === "confirmationMessage") {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  HeadingFeature({
                    enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                  }),
                ],
              }),
            };
          }
          return field;
        }),
      versions: false,
    },
    formSubmissionOverrides: {
      authorship: false,
      versions: false,
    },
  }),
  searchPlugin({
    beforeSync: beforeSyncWithSearch,
    collections: ["posts"],
    searchOverrides: {
      authorship: false,
      fields: ({ defaultFields }) => [...defaultFields, ...searchFields],
      versions: false,
    },
  }),
];
