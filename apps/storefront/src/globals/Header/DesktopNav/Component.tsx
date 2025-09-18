import { HeaderClient } from './Component.client';
import { getCachedGlobal } from '@/utilities/getGlobals';
import React, { Suspense } from 'react';
import { listRegions } from '@lib/data/regions';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CartButton from '@modules/layout/components/cart-button';
import SideMenu from '@modules/layout/components/side-menu';
import type { StoreRegion } from '@medusajs/types';
import type { Header as MedusaHeader } from '@/payload-types';
import type { TypedLocale } from 'payload';

export async function Header({ locale }: { locale: TypedLocale }) {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions);
  const headerData: MedusaHeader = await getCachedGlobal('header', 1, locale)();

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative bg-white border-b duration-200 border-ui-border-base">
        {/* First Line: Logo, Navigation, Language & Sign Up */}
        <div className="h-12">
          <div className="container flex items-center justify-between w-full h-full">
            <div className="flex-1 basis-0 h-full flex items-center">
              <LocalizedClientLink
                href="/"
                className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase mr-8"
                data-testid="nav-store-link"
              >
                Medusa Store
              </LocalizedClientLink>
            </div>

            <HeaderClient data={headerData} showOnlyNav={true} />

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <HeaderClient data={headerData} showOnlyActions={true} />
              <div className="hidden small:flex items-center gap-x-6 h-full">
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  Account
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 mx-auto border-t border-ui-border-base bg-muted/30">
          <div className="container flex items-center justify-between w-full h-full txt-xsmall-plus text-ui-fg-subtle">
            <div className="flex-1 basis-0 h-full flex items-center">
              <SideMenu regions={regions} />
            </div>

            <div className="flex items-center h-full">
              <HeaderClient data={headerData} showOnlySearch={true} />
            </div>

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    Cart (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </div>

        <HeaderClient data={headerData} showOnlyMegaMenu={true} />
      </header>
    </div>
  );
}
