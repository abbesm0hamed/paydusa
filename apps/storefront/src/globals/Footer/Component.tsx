import { getCachedGlobal } from '@/utilities/getGlobals';
import React from 'react';
import type { Footer } from '@/payload-types';
import { ThemeSelector } from '@/providers/Theme/ThemeSelector';
import { CMSLink } from '@/components/Link';
import { TypedLocale } from 'payload';
import NextImage from 'next/image';

export async function Footer({ locale }: { locale: TypedLocale }) {
  const footerData: Footer = await getCachedGlobal('footer', 1, locale)();
  const footerLogo = footerData?.logo;
  const footerColumns = footerData?.columns || [];

  return (
    <footer className="w-full bg-background border-t border-t-orange">
      <div className="w-full flex flex-col justify-between bg-slate-900">
        <div className="flex flex-col container">
          {footerLogo && (
            <div className="h-20 sm:h-32 md:h-38 lg:h-48 xl:h-56 relative overflow-hidden">
              <NextImage
                src={footerLogo.url}
                alt={footerLogo.alt || 'Footer logo'}
                width={footerLogo.width || 200}
                height={footerLogo.height || 30}
                className="object-contain w-full h-auto max-w-full absolute left-0 top-[25%] sm:top-[30%] md:top-[40%] lg:top-[15%] xl:top-[5%]"
                style={{
                  aspectRatio: `${footerLogo.width}/${footerLogo.height}`,
                }}
              />
            </div>
          )}
        </div>

        <div className="bg-slate-700">
          <div className="flex items-center justify-between container">
            <p className="text-sm text-gray-500">© 2025 Ecommerce</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                instagram
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                facebook
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                twitter
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                linkedin
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-600 border-t border-t-orange">
        <div className="w-full container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex justify-end w-full">
              <ThemeSelector />
            </div>
            {footerColumns.map((col, i) => (
              <div key={i} className="flex flex-col">
                <h3 className="py-[0.3rem]">{col?.label}</h3>
                <nav className="flex flex-col gap-2">
                  {col?.navItems?.map(({ link }, i) => (
                    <CMSLink key={i} {...link} />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
