import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { sharpTransformer } from "@payloadcms/transformer-sharp";
import type { PayloadRequest } from "payload";
import { buildConfig } from "payload";
import sharp from "sharp";

import { BlogContent } from "@/blocks/BlogContent/config";
import { BlogMarkdown } from "@/blocks/BlogMarkdown/config";
import { Callout } from "@/blocks/Callout/config";
import { CallToAction } from "@/blocks/CallToAction/config";
import { Content } from "@/blocks/Content/config";
import { ContentGrid } from "@/blocks/ContentGrid/config";
import { FormBlock } from "@/blocks/Form/config";
import { HoverCards } from "@/blocks/HoverCards/config";
import { HoverHighlights } from "@/blocks/HoverHighlights/config";
// import { CardGrid } from '@/blocks/CardGrid/config';
import { LinkGrid } from "@/blocks/LinkGrid/config";
import { LogoGrid } from "@/blocks/LogoGrid/config";
import { MediaBlock } from "@/blocks/MediaBlock/config";
import { MediaContent } from "@/blocks/MediaContent/config";
import { MediaContentAccordion } from "@/blocks/MediaContentAccordion/config";
import { Pricing } from "@/blocks/Pricing/config";
import { Categories } from "@/collections/Categories";
import { Media } from "@/collections/Media";
import { Pages } from "@/collections/Pages";
import { Posts } from "@/collections/Posts";
import { ReusableContent } from "@/collections/ReusableContent";
import { Users } from "@/collections/Users";
import { defaultLexical } from "@/fields/defaultLexical";
import { link } from "@/fields/link";
import { Footer } from "@/globals/Footer/config";
import { Header } from "@/globals/Header/config";
import { i18n, localization } from "@/i18n/localization";
import { resolvePath } from "@/lib/paths";
import { plugins } from "@/plugins";

import { getServerSideURL } from "./utilities/getURL";
import { getMediaFileURL } from "./utilities/mediaURLs";

// oxlint-disable-next-line unicorn/prefer-import-meta-properties -- Next.js does not provide import.meta.dirname at runtime.
const dirname = path.dirname(fileURLToPath(import.meta.url));

const serverURL = getServerSideURL();
const mediaPrefix = "cms/media";

