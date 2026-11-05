import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";

import { authenticated } from "../../access/authenticated";
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished";
import { Banner } from "../../blocks/Banner/config";
import { Code } from "../../blocks/Code/config";
import { MediaBlock } from "../../blocks/MediaBlock/config";
import { generatePreviewPath } from "../../utilities/generatePreviewPath";
import { populateAuthors } from "./hooks/populateAuthors";
import { revalidateDelete, revalidatePost } from "./hooks/revalidatePost";

export const Posts = {
  slug: "posts",
  authorship: false,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    categories: true,
    meta: {
      description: true,
      image: true,
    },
    slug: true,
    title: true,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          collection: "posts",
          req,
          slug: typeof data?.slug === "string" ? data.slug : "",
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: "posts",
        req,
        slug: typeof data?.slug === "string" ? data.slug : "",
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      localized: true,
      name: "title",
      required: true,
      type: "text",
    },
    {
      tabs: [
        {
          fields: [
            {
              name: "heroImage",
              relationTo: "media",
              type: "upload",
            },
            {
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({
                    enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                  }),
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              label: false,
              localized: true,
              name: "content",
              required: true,
              type: "richText",
            },
          ],
          label: "Content",
        },
        {
          fields: [
            {
              admin: {
                position: "sidebar",
              },
              filterOptions: ({ id }) => ({
                id: {
                  not_in: [id],
                },
              }),
              hasMany: true,
              localized: true,
              name: "relatedPosts",
              relationTo: "posts",
              type: "relationship",
            },
            {
              admin: {
                position: "sidebar",
              },
              hasMany: true,
              localized: true,
              name: "categories",
              relationTo: "categories",
              type: "relationship",
            },
          ],
          label: "Meta",
        },
        {
          fields: [
            OverviewField({
              descriptionPath: "meta.description",
              imagePath: "meta.image",
              titlePath: "meta.title",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
          label: "SEO",
          localized: true,
          name: "meta",
        },
      ],
      type: "tabs",
    },
    {
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
      localized: true,
      name: "publishedAt",
      type: "date",
    },
    {
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      localized: true,
      name: "authors",
      relationTo: "users",
      type: "relationship",
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: "id",
          type: "text",
        },
        {
          name: "name",
          type: "text",
        },
      ],
      localized: true,
      name: "populatedAuthors",
      type: "array",
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterDelete: [revalidateDelete],
    afterRead: [populateAuthors],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
} satisfies CollectionConfig<"posts">;
