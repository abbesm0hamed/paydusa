import type { Footer as FooterData } from "@payload-types";
import NextImage from "next/image";
import type { TypedLocale } from "payload";
import React from "react";

import { CMSLink } from "@/components/Link";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import { getCachedGlobal } from "@/utilities/getGlobals";

export async function Footer({ locale }: { locale: TypedLocale }) {
  const footerData: FooterData = await getCachedGlobal("footer", 1, locale);
  const footerLogo = footerData?.logo;
  const footerColumns = footerData?.columns || [];

  return (
    <footer className="bg-background w-full">
      <div className="flex w-full flex-col justify-between">
        <div className="content-container flex flex-col">
          {footerLogo && (
            <div className="relative h-20 overflow-hidden sm:h-32 md:h-38 lg:h-48 xl:h-56">
              <NextImage
                src={footerLogo.url}
                alt={footerLogo.alt || "Footer logo"}
                width={footerLogo.width || 200}
                height={footerLogo.height || 30}
                className="absolute top-[25%] left-0 h-auto w-full max-w-full object-contain sm:top-[30%] md:top-[40%] lg:top-[15%] xl:top-[5%]"
                style={{
                  aspectRatio: `${footerLogo.width}/${footerLogo.height}`,
                }}
              />
            </div>
          )}
        </div>

        <div className="content-container flex w-full flex-wrap items-center justify-between">
          <p className="text-sm text-gray-500">© 2026 Ecommerce</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary text-gray-500">
              instagram
            </a>
            <a href="#" className="hover:text-primary text-gray-500">
              facebook
            </a>
            <a href="#" className="hover:text-primary text-gray-500">
              twitter
            </a>
            <a href="#" className="hover:text-primary text-gray-500">
              linkedin
            </a>
          </div>
        </div>
      </div>

      <div className="content-container w-full border-t">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex w-full justify-end">
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
    </footer>
  );
}
