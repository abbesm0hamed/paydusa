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
    <div className="group sticky inset-x-0 top-0 z-50">
      <header className="bg-background dark:bg-background border-border relative border-b duration-200">
        {/* First Line: Logo, Navigation, Language & Sign Up */}
        <div className="mx-auto h-12">
          <div className="content-container flex h-full w-full items-center justify-between">
            <div className="flex h-full flex-1 basis-0 items-center">
              <LocalizedClientLink
                href="/"
                className="txt-compact-xlarge-plus text-foreground hover:text-foreground/80 mr-8 uppercase"
                data-testid="nav-store-link"
              >
                Medusa Store
              </LocalizedClientLink>
            </div>

            <HeaderClient data={headerData} showOnlyNav={true} />

            <div className="flex h-full flex-1 basis-0 items-center justify-end gap-x-6">
              <HeaderClient data={headerData} showOnlyActions={true} />
              <div className="small:flex hidden h-full items-center gap-x-6">
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

        <div className="border-border bg-muted/30 mx-auto h-8 border-t">
          <div className="content-container txt-xsmall-plus text-muted-foreground flex h-full w-full items-center justify-between">
            <div className="flex h-full flex-1 basis-0 items-center">
              <CategoryDropdown categories={categories} />
            </div>

            <div className="flex h-full items-center">
              <HeaderClient data={headerData} showOnlySearch={true} />
            </div>

            <div className="flex h-full flex-1 basis-0 items-center justify-end gap-x-6">
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
