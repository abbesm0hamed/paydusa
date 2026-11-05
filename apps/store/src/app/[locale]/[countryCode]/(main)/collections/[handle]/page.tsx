import { getCollectionByHandle, listCollections } from "@lib/data/collections";
import { listProductFilterOptions } from "@lib/data/product-options";
import { listProductTags } from "@lib/data/product-tags";
import { listProductTypes } from "@lib/data/product-types";
import { listRegions } from "@lib/data/regions";
import type { StoreCollection, StoreRegion } from "@medusajs/types";
import CollectionTemplate from "@modules/collections/templates";
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ handle: string; countryCode: string }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: SortOptions;
    type_id?: string | string[];
    tag_id?: string | string[];
    category_id?: string | string[];
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

export const PRODUCT_LIMIT = 12;

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  });

  if (!collections) {
    return [];
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.flatMap((r) => r.countries?.map((c) => c.iso_2))
        .filter(Boolean) as string[]
  );

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  );

  const staticParams = countryCodes?.flatMap((countryCode: string) =>
    collectionHandles.map((handle: string | undefined) => ({
      countryCode,
      handle,
    }))
  );

  return staticParams;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollectionByHandle(params.handle);

  if (!collection) {
    notFound();
  }

  const metadata = {
    description: `${collection.title} collection`,
    title: `${collection.title} | Medusa Store`,
  } as Metadata;

  return metadata;
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sortBy, page, type_id, tag_id, category_id, price_from, price_to } =
    searchParams;

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  );

  if (!collection) {
    notFound();
  }

  const typeId = toArray(type_id);
  const tagId = toArray(tag_id);
  const categoryId = toArray(category_id);

  const [types, tags, optionValues] = await Promise.all([
    listProductTypes(),
    listProductTags(),
    listProductFilterOptions({ collection_id: collection.id }),
  ]);

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
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
