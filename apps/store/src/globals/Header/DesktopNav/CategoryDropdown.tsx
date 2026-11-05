"use client";

import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import { ChevronDownMini } from "@medusajs/icons";
import type { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const CategoryTreeItem = ({
  category,
  depth,
  close,
}: {
  category: HttpTypes.StoreProductCategory;
  depth: number;
  close: () => void;
}) => {
  const hasChildren =
    category.category_children && category.category_children.length > 0;

  return (
    <div>
      <LocalizedClientLink
        href={`/categories/${category.handle}`}
        className={`txt-xsmall-plus hover:bg-accent hover:text-foreground flex items-center justify-between px-4 py-2 ${
          depth === 0 ? "text-muted-foreground" : "text-muted-foreground/70"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={close}
      >
        <span>{category.name}</span>
        {hasChildren && (
          <ChevronDownMini className="text-muted-foreground/50 h-3 w-3 shrink-0 -rotate-90" />
        )}
      </LocalizedClientLink>

      {hasChildren && (
        <div>
          {category.category_children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              depth={depth + 1}
              close={close}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
    <Popover className="relative flex h-full">
      {({ open, close }) => (
        <>
          <Popover.Button className="txt-xsmall-plus text-muted-foreground hover:text-foreground relative flex h-full items-center gap-x-1 focus:outline-none">
            Categories
            <ChevronDownMini className="h-3 w-3" />
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
            <PopoverPanel className="bg-background border-border absolute top-full left-0 z-50 min-w-[220px] border shadow-lg">
              <div className="py-1">
                {topLevelCategories.map((category) => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    depth={0}
                    close={close}
                  />
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
