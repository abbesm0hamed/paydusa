import { FeaturedProductsFallback } from "@modules/home/components/featured-products/FeaturedProductsFallback";
import { FeaturedProductsSection } from "@modules/home/components/featured-products/FeaturedProductsSection";
import Hero from "@modules/home/components/hero";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
  title: "Medusa Next.js Starter Template",
};

export default async function Home(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;
  const { countryCode } = params;

  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProductsSection countryCode={countryCode} />
      </Suspense>
    </>
  );
}
