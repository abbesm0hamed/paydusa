import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";

import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import { Archive } from "@/blocks/ArchiveBlock/config";
import { Callout } from "@/blocks/Callout/config";
import { CallToAction } from "@/blocks/CallToAction/config";
import { CardGrid } from "@/blocks/CardGrid/config";
import { Content } from "@/blocks/Content/config";
import { ContentGrid } from "@/blocks/ContentGrid/config";
import { FormBlock } from "@/blocks/Form/config";
import { HoverCards } from "@/blocks/HoverCards/config";
import { HoverHighlights } from "@/blocks/HoverHighlights/config";
import { LogoGrid } from "@/blocks/LogoGrid/config";
import { MediaBlock } from "@/blocks/MediaBlock/config";
import { MediaContentAccordion } from "@/blocks/MediaContentAccordion/config";
import { slugField } from "@/fields/slug";
import { hero } from "@/heros/config";
import { populatePublishedAt } from "@/hooks/populatePublishedAt";
import { generatePreviewPath } from "@/utilities/generatePreviewPath";

import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";

export const Pages = {
  slug: "pages",
  authorship: false,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    slug: true,
    title: true,
  },
  admin: {
    defaultColumns: ["title", "slug", "createdAt", "updatedAt"],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          collection: "pages",
          req,
          slug: typeof data?.slug === "string" ? data.slug : "",
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: "pages",
        req,
        slug: typeof data?.slug === "string" ? data.slug : "",
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      required: true,
      type: "text",
    },
    {
      tabs: [
        {
          fields: [hero],
          label: "Hero",
        },
        {
          fields: [
            {
              admin: {
                initCollapsed: true,
              },
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                MediaContentAccordion,
                LogoGrid,
                HoverCards,
                HoverHighlights,
                ContentGrid,
                CardGrid,
                Callout,
                Archive,
                FormBlock,
              ],
              localized: true,
              name: "layout",
              required: true,
              type: "blocks",
            },
          ],
          label: "Content",
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
        position: "sidebar",
      },
      localized: true,
      name: "publishedAt",
      type: "date",
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
    beforeChange: [populatePublishedAt],
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
} satisfies CollectionConfig<"pages">;
