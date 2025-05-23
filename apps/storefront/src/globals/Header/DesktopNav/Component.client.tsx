'use client';

import { useHeaderTheme } from '@/providers/HeaderTheme';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import Logo from '@/components/Logo/Logo';
import LocaleSwitcher from '@/components/ui/locale-switcher';
import type { Header } from '@/payload-types';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CMSLink } from '@/components/Link';
import Image from 'next/image';
import { FlickeringGrid } from '@repo/design-system/components/ui/flickeringPatterns/flickeringDots';

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const t = useTranslations();
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();
  const navItems = data?.navItems || [];
  const [theme, setTheme] = useState<string | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const groupItems = useRef(
    navItems.filter((item) => item.type === 'group')
  ).current;

  useEffect(() => {
    setHeaderTheme(null);
  }, [pathname, setHeaderTheme]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
  }, [headerTheme, theme]);

  const handleMouseEnter = (index: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveMegaMenu(index);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300); // 300ms delay to match Payload's smooth feel
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  return (
    <header
      className="bg-muted relative"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <section className="flex items-center justify-between h-16 shadow-xl/10">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <Logo
                loading="eager"
                priority="high"
                className="h-6"
                url={data?.logo?.url as string}
              />
            </Link>
          </div>

          <nav className="flex items-stretch h-full relative ">
            {navItems.map((item, i) => {
              if (item.type === 'link' && item.linkFields?.link) {
                return (
                  <CMSLink
                    key={i}
                    {...item.linkFields.link}
                    appearance="link"
                    className="flex items-center px-4 hover:underline"
                  />
                );
              }
              if (item.type !== 'group' || !item.groupFields) return null;

              const groupIndex = groupItems.findIndex((g) => g === item);
              const { label } = item.groupFields;

              return (
                <div
                  key={i}
                  className="group relative h-full flex items-stretch"
                  onMouseEnter={() => handleMouseEnter(groupIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="cursor-pointer flex items-center h-full px-4 group-hover:underline">
                    <span>{label}</span>
                  </div>
                </div>
              );
            })}
          </nav>

          <section className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/search" className="text-gray-700 hover:text-black">
              <span className="sr-only">{t('search')}</span>
              <SearchIcon className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign up
            </Link>
          </section>
        </section>

        <div className="absolute left-0 right-0 z-20 bg-muted">
          {groupItems.map((item, i) => {
            if (item.type !== 'group' || !item.groupFields) return null;
            const { groups } = item.groupFields;

            const formattedGroups =
              groups?.map((group) => ({
                title: group.title,
                image:
                  group.image && 'url' in group.image
                    ? {
                        url: group.image.url as string,
                        alt: group.image.alt || '',
                      }
                    : undefined,
                description: group.description,
                links: (group.links || []).map((linkItem) => ({
                  link: linkItem.link,
                  description: linkItem.description,
                })),
              })) || [];

            return (
              <div
                key={i}
                className={`${
                  activeMegaMenu === i ? 'block' : 'hidden'
                } shadow-inset-top w-full transition-all duration-200 ease-in-out relative`}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-y-0 left-0 w-24 z-0">
                  <FlickeringGrid
                    className="w-full h-full [mask-image:linear-gradient(to_left,transparent_0%,white_100%)] [mask-composite:intersect] shadow-inset-top"
                    color="#11A1EB"
                    maxOpacity={0.7}
                    flickerChance={0.2}
                    height={400}
                    width={96}
                  />
                </div>
                <div className="absolute inset-y-0 right-0 w-24 z-0">
                  <FlickeringGrid
                    className="w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,white_100%)] [mask-composite:intersect] shadow-inset-top"
                    color="#60A5FA"
                    maxOpacity={0.7}
                    flickerChance={0.2}
                    height={400}
                    width={96}
                  />
                </div>

                <div className="container relative z-10">
                  <div className="py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {formattedGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-4">
                          {(group.title || group.image) && (
                            <div>
                              {group.title && (
                                <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">
                                  {group.title}
                                </h3>
                              )}
                              {group.image?.url && (
                                <Image
                                  loading="lazy"
                                  width={300}
                                  height={200}
                                  src={group.image.url}
                                  alt={
                                    group.image.alt ||
                                    group.title ||
                                    'Group image'
                                  }
                                  className="rounded-md object-cover w-full h-40"
                                />
                              )}
                              {group.description && (
                                <p className="text-sm text-gray-600 mt-3">
                                  {group.description}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="space-y-2">
                            {group.links.map((item, linkIndex) => (
                              <div key={linkIndex} className="space-y-1">
                                <CMSLink
                                  {...item.link}
                                  appearance="link"
                                  className="font-normal text-sm text-gray-800 hover:underline"
                                />
                                {item.description && (
                                  <p className="text-xs text-gray-500">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};
