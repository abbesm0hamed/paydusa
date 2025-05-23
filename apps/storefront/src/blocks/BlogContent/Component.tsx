'use client';
import type { FC } from 'react';
import RichText from '@/components/RichText';
import type { BlogContentBlock as BlogContentBlockProps } from '@/payload-types';

export const BlogContent: FC<BlogContentBlockProps> = ({ content }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        {content && <RichText data={content} />}
      </div>
    </div>
  );
};

// For use with Payload blocks renderer
export const BlogContentBlock: FC<{ data: BlogContentBlockProps }> = ({
  data,
}) => {
  return <BlogContent {...data} />;
};
