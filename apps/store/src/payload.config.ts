import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig, PayloadRequest } from "payload";
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

import { Products } from "./collections/Products";
import { getServerSideURL } from "./utilities/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverURL = getServerSideURL();

if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    "PAYLOAD_SECRET is required but not set in environment variables"
  );
}

export default buildConfig({
  i18n,
  localization,
  serverURL,
  cors: [
    serverURL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.MEDUSA_BACKEND_URL,
  ].filter((url): url is string => typeof url === "string" && url.length > 0),
  csrf: [serverURL, process.env.NEXT_PUBLIC_BASE_URL].filter(
    (url): url is string => typeof url === "string" && url.length > 0
  ),
  cookiePrefix: "paydusa",
  trustProxy: true,
  graphQL: {
    maxComplexity: 1000,
  },
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // beforeDashboard: ['@/components/BeforeDashboard'], // you can use this seed function to reset the db with initial data
      graphics: {
        Logo: "@/components/Logo/AdminLogo",
        Icon: "@/icons/AdminIcon",
      },
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
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
      slug: "video",
      fields: [
        {
          name: "url",
          type: "text",
        },
      ],
      interfaceName: "VideoBlock",
    },
    {
      slug: "br",
      fields: [
        {
          name: "ignore",
          type: "text",
        },
      ],

      interfaceName: "BrBlock",
    },
    // VideoDrawerBlock,
    {
      slug: "commandLine",
      fields: [
        {
          name: "command",
          type: "text",
        },
      ],
      interfaceName: "CommandLineBlock",
    },
    {
      slug: "command",
      fields: [
        {
          name: "command",
          type: "text",
          required: true,
        },
      ],
      labels: {
        plural: "Command Lines",
        singular: "Command Line",
      },
    },
    {
      slug: "link",
      fields: [link()],
      labels: {
        plural: "Links",
        singular: "Link",
      },
    },
    {
      slug: "templateCards",
      fields: [
        {
          name: "templates",
          type: "array",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
            },
            {
              name: "description",
              type: "textarea",
              required: true,
            },
            {
              name: "image",
              type: "text",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              required: true,
            },
            {
              name: "order",
              type: "number",
              required: true,
            },
          ],
          labels: {
            plural: "Templates",
            singular: "Template",
          },
        },
      ],
      interfaceName: "TemplateCardsBlock",
    },
    // BannerBlock,
    // CodeBlock,
  ],
  globals: [Header, Footer],
  collections: [
    Pages,
    ReusableContent,
    Posts,
    Media,
    Categories,
    Users,
    Products,
    {
      slug: "video",
      fields: [
        {
          name: "url",
          type: "text",
        },
      ],
      interfaceName: "VideoBlock",
    },
    {
      slug: "br",
      fields: [
        {
          name: "ignore",
          type: "text",
        },
      ],

      interfaceName: "BrBlock",
    },
    // VideoDrawerBlock,
    {
      slug: "commandLine",
      fields: [
        {
          name: "command",
          type: "text",
        },
      ],
      interfaceName: "CommandLineBlock",
    },
    {
      slug: "command",
      fields: [
        {
          name: "command",
          type: "text",
          required: true,
        },
      ],
      labels: {
        plural: "Command Lines",
        singular: "Command Line",
      },
    },
    {
      slug: "link",
      fields: [link()],
      labels: {
        plural: "Links",
        singular: "Link",
      },
    },
    {
      slug: "templateCards",
      fields: [
        {
          name: "templates",
          type: "array",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
            },
            {
              name: "description",
              type: "textarea",
              required: true,
            },
            {
              name: "image",
              type: "text",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              required: true,
            },
            {
              name: "order",
              type: "number",
              required: true,
            },
          ],
          labels: {
            plural: "Templates",
            singular: "Template",
          },
        },
      ],
      interfaceName: "TemplateCardsBlock",
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    migrationDir: resolvePath.migrations,
  }),
  sharp,
  plugins: [...plugins],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || "",
    defaultFromName: "Ecom",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
});
