import { withPayload } from "@payloadcms/next/withPayload";
import { withSentryConfig } from "@sentry/nextjs/config";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Share the public R2 URL with Payload instead of configuring the hostname twice.
const r2Hostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  images: {
    qualities: [50, 75],
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        protocol: "https",
      },
      {
        hostname: "medusa-server-testing.s3.amazonaws.com",
        protocol: "https",
      },
      {
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
        protocol: "https",
      },
      ...(r2Hostname
        ? [
            {
              hostname: r2Hostname,
              protocol: "https",
            },
          ]
        : []),
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  partialPrefetching: true,
  reactStrictMode: true,
  turbopack: {
    root: new URL("../../", import.meta.url).pathname,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

const configWithPayload = withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});

export default withSentryConfig(configWithPayload, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
    disable: !(
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT
    ),
  },
});
