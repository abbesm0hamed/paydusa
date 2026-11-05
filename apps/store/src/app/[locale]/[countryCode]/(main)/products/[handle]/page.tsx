import { listProducts } from "@lib/data/products";
import { getRegion, listRegions } from "@lib/data/regions";
import type { HttpTypes } from "@medusajs/types";
import ProductTemplate from "@modules/products/templates";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const instant = false;

interface Props {
  params: Promise<{ countryCode: string; handle: string }>;
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.flatMap((r) => r.countries?.map((c) => c.iso_2))
    );

    if (!countryCodes) {
      return [];
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { fields: "handle", limit: 100 },
      });

      return {
        country,
        products: response.products,
      };
    });

    const countryProducts = await Promise.all(promises);

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle);
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    );
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { handle } = params;
  const region = await getRegion(params.countryCode);

  if (!region) {
    notFound();
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle } as Partial<HttpTypes.StoreProductParams>,
  }).then(({ response }) => response.products[0]);

  if (!product) {
    notFound();
  }

  return {
    description: `${product.title}`,
    openGraph: {
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
      title: `${product.title} | Medusa Store`,
    },
    title: `${product.title} | Medusa Store`,
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const region = await getRegion(params.countryCode);

  if (!region) {
    notFound();
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      handle: params.handle,
    } as Partial<HttpTypes.StoreProductParams>,
  }).then(({ response }) => response.products[0]);

  if (!pricedProduct) {
    notFound();
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  );
}
