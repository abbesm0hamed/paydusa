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
  showOnlyNav?: boolean;
  showOnlyActions?: boolean;
  showOnlySearch?: boolean;
  showOnlyMegaMenu?: boolean;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  showOnlyNav = false,
  showOnlyActions = false,
  showOnlySearch = false,
  showOnlyMegaMenu = false,
}) => {
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
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  // Show only navigation items
  if (showOnlyNav) {
    return (
      <nav className="flex items-stretch h-full relative">
        {navItems.map((item, i) => {
          if (item.type === 'link' && item.linkFields?.link) {
            return (
              <CMSLink
                key={i}
                {...item.linkFields.link}
                appearance="link"
                className="flex items-center px-4 hover:text-ui-fg-base txt-compact-small"
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
              <div className="cursor-pointer flex items-center h-full px-4 hover:text-ui-fg-base txt-compact-small">
                <span>{label}</span>
              </div>
            </div>
          );
        })}
      </nav>
    );
  }

  // Show only search
  if (showOnlySearch) {
    return (
      <Link
        href="/search"
        className="text-ui-fg-subtle hover:text-ui-fg-base flex items-center gap-2"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="txt-compact-small hidden sm:inline">
          {t('search')}
        </span>
      </Link>
    );
  }

  // Show only actions (language switcher and sign up)
  if (showOnlyActions) {
    return (
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
      </div>
    );
  }

  // Show only mega menu
  if (showOnlyMegaMenu) {
    return (
      <div {...(theme ? { 'data-theme': theme } : {})}>
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

                <div className="content-container relative z-10">
                  <div className="py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {formattedGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-4">
                          {(group.title || group.image) && (
                            <div>
                              {group.title && (
                                <h3 className="txt-compact-small-plus uppercase tracking-wider text-ui-fg-muted font-medium mb-3">
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
                                <p className="txt-compact-small text-ui-fg-subtle mt-3">
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
                                  className="font-normal txt-compact-small text-ui-fg-base hover:text-ui-fg-interactive"
                                />
                                {item.description && (
                                  <p className="txt-compact-xsmall text-ui-fg-subtle">
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
    );
  }

  // Default: show nothing (this shouldn't be reached with the new structure)
  return null;
};
