import { getCategoryByHandle, listCategories } from "@lib/data/categories";
import { listProductFilterOptions } from "@lib/data/product-options";
import { listProductTags } from "@lib/data/product-tags";
import { listProductTypes } from "@lib/data/product-types";
import { listRegions } from "@lib/data/regions";
import type { StoreRegion } from "@medusajs/types";
import CategoryTemplate from "@modules/categories/templates";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string[]; countryCode: string }>;
  searchParams: Promise<{
    sortBy?: SortOptions;
    page?: string;
    type_id?: string | string[];
    tag_id?: string | string[];
    option_value_id?: string | string[];
    price_from?: string;
    price_to?: string;
  }>;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export const instant = false;

export async function generateStaticParams() {
  const product_categories = await listCategories();

  if (!product_categories) {
    return [];
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.flatMap((r) => r.countries?.map((c) => c.iso_2))
  );

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  );

  const staticParams = countryCodes?.flatMap(
    (countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        category: [handle],
        countryCode,
      }))
  );

  return staticParams;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const productCategory = await getCategoryByHandle(params.category);

    const title = `${productCategory.name} | Medusa Store`;

    const description = productCategory.description ?? `${title} category.`;

    return {
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
      description,
      title: `${title} | Medusa Store`,
    };
  } catch {
    notFound();
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sortBy, page, type_id, tag_id, price_from, price_to } = searchParams;

  const productCategory = await getCategoryByHandle(params.category);

  if (!productCategory) {
    notFound();
  }

  const typeId = toArray(type_id);
  const tagId = toArray(tag_id);

  const [types, tags, optionValues] = await Promise.all([
    listProductTypes(),
    listProductTags(),
    listProductFilterOptions({ category_id: productCategory.id }),
  ]);

  const subcategories = productCategory.category_children?.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      subcategories={subcategories}
      types={types.map((t) => ({ label: t.value, value: t.id }))}
      tags={tags.map((t) => ({ label: t.value, value: t.id }))}
      optionValues={optionValues.option_values}
      typeId={typeId}
      tagId={tagId}
      priceFrom={price_from}
      priceTo={price_to}
    />
  );
}
