import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import React from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import { getCachedPosts } from "@/utilities/getPosts";

import PageClient from "./page.client";

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise;

  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) {
    notFound();
  }

  const posts = await getCachedPosts(sanitizedPageNumber);

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="content-container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="content-container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="content-container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise;
  return {
    title: `Holmena for digital solutions Posts Page ${pageNumber || ""}`,
  };
}

export async function generateStaticParams() {
  const { totalPages } = await getCachedPosts();

  const pages: { pageNumber: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}
