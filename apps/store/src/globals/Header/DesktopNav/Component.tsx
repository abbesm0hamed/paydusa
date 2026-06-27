import { listCategories } from "@lib/data/categories";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@modules/layout/components/cart-button";
import type { Header as MedusaHeader } from "@payload-types";
import type { TypedLocale } from "payload";
import { Suspense } from "react";

import { getCachedGlobal } from "@/utilities/getGlobals";

import { CategoryDropdown } from "./CategoryDropdown";
import { HeaderClient } from "./Component.client";

export async function Header({ locale }: { locale: TypedLocale }) {
  const headerData: MedusaHeader = await getCachedGlobal("header", 1, locale);
  const categories = await listCategories({ limit: 100 });

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative bg-background dark:bg-background border-b duration-200 border-border">
        {/* First Line: Logo, Navigation, Language & Sign Up */}
        <div className="h-12 mx-auto">
          <div className="content-container flex items-center justify-between w-full h-full">
            <div className="flex-1 basis-0 h-full flex items-center">
              <LocalizedClientLink
                href="/"
                className="txt-compact-xlarge-plus text-foreground hover:text-foreground/80 uppercase mr-8"
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
                  className="text-foreground hover:text-foreground/80"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  Account
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 mx-auto border-t border-border bg-muted/30">
          <div className="content-container flex items-center justify-between w-full h-full txt-xsmall-plus text-muted-foreground">
            <div className="flex-1 basis-0 h-full flex items-center">
              <CategoryDropdown categories={categories} />
            </div>

            <div className="flex items-center h-full">
              <HeaderClient data={headerData} showOnlySearch={true} />
            </div>

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="text-foreground hover:text-foreground/80 flex gap-2"
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
