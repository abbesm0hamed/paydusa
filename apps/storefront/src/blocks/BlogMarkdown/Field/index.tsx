import { TextareaField } from '@payloadcms/ui';
import React from 'react';

export const BlogMarkdownField: React.FC<{ name: string; path: string }> = ({
  name,
  path,
}) => {
  return (
    <div className="min-h-[12rem]">
      <TextareaField field={{ name, required: true }} path={path} />
    </div>
  );
};
