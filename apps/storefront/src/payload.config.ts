import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { buildConfig, PayloadRequest } from 'payload';

import { resolvePath } from '@/lib/paths';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';

import { ReusableContent } from '@/collections/ReusableContent';
import { Categories } from '@/collections/Categories';
import { Media } from '@/collections/Media';
import { Pages } from '@/collections/Pages';
import { Users } from '@/collections/Users';
import { Posts } from '@/collections/Posts';

import { Footer } from '@/globals/Footer/config';
import { Header } from '@/globals/Header/config';

import { defaultLexical } from '@/fields/defaultLexical';
import { link } from '@/fields/link';

import { MediaContentAccordion } from '@/blocks/MediaContentAccordion/config';
import { HoverHighlights } from '@/blocks/HoverHighlights/config';
import { CallToAction } from '@/blocks/CallToAction/config';
import { MediaContent } from '@/blocks/MediaContent/config';
import { BlogMarkdown } from '@/blocks/BlogMarkdown/config';
import { ContentGrid } from '@/blocks/ContentGrid/config';
import { BlogContent } from '@/blocks/BlogContent/config';
import { MediaBlock } from '@/blocks/MediaBlock/config';
import { HoverCards } from '@/blocks/HoverCards/config';
import { LogoGrid } from '@/blocks/LogoGrid/config';
// import { CardGrid } from '@/blocks/CardGrid/config';
import { LinkGrid } from '@/blocks/LinkGrid/config';
import { Pricing } from '@/blocks/Pricing/config';
import { Content } from '@/blocks/Content/config';
import { Callout } from '@/blocks/Callout/config';
import { FormBlock } from '@/blocks/Form/config';
import { plugins } from '@/plugins';

import { i18n, localization } from '@/i18n/localization';
import { Products } from './collections/Products';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  i18n,
  localization,
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // beforeDashboard: ['@/components/BeforeDashboard'], // you can use this seed function to reset the db with initial data
      graphics: {
        Logo: '@/components/Logo/AdminLogo',
        Icon: '@/icons/AdminIcon',
      },
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
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
      slug: 'video',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
      interfaceName: 'VideoBlock',
    },
    {
      slug: 'br',
      fields: [
        {
          name: 'ignore',
          type: 'text',
        },
      ],

      interfaceName: 'BrBlock',
    },
    // VideoDrawerBlock,
    {
      slug: 'commandLine',
      fields: [
        {
          name: 'command',
          type: 'text',
        },
      ],
      interfaceName: 'CommandLineBlock',
    },
    {
      slug: 'command',
      fields: [
        {
          name: 'command',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        plural: 'Command Lines',
        singular: 'Command Line',
      },
    },
    {
      slug: 'link',
      fields: [link()],
      labels: {
        plural: 'Links',
        singular: 'Link',
      },
    },
    {
      slug: 'templateCards',
      fields: [
        {
          name: 'templates',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'image',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              required: true,
            },
          ],
          labels: {
            plural: 'Templates',
            singular: 'Template',
          },
        },
      ],
      interfaceName: 'TemplateCardsBlock',
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
      slug: 'video',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
      interfaceName: 'VideoBlock',
    },
    {
      slug: 'br',
      fields: [
        {
          name: 'ignore',
          type: 'text',
        },
      ],

      interfaceName: 'BrBlock',
    },
    // VideoDrawerBlock,
    {
      slug: 'commandLine',
      fields: [
        {
          name: 'command',
          type: 'text',
        },
      ],
      interfaceName: 'CommandLineBlock',
    },
    {
      slug: 'command',
      fields: [
        {
          name: 'command',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        plural: 'Command Lines',
        singular: 'Command Line',
      },
    },
    {
      slug: 'link',
      fields: [link()],
      labels: {
        plural: 'Links',
        singular: 'Link',
      },
    },
    {
      slug: 'templateCards',
      fields: [
        {
          name: 'templates',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'image',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              required: true,
            },
          ],
          labels: {
            plural: 'Templates',
            singular: 'Template',
          },
        },
      ],
      interfaceName: 'TemplateCardsBlock',
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.NODE_ENV === 'development'
          ? process.env.LOCAL_DATABASE_URI
          : process.env.DATABASE_URI,
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
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER!!,
    defaultFromName: 'Ecom',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization');
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
});
