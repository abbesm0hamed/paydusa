"use client";

import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import { ChevronDownMini } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const CategoryDropdown = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[];
}) => {
  const topLevelCategories = categories.filter(
    (category) => !category.parent_category
  );

  if (topLevelCategories.length === 0) {
    return null;
  }

  return (
    <Popover className="relative h-full flex">
      {({ open, close }) => (
        <>
          <Popover.Button className="relative h-full flex items-center gap-x-1 txt-xsmall-plus text-muted-foreground hover:text-foreground focus:outline-none">
            Categories
            <ChevronDownMini className="w-3 h-3" />
          </Popover.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <PopoverPanel className="absolute top-full left-0 bg-background border border-border shadow-lg min-w-[220px] z-50">
              <div className="py-1">
                {topLevelCategories.map((category) => (
                  <div key={category.id}>
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                      className="flex items-center justify-between px-4 py-2 txt-xsmall-plus text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={close}
                    >
                      <span>{category.name}</span>
                      {category.category_children &&
                        category.category_children.length > 0 && (
                          <ChevronDownMini className="w-3 h-3 -rotate-90 text-muted-foreground/50" />
                        )}
                    </LocalizedClientLink>

                    {category.category_children &&
                      category.category_children.length > 0 && (
                        <div className="ml-4">
                          {category.category_children.map((child) => (
                            <LocalizedClientLink
                              key={child.id}
                              href={`/categories/${child.handle}`}
                              className="block px-4 py-1.5 txt-xsmall-plus text-muted-foreground/70 hover:bg-accent hover:text-foreground"
                              onClick={close}
                            >
                              {child.name}
                            </LocalizedClientLink>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export { CategoryDropdown };
