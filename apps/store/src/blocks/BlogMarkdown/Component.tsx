"use client";
import type { BlogMarkdownBlock as BlogMarkdownBlockProps } from "@payload-types";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

export const BlogMarkdown: React.FC<BlogMarkdownBlockProps> = ({
  markdown,
}) => {
  return (
    <div className="content-container mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={
                    tomorrow as unknown as Record<string, React.CSSProperties>
                  }
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

// For use with Payload blocks renderer
export const BlogMarkdownBlock: React.FC<{ data: BlogMarkdownBlockProps }> = ({
  data,
}) => {
  return <BlogMarkdown {...data} />;
};
