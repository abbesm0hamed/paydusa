import type { BeforeSync, DocToSync } from "@payloadcms/plugin-search/types";

export const beforeSyncWithSearch: BeforeSync = async ({
  originalDoc,
  searchDoc,
}) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc;

  const { slug, id, categories, title, meta } = originalDoc;

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    categories: [],
    meta: {
      ...meta,
      description: meta?.description,
      image: meta?.image?.id || meta?.image,
      title: meta?.title || title,
    },
    slug,
  };

  if (categories && Array.isArray(categories) && categories.length > 0) {
    // get full categories and keep a flattened copy of their most important properties
    try {
      const mappedCategories = categories.map((category) => {
        const { id, title } = category;

        return {
          id,
          relationTo: "categories",
          title,
        };
      });

      modifiedDoc.categories = mappedCategories;
    } catch {
      console.error(
        `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`
      );
    }
  }

  return modifiedDoc;
};
