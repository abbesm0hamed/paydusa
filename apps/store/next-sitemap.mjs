const excludedPaths = ["/checkout", "/account/*"];

export default {
  exclude: excludedPaths + ["/[sitemap]"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        allow: "/",
        userAgent: "*",
      },
      {
        disallow: excludedPaths,
        userAgent: "*",
      },
    ],
  },
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
};
