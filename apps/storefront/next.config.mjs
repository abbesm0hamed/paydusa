import { withPayload } from '@payloadcms/next/withPayload';
import checkEnvVariables from './check-env-variables.mjs';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// Run environment variable check
checkEnvVariables();
const r2Hostname = process.env.NEXT_PUBLIC_R2_HOSTNAME || "fallback.example.com";
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: r2Hostname,
      },
    ],
  },
};

// Export the config with Payload integration
export default withNextIntl(
  withPayload(nextConfig, { devBundleServerPackages: false })
);
