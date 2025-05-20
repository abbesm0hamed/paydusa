'use client';
import type React from 'react';
import Image from 'next/image';
import RichText from '@/components/RichText';
import type { CalloutBlock as COBlockProps } from '@/payload-types';
import type { Media } from '@/payload-types'; // Make sure this is imported

// Define types based on your Payload CMS configuration
export const Callout: React.FC<COBlockProps> = ({
  content,
  logo,
  author,
  role,
  imgs = [],
}) => {
  // Type guard to check if logo is a Media object
  const logoMedia = typeof logo === 'number' ? null : (logo as Media);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-8">
      {/* Logo */}
      {logoMedia && (
        <div className="mb-6">
          <Image
            src={logoMedia?.url!}
            alt={logoMedia.alt || 'Company logo'}
            width={logoMedia.width || 150}
            height={logoMedia.height || 50}
            className="h-12 w-auto object-contain"
          />
        </div>
      )}

      {/* Content */}
      <div className="mb-6 prose max-w-none">
        {content && <RichText className="mb-0" data={content} />}
      </div>

      {/* Author Information */}
      {(author || role) && (
        <div className="mb-6">
          {author && <h4 className="font-medium text-lg">{author}</h4>}
          {role && <p className="text-gray-600">{role}</p>}
        </div>
      )}

      {/* Images */}
      {imgs && imgs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {imgs.map((item, index) => {
            // Type guard to check if img is a Media object
            const imgMedia =
              typeof item.img === 'number' ? null : (item.img as Media);

            if (!imgMedia) return null;

            return (
              <div
                key={item.id || `img-${index}`}
                className="relative aspect-square overflow-hidden rounded-md"
              >
                <Image
                  src={imgMedia?.url!}
                  alt={imgMedia.alt || 'Callout image'}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// For use with Payload blocks renderer
export const CalloutBlock: React.FC<{ data: COBlockProps }> = ({ data }) => {
  return <Callout {...data} />;
};
