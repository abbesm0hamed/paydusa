import fs from 'node:fs';
import { MetadataRoute } from 'next';
import { env } from 'env';
import { routing } from '@/i18n/routing'; // Import your routing configuration

// Get all app folders excluding special Next.js folders
const appFolders = fs.readdirSync('www', { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith('_'))
  .filter((folder) => !folder.name.startsWith('('))
  .map((folder) => folder.name);

// Determine the URL base
const protocol = env.NEXT_PUBLIC_WWW_URL?.startsWith('https')
  ? 'https'
  : 'http';
const url = new URL(`${protocol}://${env.NEXT_PUBLIC_WWW_URL}`);

// Define async function to fetch any dynamic content (like blog posts)
// Example for blog posts if you have them
async function getBlogPosts() {
  try {
    // Replace with your actual method to fetch blog posts
    // const posts = await blog.getPosts();
    // return posts.map((post) => post._slug);
    return []; // Placeholder if you don't have blog posts
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get any dynamic content
  const blogPosts = await getBlogPosts();

  // Create sitemap items array
  const sitemapItems: MetadataRoute.Sitemap = [];

  // Add locale-specific home pages with high priority
  for (const locale of routing.locales) {
    sitemapItems.push({
      url: new URL(`/${locale}`, url).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });
  }

  // Add all regular pages for each locale
  for (const locale of routing.locales) {
    for (const page of pages) {
      if (page !== 'api' && page !== 'sitemap.xml') {
        // Skip non-page directories
        sitemapItems.push({
          url: new URL(`/${locale}/${page}`, url).href,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  }

  // Add blog posts for each locale if you have them
  for (const locale of routing.locales) {
    for (const post of blogPosts) {
      sitemapItems.push({
        url: new URL(`/${locale}/blog/${post}`, url).href,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return sitemapItems;
}
