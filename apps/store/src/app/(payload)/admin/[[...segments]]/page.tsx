import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { importMap } from "../importMap";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

async function DynamicContent({ params, searchParams }: Args) {
  await connection();
  return RootPage({ config, params, searchParams, importMap });
}

const Page = ({ params, searchParams }: Args) => (
  <Suspense>
    <DynamicContent params={params} searchParams={searchParams} />
  </Suspense>
);

export default Page;
