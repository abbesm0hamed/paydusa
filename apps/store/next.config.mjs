import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Run environment variable check
const r2Hostname = process.env.NEXT_PUBLIC_R2_HOSTNAME;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  transpilePackages: ["@ecommerce/medusa"],
  turbopack: {
    root: new URL("../../", import.meta.url).pathname,
  },
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      ...(r2Hostname
        ? [
            {
              protocol: "https",
              hostname: r2Hostname,
            },
          ]
        : []),
    ],
  },
};

// Export the config with Payload integration
export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
