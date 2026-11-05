import type {
  CollectionSlug,
  GlobalSlug,
  Payload,
  PayloadRequest,
  File,
} from "payload";

import { contactForm as contactFormData } from "./contact-form";
import { contact as contactPageData } from "./contact-page";
import { home } from "./home";
import { image1 } from "./image-1";
import { image2 } from "./image-2";
import { imageHero1 } from "./image-hero-1";
import { post1 } from "./post-1";
import { post2 } from "./post-2";
import { post3 } from "./post-3";

const collections: CollectionSlug[] = [
  "categories",
  "media",
  "pages",
  "posts",
  "forms",
  "form-submissions",
  "search",
];
const globals: GlobalSlug[] = ["header", "footer"];

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload;
  req: PayloadRequest;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`);

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        context: {
          disableRevalidate: true,
        },
        data: {
          navItems: [],
        },
        depth: 0,
        slug: global,
      })
    )
  );

  await Promise.all(
    collections.map((collection) =>
      payload.db.deleteMany({ collection, req, where: {} })
    )
  );

  await Promise.all(
    collections
      .filter((collection) =>
        Boolean(payload.collections[collection].config.versions)
      )
      .map((collection) =>
        payload.db.deleteVersions({ collection, req, where: {} })
      )
  );

  payload.logger.info(`— Seeding demo author and user...`);

  await payload.delete({
    collection: "users",
    depth: 0,
    where: {
      email: {
        equals: "demo-author@example.com",
      },
    },
  });

  payload.logger.info(`— Seeding media...`);

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] =
    await Promise.all([
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp"
      ),
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp"
      ),
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp"
      ),
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp"
      ),
    ]);

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] =
    await Promise.all([
      payload.create({
        collection: "users",
        data: {
          email: "demo-author@example.com",
          name: "Demo Author",
          password: "password",
        },
      }),
      payload.create({
        collection: "media",
        data: image1,
        file: image1Buffer,
      }),
      payload.create({
        collection: "media",
        data: image2,
        file: image2Buffer,
      }),
      payload.create({
        collection: "media",
        data: image2,
        file: image3Buffer,
      }),
      payload.create({
        collection: "media",
        data: imageHero1,
        file: hero1Buffer,
      }),

      payload.create({
        collection: "categories",
        data: {
          breadcrumbs: [
            {
              label: "Technology",
              url: "/technology",
            },
          ],
          title: "Technology",
        },
      }),

      payload.create({
        collection: "categories",
        data: {
          breadcrumbs: [
            {
              label: "News",
              url: "/news",
            },
          ],
          title: "News",
        },
      }),

      payload.create({
        collection: "categories",
        data: {
          breadcrumbs: [
            {
              label: "Finance",
              url: "/finance",
            },
          ],
          title: "Finance",
        },
      }),
      payload.create({
        collection: "categories",
        data: {
          breadcrumbs: [
            {
              label: "Design",
              url: "/design",
            },
          ],
          title: "Design",
        },
      }),

      payload.create({
        collection: "categories",
        data: {
          breadcrumbs: [
            {
              label: "Software",
              url: "/software",
            },
          ],
          title: "Software",
        },
      }),

      payload.create({
        collection: "categories",
        data: {
          breadcrumbs: [
            {
              label: "Engineering",
              url: "/engineering",
            },
          ],
          title: "Engineering",
        },
      }),
    ]);

  payload.logger.info(`— Seeding posts...`);

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: "posts",
    context: {
      disableRevalidate: true,
    },
    data: post1({
      author: demoAuthor,
      blockImage: image2Doc,
      heroImage: image1Doc,
    }),
    depth: 0,
  });

  const post2Doc = await payload.create({
    collection: "posts",
    context: {
      disableRevalidate: true,
    },
    data: post2({
      author: demoAuthor,
      blockImage: image3Doc,
      heroImage: image2Doc,
    }),
    depth: 0,
  });

  const post3Doc = await payload.create({
    collection: "posts",
    context: {
      disableRevalidate: true,
    },
    data: post3({
      author: demoAuthor,
      blockImage: image1Doc,
      heroImage: image3Doc,
    }),
    depth: 0,
  });

  // update each post with related posts
  await payload.update({
    collection: "posts",
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
    id: post1Doc.id,
  });
  await payload.update({
    collection: "posts",
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
    id: post2Doc.id,
  });
  await payload.update({
    collection: "posts",
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
    id: post3Doc.id,
  });

  payload.logger.info(`— Seeding contact form...`);

  const contactForm = await payload.create({
    collection: "forms",
    data: contactFormData,
    depth: 0,
  });

  payload.logger.info(`— Seeding pages...`);

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: "pages",
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
      depth: 0,
    }),
    payload.create({
      collection: "pages",
      data: contactPageData({ contactForm }),
      depth: 0,
    }),
  ]);

  payload.logger.info(`— Seeding globals...`);

  await Promise.all([
    payload.updateGlobal({
      data: {
        navItems: [
          {
            link: {
              label: "Posts",
              type: "custom",
              url: "/posts",
            },
          },
          {
            link: {
              label: "Contact",
              reference: {
                relationTo: "pages",
                value: contactPage.id,
              },
              type: "reference",
            },
          },
        ],
      },
      slug: "header",
    }),
    payload.updateGlobal({
      data: {
        navItems: [
          {
            link: {
              label: "Admin",
              type: "custom",
              url: "/admin",
            },
          },
          {
            link: {
              label: "Source Code",
              newTab: true,
              type: "custom",
              url: "https://github.com/payloadcms/payload/tree/main/templates/website",
            },
          },
          {
            link: {
              label: "Payload",
              newTab: true,
              type: "custom",
              url: "https://payloadcms.com/",
            },
          },
        ],
      },
      slug: "footer",
    }),
  ]);

  payload.logger.info("Seeded database successfully!");
};

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`);
  }

  const data = await res.arrayBuffer();

  return {
    data: Buffer.from(data),
    mimetype: `image/${url.split(".").pop()}`,
    name: url.split("/").pop() || `file-${Date.now()}`,
    size: data.byteLength,
  };
}