if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    "PAYLOAD_SECRET is required but not set in environment variables"
  );
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // beforeDashboard: ['@/components/BeforeDashboard'], // you can use this seed function to reset the db with initial data
      graphics: {
        Icon: "@/icons/AdminIcon",
        Logo: "@/components/Logo/AdminLogo",
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          height: 667,
          label: "Mobile",
          name: "mobile",
          width: 375,
        },
        {
          height: 1024,
          label: "Tablet",
          name: "tablet",
          width: 768,
        },
        {
          height: 900,
          label: "Desktop",
          name: "desktop",
          width: 1440,
        },
      ],
    },
    user: Users.slug,
  },
  blocks: [
    BlogContent,
    BlogMarkdown,
    Callout,
    CallToAction,
    // DownloadBlock,
    // LightDarkImageBlock,
    // TableWithDrawersBlock,
    // YoutubeBlock,
    // CardGrid,
    // CaseStudyCards,
    // CaseStudiesHighlight,
    // UploadBlock,
    // CaseStudyParallax,
    // CodeFeature,
    Content,
    ContentGrid,
    // ComparisonTable,
    FormBlock,
    HoverCards,
    HoverHighlights,
    LinkGrid,
    LogoGrid,
    MediaBlock,
    MediaContent,
    MediaContentAccordion,
    // RestExamplesBlock,
    Pricing,
    // ReusableContentBlock,
    // Slider,
    // Statement,
    // Steps,
    // StickyHighlights,
    // ExampleTabs,
    {
      fields: [
        {
          name: "url",
          type: "text",
        },
      ],
      interfaceName: "VideoBlock",
      slug: "video",
    },
    {
      fields: [
        {
          name: "ignore",
          type: "text",
        },
      ],
      interfaceName: "BrBlock",
      slug: "br",
    },
    // VideoDrawerBlock,
    {
      fields: [
        {
          name: "command",
          type: "text",
        },
      ],
      interfaceName: "CommandLineBlock",
      slug: "commandLine",
    },
    {
      fields: [
        {
          name: "command",
          required: true,
          type: "text",
        },
      ],
      labels: {
        plural: "Command Lines",
        singular: "Command Line",
      },
      slug: "command",
    },
    {
      fields: [link()],
      labels: {
        plural: "Links",
        singular: "Link",
      },
      slug: "link",
    },
    {
      fields: [
        {
          fields: [
            {
              name: "name",
              required: true,
              type: "text",
            },
            {
              name: "description",
              required: true,
              type: "textarea",
            },
            {
              name: "image",
              required: true,
              type: "text",
            },
            {
              name: "slug",
              required: true,
              type: "text",
            },
            {
              name: "order",
              required: true,
              type: "number",
            },
          ],
          labels: {
            plural: "Templates",
            singular: "Template",
          },
          name: "templates",
          type: "array",
        },
      ],
      interfaceName: "TemplateCardsBlock",
      slug: "templateCards",
    },
    // BannerBlock,
    // CodeBlock,
  ],
  collections: [
    Pages,
    ReusableContent,
    Posts,
    Media,
    Categories,
    Users,
    {
      authorship: false,
      fields: [
        {
          name: "url",
          type: "text",
        },
      ],
      slug: "video",
      versions: false,
    },
    {
      authorship: false,
      fields: [
        {
          name: "ignore",
          type: "text",
        },
      ],
      slug: "br",
      versions: false,
    },
    // VideoDrawerBlock,
    {
      authorship: false,
      fields: [
        {
          name: "command",
          type: "text",
        },
      ],
      slug: "commandLine",
      versions: false,
    },
    {
      authorship: false,
      fields: [
        {
          name: "command",
          required: true,
          type: "text",
        },
      ],
      labels: {
        plural: "Command Lines",
        singular: "Command Line",
      },
      slug: "command",
      versions: false,
    },
    {
      authorship: false,
      fields: [link()],
      labels: {
        plural: "Links",
        singular: "Link",
      },
      slug: "link",
      versions: false,
    },
    {
      authorship: false,
      fields: [
        {
          fields: [
            {
              name: "name",
              required: true,
              type: "text",
            },
            {
              name: "description",
              required: true,
              type: "textarea",
            },
            {
              name: "image",
              required: true,
              type: "text",
            },
            {
              name: "slug",
              required: true,
              type: "text",
            },
            {
              name: "order",
              required: true,
              type: "number",
            },
          ],
          labels: {
            plural: "Templates",
            singular: "Template",
          },
          name: "templates",
          type: "array",
        },
      ],
      slug: "templateCards",
      versions: false,
    },
  ],
  cookiePrefix: "paydusa",
  cors: [
    serverURL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.MEDUSA_BACKEND_URL,
  ].filter((url): url is string => typeof url === "string" && url.length > 0),
  csrf: [serverURL, process.env.NEXT_PUBLIC_BASE_URL].filter(
    (url): url is string => typeof url === "string" && url.length > 0
  ),
  db: postgresAdapter({
    // Apply reviewed migrations instead of dropping legacy media columns in dev.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL,
      idleTimeoutMillis: 30_000,
      max: 10,
    },
    migrationDir: resolvePath.migrations,
  }),
  defaultDepth: 2,
  editor: lexicalEditor(),
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || "",
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || "",
    defaultFromName: "Ecom",
  }),
  globals: [Header, Footer],
  graphQL: {
    maxComplexity: 1000,
  },
  i18n,
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) {
          return true;
        }

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const secret = process.env.CRON_SECRET;
        if (!secret) {
          return false;
        }

        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${secret}`;
      },
    },
    tasks: [],
  },
  localization,
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  serverURL,
  storage: [
    // R2 uses the S3-compatible adapter in Node.js (storage-r2 requires Workers bindings).
    s3Storage({
      bucket: process.env.R2_BUCKET!,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: getMediaFileURL,
          prefix: mediaPrefix,
        },
      },
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.R2_ENDPOINT!,
        forcePathStyle: true,
        region: "auto",
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  upload: {
    limits: {
      fileSize: 5_000_000, // 5MB, written in bytes
    },
    transformers: [
      sharpTransformer({
        collections: {
          media: {
            variants: [
              {
                height: 300,
                name: "thumbnail",
                position: "centre",
                width: 400,
              },
              {
                height: 1024,
                name: "card",
                position: "centre",
                width: 768,
              },
              {
                name: "tablet",
                position: "centre",
                width: 1024,
              },
            ],
          },
        },
        sharp,
      }),
    ],
  },
});
